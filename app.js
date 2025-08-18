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

function autoCompleteBox(input, brand, cb) {
  let items = [];
  let index = -1;
  let list = null;

  input.setAttribute('autocomplete', 'off');
  input.addEventListener('input', function () {
    closeList();
    const search = this.value.trim().toLowerCase();
    if (!search) return;

    items = productData
      .filter(p => p.brandName === brand &&
        (p.productName.toLowerCase().includes(search) || p.skuId.toLowerCase().includes(search)))
      .slice(0, 8); // show max 8

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
      div.addEventListener('mousedown', e => {
        e.preventDefault();
        select(idx);
      });
      list.appendChild(div);
    });
    document.body.appendChild(list);

    index = -1;
  });

  input.addEventListener('keydown', function (e) {
    if (!list) return;
    const len = list.childElementCount;
    if (e.key === 'ArrowDown') {
      index = (index + 1 + len) % len;
      highlight();
      e.preventDefault();
    }
    if (e.key === 'ArrowUp') {
      index = (index - 1 + len) % len;
      highlight();
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      if (index > -1) {
        select(index);
        e.preventDefault();
      }
    }
    if (e.key === 'Escape') {
      closeList();
    }
  });

  input.addEventListener('blur', function() {
    setTimeout(closeList, 100);
  });

  function highlight() {
    Array.from(list.children).forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });
  }
  function select(idx) {
    if (typeof cb === 'function')
      cb(items[idx]);
    closeList();
  }
  function closeList() {
    if (list) { document.body.removeChild(list); list = null; }
    items = []; index = -1;
  }
}

function createProductCard() {
  const brand = dom('brandSelect').value;
  if (!brand) return alert('Select a brand first.');

  const card = document.createElement('div');
  card.className = 'product-card';

  // Remove Button - large clickable X
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = '&times;'; // Unicode ×
  removeBtn.className = 'remove-card';
  removeBtn.type = 'button';
  removeBtn.setAttribute('aria-label', 'Remove product');
  card.appendChild(removeBtn);

  const flex = document.createElement('div');
  flex.className = 'card-flex';
  card.appendChild(flex);

  const thumbWrap = document.createElement('div');
  thumbWrap.className = 'thumbnail-wrap';
  flex.appendChild(thumbWrap);

  const styleImg = document.createElement('img');
  styleImg.alt = 'Style Image';
  styleImg.style.display = 'none';
  thumbWrap.appendChild(styleImg);

  const styleCaption = document.createElement('span');
  styleCaption.textContent = 'Style';
  styleCaption.className = 'caption';
  thumbWrap.appendChild(styleCaption);

  const printImg = document.createElement('img');
  printImg.alt = 'Print Image';
  printImg.style.display = 'none';
  thumbWrap.appendChild(printImg);

  const printCaption = document.createElement('span');
  printCaption.textContent = 'Print';
  printCaption.className = 'caption';
  printCaption.style.display = 'none';
  thumbWrap.appendChild(printCaption);

  const details = document.createElement('div');
  details.style.flex = '1';
  flex.appendChild(details);

  // Style Autocomplete
  const styleWrap = document.createElement('div');
  styleWrap.style.position = 'relative';
  details.appendChild(styleWrap);

  const styleField = document.createElement('input');
  styleField.type = 'text';
  styleField.placeholder = 'Search style by SKU or name';
  styleField.style.width = '320px';
  styleWrap.appendChild(styleField);

  // Print Autocomplete
  const printWrap = document.createElement('div');
  printWrap.style.position = 'relative';
  printWrap.style.marginTop = '8px';
  details.appendChild(printWrap);

  const printField = document.createElement('input');
  printField.type = 'text';
  printField.placeholder = 'Optional custom print – SKU or name';
  printField.style.width = '320px';
  printWrap.appendChild(printField);

  // Product info
  const prodName = document.createElement('div');
  prodName.style.fontWeight = '600';
  prodName.style.marginTop = '8px';
  details.appendChild(prodName);

  // Link
  const link = document.createElement('a');
  link.textContent = 'View Product Details';
  link.target = '_blank';
  link.style.display = 'block';
  link.style.margin = '4px 0 8px';
  details.appendChild(link);

  // Price boxes
  const priceWrap = document.createElement('div');
  priceWrap.style.display = 'flex';
  priceWrap.style.alignItems = 'center';
  details.appendChild(priceWrap);

  const landingBox = document.createElement('div');
  landingBox.className = 'price-box';
  priceWrap.appendChild(landingBox);

  const retailBox = document.createElement('div');
  retailBox.className = 'price-box';
  priceWrap.appendChild(retailBox);

  // Size, qty, unit price, subtotal
  const sizeInput = document.createElement('input');
  sizeInput.placeholder = 'Selected sizes (e.g. 2 XS, 2 S, 1 M)';
  sizeInput.style.width = '100%';
  sizeInput.style.marginTop = '8px';
  details.appendChild(sizeInput);

  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.placeholder = 'Quantity';
  qtyInput.style.marginTop = '8px';
  qtyInput.min = '1';
  details.appendChild(qtyInput);

  const unitPriceInput = document.createElement('input');
  unitPriceInput.type = 'number';
  unitPriceInput.placeholder = 'Unit Price $';
  unitPriceInput.style.marginTop = '8px';
  unitPriceInput.min = '0';
  details.appendChild(unitPriceInput);

  const subtotalDisp = document.createElement('div');
  subtotalDisp.style.fontWeight = '600';
  subtotalDisp.style.marginTop = '8px';
  details.appendChild(subtotalDisp);

  const noteArea = document.createElement('textarea');
  noteArea.rows = 2;
  noteArea.placeholder = 'Customization notes';
  noteArea.style.marginTop = '8px';
  noteArea.style.width = '100%';
  details.appendChild(noteArea);

  // Data binding object
  const lineItem = {
    styleSku: '',
    printSku: '',
    productName: '',
    sizes: '',
    quantity: 0,
    unitPrice: 0,
    subtotal: 0,
    notes: '',
    styleImgUrl: '',
    printImgUrl: ''
  };

  function updateSubtotal() {
    const qty = Number(qtyInput.value || 0);
    const unit = Number(unitPriceInput.value || 0);
    const subtotal = qty * unit;
    lineItem.quantity = qty;
    lineItem.unitPrice = unit;
    lineItem.subtotal = subtotal;
    subtotalDisp.textContent = (qty && unit) ? `Subtotal $${subtotal.toFixed(2)}` : '';
    state.recalculateTotals();
  }
  qtyInput.addEventListener('input', updateSubtotal);
  unitPriceInput.addEventListener('input', updateSubtotal);

  sizeInput.addEventListener('input', () => lineItem.sizes = sizeInput.value);
  noteArea.addEventListener('input', () => lineItem.notes = noteArea.value);

  autoCompleteBox(styleField, brand, prod => {
    styleField.value = `${prod.skuId} – ${prod.productName}`;
    styleImg.src = prod.imageUrl;
    styleImg.style.display = '';
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
    styleImg.style.display = '';
    updateSubtotal();
  });

  autoCompleteBox(printField, brand, prod => {
    printField.value = `${prod.skuId} – ${prod.productName}`;
    printImg.src = prod.imageUrl;
    printImg.style.display = '';
    printCaption.style.display = '';
    lineItem.printSku = prod.skuId;
    lineItem.printImgUrl = prod.imageUrl;
  });

  // Remove logic
  removeBtn.addEventListener('click', () => {
    card.remove();
    state.removeItem(state.items.indexOf(lineItem));
  });

  dom('productCards').appendChild(card);
  state.addItem(lineItem);
}

// ---- Helper: Load remote image as base64 dataURL -----
async function toDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 70;
      canvas.height = 70;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#fff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      const ratio = Math.min(canvas.width/this.width, canvas.height/this.height);
      const w = this.width * ratio, h = this.height * ratio;
      ctx.drawImage(this, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.90));
    };
    img.onerror = reject;
    img.src = url + (url.includes("?") ? "&" : "?") + "rand=" + Math.random();
  });
}

// ---- Generate PDF with images -----
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
  const doc = new jsPDF();
  let y = 10;
  doc.setFontSize(14);
  doc.text('Order Sheet – Brand Assembly LA', 10, y);
  y += 8;
  doc.setFontSize(10);
  Object.entries(state.header).forEach(([k, v]) => {
    doc.text(`${k}: ${v}`, 10, y); y += 6;
  });
  y += 3;

  // PRELOAD all needed images
  for (let idx = 0; idx < state.items.length; ++idx) {
    let it = state.items[idx];
    let styleData = null, printData = null;
    try {
      styleData = it.styleImgUrl ? await toDataUrl(it.styleImgUrl) : null;
    }catch{}
    try {
      printData = it.printImgUrl ? await toDataUrl(it.printImgUrl) : null;
    }catch{}
    doc.setFont(undefined, "bold");
    doc.text(`Item ${idx + 1} – ${it.productName}`, 10, y); y += 6;
    doc.setFont(undefined, "normal");
    doc.text(`Style SKU: ${it.styleSku || ""}  Print SKU: ${it.printSku || ""}`, 14, y); y += 6;
    doc.text(`Sizes: ${it.sizes || ""}  Qty: ${it.quantity || ""}  Unit: $${it.unitPrice||""}  Subtotal: $${it.subtotal || ""}`, 14, y); y += 6;
    doc.text(`Notes: ${it.notes || ""}`, 14, y); y += 6;

    // Images side by side (if style/print)
    if (styleData) {
      doc.text("Style", 15, y);
      doc.addImage(styleData, "JPEG", 10, y+1, 22, 22);
    }
    if (printData) {
      doc.text("Print", 48, y);
      doc.addImage(printData, "JPEG", 42, y+1, 22, 22);
    }
    if(styleData || printData) y += 26;
    else y += 4;

    // If at bottom, new page
    if (y > 265) {
      doc.addPage();
      y = 10;
    }
  }
  doc.save(`OrderSheet_${state.header.orderNumber}.pdf`);
  console.log({ header: state.header, items: state.items });
});

// Auto-create first product when brand selected.
dom('brandSelect').addEventListener('change', function () {
  dom('productCards').innerHTML = '';
  state.reset();
  if (this.value) {
    createProductCard();
  }
});

dom('addProductBtn').addEventListener('click', createProductCard);
