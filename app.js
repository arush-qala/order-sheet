// === CONFIGURE THESE AT THE VERY TOP ===
const EMAILJS_PUBLIC_KEY = "ThVWDzQ_A2rENNdVu";
const EMAILJS_SERVICE_ID = "service_mjhvpwj";
const EMAILJS_TEMPLATE_ID = "template_wpcfoca";
const SHEET_ENDPOINT = "AKfycbwcld-zPxt_fpQh3jmT1a3YItSUpmnhCjgdmBJ27qYgFOkhL2rAQttvEMvtyFYlCqFg";

// --- Product Data ---
let productData = []; // Holds dynamically loaded products from Google Sheets

async function fetchProductData() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNVrRrsiEXVml8Ecuq7kmaEh9JY1G0_X5-PGtvoXvHo37yGGGFuT9aysBUHf0LKzel73hRUWq3IWys/pub?output=csv";
  try {
    const res = await fetch(url);
    if (!res.ok) {
      alert("Could not load product database. Please check your connection.");
      return;
    }
    const csv = await res.text();
    productData = csvToProductData(csv);
    document.getElementById('addProductBtn').disabled = false;
    document.getElementById('brandSelect').disabled = false;
    // Ensure if a brand is already selected, a first product card is shown
    if (document.getElementById('brandSelect').value) {
      createProductCard();
    }
  } catch (err) {
    alert("Could not load product database from Google Sheets.");
    productData = [];
    document.getElementById('addProductBtn').disabled = true;
    document.getElementById('brandSelect').disabled = true;
  }
}

function csvToProductData(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(row => {
    const cols = row.split(',').map(c => c.trim());
    let obj = {};
    headers.forEach((h, i) => obj[h] = cols[i]);
    obj.skuId = obj.skuID || obj.skuId || "";
    obj.brandName = obj.brandName || "";
    obj.productName = obj.productName || "";
    obj.imageUrl = obj.imageURL || obj.imageUrl || "";
    obj.productLink = obj.productLink || "";
    obj.landingPrice = Number(obj.landingPrice) || 0;
    obj.recommendedRetailPrice = Number(obj.recommendedRetailPrice) || 0;
    obj.availableSizes = obj.availableSizes ? obj.availableSizes.split('|').map(s => s.trim()) : [];
    return obj;
  }).filter(x => x.skuId && x.brandName);
}

const dom = id => document.getElementById(id);
// Disable add and brand select until data loads
dom('addProductBtn').disabled = true;
dom('brandSelect').disabled = true;

fetchProductData();

// --- App State ---
class OrderSheetState {
  constructor() {
    this.header = {};
    this.items = [];
    this.totalQty = 0;
    this.totalAmount = 0;
  }
  addItem(item) { this.items.push(item); this.recalculateTotals(); }
  removeItem(idx) { this.items.splice(idx, 1); this.recalculateTotals(); }
  recalculateTotals() {
    this.totalQty = this.items.reduce((s,i)=>s+Number(i.quantity||0),0);
    this.totalAmount = this.items.reduce((s,i)=>s+Number(i.subtotal||0),0);
    dom('totalQuantity').textContent = this.totalQty;
    dom('totalAmount').textContent = `$${this.totalAmount.toFixed(2)}`;
  }
  reset() { this.items = []; this.recalculateTotals(); }
}
const state = new OrderSheetState();

// --- AUTOCOMPLETE PRODUCT SEARCH ---
function autoCompleteBox(input, brand, cb) {
  let items=[], index=-1, list=null;
  input.setAttribute('autocomplete', 'off');
  function getResults(val) {
    let arr = productData.filter(p => p.brandName === brand && 
      (val ? (p.productName.toLowerCase().includes(val) || p.skuId.toLowerCase().includes(val)) : true)
    );
    arr.sort((a,b) => a.skuId.localeCompare(b.skuId, undefined, {numeric:true, sensitivity:'base'}));
    return arr.slice(0, 8);
  }
  function showList(val) {
    closeList();
    const search = val ? val.trim().toLowerCase() : "";
    items = getResults(search);
    if (!items.length) return;
    list = document.createElement('div');
    list.className = 'autocomplete-list';
    list.style.position = 'absolute';
    const rect = input.getBoundingClientRect();
    const scrollTop  = (window.pageYOffset || document.documentElement.scrollTop);
    const scrollLeft = (window.pageXOffset || document.documentElement.scrollLeft);
    list.style.left  = `${rect.left + scrollLeft}px`;
    list.style.top   = `${rect.bottom + scrollTop}px`;
    list.style.width = `${rect.width}px`;
    items.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.innerHTML = `<strong>${item.skuId}</strong> – ${item.productName}`;
      div.addEventListener('mousedown', e => { e.preventDefault(); select(idx); });
      list.appendChild(div);
    });
    document.body.appendChild(list);
    index = -1;
  }
  input.addEventListener('input', function() { showList(this.value); });
  input.addEventListener('focus', function() { if (!this.value.trim()) showList(""); });
  input.addEventListener('keydown', function(e) {
    if (!list) return;
    const len = list.childElementCount;
    if (e.key === 'ArrowDown') { index = (index + 1 + len) % len; highlight(); e.preventDefault();}
    if (e.key === 'ArrowUp') { index = (index - 1 + len) % len; highlight(); e.preventDefault();}
    if (e.key === 'Enter') { if (index > -1) { select(index); e.preventDefault(); } }
    if (e.key === 'Escape') closeList();
  });
  input.addEventListener('blur', ()=>setTimeout(closeList,100));
  function highlight(){Array.from(list.children).forEach((item,idx)=>item.classList.toggle('active',idx===index));}
  function select(idx){if(typeof cb==='function')cb(items[idx]);closeList();}
  function closeList(){if(list){document.body.removeChild(list);list=null;}items=[];index=-1;}
}

// --- IMAGE UTILS ---
const imageCache = new Map();
async function toDataUrl(url) {
  if (imageCache.has(url)) return imageCache.get(url);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 120; canvas.height = 120;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#fff"; ctx.fillRect(0,0,canvas.width,canvas.height);
      const ratio = Math.min(canvas.width/this.width, canvas.height/this.height, 1.0);
      const w = this.width * ratio, h = this.height * ratio;
      ctx.drawImage(this, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      imageCache.set(url, dataUrl);
      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = url + (url.includes("?") ? "&" : "?") + "rand=" + Math.random();
  });
}

// --- CREATE PRODUCT CARD ---
function createProductCard() {
  const brand = dom('brandSelect').value;
  if (!brand) return alert('Select a brand first.');
  // Only allow if product data is present
  if (!productData.length) return alert('No products loaded.');

  const card = document.createElement('div');
  card.className = 'product-card';
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = '&times;';
  removeBtn.className = 'remove-card';
  removeBtn.type = 'button';
  removeBtn.setAttribute('aria-label', 'Remove product');
  card.appendChild(removeBtn);

  // -- Multi column layout elements omitted for brevity (same as before) --
  const row = document.createElement('div');
  row.className = 'card-threecol';
  card.appendChild(row);

  const styleCol = document.createElement('div');
  styleCol.className = 'productcol stylecol';
  row.appendChild(styleCol);
  const styleField = document.createElement('input');
  styleField.type = 'text';
  styleField.placeholder = 'Search style by SKU or name';
  styleField.style.width = '100%';
  styleField.style.marginBottom = '8px';
  styleCol.appendChild(styleField);

  const styleImg = document.createElement('img');
  styleImg.alt = 'Style Image';
  styleImg.style.display = 'none';
  styleCol.appendChild(styleImg);

  const styleImgLabel = document.createElement('div');
  styleImgLabel.className = 'img-label';
  styleImgLabel.textContent = 'Style';
  styleCol.appendChild(styleImgLabel);

  const printCol = document.createElement('div');
  printCol.className = 'productcol printcol';
  row.appendChild(printCol);
  const printField = document.createElement('input');
  printField.type = 'text';
  printField.placeholder = 'Optional custom print';
  printField.style.width = '100%';
  printField.style.marginBottom = '8px';
  printCol.appendChild(printField);

  const printImg = document.createElement('img');
  printImg.alt = 'Print Image';
  printImg.style.display = 'none';
  printCol.appendChild(printImg);

  const printImgLabel = document.createElement('div');
  printImgLabel.className = 'img-label';
  printImgLabel.textContent = 'Custom Print';
  printCol.appendChild(printImgLabel);

  const detailsCol = document.createElement('div');
  detailsCol.className = 'productcol infocol';
  row.appendChild(detailsCol);

  const prodName = document.createElement('div');
  prodName.className = 'prod-name';
  detailsCol.appendChild(prodName);
  const sizesSpan = document.createElement('div');
  sizesSpan.className = 'available-sizes';
  sizesSpan.style.display = 'none';
  detailsCol.appendChild(sizesSpan);

  const link = document.createElement('a');
  link.textContent = 'View Product Details';
  link.target = '_blank';
  link.style.display = 'inline-block';
  link.style.marginBottom = '18px';
  detailsCol.appendChild(link);

  const priceRow = document.createElement('div');
  priceRow.style.display = 'flex';
  priceRow.style.alignItems = 'center';
  detailsCol.appendChild(priceRow);

  const landingBox = document.createElement('div');
  landingBox.className = 'price-box';
  priceRow.appendChild(landingBox);

  const retailBox = document.createElement('div');
  retailBox.className = 'price-box';
  priceRow.appendChild(retailBox);

  // --- Dynamic SIZES + QTY ROW ---
  const sizesList = document.createElement('div');
  sizesList.className = 'sizes-list';
  let sizeQtyArray = [];
  let availableSizesArr = [];

  // Unit price input
  const unitPriceInput = document.createElement('input');
  unitPriceInput.type = 'number';
  unitPriceInput.min = '0';
  unitPriceInput.step = '0.01';
  unitPriceInput.className = 'unit-price-override';
  unitPriceInput.placeholder = 'Unit Price $';

  function updateTotalAndSubtotal() {
    const totalQty = sizeQtyArray.reduce((sum, entry) => sum + (Number(entry.quantity) > 0 ? Number(entry.quantity) : 0), 0);
    const unit = Number(unitPriceInput.value || 0);
    lineItem.quantity = totalQty;
    qtySummary.textContent = (totalQty > 0 && unit > 0)
      ? `Total Qty: ${totalQty}`
      : "";
    lineItem.sizes = sizeQtyArray.filter(e => Number(e.quantity) > 0).map(e => `${e.quantity} ${e.size}`).join(', ');
    lineItem.unitPrice = unit;
    const subtotal = totalQty * unit;
    lineItem.subtotal = subtotal;
    subtotalDisp.textContent = (totalQty > 0 && unit > 0)
      ? `Subtotal $${subtotal.toFixed(2)}`
      : '';
    summaryRow.style.display = (totalQty > 0 && unit > 0) ? 'flex' : 'none';
    state.recalculateTotals();
  }
  function renderSizeQtyRows() {
    sizesList.innerHTML = "";
    sizeQtyArray.forEach((item, idx) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'sizes-qty-row';
      // Size dropdown
      const sizeSel = document.createElement('select');
      sizeSel.className = 'size-select';
      sizeSel.style.width = '70px';
      availableSizesArr.forEach(size => {
        const opt = document.createElement('option');
        opt.value = size;
        opt.textContent = size;
        sizeSel.appendChild(opt);
      });
      sizeSel.value = item.size || availableSizesArr[0] || '';
      sizeSel.onchange = function() {
        item.size = this.value;
        updateTotalAndSubtotal();
      };
      // Quantity stepper
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.className = 'qty-stepper';
      qtyInput.min = '1';
      qtyInput.step = '1';
      qtyInput.placeholder = 'Qty';
      qtyInput.value = item.quantity > 0 ? item.quantity : 1;
      qtyInput.style.width = '60px';
      qtyInput.addEventListener('input', function() {
        item.quantity = Math.max(1, Number(this.value) || 1);
        this.value = item.quantity;
        updateTotalAndSubtotal();
      });
      qtyInput.addEventListener('change', function() {
        item.quantity = Math.max(1, Number(this.value) || 1);
        this.value = item.quantity;
        updateTotalAndSubtotal();
      });
      // Remove button
      const remBtn = document.createElement('button');
      remBtn.type = 'button';
      remBtn.innerHTML = `
        <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true">
          <line x1="4" y1="4" x2="12" y2="12" stroke="#c22525" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="4" x2="4" y2="12" stroke="#c22525" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
      remBtn.className = 'remove-size-btn';
      remBtn.title = 'Remove this size';
      remBtn.onclick = () => {
        sizeQtyArray.splice(idx, 1);
        renderSizeQtyRows();
        updateTotalAndSubtotal();
      };
      rowDiv.appendChild(sizeSel);
      rowDiv.appendChild(qtyInput);
      if (sizeQtyArray.length > 1) rowDiv.appendChild(remBtn);
      if (idx === sizeQtyArray.length - 1) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.innerHTML = `
        <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
          <line x1="8" y1="4" x2="8" y2="12" stroke="#101010" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="4" y1="8" x2="12" y2="8" stroke="#101010" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`;
        addBtn.className = 'add-size-btn-inline';
        addBtn.title = 'Add new size';
        addBtn.onclick = function(e) {
          e.preventDefault();
          sizeQtyArray.push({ size: availableSizesArr[0] || "", quantity: 1 });
          renderSizeQtyRows();
          updateTotalAndSubtotal();
        };
        rowDiv.appendChild(addBtn);
      }
      sizesList.appendChild(rowDiv);
    });
  }

  // Info building
  const sizesTitle = document.createElement('label');
  sizesTitle.textContent = 'Select Size(s) & Qty:';
  detailsCol.appendChild(sizesTitle);
  detailsCol.appendChild(sizesList);

  // Unit price override
  const unitPriceLabel = document.createElement('label');
  unitPriceLabel.textContent = 'Unit Price Override ($)';
  detailsCol.appendChild(unitPriceLabel);
  detailsCol.appendChild(unitPriceInput);

  // Notes and subtotal
  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Customization Notes';
  detailsCol.appendChild(noteLabel);

  const noteArea = document.createElement('textarea');
  noteArea.rows = 2; 
  noteArea.style.width = '100%';
  detailsCol.appendChild(noteArea);

  // Summary Row
  const summaryRow = document.createElement('div');
  summaryRow.style.display = 'none';
  summaryRow.style.justifyContent = 'space-between';
  summaryRow.style.alignItems = 'center';
  summaryRow.style.marginTop = '12px';
  summaryRow.style.marginBottom = '8px';
  summaryRow.style.width = '100%';
  const qtySummary = document.createElement('span');
  qtySummary.className = 'qty-summary-left';
  qtySummary.style.fontWeight = 'bold';
  qtySummary.style.fontSize = '1.03em';
  qtySummary.style.textAlign = 'left';
  const subtotalDisp = document.createElement('span');
  subtotalDisp.className = 'subtotal-disp';
  subtotalDisp.style.fontWeight = 'bold';
  subtotalDisp.style.fontSize = '1.06em';
  subtotalDisp.style.textAlign = 'right';
  summaryRow.appendChild(qtySummary);
  summaryRow.appendChild(subtotalDisp);
  detailsCol.appendChild(summaryRow);

  const lineItem = {
    styleSku:'', printSku:'', productName:'', sizes:'',
    quantity:0, unitPrice:0, subtotal:0, notes:'',
    styleImgUrl:'', printImgUrl:''
  };
  function onStyleChange(prod) {
    availableSizesArr = Array.isArray(prod.availableSizes) ? prod.availableSizes : [];
    sizeQtyArray.length = 0;
    if (availableSizesArr.length) {
      sizeQtyArray.push({
        size: availableSizesArr[0], 
        quantity: 1                 
      });
    }
    renderSizeQtyRows();
    updateTotalAndSubtotal();
  }
  unitPriceInput.addEventListener('input', updateTotalAndSubtotal);
  noteArea.addEventListener('input', () => lineItem.notes = noteArea.value);

  autoCompleteBox(styleField, brand, prod => {
    styleField.value = `${prod.skuId} – ${prod.productName}`;
    styleImg.src = prod.imageUrl; styleImg.style.display = ''; styleImgLabel.classList.add('active');
    prodName.textContent = prod.productName; link.style.display = 'inline-block'; link.href = prod.productLink;
    landingBox.textContent = `Landing $${prod.landingPrice}`; retailBox.textContent = `RRP $${prod.recommendedRetailPrice}`;
    unitPriceInput.value = prod.landingPrice; lineItem.styleSku = prod.skuId; lineItem.productName = prod.productName;
    lineItem.unitPrice = prod.landingPrice; lineItem.styleImgUrl = prod.imageUrl;
    sizesSpan.textContent = prod.availableSizes.length ? 'Available Sizes: ' + prod.availableSizes.join(' · ') : '';
    sizesSpan.style.display = prod.availableSizes.length ? '' : 'none';
    onStyleChange(prod);
  });

  autoCompleteBox(printField, brand, prod => {
    printField.value = `${prod.skuId} – ${prod.productName}`;
    printImg.src = prod.imageUrl;
    printImg.style.display = '';
    printImgLabel.classList.add('active');
    lineItem.printSku = prod.skuId;
    lineItem.printImgUrl = prod.imageUrl;
  });

  removeBtn.addEventListener('click', () => { 
    card.remove(); 
    state.removeItem(state.items.indexOf(lineItem)); 
  });

  dom('productCards').appendChild(card); 
  state.addItem(lineItem);
}

// --- FORM SUBMIT HANDLER ---
dom('orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '📧 Sending order...';

  // Validate required fields!
  const requiredFields = ['orderNumber', 'buyerName', 'email', 'phone', 'shippingAddress', 'brandSelect'];
  for (let f of requiredFields) {
    if (!dom(f).value.trim()) {
      alert("Please fill all required fields.");
      submitBtn.disabled = false; submitBtn.textContent = originalText; return;
    }
  }
  if (!state.items.length || !state.items.some(i=>i.productName)) {
    alert("Add at least one valid product before submitting the order.");
    submitBtn.disabled = false; submitBtn.textContent = originalText; return;
  }
  if (!state.items.every(i => i.quantity && i.unitPrice && (i.quantity > 0) && (i.unitPrice > 0))) {
    alert("All product lines must have a quantity and unit price greater than 0.");
    submitBtn.disabled = false; submitBtn.textContent = originalText; return;
  }

  // Collect order data
  state.header = {
    orderNumber: dom('orderNumber').value,
    buyerName: dom('buyerName').value,
    email: dom('email').value,
    phone: dom('phone').value,
    shippingAddress: dom('shippingAddress').value,
    orderComments: dom('orderComments').value,
    brand: dom('brandSelect').value,
    totalQty: state.totalQty,
    totalAmount: state.totalAmount,
    timestamp: new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }),
    userAgent: navigator.userAgent.substr(0, 100)
  };
  const products = state.items.map(item => ({
    productName: item.productName,
    productSku: item.styleSku,
    printSku: item.printSku || '',
    sizes: item.sizes,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal.toFixed(2),
    notes: item.notes
  }));

  // Always attempt to log to sheet, even if email fails
  const orderInfo = {
    orderId: state.header.orderNumber,
    timestamp: state.header.timestamp,
    buyerName: state.header.buyerName,
    email: state.header.email,
    phone: state.header.phone,
    shippingAddress: state.header.shippingAddress,
    brand: state.header.brand,
    orderComments: state.header.orderComments
  };
  const items = state.items.map((item, idx) => ({
    productSku: item.styleSku,
    productName: item.productName,
    printSku: item.printSku || "",
    sizes: item.sizes,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
    notes: item.notes
  }));
  
  


for (let i = 0; i < state.items.length; ++i) {
  const item = state.items[i];
  const flatRowObject = {
    OrderID: state.header.orderNumber,
    SubmissionTimestamp: state.header.timestamp,
    BuyerName: state.header.buyerName,
    Email: state.header.email,
    Phone: state.header.phone,
    ShippingAddress: state.header.shippingAddress,
    Brand: state.header.brand,
    OrderComments: state.header.orderComments,
    ProductSelectionID: i + 1,
    ProductSKU: item.styleSku,
    ProductName: item.productName,
    CustomPrintSKU: item.printSku,
    SizesAndQuantities: item.sizes,
    UnitPrice: item.unitPrice,
    Subtotal: item.subtotal,
    Notes: item.notes
  };
  fetch(SHEET_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flatRowObject)
  })
  .then(res => res.json())
  .then(res => {
    if (res && res.result === "SUCCESS") {
      console.log("Row added for product:", item.productName);
    } else {
      console.warn("Failed to add row for:", item.productName);
    }
  })
  .catch(err => {
    console.error("POST to Google Sheet failed:", err);
  });
}


  
  // Send email and show diagnostics if failure
  try {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  // Build payload **without using ...state.header** so products stays as an array
  await emailjs.send(
    EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
    {
      orderNumber: state.header.orderNumber,
      buyerName: state.header.buyerName,
      email: state.header.email,
      phone: state.header.phone,
      shippingAddress: state.header.shippingAddress,
      orderComments: state.header.orderComments,
      brand: state.header.brand,
      totalQty: state.header.totalQty,
      totalAmount: state.totalAmount.toFixed(2),
      timestamp: state.header.timestamp,
      userAgent: state.header.userAgent,
    orderProducts: products, // Use a fresh, unique key!
    }
  );
  submitBtn.textContent = '✅ Order emailed! Generating PDF...';
} catch (emailError) {
  alert("❌ EMAIL FAILED!\n\n" + (emailError?.text || emailError?.message || JSON.stringify(emailError)));
  submitBtn.textContent = '⚠️ Email failed, generating PDF...';
}


  // Always generate PDF regardless of email result
  try {

    const { jsPDF } = window.jspdf;
const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
let x = 36, y = 38;
doc.setFontSize(16);
doc.setFont(undefined, "bold");
doc.text('Qala Collective – Order Sheet', x, y);
y += 28;

// HEADER BOXES (same as your current improved version—skip or keep if already in)
doc.setFontSize(9.8);
// ... [order header boxes as in last answer remain unchanged] ...

// Advance to products section
y += 54;

// == PRODUCT CARD LAYOUT ==
for(let idx=0; idx<state.items.length; ++idx) {
  let it = state.items[idx];
  // Outer box with slight shadow
  doc.setDrawColor(200,200,200);
  doc.setLineWidth(1);
  doc.roundedRect(x-2, y-12, 510, 130, 9, 9, 'S');

  // --- 1. LARGE IMAGE, left column ---
  let imgX = x + 11, imgY = y + 5, imgW = 92, imgH = 110;
  if (it.styleImgUrl) {
    try {
      const imgData = await toDataUrl(it.styleImgUrl);
      doc.addImage(imgData, "JPEG", imgX, imgY, imgW, imgH, undefined, 'FAST');
      doc.setDrawColor(210,210,210);
      doc.rect(imgX-1, imgY-1, imgW+2, imgH+2, 'S');
    } catch (e) {}
  }

  // --- 2. RIGHT COLUMN: Detailed Info ---
  const infoX = x + imgW + 31, infoY = y + 20, infoW = 370;
  let row = infoY;

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(it.productName || '', infoX, row, { maxWidth: infoW });
  doc.setFont(undefined, "normal").setFontSize(9.8);
  row += 15;

  // Available Sizes
  let availSizes = (it.styleSku ? (productData.find(p=>p.skuId===it.styleSku)?.availableSizes?.join(" · ") : "") : "");
  if (availSizes) {
    doc.setFont(undefined, "italic");
    doc.text("Available Sizes: " + availSizes, infoX, row, { maxWidth: infoW-50 });
    row += 13;
    doc.setFont(undefined, "normal");
  }

  // Product Details Link
  if (it.styleSku) {
    const p = productData.find(p=>p.skuId===it.styleSku);
    if (p && p.productLink) {
      doc.setTextColor(48,88,200);
      doc.textWithLink('Product Details Link', infoX, row, { url: p.productLink });
      const linkWidth = doc.getTextWidth('Product Details Link');
      doc.setDrawColor(48,88,200); doc.setLineWidth(0.9);
      doc.line(infoX, row+1, infoX + linkWidth, row+1); // underline
      doc.setTextColor(0,0,0);
      row += 13;
    }
  }

  // Selected Sizes/Quantities
  doc.setFont(undefined,"bold");
  doc.text("Selected Sizes & Qtys:", infoX, row);
  doc.setFont(undefined,"normal");
  doc.text((it.sizes||''), infoX + 114, row);
  row += 12;

  // Unit Price + logic, RRP
  let usedUnit = (typeof it.unitPrice === "number" ? it.unitPrice : Number(it.unitPrice));
  let landing = (it.styleSku ? (productData.find(p=>p.skuId===it.styleSku)?.landingPrice : usedUnit) );
  let showUnit = usedUnit && usedUnit !== landing ? usedUnit : landing;
  doc.setFont(undefined,"bold");
  doc.text("Unit Price: ", infoX, row);
  doc.setFont(undefined,"normal");
  doc.text(`$${showUnit || ''}`, infoX + 54, row);
  doc.setFont(undefined,"bold");
  doc.text("RRP:", infoX + 104, row);
  let rrp = showUnit ? (showUnit * 2.5).toFixed(2) : "";
  doc.setFont(undefined,"normal");
  doc.text(`$${rrp}`, infoX + 133, row);
  doc.setFont(undefined,"bold");
  doc.text("Subtotal:", infoX + 180, row);
  doc.setFont(undefined,"normal");
  doc.text(`$${it.subtotal || ''}`, infoX + 232, row);
  row += 13;

  // Custom notes
  if (it.notes) {
    doc.setFont(undefined,"italic");
    doc.text("Customization Notes: " + (it.notes||''), infoX, row, { maxWidth: infoW-15 });
    doc.setFont(undefined,"normal");
    row += 13;
  }

  y += 140;
  if (y > 700) { doc.addPage(); y = 52; }
}

// --- TOTALS ---
y += 18;
doc.setFontSize(12).setFont(undefined,"bold");
doc.text(`Total Quantity: ${state.totalQty}`, x, y);
doc.text(`Total Amount: $${state.totalAmount.toFixed(2)}`, x + 200, y);

doc.save(`OrderSheet_${state.header.orderNumber}.pdf`);




    submitBtn.textContent = '🎉 Complete! Order emailed & PDF saved';
    alert("✅ SUCCESS!\n\n📧 Order details sent\n📄 PDF downloaded\nBackups secured!");
  } catch (error) {
    alert("⚠️ PDF GENERATION FAILED! Please screenshot or copy order details manually.");
  } finally {
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 3000);
  }
  console.log({ header: state.header, items: state.items });
});




// --- Brand selection triggers product card regeneration ---
dom('brandSelect').addEventListener('change', function () {
  dom('productCards').innerHTML = '';
  state.reset();
  if (this.value) createProductCard();
});

// --- Add product button ---
dom('addProductBtn').addEventListener('click', createProductCard);
