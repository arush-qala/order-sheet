
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
    if (document.getElementById('brandSelect').value) {
      createProductCard();
    }
  } catch (err) {
    alert("Could not load product database from Google Sheets.");
    productData = [];
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

document.getElementById('addProductBtn').disabled = true;
document.getElementById('brandSelect').disabled = true;
fetchProductData();

const dom = id => document.getElementById(id);

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

// Add this optimized function for faster PDF generation
const imageCache = new Map();

async function toDataUrl(url) {
  // Check cache first
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }
  
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement('canvas');
      // Optimized size for PDF display
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#fff"; 
      ctx.fillRect(0,0,canvas.width,canvas.height);
      const ratio = Math.min(canvas.width/this.width, canvas.height/this.height, 1.0);
      const w = this.width * ratio, h = this.height * ratio;
      ctx.drawImage(this, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
      // High quality JPEG
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      // Cache the result
      imageCache.set(url, dataUrl);
      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = url + (url.includes("?") ? "&" : "?") + "rand=" + Math.random();
  });
}



function createProductCard() {
  const brand = dom('brandSelect').value;
  if (!brand) return alert('Select a brand first.');

  const card = document.createElement('div');
  card.className = 'product-card';

  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = '&times;';
  removeBtn.className = 'remove-card';
  removeBtn.type = 'button';
  removeBtn.setAttribute('aria-label', 'Remove product');
  card.appendChild(removeBtn);

  // Three columns
  const row = document.createElement('div');
  row.className = 'card-threecol';
  card.appendChild(row);

  // === 1. Style
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

  // === 2. Print
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

  // === 3. Details
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

 // === Dynamic SIZES + QTY ROW ===
const sizesList = document.createElement('div');
sizesList.className = 'sizes-list';
let sizeQtyArray = [];
let availableSizesArr = [];

// Unit price input created here so we can reference for sizing
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

  // Set left summary label (total quantity)
  qtySummary.textContent = (totalQty > 0 && unit > 0)
    ? `Total Qty: ${totalQty}`
    : "";
  // Set right summary label (subtotal)
  lineItem.sizes = sizeQtyArray.filter(e => Number(e.quantity) > 0).map(e => `${e.quantity} ${e.size}`).join(', ');
  lineItem.unitPrice = unit;
  const subtotal = totalQty * unit;
  lineItem.subtotal = subtotal;
  subtotalDisp.textContent = (totalQty > 0 && unit > 0)
    ? `Subtotal $${subtotal.toFixed(2)}`
    : '';

  // Show/hide summary row
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

    // Quantity stepper box
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'qty-stepper';
    qtyInput.min = '1';
    qtyInput.step = '1';
    qtyInput.placeholder = 'Qty';
    qtyInput.value = item.quantity > 0 ? item.quantity : 1;
    qtyInput.style.width = '60px';
    qtyInput.addEventListener('input', function() {
      // Only allow minimum 1
      item.quantity = Math.max(1, Number(this.value) || 1);
      this.value = item.quantity;
      updateTotalAndSubtotal();
    });

    // For up/down keys and +/- buttons
    qtyInput.addEventListener('change', function() {
      item.quantity = Math.max(1, Number(this.value) || 1);
      this.value = item.quantity;
      updateTotalAndSubtotal();
    });

    // Remove button
/*    const remBtn = document.createElement('button');
    remBtn.type = 'button';
    remBtn.textContent = '×';
    remBtn.className = 'remove-size-btn';
    remBtn.title = 'Remove size';    */

const remBtn = document.createElement('button');
remBtn.type = 'button';
remBtn.innerHTML = `
  <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true">
    <line x1="4" y1="4" x2="12" y2="12" stroke="#c22525" stroke-width="2" stroke-linecap="round"/>
    <line x1="12" y1="4" x2="4" y2="12" stroke="#c22525" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;
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

    // Add inline "+" ONLY at the end
    if (idx === sizeQtyArray.length - 1) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.innerHTML = `
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
      <line x1="8" y1="4" x2="8" y2="12" stroke="#101010" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="4" y1="8" x2="12" y2="8" stroke="#101010" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;
      addBtn.className = 'add-size-btn-inline';
      addBtn.title = 'Add new size';
      addBtn.onclick = function(e) {
        e.preventDefault();
        sizeQtyArray.push({ size: availableSizesArr[0] || "", quantity: 1 });
        renderSizeQtyRows();
        updateTotalAndSubtotal(); // 👈 Now updates totals right after row is added!
      };
      rowDiv.appendChild(addBtn);
    }

    sizesList.appendChild(rowDiv);
  });
}

// Row label
const sizesTitle = document.createElement('label');
sizesTitle.textContent = 'Select Size(s) & Qty:';
detailsCol.appendChild(sizesTitle);
detailsCol.appendChild(sizesList);

// === Unit Price Override aligns with selects ===
const unitPriceLabel = document.createElement('label');
unitPriceLabel.textContent = 'Unit Price Override ($)';
detailsCol.appendChild(unitPriceLabel);
detailsCol.appendChild(unitPriceInput);

// Notes and subtotal (as per your code follows below...)

const noteLabel = document.createElement('label');
noteLabel.textContent = 'Customization Notes';
detailsCol.appendChild(noteLabel);

const noteArea = document.createElement('textarea');
noteArea.rows = 2; 
noteArea.style.width = '100%';
detailsCol.appendChild(noteArea);

// --- Summary Row (Total Qty Left, Subtotal Right, Inline) ---
const summaryRow = document.createElement('div');
summaryRow.style.display = 'none'; // Start hidden
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
      size: availableSizesArr[0], // default to first size
      quantity: 1                 // default to 1
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

  removeBtn.addEventListener('click', () => { card.remove(); state.removeItem(state.items.indexOf(lineItem)); });
  dom('productCards').appendChild(card); state.addItem(lineItem);
}

/*
async function toDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 140; canvas.height = 140;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#fff"; ctx.fillRect(0,0,canvas.width,canvas.height);
      const ratio = Math.min(canvas.width/this.width, canvas.height/this.height, 1.0);
      const w = this.width * ratio, h = this.height * ratio;
      ctx.drawImage(this, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.90));
    };
    img.onerror = reject;
    img.src = url + (url.includes("?") ? "&" : "?") + "rand=" + Math.random();
  });
}*/


dom('orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  
  // Show progress
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '📧 Sending order...';
  
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
    userAgent: navigator.userAgent.substr(0, 100) // Track which device/browser
  };

  // Prepare products for email
  const products = state.items.map(item => ({
    productName: item.productName,
    productSku: item.styleSku,
    printSku: item.printSku || '',
    sizes: item.sizes,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal.toFixed(2),
    notes: item.notes
  }));

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
fetch("AKfycbwlTlk4rtWvSCNtnauZmEECNm1wg8TO1t7ioBotLNuj_DS9NT6yACM6YpPMPOE3I7HD", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({ order: orderInfo, items: items })
}).then(res => res.json()).then(res => {
    if (res && res.result === "SUCCESS") {
      console.log("Logged to Google Sheet:", res.orderId);
    } else {
      console.warn("Order NOT saved to Google Sheet:", (res && res.message));
    }
}).catch(err => {
    console.error("POST to Google Sheet failed:", err);
});


  

  
  try {
    // STEP 1: Send email notification
    emailjs.init("EAXAUT5KyAX7qT35l"); // Replace with your actual public key
    
    await emailjs.send(
      "service_mjhvpwj",  // Replace with your service ID
      "template_wpcfoca", // Replace with your template ID
      {
        ...state.header,
        products: products,
        totalAmount: state.totalAmount.toFixed(2)
      }
    );
    
    submitBtn.textContent = '✅ Order emailed! Generating PDF...';
    
    // STEP 2: Generate PDF (your existing code)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({orientation:'portrait', unit:'pt', format:'a4'});
    let y = 32, left = 36;
    
    doc.setFontSize(17); 
    doc.text('Order Sheet – Brand Assembly LA', left, y); 
    y += 24;
    doc.setFontSize(11);
    
    Object.entries(state.header).forEach(([k, v]) => { 
      doc.text(`${k}: ${v}`, left, y); 
      y += 18; 
    });
    y += 6;
    
    // Process each item with optimized image handling
    for (let idx = 0; idx < state.items.length; ++idx) {
      let it = state.items[idx];
      
      // Parallel image processing for speed
      const [styleData, printData] = await Promise.all([
        it.styleImgUrl ? toDataUrl(it.styleImgUrl).catch(() => null) : Promise.resolve(null),
        it.printImgUrl ? toDataUrl(it.printImgUrl).catch(() => null) : Promise.resolve(null)
      ]);
      
      // Three cols layout
      const col1 = left, col2 = left+170, col3 = left+340;
      let rowMaxH = 0;
      
      doc.setFontSize(12); 
      doc.setFont(undefined,"bold");
      doc.text(`Item ${idx+1}`, left, y);
      
      // Style col
      if (styleData) {
        doc.setFontSize(10); 
        doc.text("Style", col1+42, y+17);
        doc.addImage(styleData, "JPEG", col1+10, y+26, 120, 120, undefined, 'FAST');
        rowMaxH = 137;
      }
      
      // Print col
      if (printData) {
        doc.setFontSize(10); 
        doc.text("Custom Print", col2+25, y+17);
        doc.addImage(printData, "JPEG", col2+10, y+26, 120, 120, undefined, 'FAST');
        rowMaxH = Math.max(rowMaxH,137);
      }
      
      // Details col
      doc.setFontSize(10);
      let infoRow = y+2;
      doc.setFont(undefined,"bold"); 
      doc.text(it.productName || "", col3, infoRow+20);
      doc.setFont(undefined,"normal"); 
      infoRow += 35;
      
      if (it.styleSku) {
        const p = productData.find(p=>p.skuId===it.styleSku);
        if (p && p.availableSizes && p.availableSizes.length) {
          doc.text("Available Sizes: "+p.availableSizes.join(" · "), col3, infoRow); 
          infoRow+=14;
        }
      }
      if (it.styleSku) {
        const p = productData.find(p=>p.skuId===it.styleSku);
        if (p && p.productLink) doc.textWithLink('Product Details Link', col3, infoRow, {url: p.productLink}); 
        infoRow+=14;
      }
      
      doc.text(`Landing $${it.unitPrice||""} · RRP ${(()=>{const p=productData.find(p=>p.skuId===it.styleSku);return p?p.recommendedRetailPrice:""})()}`, col3, infoRow); 
      infoRow+=14;
      doc.text(`Sizes: ${it.sizes||""} · Qty: ${it.quantity||""}`, col3, infoRow); 
      infoRow+=14;
      doc.text(`Notes: ${it.notes||""}`, col3, infoRow); 
      infoRow+=14;
      doc.setFont(undefined,"bold");
      doc.text(`Subtotal $${it.subtotal||""}`, col3, infoRow+4); 
      
      rowMaxH = Math.max(rowMaxH, infoRow-(y+2)+30);
      y += rowMaxH + 32;
      if (y > 660) { doc.addPage(); y = 36; }
    }
    
    doc.save(`OrderSheet_${state.header.orderNumber}.pdf`);
    
    submitBtn.textContent = '🎉 Complete! Order emailed & PDF saved';
    alert("✅ SUCCESS!\n\n📧 Order details emailed to arush@qala.global\n📄 PDF downloaded to your device\n\nBoth backups are secured!");
    
  } catch (error) {
    console.error('Error:', error);
    
    // Even if email fails, still generate PDF
    submitBtn.textContent = '⚠️ Email failed, generating PDF...';
    
    // Generate PDF as fallback
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({orientation:'portrait', unit:'pt', format:'a4'});
    // ... (your existing PDF code) ...
    doc.save(`OrderSheet_${state.header.orderNumber}.pdf`);
    
    alert("⚠️ EMAIL FAILED but PDF saved!\n\nPlease manually send this order info:\n" + JSON.stringify({...state.header, items: products}, null, 2));
  } finally {
    // Restore button after 3 seconds
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 3000);
  }
  
  console.log({ header: state.header, items: state.items });
});



dom('brandSelect').addEventListener('change', function () {
  dom('productCards').innerHTML = '';
  state.reset();
  if (this.value) createProductCard();
});
dom('addProductBtn').addEventListener('click', createProductCard);



