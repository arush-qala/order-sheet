// === CONFIGURE THESE AT THE VERY TOP ===
const EMAILJS_PUBLIC_KEY = "ThVWDzQ_A2rENNdVu";
const EMAILJS_SERVICE_ID = "service_mjhvpwj";
const EMAILJS_TEMPLATE_ID = "template_wpcfoca";
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbwWCS2QwfQe-NtvDXsgFfdpL98HzAO8PUZcoBADqRoXnuP1A5p5N4hO9Kk_u-hAyK5j/exec";

// UPDATE THIS URL to your deployed Apps Script Web URL
const ORDER_NUMBER_ENDPOINT = "https://script.google.com/macros/s/AKfycbwWCS2QwfQe-NtvDXsgFfdpL98HzAO8PUZcoBADqRoXnuP1A5p5N4hO9Kk_u-hAyK5j/exec";

async function fetchOrderNumber(brand) {
  console.log("🔍 DEBUG: fetchOrderNumber() called with brand:", brand);
  
  try {
    // Use GET request with URL parameters (CORS-friendly)
    const url = `${ORDER_NUMBER_ENDPOINT}?action=getOrderNumber&brand=${encodeURIComponent(brand)}`;
    console.log(encodeURIComponent(brand))
    console.log("🔍 DEBUG: Sending GET request to:", url);
    
    const response = await fetch(url);
    console.log("🔍 DEBUG: Response status:", response.status);
    
    const responseText = await response.text();
    console.log("🔍 DEBUG: Raw response text:", responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
      console.log("🔍 DEBUG: Parsed JSON result:", result);
    } catch (parseError) {
      console.error("❌ DEBUG: JSON parsing failed:", parseError);
      console.error("❌ DEBUG: Response was not JSON:", responseText);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
    }
    
    if (result && result.orderId) {
      console.log("✅ DEBUG: Successfully got order number:", result.orderId);
      return result.orderId;
    } else {
      console.error("❌ DEBUG: Invalid response format:", result);
      // Fallback to legacy format
      console.log("🔄 DEBUG: Trying legacy GET format");
      const legacyUrl = `${ORDER_NUMBER_ENDPOINT}?getOrderNumber=Yes&brand=${encodeURIComponent(brand)}`;
      console.log("🔍 DEBUG: Legacy URL:", legacyUrl);
      
      const legacyRes = await fetch(legacyUrl);
      console.log("🔍 DEBUG: Legacy response status:", legacyRes.status);
      
      const legacyResult = await legacyRes.json();
      console.log("🔍 DEBUG: Legacy result:", legacyResult);
      
      return legacyResult.orderId;
    }
  } catch (error) {
    console.error("❌ DEBUG: Exception in fetchOrderNumber:", error);
    throw error; // Re-throw so calling code can handle
  }
}



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
    
  } 
  catch (err) {
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

// Debug helper function to show status on page
function showDebugStatus(message, type = 'info') {
  const existingDebug = document.getElementById('debug-status');
  if (existingDebug) existingDebug.remove();
  
  const debugDiv = document.createElement('div');
  debugDiv.id = 'debug-status';
  debugDiv.style.cssText = `
    position: fixed; top: 10px; right: 10px; z-index: 9999; 
    padding: 10px; border-radius: 5px; max-width: 300px; 
    font-size: 12px; font-family: monospace;
    ${type === 'error' ? 'background: #ffe6e6; border: 1px solid #ff9999; color: #cc0000;' : 
      type === 'success' ? 'background: #e6ffe6; border: 1px solid #99ff99; color: #006600;' : 
      'background: #e6f3ff; border: 1px solid #99ccff; color: #0066cc;'}
  `;
  debugDiv.textContent = message;
  document.body.appendChild(debugDiv);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (debugDiv.parentNode) debugDiv.parentNode.removeChild(debugDiv);
  }, 10000);
}
// Disable add and brand select until data loads
dom('addProductBtn').disabled = true;
dom('brandSelect').disabled = true;
dom('orderNumber').readOnly = true; // Always read-only
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
    return arr; // Removed artificial limit - allow scrolling through all results
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
// Higher resolution image conversion for PDF. size=desired pixels (default: 300)
async function toDataUrl(url, size=300) {
  if (imageCache.has(url+":"+size)) return imageCache.get(url+":"+size);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      // Use a larger canvas for a crisper image in PDF
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#fff"; ctx.fillRect(0,0,canvas.width,canvas.height);
      const ratio = Math.min(canvas.width/this.width, canvas.height/this.height, 1.0);
      const w = this.width * ratio, h = this.height * ratio;
      ctx.drawImage(this, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.93); // less lossy
      imageCache.set(url+":"+size, dataUrl);
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
  
  // Style label
  const styleLabel = document.createElement('label');
  styleLabel.textContent = 'Style';
  styleLabel.style.fontSize = '0.92rem';
  styleLabel.style.fontWeight = '600';
  styleLabel.style.color = '#232323';
  styleLabel.style.marginBottom = '3px';
  styleLabel.style.display = 'block';
  styleCol.appendChild(styleLabel);
  
  const styleField = document.createElement('input');
  styleField.type = 'text';
  styleField.placeholder = 'Search by SKU or Product name';
  styleField.style.width = '100%';
  styleField.style.marginBottom = '8px';
  styleCol.appendChild(styleField);

  const styleImg = document.createElement('img');
  styleImg.alt = 'Style Image';
  styleImg.style.display = 'none';
  styleCol.appendChild(styleImg);

  // Removed under-image label for style to avoid duplicate titling

  const printCol = document.createElement('div');
  printCol.className = 'productcol printcol';
  row.appendChild(printCol);
  
  // Custom Print label
  const printLabel = document.createElement('label');
  printLabel.textContent = 'Custom Print/Shade (optional)';
  printLabel.style.fontSize = '0.92rem';
  printLabel.style.fontWeight = '600';
  printLabel.style.color = '#232323';
  printLabel.style.marginBottom = '3px';
  printLabel.style.display = 'block';
  printCol.appendChild(printLabel);
  
  const printField = document.createElement('input');
  printField.type = 'text';
  printField.placeholder = 'Search by SKU or Product name';
  printField.style.width = '100%';
  printField.style.marginBottom = '8px';
  printCol.appendChild(printField);

  const printImg = document.createElement('img');
  printImg.alt = 'Print Image';
  printImg.style.display = 'none';
  printCol.appendChild(printImg);

  // Removed under-image label for custom print to avoid duplicate titling

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
      // Quantity dropdown
      const qtySelect = document.createElement('select');
      qtySelect.className = 'qty-stepper';
      qtySelect.style.width = '80px';
      qtySelect.style.fontSize = '15px';
      
      // Add options 1-10
      for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        qtySelect.appendChild(option);
      }
      
      qtySelect.value = item.quantity > 0 ? item.quantity : 1;
      qtySelect.addEventListener('change', function() {
        item.quantity = Number(this.value);
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
      rowDiv.appendChild(qtySelect);
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
    styleImg.src = prod.imageUrl; styleImg.style.display = '';
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
  console.log("🚀 DEBUG: Form submission started");
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '📧 Sending order...';

  console.log("🔍 DEBUG: Current state.items:", state.items);
  console.log("🔍 DEBUG: Total quantity:", state.totalQty);
  console.log("🔍 DEBUG: Total amount:", state.totalAmount);

  // Validate required fields: buyer name, email, and brand selection
  const requiredFields = ['buyerName', 'email', 'brandSelect'];
  const missing = requiredFields.filter(f => !dom(f).value.trim());
  if (missing.length) {
    const labels = {
      buyerName: 'Buyer/Store Name',
      email: 'Email Address',
      brandSelect: 'Brand'
    };
    alert('Please fill required field(s): ' + missing.map(f => labels[f] || f).join(', '));
    submitBtn.disabled = false; submitBtn.textContent = originalText; return;
  }
  if (!state.items.length || !state.items.some(i=>i.productName)) {
    alert("Add at least one valid product before submitting the order.");
    submitBtn.disabled = false; submitBtn.textContent = originalText; return;
  }
  // Allow submission even without quantities - for pricing enquiries
  // Only validate that products have been selected (style/product name)
  if (!state.items.every(i => i.productName && i.styleSku)) {
    alert("Please ensure all products have a style selected.");
    submitBtn.disabled = false; submitBtn.textContent = originalText; return;
  }

  // MOVED TO TOP: Fetch and assign a unique order number BEFORE sending any data to sheets!
  const brand = dom('brandSelect').value;
  showDebugStatus('Generating order number...', 'info');
  
  let orderNumber;
  try {
    orderNumber = await fetchOrderNumber(brand);
    dom('orderNumber').value = orderNumber;
    showDebugStatus(`Order number generated: ${orderNumber}`, 'success');
  } catch (error) {
    console.error("❌ DEBUG: Failed to generate order number:", error);
    showDebugStatus('❌ Failed to generate order number', 'error');
    alert("Failed to generate order number. Please try again.");
    submitBtn.disabled = false; 
    submitBtn.textContent = originalText; 
    return;
  }
  
  // Collect order data
  state.header = {
    orderNumber: orderNumber,
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
  
  


// Send all order line items to Google Sheets OrderLineItems tab
const allLineItems = state.items.map((item, i) => ({
  OrderID: orderNumber,
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
}));

// Send line items to OrderLineItems sheet using GET requests
console.log("🔍 DEBUG: Starting OrderLineItems submission");
console.log("🔍 DEBUG: Number of line items to send:", allLineItems.length);
console.log("🔍 DEBUG: Line items data:", allLineItems);
showDebugStatus(`Sending ${allLineItems.length} line items to Google Sheets...`, 'info');

let successCount = 0;
let failedCount = 0;

for (let i = 0; i < allLineItems.length; i++) {
  const item = allLineItems[i];
  try {
    console.log(`🔍 DEBUG: Sending line item ${i + 1}/${allLineItems.length}:`, item);
    
    // Build URL with all parameters for GET request
    const params = new URLSearchParams({
      action: 'addOrderLineItem',
      OrderID: item.OrderID,
      SubmissionTimestamp: item.SubmissionTimestamp,
      BuyerName: item.BuyerName,
      Email: item.Email,
      Phone: item.Phone,
      ShippingAddress: item.ShippingAddress,
      Brand: item.Brand,
      OrderComments: item.OrderComments,
      ProductSelectionID: item.ProductSelectionID,
      ProductSKU: item.ProductSKU,
      ProductName: item.ProductName,
      CustomPrintSKU: item.CustomPrintSKU,
      SizesAndQuantities: item.SizesAndQuantities,
      UnitPrice: item.UnitPrice,
      Subtotal: item.Subtotal,
      Notes: item.Notes
    });
    
    const url = `${SHEET_ENDPOINT}?${params.toString()}`;
    console.log(`🔍 DEBUG: Line item ${i + 1} URL:`, url);
    
    const response = await fetch(url);
    console.log(`🔍 DEBUG: Line item ${i + 1} response status:`, response.status);
    
    const result = await response.json();
    console.log(`🔍 DEBUG: Line item ${i + 1} result:`, result);
    
    if (result && result.result === "SUCCESS") {
      successCount++;
      console.log(`✅ DEBUG: Line item ${i + 1} recorded successfully`);
    } else {
      failedCount++;
      console.warn(`❌ DEBUG: Line item ${i + 1} failed:`, result);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
    
  } catch (err) {
    failedCount++;
    console.error(`❌ DEBUG: Exception for line item ${i + 1}:`, err);
  }
}

console.log(`🔍 DEBUG: OrderLineItems complete - Success: ${successCount}, Failed: ${failedCount}`);
if (successCount === allLineItems.length) {
  showDebugStatus('✅ All order line items saved to Google Sheets', 'success');
} else if (successCount > 0) {
  showDebugStatus(`⚠️ ${successCount}/${allLineItems.length} line items saved`, 'error');
} else {
  showDebugStatus('❌ Failed to save any order line items', 'error');
}


  
  // Send email and show diagnostics if failure
  try {
  emailjs.init(EMAILJS_PUBLIC_KEY);

  // Debug: Log what we're sending to EmailJS

const emailData = {
  orderNumber: state.header.orderNumber || '',
  buyerName: state.header.buyerName || '',
  email: state.header.email || '',
  phone: state.header.phone || '',
  shippingAddress: state.header.shippingAddress || '',
  orderComments: state.header.orderComments || '',
  brand: state.header.brand || '',
  totalQty: String(state.header.totalQty || 0),
  totalAmount: String(state.totalAmount.toFixed(2) || '0.00'),
  timestamp: state.header.timestamp || '',
  productList: products.map(item => {
    let line = `${item.productName}`;
    if (item.sizes && item.sizes.trim()) {
      line += ` (${item.sizes}) - $${item.subtotal}`;
    } else {
      line += ` - Pricing enquiry (quantities to be confirmed)`;
    }
    if (item.notes && item.notes.trim()) {
      line += `\nCustom notes: ${item.notes.trim()}`;
    }
    return line;
  }).join('\n\n') || 'No products'
};

    
console.log('Sending to EmailJS:', emailData);

await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailData);

    


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
doc.text('Qala Collective - Order Enquiry Sheet', x, y);
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
let fieldGaps = 32;
let buyerW = 232, emailW = 108, phoneW = 60;
let fy = y;
let bx = x;
// Buyer/Store Name
doc.setFont(undefined,"bold"); doc.setTextColor(0,0,0);
doc.text('Buyer & Store Name', bx, fy);
doc.setDrawColor(200,200,230);
doc.setFillColor(252,252,255);
doc.roundedRect(bx, fy+4, buyerW, fieldBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal");
doc.text(state.header.buyerName || '', bx + 5, fy + 16);
bx += buyerW + fieldGaps;
// Email
doc.setFont(undefined,"bold"); doc.setTextColor(0,0,0);
doc.text('Email', bx, fy);
doc.setDrawColor(200,200,230);
doc.setFillColor(252,252,255);
doc.roundedRect(bx, fy+4, emailW, fieldBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal");
doc.text(state.header.email || '', bx + 5, fy + 16);
bx += emailW + fieldGaps;
// Phone
doc.setFont(undefined,"bold"); doc.setTextColor(0,0,0);
doc.text('Phone', bx, fy);
doc.setDrawColor(200,200,230);
doc.setFillColor(252,252,255);
doc.roundedRect(bx, fy+4, phoneW, fieldBoxH, fieldBoxR, fieldBoxR, 'F');
doc.setFont(undefined,"normal");
doc.text(state.header.phone || '', bx + 5, fy + 16);
y += 28;

// === ROW 3: DELIVERY TIMELINES [2/3 wide] + SHIPPING [1/3 wide], side by side with soft rectangles ===
const commentsW = 232, shippingW = 232;
const labelY = y+6;
bx = x;
doc.setFont(undefined,"bold");
doc.text('Delivery Timelines', bx, labelY);
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
const cardW = 530, cardH = 210, cardR = 8;
const imgW = 130, imgH = 130; // sharper/larger images
const styleImgX = x + 14, printImgX = styleImgX + imgW + 32, textX = printImgX + imgW + 42, textW = 162;

for (let idx = 0; idx < state.items.length; ++idx) {
  let it = state.items[idx];

  // Check if there's enough space for the entire card before drawing it
  if (y + cardH > 750) { 
    doc.addPage(); 
    y = 40; 
  }

  // Outer card
  doc.setDrawColor(200,200,220);
  doc.setLineWidth(1);
  doc.roundedRect(x, y, cardW, cardH, cardR, cardR, 'S');

  // === ITEM NUMBER: INSIDE CARD, top left corner ===
  doc.setFont(undefined, "bolditalic");
  doc.setFontSize(10.7);
  doc.setTextColor(0,0,0);
  doc.text(`Item ${idx+1}`, x+10, y+19);
  doc.setTextColor(0,0,0);

  // === STYLE IMAGE, higher quality/larger ===
  if (it.styleImgUrl) {
    try {
      const imgData = await toDataUrl(it.styleImgUrl, 370); // 370px source; 2.5x your display size for crisp print
      doc.addImage(imgData, "JPEG", styleImgX, y+30, imgW, imgH);

      doc.setDrawColor(170,170,200);
      doc.roundedRect(styleImgX-2, y+28, imgW+4, imgH+4, 10,10,'S');
    } catch (e) {}
  }
  // PDF caption under style image
  doc.setFont(undefined, "bold");
  doc.setFontSize(9.2);
  doc.text('Style', styleImgX + imgW/2, y+30+imgH+13, {align:'center'});

  // === CUSTOM PRINT IMAGE, higher quality/larger, spaced further ===
  if (it.printImgUrl) {
    try {
      const imgData = await toDataUrl(it.printImgUrl, 370);
      doc.addImage(imgData, "JPEG", printImgX, y+30, imgW, imgH);

      doc.setDrawColor(170,170,200);
      doc.roundedRect(printImgX-2, y+28, imgW+4, imgH+4, 10,10,'S');
    } catch (e) {}
  
  // PDF caption under custom print image
  doc.setFont(undefined, "bold");
  doc.setFontSize(9.2);
  doc.text('Custom Print', printImgX + imgW/2, y+30+imgH+13, {align:'center'});
  }
  // === DETAILS RIGHT COLUMN ===
  let ty = y + 36;

  // Product Name
  doc.setFont(undefined, "bold");
  doc.setFontSize(11.2);
  doc.text((it.productName || '').substring(0,36), textX, ty, {maxWidth: textW});
  ty += 30;

  // Available Sizes
  doc.setFont(undefined,"bold").setFontSize(9.5);
  doc.text("Available Sizes:", textX, ty);
  doc.setFont(undefined,"normal");
  let availSizes = (productData.find(p=>p.skuId===it.styleSku)?.availableSizes?.join(", ") || "");
  let availLines = doc.splitTextToSize(availSizes, textW-92);
  if(availSizes) doc.text(availLines, textX+82, ty, {maxWidth: textW-82});
  ty += Math.max(13, availLines.length * 11);

  // Product Link
  doc.setFont(undefined,"bold");
  doc.text("Product Details:", textX, ty);
  doc.setFont(undefined,"normal");
  if (it.styleSku) {
    const p = productData.find(p=>p.skuId===it.styleSku);
    if (p && p.productLink) {
      doc.setTextColor(50,90,200);
      doc.textWithLink('Link', textX+77, ty, { url: p.productLink });
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
  doc.text(`${showUnit || ''}`, textX+74, ty);
  ty += 14;

  // Selected sizes and quantities, wrapped
  doc.setFont(undefined,"bold");
const selectionLabel = "Selection:";
doc.text(selectionLabel, textX, ty);
doc.setFont(undefined,"normal");

// Calculate label width and add extra space after the colon
const numSpaces = 4; // Change this for more/less space
const extraSpacing = doc.getTextWidth(' '.repeat(numSpaces));
const selectionLabelWidth = doc.getTextWidth(selectionLabel) + extraSpacing;

let sizesQty = (it.sizes || '');
if (!sizesQty.trim()) {
  sizesQty = "Pricing enquiry - quantities to be confirmed";
}
let selectionLines = doc.splitTextToSize(
  sizesQty,
  textW - selectionLabelWidth // wrap at remainder of right column width
);

if (selectionLines.length > 0) {
  // Print first line after the label + padding spaces
  doc.text(selectionLines[0], textX + selectionLabelWidth, ty, {baseline: "alphabetic"});
  for (let l = 1; l < selectionLines.length; l++) {
    ty += 13;
    doc.text(selectionLines[l], textX, ty, {baseline: "alphabetic"});
  }
}
ty += 13;



  // Customization notes, wrapped if needed
  if (it.notes) {
    doc.setFont(undefined,"bold");
    doc.text("Notes:", textX, ty);
    doc.setFont(undefined,"normal");
    let notesLines = doc.splitTextToSize((it.notes||'').substring(0,65), textW-44);
    doc.text(notesLines, textX+40, ty, {maxWidth: textW-40});
    ty += Math.max(13, notesLines.length * 11);
  }

  // Subtotal at bottom
  doc.setFont(undefined,"bold");
  doc.setFontSize(10.5);
  if (it.subtotal && it.subtotal > 0) {
    doc.text(`Subtotal: ${it.subtotal || ''}`, textX, y+cardH-15);
  } else {
    doc.text(`Pricing enquiry`, textX, y+cardH-15);
  }

  y += cardH + 25;
}

// === TOTALS (centered, bold) ===
y += 12;
doc.setFontSize(11.5);
doc.setFont(undefined, "bold");
if (state.totalQty > 0) {
  doc.text(`Total Quantity: ${state.totalQty}`, x, y);
  doc.text(`Total Amount: ${state.totalAmount.toFixed(2)}`, x + 200, y);
} else {
  doc.text(`Pricing Enquiry - Quantities to be confirmed`, x, y);
}

doc.save(`OrderSheet_${state.header.orderNumber}.pdf`);

    // submitBtn.textContent = '🎉 Complete! Order emailed & PDF saved';
    console.log("🎉 DEBUG: FINAL SUCCESS - All operations completed");
    console.log("🔍 DEBUG: Final order number:", orderNumber);
    console.log("🔍 DEBUG: Final state summary:", { 
      header: state.header, 
      itemCount: state.items.length,
      totalQty: state.totalQty,
      totalAmount: state.totalAmount
    });
    // alert(`✅ SUCCESS!\n\n📧 Order details sent\nYour order number: ${orderNumber}\n📄 PDF downloaded\nBackups secured!`);
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
  if (this.value) {
    createProductCard();
   // dom('orderNumber').value = '';        // Optionally clear previous order number for clarity
  }
});





// --- Add product button ---
dom('addProductBtn').addEventListener('click', createProductCard);
 
 