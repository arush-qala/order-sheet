const productData = [
  { skuId:"DO01", brandName:"Doodlage", productName:"Noor Scarf Tube Dress", imageUrl:"https://doodlage.in/cdn/shop/files/DL25-DR-015-01_2b628836-d07a-4e96-85c1-b5c9aeb6bece.jpg?v=1750658908&width=1000", productLink:"https://doodlage.in/products/dl25-dr-015-mudpie-maker-dress", landingPrice:100, recommendedRetailPrice:250, availableSizes:["XXS","M","XL","L"] },
  { skuId:"DO02", brandName:"Doodlage", productName:"Noor Draped Toga Maxi Dress", imageUrl:"https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800", productLink:"https://doodlage.in/products/dl25-dr-014-kiteberry-dress", landingPrice:200, recommendedRetailPrice:500, availableSizes:["XXS","M","XL"] },
  { skuId:"KK01", brandName:"Khara Kapas", productName:"English Rose", imageUrl:"https://kharakapas.com/cdn/shop/files/KKSpring2137_8c6e5c18-9704-4b36-b2b1-d387e34817e4.jpg?v=1740160276&width=1080", productLink:"https://kharakapas.com/products/daisy-dance?_pos=1&_sid=ba4bd3a82&_ss=r", landingPrice:100, recommendedRetailPrice:250, availableSizes:["XXS","M","XL","XXL"] },
  { skuId:"NA01", brandName:"Naushad Ali", productName:"Jacket 1", imageUrl:"https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000", productLink:"https://www.hindostanarchive.com/products/paisley-silk-shirt?_pos=1&_psq=PAI&_ss=e&_v=1.0", landingPrice:100, recommendedRetailPrice:250, availableSizes:["XXS","M","XL","S"] },
  { skuId:"RI01", brandName:"The Raw India", productName:"Dress 2", imageUrl:"https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100", productLink:"https://rasti.in/products/blue-meadow-crochet-vest", landingPrice:99, recommendedRetailPrice:248, availableSizes:["XXS","M","XL"] },
  { skuId:"KK02", brandName:"Khara Kapas", productName:"Daisy Dance", imageUrl:"https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080", productLink:"https://kharakapas.com/products/patio-jumpsuit?_pos=1&_sid=e0d625e6b&_ss=r", landingPrice:123, recommendedRetailPrice:308, availableSizes:["XXS","M","XL"] },
  { skuId:"DO03", brandName:"Doodlage", productName:"Noor Sundown Maxi Dress", imageUrl:"https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800", productLink:"https://doodlage.in/products/dl25-dr-014-kiteberry-dress", landingPrice:300, recommendedRetailPrice:750, availableSizes:["XXS","M","XL","XXL"] },
  { skuId:"RI02", brandName:"The Raw India", productName:"Dress 3", imageUrl:"https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100", productLink:"https://rasti.in/products/hand-knitted-fading-fire-dress", landingPrice:89, recommendedRetailPrice:223, availableSizes:["XXS","M","XL","XS"] },
  { skuId:"KK03", brandName:"Khara Kapas", productName:"Patio Jumpsuit", imageUrl:"https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080", productLink:"https://kharakapas.com/products/mist-veil-gown?_pos=1&_sid=fe173a638&_ss=r", landingPrice:122, recommendedRetailPrice:305, availableSizes:["XXS","M","XL"] },
  { skuId:"NA02", brandName:"Naushad Ali", productName:"Dress 1", imageUrl:"https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000", productLink:"https://www.hindostanarchive.com/products/shibori-indigo-slik-shirt?_pos=1&_psq=SHIBORI&_ss=e&_v=1.0", landingPrice:114, recommendedRetailPrice:285, availableSizes:["XXS","M","XL","L"] },
  { skuId:"NA03", brandName:"Naushad Ali", productName:"Shirt 1", imageUrl:"https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000", productLink:"https://www.hindostanarchive.com/products/mankolam-handblocked-shirt", landingPrice:56, recommendedRetailPrice:140, availableSizes:["XXS","M","XL","S","XS"] },
  { skuId:"RI03", brandName:"The Raw India", productName:"Jacket 2", imageUrl:"https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100", productLink:"https://rasti.in/products/knit-citrus-skirt", landingPrice:167, recommendedRetailPrice:418, availableSizes:["XXS","M","XL","XS"] }
];

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
  let items = [], index = -1, list = null;
  input.setAttribute('autocomplete', 'off');
  input.addEventListener('input', function () {
    closeList();
    const search = this.value.trim().toLowerCase();
    if (!search) return;
    items = productData.filter(
      p => p.brandName === brand &&
      (p.productName.toLowerCase().includes(search) || p.skuId.toLowerCase().includes(search))
    ).slice(0,8);
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
  });
  input.addEventListener('keydown', function (e) {
    if (!list) return;
    const len = list.childElementCount;
    if (e.key === 'ArrowDown') { index = (index + 1 + len) % len; highlight(); e.preventDefault(); }
    if (e.key === 'ArrowUp')   { index = (index - 1 + len) % len; highlight(); e.preventDefault(); }
    if (e.key === 'Enter')     { if (index > -1) { select(index); e.preventDefault(); } }
    if (e.key === 'Escape')    { closeList(); }
  });
  input.addEventListener('blur', function(){ setTimeout(closeList, 100); });
  function highlight() { Array.from(list.children).forEach((item, idx) => item.classList.toggle('active', idx === index)); }
  function select(idx) { if (typeof cb === 'function') cb(items[idx]); closeList(); }
  function closeList() { if (list) { document.body.removeChild(list); list = null; } items = []; index = -1; }
}

function createProductCard() {
  const brand = dom('brandSelect').value; if (!brand) return alert('Select a brand first.');
  const card = document.createElement('div'); card.className = 'product-card';
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = '&times;'; removeBtn.className='remove-card'; removeBtn.type='button';
  removeBtn.setAttribute('aria-label','Remove product'); card.appendChild(removeBtn);

  // Three columns
  const row = document.createElement('div'); row.className = 'card-threecol'; card.appendChild(row);

  // 1. Style search+image
  const styleCol = document.createElement('div'); styleCol.className = 'productcol stylecol'; row.appendChild(styleCol);
  const styleField = document.createElement('input'); styleField.type='text'; styleField.placeholder='Search style by SKU or name'; styleField.style.width='100%'; styleField.style.marginBottom='8px'; styleCol.appendChild(styleField);
  const styleImg = document.createElement('img'); styleImg.alt = 'Style Image'; styleImg.style.display='none'; styleCol.appendChild(styleImg);

  // 2. Print search+image
  const printCol = document.createElement('div'); printCol.className = 'productcol printcol'; row.appendChild(printCol);
  const printField = document.createElement('input'); printField.type='text'; printField.placeholder='Optional custom print – SKU or name'; printField.style.width='100%'; printField.style.marginBottom='8px'; printCol.appendChild(printField);
  const printImg = document.createElement('img'); printImg.alt = 'Print Image'; printImg.style.display='none'; printCol.appendChild(printImg);

  // 3. Details
  const detailsCol = document.createElement('div'); detailsCol.className = 'productcol infocol'; row.appendChild(detailsCol);
  const prodName = document.createElement('div'); prodName.className='prod-name'; detailsCol.appendChild(prodName);
  const sizesSpan = document.createElement('div'); sizesSpan.className = 'available-sizes'; sizesSpan.style.display = 'none'; detailsCol.appendChild(sizesSpan);
  const link = document.createElement('a'); link.textContent='View Product Details'; link.target='_blank'; link.style.display='inline-block'; link.style.marginBottom='8px'; detailsCol.appendChild(link);
  const priceRow = document.createElement('div'); priceRow.style.display='flex'; priceRow.style.alignItems='center'; detailsCol.appendChild(priceRow);
  const landingBox = document.createElement('div'); landingBox.className='price-box'; priceRow.appendChild(landingBox);
  const retailBox = document.createElement('div'); retailBox.className='price-box'; priceRow.appendChild(retailBox);
  const sizeInput = document.createElement('input'); sizeInput.placeholder='Selected sizes (e.g. 2 XS, 2 S, 1 M)'; sizeInput.style.width='100%'; sizeInput.style.marginTop='10px'; detailsCol.appendChild(sizeInput);
  const qtyInput = document.createElement('input'); qtyInput.type='number'; qtyInput.placeholder='Quantity'; qtyInput.style.marginTop='8px'; qtyInput.min='1'; qtyInput.style.width='100%'; detailsCol.appendChild(qtyInput);
  const unitPriceInput = document.createElement('input'); unitPriceInput.type='number'; unitPriceInput.placeholder='Unit Price $'; unitPriceInput.style.marginTop='8px'; unitPriceInput.min='0'; unitPriceInput.style.width='100%'; detailsCol.appendChild(unitPriceInput);
  const noteArea = document.createElement('textarea'); noteArea.rows=2; noteArea.placeholder='Customization notes'; noteArea.style.marginTop='8px'; noteArea.style.width = '100%'; detailsCol.appendChild(noteArea);
  const subtotalDisp = document.createElement('div'); subtotalDisp.className='subtotal-disp'; detailsCol.appendChild(subtotalDisp);

  const lineItem = { styleSku:'', printSku:'', productName:'', sizes:'', quantity:0, unitPrice:0, subtotal:0, notes:'', styleImgUrl:'', printImgUrl:'' };

  function updateSubtotal() {
    const qty = Number(qtyInput.value || 0), unit = Number(unitPriceInput.value || 0), subtotal = qty * unit;
    lineItem.quantity = qty; lineItem.unitPrice = unit; lineItem.subtotal = subtotal;
    subtotalDisp.textContent = (qty && unit) ? `Subtotal $${subtotal.toFixed(2)}` : '';
    state.recalculateTotals();
  }
  qtyInput.addEventListener('input', updateSubtotal); unitPriceInput.addEventListener('input', updateSubtotal);
  sizeInput.addEventListener('input', () => lineItem.sizes = sizeInput.value); noteArea.addEventListener('input', () => lineItem.notes = noteArea.value);

  autoCompleteBox(styleField, brand, prod => {
    styleField.value = `${prod.skuId} – ${prod.productName}`;
    styleImg.src = prod.imageUrl; styleImg.style.display = '';
    prodName.textContent = prod.productName; link.style.display = 'inline-block'; link.href = prod.productLink;
    landingBox.textContent = `Landing $${prod.landingPrice}`; retailBox.textContent = `RRP $${prod.recommendedRetailPrice}`;
    unitPriceInput.value = prod.landingPrice; lineItem.styleSku = prod.skuId; lineItem.productName = prod.productName;
    lineItem.unitPrice = prod.landingPrice; lineItem.styleImgUrl = prod.imageUrl;
    sizesSpan.textContent = prod.availableSizes.length ? 'Available Sizes: ' + prod.availableSizes.join(' · ') : '';
    sizesSpan.style.display = prod.availableSizes.length ? '' : 'none';
    updateSubtotal();
  });
  autoCompleteBox(printField, brand, prod => {
    printField.value = `${prod.skuId} – ${prod.productName}`; printImg.src = prod.imageUrl; printImg.style.display = ''; lineItem.printSku = prod.skuId; lineItem.printImgUrl = prod.imageUrl;
  });

  removeBtn.addEventListener('click', () => { card.remove(); state.removeItem(state.items.indexOf(lineItem)); });
  dom('productCards').appendChild(card); state.addItem(lineItem);
}

// PDF output as three column – visually matches product card
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
    doc.setFontSize(12); doc.setFont(undefined, "bold");
    doc.text(`Item ${idx + 1}`, left, y);
    doc.setFont(undefined, "normal");
    // Columns (left: style, center: print, right: details)
    const col1 = left, col2 = left+155, col3 = left+320;
    let rowMaxH = 0;
    // Style
    if (styleData) {
      doc.setFontSize(10);
      doc.text("Style", col1+20, y+13);
      doc.addImage(styleData, "JPEG", col1+4, y+18, 105, 105);
      rowMaxH = 123;
    }
    // Print
    if (printData) {
      doc.setFontSize(10);
      doc.text("Print", col2+20, y+13);
      doc.addImage(printData, "JPEG", col2+4, y+18, 105, 105);
      rowMaxH = Math.max(rowMaxH,123);
    }
    doc.setFontSize(10);
    // Details Column (Name, sizes, link, price, quantity, notes)
    let infoY = y+10;
    doc.setFont(undefined,"bold"); doc.text(it.productName || "", col3, infoY+11);
    doc.setFont(undefined,"normal");
    let infoRow = infoY+22;
    // Show sizes
    if (it.styleSku) {
      const p = productData.find(p=>p.skuId===it.styleSku);
      if (p && p.availableSizes && p.availableSizes.length) {
        doc.text("Available Sizes: "+p.availableSizes.join(" · "), col3, infoRow); infoRow+=15;
      }
    }
    // Link
    if (it.styleSku) {
      const p = productData.find(p=>p.skuId===it.styleSku);
      if (p && p.productLink) doc.textWithLink('Product Details Link', col3, infoRow, {url: p.productLink}); infoRow+=15;
    }
    // Price
    doc.text(`Landing $${it.unitPrice||""} · RRP ${(()=>{const p=productData.find(p=>p.skuId===it.styleSku);return p?p.recommendedRetailPrice:""})()}`, col3, infoRow); infoRow+=15;
    doc.text(`Sizes: ${it.sizes||""} · Qty: ${it.quantity||""}`, col3, infoRow); infoRow+=15;
    doc.text(`Notes: ${it.notes||""}`, col3, infoRow); infoRow+=15;
    doc.setFont(undefined,"bold");
    doc.text(`Subtotal $${it.subtotal||""}`, col3, infoRow+2); 
    rowMaxH = Math.max(rowMaxH, infoRow-(y+10)+34);
    y += rowMaxH + 26;
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
