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
let x = 36, y = 40;
const pageW = 520; // page width minus typical margin

// === TITLE ===
doc.setFontSize(15.5);
doc.setFont(undefined, "bold"); doc.setTextColor(0,0,0);
doc.text('Qala Collective – Order Sheet', x, y);
y += 28;

// === ROW 1: ORDER NUMBER (soft box, left-of-page row) ===
doc.setFontSize(9.3);
const fieldBoxH = 16, fieldBoxR = 6;
doc.setFont(undefined,"bold");
doc.text('Order Number', x, y);
doc.setDrawColor(200,200,230).setFillColor(252,252,255);
doc.roundedRect(x, y+4, 112, fieldBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal");
let ordNumTrunc = (state.header.orderNumber||'').length > 17 ? ((state.header.orderNumber||'').slice(0,14)+'...') : (state.header.orderNumber||'');
doc.setTextColor(0,0,0);
doc.text(ordNumTrunc, x+7, y+16);
y += 38;

// === ROW 2: BUYER/STORE NAME | EMAIL | PHONE (equal boxes) ===
let fieldGaps = 30;
let buyerW = 106, emailW = 146, phoneW = 95;
let fy = y;
let bx = x;
// Buyer/Store Name
doc.setFont(undefined,"bold"); doc.setTextColor(0,0,0);
doc.text('Buyer/Store Name', bx, fy);
doc.setDrawColor(200,200,230);
doc.setFillColor(252,252,255);
doc.roundedRect(bx, fy+4, buyerW, fieldBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal");
let buyerTrunc = (state.header.buyerName||'').length > 17?((state.header.buyerName||'').slice(0,14)+"..."):(state.header.buyerName||'');
doc.text(buyerTrunc, bx+5, fy+16);
bx += buyerW + fieldGaps;
// Email
doc.setFont(undefined,"bold"); doc.setTextColor(0,0,0);
doc.text('Email', bx, fy);
doc.setDrawColor(200,200,230);
doc.setFillColor(252,252,255);
doc.roundedRect(bx, fy+4, emailW, fieldBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal");
let emailTrunc = (state.header.email||'').length > 23?((state.header.email||'').slice(0,20)+"..."):(state.header.email||'');
doc.text(emailTrunc, bx+5, fy+16);
bx += emailW + fieldGaps;
// Phone
doc.setFont(undefined,"bold"); doc.setTextColor(0,0,0);
doc.text('Phone', bx, fy);
doc.setDrawColor(200,200,230);
doc.setFillColor(252,252,255);
doc.roundedRect(bx, fy+4, phoneW, fieldBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal");
let phoneTrunc = (state.header.phone||'').length > 13?((state.header.phone||'').slice(0,10)+"..."):(state.header.phone||'');
doc.text(phoneTrunc, bx+5, fy+16);
y += 28;

// === ROW 3: ORDER COMMENTS [2/3 wide] + SHIPPING [1/3 wide], side by side with soft rectangles ===
const commentsW = 232, shippingW = 137;
const labelY = y+6;
bx = x;
doc.setFont(undefined,"bold");
doc.text('Order Comments', bx, labelY);
let commentsLines = doc.splitTextToSize(state.header.orderComments || '', commentsW-12);
let commentsBoxH = Math.max(22, 13*commentsLines.length+8);
doc.setDrawColor(200,200,230).setFillColor(252,252,255);
doc.roundedRect(bx, labelY+4, commentsW, commentsBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal"); doc.setTextColor(0,0,0);
doc.text(commentsLines, bx+5, labelY+18);

bx += commentsW + 32; // more space between the 2 boxes
doc.setFont(undefined,"bold");
doc.text('Shipping Address', bx, labelY);
let shipLines = doc.splitTextToSize(state.header.shippingAddress || '', shippingW-12);
let shipBoxH = Math.max(22, 13*shipLines.length+8);
doc.setDrawColor(200,200,230).setFillColor(252,252,255);
doc.roundedRect(bx, labelY+4, shippingW, shipBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal"); doc.setTextColor(0,0,0);
doc.text(shipLines, bx+5, labelY+18);

y = labelY + Math.max(commentsBoxH, shipBoxH) + 17;

// === BRAND NAME, same style as Order Number ===
doc.setFontSize(9.3);
const brandBoxH = 16, brandBoxR = 6;
doc.setFont(undefined,"bold");
doc.text('Brand', x, y);
doc.setDrawColor(200,200,230).setFillColor(252,252,255);
doc.roundedRect(x, y+4, 170, brandBoxH, brandBoxR, brandBoxR, 'F');
doc.setFont(undefined,"normal");
let brandTrunc = (state.header.brand||'').length > 21 ? ((state.header.brand||'').slice(0,18)+'...') : (state.header.brand||'');
doc.setTextColor(0,0,0);
doc.text(brandTrunc, x+7, y+16);
y += 38;  // same spacing as other fields


// === SELECTIONS HEADER ===
doc.setFont(undefined, "bold");
doc.setFontSize(10.2);
doc.text("Selections", x, y);
y += 16;

// === PRODUCT CARDS ===
const cardW = 510, cardH = 170, cardR = 8;
const imgW = 130, imgH = 130; // sharper/larger images
const styleImgX = x + 14, printImgX = styleImgX + imgW + 32, textX = printImgX + imgW + 42, textW = 162;

for (let idx = 0; idx < state.items.length; ++idx) {
  let it = state.items[idx];

  // Outer card
  doc.setDrawColor(200,200,220);
  doc.setLineWidth(1);
  doc.roundedRect(x, y, cardW, cardH, cardR, cardR, 'S');

  // === ITEM NUMBER: INSIDE CARD, top left corner ===
  doc.setFont(undefined, "bolditalic");
  doc.setFontSize(10.7);
  doc.setTextColor(70,100,170);
  doc.text(`Item ${idx+1}`, x+10, y+19);
  doc.setTextColor(0,0,0);

  // === STYLE IMAGE, higher quality/larger ===
  if (it.styleImgUrl) {
    try {
      const imgData = await toDataUrl(it.styleImgUrl);
      doc.addImage(imgData, "JPEG", styleImgX, y+30, imgW, imgH);
      doc.setDrawColor(170,170,200);
      doc.roundedRect(styleImgX-2, y+28, imgW+4, imgH+4, 10,10,'S');
    } catch (e) {}
  }
  doc.setFont(undefined, "bold");
  doc.setFontSize(9.2);
  doc.text('Style', styleImgX + imgW/2, y+30+imgH+13, {align:'center'});

  // === CUSTOM PRINT IMAGE, higher quality/larger, spaced further ===
  if (it.printImgUrl) {
    try {
      const imgData = await toDataUrl(it.printImgUrl);
      doc.addImage(imgData, "JPEG", printImgX, y+30, imgW, imgH);
      doc.setDrawColor(170,170,200);
      doc.roundedRect(printImgX-2, y+28, imgW+4, imgH+4, 10,10,'S');
    } catch (e) {}
  }
  doc.setFont(undefined, "bold");
  doc.setFontSize(9.2);
  doc.text('Custom Print', printImgX + imgW/2, y+30+imgH+13, {align:'center'});

  // === DETAILS RIGHT COLUMN ===
  let ty = y + 36;

  // Product Name
  doc.setFont(undefined, "bold");
  doc.setFontSize(11.2);
  doc.text((it.productName || '').substring(0,36), textX, ty, {maxWidth: textW});
  ty += 15;

  // Available Sizes
  doc.setFont(undefined,"bold").setFontSize(9.5);
  doc.text("Available Sizes:", textX, ty);
  doc.setFont(undefined,"normal");
  let availSizes = (productData.find(p=>p.skuId===it.styleSku)?.availableSizes?.join(", ") || "");
  let availLines = doc.splitTextToSize(availSizes, textW-92);
  if(availSizes) doc.text(availLines, textX+88, ty, {maxWidth: textW-88});
  ty += Math.max(13, availLines.length * 11);

  // Product Link
  doc.setFont(undefined,"bold");
  doc.text("Product Link:", textX, ty);
  doc.setFont(undefined,"normal");
  if (it.styleSku) {
    const p = productData.find(p=>p.skuId===it.styleSku);
    if (p && p.productLink) {
      doc.setTextColor(50,90,200);
      doc.textWithLink('Details', textX+77, ty, { url: p.productLink });
      doc.setTextColor(0,0,0);
    } else {
      doc.text("-", textX+80, ty);
    }
  } else {
    doc.text("-", textX+80, ty);
  }
  ty += 14;

  // Landing price
  doc.setFont(undefined,"bold");
  doc.text("Landing Price:", textX, ty);
  doc.setFont(undefined,"normal");
  let usedUnit = (typeof it.unitPrice === "number" ? it.unitPrice : Number(it.unitPrice));
  let landing = it.styleSku ? (productData.find(p => p.skuId === it.styleSku)?.landingPrice) : usedUnit;
  let showUnit = usedUnit && usedUnit !== landing ? usedUnit : landing;
  doc.text(`$${showUnit || ''}`, textX+84, ty);
  ty += 14;

  // Selected sizes and quantities, wrapped
  doc.setFont(undefined,"bold");
  doc.text("Selected Sizes & Qtys:", textX, ty);
  doc.setFont(undefined,"normal");
  let sizesQty = (it.sizes || '');
  let sizeLines = doc.splitTextToSize(sizesQty, textW-124);
  doc.text(sizeLines, textX+120, ty, {maxWidth: textW-124});
  ty += Math.max(13, sizeLines.length * 11);

  // Customization notes, wrapped if needed
  if (it.notes) {
    doc.setFont(undefined,"bold");
    doc.text("Notes:", textX, ty);
    doc.setFont(undefined,"normal");
    let notesLines = doc.splitTextToSize((it.notes||'').substring(0,65), textW-44);
    doc.text(notesLines, textX+42, ty, {maxWidth: textW-44});
    ty += Math.max(13, notesLines.length * 11);
  }

  // Subtotal at bottom
  doc.setFont(undefined,"bold");
  doc.setFontSize(10.5);
  doc.text(`Subtotal: $${it.subtotal || ''}`, textX, y+cardH-15);

  y += cardH + 25;
  if (y > 700) { doc.addPage(); y = 40; }
}

// === TOTALS (centered, bold) ===
y += 12;
doc.setFontSize(11.5);
doc.setFont(undefined, "bold");
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
