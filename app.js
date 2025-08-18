let productData = [];

async function loadProductsFromSheet() {
  const url = "https://docs.google.com/spreadsheets/d/12cd298kPsjqbQUdx2zDbGQSKpQGU-kk9em1nrCC91D4/export?format=csv";
  const response = await fetch(url);
  const csvText = await response.text();

  // Parse CSV (basic version)
  const rows = csvText.trim().split("\n").map(r => r.split(","));
  const headers = rows[0];
  productData = rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h,i) => obj[h] = row[i]);
    // typecast and split availableSizes
    obj.landingPrice = Number(obj.landingPrice);
    obj.recommendedRetailPrice = Number(obj.recommendedRetailPrice);
    obj.availableSizes = obj.availableSizes ? obj.availableSizes.split("|") : [];
    return obj;
  });
}

loadProductsFromSheet().then(() => {
  // After products loaded, initialize your app (e.g., enable controls, etc)
});


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
  const brand = dom('brandSelect').value; if (!brand) return alert('Select a brand first.');
  const card = document.createElement('div'); card.className = 'product-card';
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = '&times;'; removeBtn.className='remove-card'; removeBtn.type='button';
  removeBtn.setAttribute('aria-label','Remove product'); card.appendChild(removeBtn);

  // Three columns
  const row = document.createElement('div'); row.className = 'card-threecol'; card.appendChild(row);
  // 1. Style
  const styleCol = document.createElement('div'); styleCol.className = 'productcol stylecol'; row.appendChild(styleCol);
  const styleField = document.createElement('input'); styleField.type='text'; styleField.placeholder='Search style by SKU or name'; styleField.style.width='100%'; styleField.style.marginBottom='8px'; styleCol.appendChild(styleField);
  const styleImg = document.createElement('img'); styleImg.alt = 'Style Image'; styleImg.style.display='none'; styleCol.appendChild(styleImg);
  const styleImgLabel = document.createElement('div'); styleImgLabel.className = 'img-label'; styleImgLabel.textContent = 'Style'; styleCol.appendChild(styleImgLabel);
  // 2. Print
  const printCol = document.createElement('div'); printCol.className = 'productcol printcol'; row.appendChild(printCol);
  const printField = document.createElement('input'); printField.type='text'; printField.placeholder='Optional custom print'; printField.style.width='100%'; printField.style.marginBottom='8px'; printCol.appendChild(printField);
  const printImg = document.createElement('img'); printImg.alt = 'Print Image'; printImg.style.display='none'; printCol.appendChild(printImg);
  const printImgLabel = document.createElement('div'); printImgLabel.className = 'img-label'; printImgLabel.textContent = 'Custom Print'; printCol.appendChild(printImgLabel);
  // 3. Details
  const detailsCol = document.createElement('div'); detailsCol.className = 'productcol infocol'; row.appendChild(detailsCol);
  const prodName = document.createElement('div'); prodName.className='prod-name'; detailsCol.appendChild(prodName);
  const sizesSpan = document.createElement('div'); sizesSpan.className = 'available-sizes'; sizesSpan.style.display = 'none'; detailsCol.appendChild(sizesSpan);
  const link = document.createElement('a'); link.textContent='View Product Details'; link.target='_blank'; link.style.display='inline-block'; link.style.marginBottom='8px'; detailsCol.appendChild(link);
  const priceRow = document.createElement('div'); priceRow.style.display='flex'; priceRow.style.alignItems='center'; detailsCol.appendChild(priceRow);
  const landingBox = document.createElement('div'); landingBox.className='price-box'; priceRow.appendChild(landingBox);
  const retailBox = document.createElement('div'); retailBox.className='price-box'; priceRow.appendChild(retailBox);

  // SIZES + QTY ROW
  const sizesQtyRow = document.createElement('div');
  sizesQtyRow.className = 'sizes-qty-row';

  // Sizes block
  const sizesBlock = document.createElement('div');
  sizesBlock.className = 'sizes-block';
  const sizesFieldLabel = document.createElement('label');
  sizesFieldLabel.textContent = 'Selected Sizes';
  sizesBlock.appendChild(sizesFieldLabel);
  const sizeInput = document.createElement('input');
  sizeInput.placeholder = 'e.g. 2 XS, 2 S, 1 M';
  sizesBlock.appendChild(sizeInput);
  // Quantity block
  const qtyBlock = document.createElement('div');
  qtyBlock.className = 'qty-block';
  const qtyLabel = document.createElement('label');
  qtyLabel.textContent = 'Quantity';
  qtyBlock.appendChild(qtyLabel);
  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.placeholder = 'Quantity';
  qtyInput.min = '1';
  qtyBlock.appendChild(qtyInput);
  sizesQtyRow.appendChild(sizesBlock);
  sizesQtyRow.appendChild(qtyBlock);
  detailsCol.appendChild(sizesQtyRow);

  // UNIT PRICE
  const unitPriceLabel = document.createElement('label');
  unitPriceLabel.textContent = 'Unit Price ($)';
  detailsCol.appendChild(unitPriceLabel);
  const unitPriceInput = document.createElement('input');
  unitPriceInput.type = 'number';
  unitPriceInput.placeholder = 'Unit Price $';
  unitPriceInput.min = '0';
  detailsCol.appendChild(unitPriceInput);

  // CUSTOMIZATION NOTES
  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Customization Notes';
  detailsCol.appendChild(noteLabel);
  const noteArea = document.createElement('textarea');
  noteArea.rows=2; noteArea.placeholder='Customization notes'; noteArea.style.width = '100%';
  detailsCol.appendChild(noteArea);
  const subtotalDisp = document.createElement('div'); subtotalDisp.className='subtotal-disp'; detailsCol.appendChild(subtotalDisp);

  const lineItem = { styleSku:'', printSku:'', productName:'', sizes:'', quantity:0, unitPrice:0, subtotal:0, notes:'', styleImgUrl:'', printImgUrl:'' };

  function updateSubtotal() {
    const qty = Number(qtyInput.value || 0), unit = Number(unitPriceInput.value || 0), subtotal = qty * unit;
    lineItem.quantity = qty; lineItem.unitPrice = unit; lineItem.subtotal = subtotal;
    subtotalDisp.textContent = (qty && unit) ? `Subtotal $${subtotal.toFixed(2)}` : '';
    state.recalculateTotals();
  }

  qtyInput.addEventListener('input', updateSubtotal);
  unitPriceInput.addEventListener('input', updateSubtotal);
  sizeInput.addEventListener('input', () => lineItem.sizes = sizeInput.value);
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
    updateSubtotal();
  });
  autoCompleteBox(printField, brand, prod => {
    printField.value = `${prod.skuId} – ${prod.productName}`; printImg.src = prod.imageUrl; printImg.style.display = ''; printImgLabel.classList.add('active');
    lineItem.printSku = prod.skuId; lineItem.printImgUrl = prod.imageUrl;
  });

  removeBtn.addEventListener('click', () => { card.remove(); state.removeItem(state.items.indexOf(lineItem)); });
  dom('productCards').appendChild(card); state.addItem(lineItem);
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
