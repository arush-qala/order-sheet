/* ---------------------------------------------------
   Catalogue Data
--------------------------------------------------- */
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

/* ---------------------------------------------------
   DOM Helpers
--------------------------------------------------- */
const dom = id => document.getElementById(id);
const create = tag => document.createElement(tag);

/* ---------------------------------------------------
   State Container
--------------------------------------------------- */
class OrderSheetState {
  constructor() {
    this.header = {};
    this.items = [];
    this.totalQty = 0;
    this.totalAmount = 0;
  }
  addItem(item) {
    this.items.push(item);
    this.recalculateTotals();
  }
  removeItem(idx) {
    this.items.splice(idx, 1);
    this.recalculateTotals();
  }
  recalculateTotals() {
    this.totalQty = this.items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
    this.totalAmount = this.items.reduce((sum, i) => sum + Number(i.subtotal || 0), 0);
    dom('totalQuantity').textContent = this.totalQty;
    dom('totalAmount').textContent = `$${this.totalAmount.toFixed(2)}`;
  }
  reset() {
    this.items = [];
    this.recalculateTotals();
  }
}
const state = new OrderSheetState();

/* ---------------------------------------------------
   Autocomplete
--------------------------------------------------- */
function buildAutocomplete(inputEl, brandFilter, onSelect) {
  let listEl;
  inputEl.addEventListener('input', () => {
    const query = inputEl.value.trim().toLowerCase();
    if (listEl) listEl.remove();
    if (!query) return;

    listEl = create('div');
    listEl.className = 'auto-list';
    listEl.style.position = 'absolute';
    listEl.style.background = '#fff';
    listEl.style.border = '1px solid #e0e0dc';
    listEl.style.zIndex = '10';
    document.body.appendChild(listEl);

    const rect = inputEl.getBoundingClientRect();
    listEl.style.left = `${rect.left + window.scrollX}px`;
    listEl.style.top = `${rect.bottom + window.scrollY}px`;
    listEl.style.width = `${rect.width}px`;

    const matches = productData.filter(p =>
      p.brandName === brandFilter &&
      (p.productName.toLowerCase().includes(query) || p.skuId.toLowerCase().includes(query))
    );

    matches.forEach(m => {
      const item = create('div');
      item.textContent = `${m.skuId} – ${m.productName}`;
      item.style.padding = '6px 10px';
      item.style.cursor = 'pointer';
      item.addEventListener('mousedown', e => e.preventDefault());
      item.addEventListener('click', () => {
        onSelect(m);
        listEl.remove();
        listEl = null;
      });
      listEl.appendChild(item);
    });
  });

  document.addEventListener('click', e => {
    if (listEl && !listEl.contains(e.target) && e.target !== inputEl) {
      listEl.remove();
      listEl = null;
    }
  });
}

/* ---------------------------------------------------
   Product Card Factory
--------------------------------------------------- */
function createProductCard() {
  const brand = dom('brandSelect').value;
  if (!brand) {
    alert('Select a brand first.');
    return;
  }

  const card = create('div');
  card.className = 'product-card';

  const removeBtn = create('button');
  removeBtn.textContent = '×';
  removeBtn.className = 'remove-card';
  card.appendChild(removeBtn);

  const flex = create('div');
  flex.className = 'card-flex';
  card.appendChild(flex);

  const thumbWrap = create('div');
  thumbWrap.className = 'thumbnail-wrap';
  flex.appendChild(thumbWrap);

  const styleImg = create('img');
  styleImg.alt = 'Style Image';
  thumbWrap.appendChild(styleImg);

  const styleCaption = create('span');
  styleCaption.textContent = 'Style';
  styleCaption.className = 'caption';
  thumbWrap.appendChild(styleCaption);

  const printImg = create('img');
  printImg.alt = 'Print Image';
  printImg.style.display = 'none';
  thumbWrap.appendChild(printImg);

  const printCaption = create('span');
  printCaption.textContent = 'Print';
  printCaption.className = 'caption';
  printCaption.style.display = 'none';
  thumbWrap.appendChild(printCaption);

  const details = create('div');
  details.style.flex = '1';
  flex.appendChild(details);

  // Style Autocomplete
  const styleField = create('input');
  styleField.placeholder = 'Search style by SKU or name';
  details.appendChild(styleField);

  // Print Autocomplete
  const printField = create('input');
  printField.placeholder = 'Optional print – SKU or name';
  details.appendChild(printField);

  // Product name display
  const prodName = create('div');
  prodName.style.fontWeight = '600';
  prodName.style.marginTop = '8px';
  details.appendChild(prodName);

  // Link
  const link = create('a');
  link.textContent = 'View Product Details';
  link.target = '_blank';
  link.style.display = 'block';
  link.style.margin = '4px 0 8px';
  details.appendChild(link);

  // Price boxes
  const priceWrap = create('div');
  priceWrap.style.display = 'flex';
  priceWrap.style.alignItems = 'center';
  details.appendChild(priceWrap);

  const landingBox = create('div');
  landingBox.className = 'price-box';
  priceWrap.appendChild(landingBox);

  const retailBox = create('div');
  retailBox.className = 'price-box';
  priceWrap.appendChild(retailBox);

  // Size, qty, unit price, subtotal
  const sizeInput = create('input');
  sizeInput.placeholder = 'Selected sizes (e.g. 2 XS, 2 S, 1 M)';
  sizeInput.style.width = '100%';
  sizeInput.style.marginTop = '8px';
  details.appendChild(sizeInput);

  const qtyInput = create('input');
  qtyInput.type = 'number';
  qtyInput.placeholder = 'Quantity';
  qtyInput.style.marginTop = '8px';
  details.appendChild(qtyInput);

  const unitPriceInput = create('input');
  unitPriceInput.type = 'number';
  unitPriceInput.placeholder = 'Unit Price $';
  unitPriceInput.style.marginTop = '8px';
  details.appendChild(unitPriceInput);

  const subtotalDisp = create('div');
  subtotalDisp.style.fontWeight = '600';
  subtotalDisp.style.marginTop = '8px';
  details.appendChild(subtotalDisp);

  const noteArea = create('textarea');
  noteArea.rows = 2;
  noteArea.placeholder = 'Customization notes';
  noteArea.style.marginTop = '8px';
  noteArea.style.width = '100%';
  details.appendChild(noteArea);

  /* ---------- Data Bindings ---------- */
  const lineItem = {
    styleSku: '',
    printSku: '',
    productName: '',
    sizes: '',
    quantity: 0,
    unitPrice: 0,
    subtotal: 0,
    notes: ''
  };

  function updateSubtotal() {
    const qty = Number(qtyInput.value || 0);
    const unit = Number(unitPriceInput.value || 0);
    const subtotal = qty * unit;
    lineItem.quantity = qty;
    lineItem.unitPrice = unit;
    lineItem.subtotal = subtotal;
    subtotalDisp.textContent = `Subtotal $${subtotal.toFixed(2)}`;
    state.recalculateTotals();
  }

  qtyInput.addEventListener('input', updateSubtotal);
  unitPriceInput.addEventListener('input', updateSubtotal);

  sizeInput.addEventListener('input', () => lineItem.sizes = sizeInput.value);
  noteArea.addEventListener('input', () => lineItem.notes = noteArea.value);

  buildAutocomplete(styleField, brand, prod => {
    styleImg.src = prod.imageUrl;
    prodName.textContent = prod.productName;
    link.href = prod.productLink;
    landingBox.textContent = `Landing $${prod.landingPrice}`;
    retailBox.textContent = `RRP $${prod.recommendedRetailPrice}`;
    unitPriceInput.value = prod.landingPrice;
    lineItem.styleSku = prod.skuId;
    lineItem.productName = prod.productName;
    lineItem.unitPrice = prod.landingPrice;
    updateSubtotal();
  });

  buildAutocomplete(printField, brand, prod => {
    printImg.src = prod.imageUrl;
    printImg.style.display = '';
    printCaption.style.display = '';
    lineItem.printSku = prod.skuId;
  });

  /* ---------- Remove ---------- */
  removeBtn.addEventListener('click', () => {
    card.remove();
    state.removeItem(state.items.indexOf(lineItem));
  });

  dom('productCards').appendChild(card);
  state.addItem(lineItem);
}

/* ---------------------------------------------------
   Event Wiring
--------------------------------------------------- */
dom('addProductBtn').addEventListener('click', createProductCard);

dom('brandSelect').addEventListener('change', () => {
  dom('productCards').innerHTML = '';
  state.reset();
});

dom('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  // Collect header info
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

  // --- PDF Generation ---
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;
  doc.setFontSize(14);
  doc.text('Order Sheet – Brand Assembly LA', 10, y);
  y += 8;
  doc.setFontSize(10);
  Object.entries(state.header).forEach(([k, v]) => {
    doc.text(`${k}: ${v}`, 10, y);
    y += 6;
  });
  y += 4;
  state.items.forEach((it, idx) => {
    doc.text(`Item ${idx + 1} – ${it.productName}`, 10, y);
    y += 6;
    doc.text(`Style SKU: ${it.styleSku}  Print SKU: ${it.printSku}`, 14, y);
    y += 6;
    doc.text(`Sizes: ${it.sizes}  Qty: ${it.quantity}  Unit: $${it.unitPrice}  Subtotal: $${it.subtotal}`, 14, y);
    y += 8;
  });
  doc.save(`OrderSheet_${state.header.orderNumber}.pdf`);
  alert('PDF downloaded. JSON payloads logged to console for integration.');
  console.log({ header: state.header, items: state.items });
});
