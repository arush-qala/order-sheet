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

    // Optional: enable UI (if you want to block controls until loaded)
    document.getElementById('addProductBtn').disabled = false;
    document.getElementById('brandSelect').disabled = false;
    // Optionally, automatically create a product card if a brand is already selected:
    if (document.getElementById('brandSelect').value) {
      createProductCard();
    }
  } catch (err) {
    alert("Could not load product database from Google Sheets.");
    productData = []; // Safe fallback
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
  }).filter(x => x.skuId && x.brandName); // Only keep valid rows
}

// <<< PLACE IT HERE, before you enable any UI or listen for user interactions! >>>
document.getElementById('addProductBtn').disabled = true;
document.getElementById('brandSelect').disabled = true;

// Call once on page load
fetchProductData();




/*
function fetchProductDataFromSheet(callback) {
  // Replace GID if your sheet uses a different tab
  const SHEET_ID = '2PACX-1vSGSBJA4h8Rbg6eCNk63pR4CGb4wwBPmHa6kN2B3R2wu_MJX35fdWRgWJ5FKDtChOo22lW5roEViMwq';
  const GID = '0'; // update this if your sheet tab is different
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;
  fetch(url)
    .then(response => response.text())
    .then(text => {
      // Strip the JS wrapper to get raw JSON
      const json = JSON.parse(text.match(/(?<=setResponse\\().*(?=\\);)/s)[0]);
      const rows = json.table.rows;
      const headers = json.table.cols.map(col => col.label || col.id);

      // Map rows to objects with correct headers
      const products = rows.map(row => {
        const obj = {};
        row.c.forEach((cell, i) => obj[headers[i]] = cell ? cell.v : "");
        return obj;
      });
      callback(products);
    });
}
*/



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

  // Helper to get results; empty string returns all, sorted by skuId
  function getResults(val) {
    let arr = productData.filter(p => p.brandName === brand && 
      (val ? (p.productName.toLowerCase().includes(val) || p.skuId.toLowerCase().includes(val)) : true)
    );
    // sort by SKU ID string
    arr.sort((a,b) => a.skuId.localeCompare(b.skuId, undefined, {numeric:true, sensitivity:'base'}));
    return arr.slice(0, 8);
  }

  // Actually use this on both 'input' and 'focus'
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

  input.addEventListener('input', function() {
    showList(this.value);
  });

  // NEW: Show all on focus (when nothing filled out yet)
  input.addEventListener('focus', function() {
    if (!this.value.trim()) showList("");
  });

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

  // === 1. Style ===
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

  // === 2. Print ===
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

  // === 3. Details ===
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
  link.style.marginBottom = '8px';
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

  // ==== New Dynamic SIZES + QTY ROW LOGIC ====
  const sizesList = document.createElement('div');
  sizesList.className = 'sizes-list';

  let sizeQtyArray = []; // [{size: 'S', quantity: 2}, ...]
  let availableSizesArr = [];

  function renderSizeQtyRows() {
    sizesList.innerHTML = ""; // Clear before re-render

    sizeQtyArray.forEach((item, idx) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'sizes-qty-row';

      // Size dropdown
      const sizeSel = document.createElement('select');
      availableSizesArr.forEach(size => {
        const opt = document.createElement('option');
        opt.value = size;
        opt.textContent = size;
        sizeSel.appendChild(opt);
      });
      sizeSel.value = item.size || availableSizesArr[0] || '';
      sizeSel.onchange = function() {
        item.size = this.value;
        updateAvailableSizeOptions();
      };

      // Qty
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.placeholder = 'Qty';
      qtyInput.min = '0';
      qtyInput.value = item.quantity;
      qtyInput.style.width = '65px';
      qtyInput.addEventListener('input', function() {
        item.quantity = Number(this.value) || 0;
        updateTotalAndSubtotal();
      });

      // Remove size line button
      const remBtn = document.createElement('button');
      remBtn.type = 'button';
      remBtn.textContent = '×';
      remBtn.className = 'remove-size-btn';
      remBtn.title = 'Remove size';
      remBtn.onclick = () => {
        sizeQtyArray.splice(idx, 1);
        renderSizeQtyRows();
        updateTotalAndSubtotal();
      };

      rowDiv.appendChild(sizeSel);
      rowDiv.appendChild(qtyInput);
      if (sizeQtyArray.length > 1) rowDiv.appendChild(remBtn);

      sizesList.appendChild(rowDiv);
    });
  }

  // Add size line button
  const addSizeBtn = document.createElement('button');
  addSizeBtn.type = 'button';
  addSizeBtn.textContent = '+ Size';
  addSizeBtn.className = 'add-size-btn';
  addSizeBtn.onclick = function(e) {
    e.preventDefault();
    // Find first available (unselected) size, or add duplicate if user wants
    const sizeUsed = sizeQtyArray.map(line => line.size);
    const nextAvailable = availableSizesArr.find(size => !sizeUsed.includes(size)) || availableSizesArr[0];
    sizeQtyArray.push({ size: nextAvailable, quantity: 0 });
    renderSizeQtyRows();
  };

  // Total QTY display
  const qtyTotalWrap = document.createElement('div');
  const qtyTotalLabel = document.createElement('span');
  qtyTotalLabel.textContent = 'Total Qty: ';
  const qtyTotalSpan = document.createElement('span');
  qtyTotalSpan.className = 'current-qty-total';
  qtyTotalSpan.textContent = '0';
  qtyTotalWrap.appendChild(qtyTotalLabel);
  qtyTotalWrap.appendChild(qtyTotalSpan);

  // UNIT PRICE
  const unitPriceLabel = document.createElement('label');
  unitPriceLabel.textContent = 'Unit Price ($)';
  detailsCol.appendChild(unitPriceLabel);

  const unitPriceInput = document.createElement('input');
  unitPriceInput.type = 'number';
  unitPriceInput.placeholder = 'Unit Price $';
  unitPriceInput.min = '0';
  detailsCol.appendChild(unitPriceInput);

  // SIZES TITLE + DYNAMIC LIST + ADD BUTTON
  const sizesTitle = document.createElement('label');
  sizesTitle.textContent = 'Select Size(s) & Qty:';
  detailsCol.appendChild(sizesTitle);
  detailsCol.appendChild(sizesList);
  detailsCol.appendChild(addSizeBtn);
  detailsCol.appendChild(qtyTotalWrap);

  // Customize notes
  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Customization Notes';
  detailsCol.appendChild(noteLabel);

  const noteArea = document.createElement('textarea');
  noteArea.rows = 2;
  noteArea.placeholder = 'Customization notes';
  noteArea.style.width = '100%';
  detailsCol.appendChild(noteArea);

  const subtotalDisp = document.createElement('div');
  subtotalDisp.className = 'subtotal-disp';
  detailsCol.appendChild(subtotalDisp);

  // Core order line item
  const lineItem = { styleSku:'', printSku:'', productName:'', sizes:'', quantity:0, unitPrice:0, subtotal:0, notes:'', styleImgUrl:'', printImgUrl:'' };

  // --- Helper Functions
  function updateTotalAndSubtotal() {
    // Remove lines with no size or negative/zero qty
    sizeQtyArray = sizeQtyArray.filter(line => line.size && Number(line.quantity) > 0);

    const totalQty = sizeQtyArray.reduce((sum, entry) => sum + (Number(entry.quantity) || 0), 0);
    qtyTotalSpan.textContent = totalQty;
    lineItem.quantity = totalQty;

    // Save as string summary to .sizes field for export/PDF
    lineItem.sizes = sizeQtyArray.filter(e => e.quantity).map(e => `${e.quantity} ${e.size}`).join(', ');

    const unit = Number(unitPriceInput.value || 0);
    lineItem.unitPrice = unit;
    const subtotal = totalQty * unit;
    lineItem.subtotal = subtotal;
    subtotalDisp.textContent = (totalQty && unit) ? `Subtotal $${subtotal.toFixed(2)}` : '';
    state.recalculateTotals();
  }

  // When style is selected, set sizes and reset sizes-qty UI
  function onStyleChange(prod) {
    availableSizesArr = (prod.availableSizes && prod.availableSizes.length) ? prod.availableSizes : [];
    // Start with one row by default
    sizeQtyArray = [{size: availableSizesArr[0] || "", quantity: 0}];
    renderSizeQtyRows();
    updateTotalAndSubtotal();
  }

  function updateAvailableSizeOptions() {
    // Ensures that changing one row to use a used size is allowed if you want (e.g., two size "S" if needed)
    // Optionally, you could prevent duplicates by making used sizes disabled in other dropdowns
    // No additional logic needed for now
    updateTotalAndSubtotal();
  }

  // Unit price and customization notes listeners
  unitPriceInput.addEventListener('input', updateTotalAndSubtotal);
  noteArea.addEventListener('input', () => lineItem.notes = noteArea.value);

  // Autocomplete and data population
  autoCompleteBox(styleField, brand, prod => {
    styleField.value = `${prod.skuId} – ${prod.productName}`;
    styleImg.src = prod.imageUrl;
    styleImg.style.display = '';
    styleImgLabel.classList.add('active');
    prodName.textContent = prod.productName;
    link.style.display = 'inline-block';
    link.href = prod.productLink;
    landingBox.textContent = `Landing $${prod.landingPrice}`;
    retailBox.textContent = `RRP $${prod.recommendedRetailPrice}`;
    unitPriceInput.value = prod.landingPrice;
    lineItem.styleSku = prod.skuId;
    lineItem.productName = prod.productName;
    lineItem.unitPrice = prod.landingPrice;
    lineItem.styleImgUrl = prod.imageUrl;
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
}

dom('orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  state.header = {
    orderNumber: dom('orderNumber').value,
    buyerName: dom('buyerName').value,
    email: dom('email').value,
    phone: dom('phone').value,
    shippingAddress: dom('shippingAddress').value,
    orderComments: dom('orderComments').value,
    brand: dom('brandSelect').value,
    totalQty: state.totalQty,
    totalAmount: state.totalAmount
  };
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:'portrait', unit:'pt', format:'a4'});
  let y = 32, left = 36;
  doc.setFontSize(17); doc.text('Order Sheet – Brand Assembly LA', left, y); y += 24;
  doc.setFontSize(11);
  Object.entries(state.header).forEach(([k, v]) => { doc.text(`${k}: ${v}`, left, y); y += 18; });
  y += 6;
  for (let idx = 0; idx < state.items.length; ++idx) {
    let it = state.items[idx];
    let styleData = null, printData = null;
    try { styleData = it.styleImgUrl ? await toDataUrl(it.styleImgUrl) : null; }catch{}
    try { printData = it.printImgUrl ? await toDataUrl(it.printImgUrl) : null; }catch{}
    // Three cols layout
    const col1 = left, col2 = left+170, col3 = left+340;
    let rowMaxH = 0;
    doc.setFontSize(12); doc.setFont(undefined,"bold");
    doc.text(`Item ${idx+1}`, left, y);
    // Style col
    if (styleData) {
      doc.setFontSize(10); doc.text("Style", col1+42, y+17);
      doc.addImage(styleData, "JPEG", col1+10, y+26, 120, 120);
      rowMaxH = 137;
    }
    // Print col
    if (printData) {
      doc.setFontSize(10); doc.text("Custom Print", col2+25, y+17);
      doc.addImage(printData, "JPEG", col2+10, y+26, 120, 120);
      rowMaxH = Math.max(rowMaxH,137);
    }
    // Details col
    doc.setFontSize(10);
    let infoRow = y+2;
    doc.setFont(undefined,"bold"); doc.text(it.productName || "", col3, infoRow+20);
    doc.setFont(undefined,"normal"); infoRow += 35;
    if (it.styleSku) {
      const p = productData.find(p=>p.skuId===it.styleSku);
      if (p && p.availableSizes && p.availableSizes.length) {
        doc.text("Available Sizes: "+p.availableSizes.join(" · "), col3, infoRow); infoRow+=14;
      }
    }
    if (it.styleSku) {
      const p = productData.find(p=>p.skuId===it.styleSku);
      if (p && p.productLink) doc.textWithLink('Product Details Link', col3, infoRow, {url: p.productLink}); infoRow+=14;
    }
    doc.text(`Landing $${it.unitPrice||""} · RRP ${(()=>{const p=productData.find(p=>p.skuId===it.styleSku);return p?p.recommendedRetailPrice:""})()}`, col3, infoRow); infoRow+=14;
    doc.text(`Sizes: ${it.sizes||""} · Qty: ${it.quantity||""}`, col3, infoRow); infoRow+=14;
    doc.text(`Notes: ${it.notes||""}`, col3, infoRow); infoRow+=14;
    doc.setFont(undefined,"bold");
    doc.text(`Subtotal $${it.subtotal||""}`, col3, infoRow+4); 
    rowMaxH = Math.max(rowMaxH, infoRow-(y+2)+30);
    y += rowMaxH + 32;
    if (y > 660) { doc.addPage(); y = 36; }
  }
  doc.save(`OrderSheet_${state.header.orderNumber}.pdf`);
  console.log({ header: state.header, items: state.items });
});

dom('brandSelect').addEventListener('change', function () {
  dom('productCards').innerHTML = '';
  state.reset();
  if (this.value) createProductCard();
});
dom('addProductBtn').addEventListener('click', createProductCard);
