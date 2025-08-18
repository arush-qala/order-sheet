/* app.js */
const productData = [/* truncated for brevity; paste full array here */];

const state = {
  currentBrand: '',
  orderInfo: {},
  orderLines: []
};

const elements = {
  brandDropdown: document.getElementById('brandDropdown'),
  brandNote: document.getElementById('brandNote'),
  productList: document.getElementById('product-list'),
  addProduct: document.getElementById('addProduct'),
  summaryBar: document.getElementById('summaryBar'),
  totalQty: document.getElementById('totalQty'),
  totalAmt: document.getElementById('totalAmt'),
  submitOrder: document.getElementById('submitOrder')
};

function init() {
  populateBrandDropdown();
  elements.brandDropdown.addEventListener('change', handleBrandChange);
  elements.addProduct.addEventListener('click', addProductCard);
  elements.submitOrder.addEventListener('click', handleSubmit);
}
init();

function populateBrandDropdown() {
  const brands = [...new Set(productData.map(p => p.brandName))].sort();
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    elements.brandDropdown.appendChild(opt);
  });
}

function handleBrandChange(e) {
  state.currentBrand = e.target.value;
  state.orderLines = [];
  elements.productList.innerHTML = '';
  updateSummary();
}

function addProductCard() {
  if (!state.currentBrand) {
    alert('Please select a brand first.');
    return;
  }
  const idx = state.orderLines.length;
  state.orderLines.push({
    style: null,
    print: null,
    sizeText: '',
    quantity: 0,
    unitPrice: 0,
    subtotal: 0,
    notes: ''
  });
  const card = renderCard(idx);
  elements.productList.appendChild(card);
}

function renderCard(index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.index = index;

  card.innerHTML = `
    <div class="card-top">
      <input type="text" placeholder="Search style by name or SKU" class="style-input">
      <button class="remove-btn" aria-label="Remove">&times;</button>
    </div>
    <div class="card-top">
      <input type="text" placeholder="Search print by name or SKU (optional)" class="print-input">
    </div>
    <div class="image-row">
      <div class="image-col style-img"><span>Style</span></div>
      <div class="image-col print-img" style="display:none;"><span>Print</span></div>
    </div>
    <div class="details">
      <div><strong class="productName"></strong> <a class="productLink" target="_blank"></a></div>
      <div class="sizes"></div>
      <div class="pricing">
        <div class="price-box landing"></div>
        <div class="price-box retail"></div>
      </div>
    </div>
    <div class="field full">
      <label>Selected Sizes</label>
      <input type="text" class="sizeText">
    </div>
    <div class="field half">
      <label>Quantity</label>
      <input type="number" min="0" class="qty">
    </div>
    <div class="field half">
      <label>Unit Price</label>
      <input type="number" min="0" step="0.01" class="unitPrice">
    </div>
    <div class="field full">
      <label>Subtotal</label>
      <input type="text" class="subtotal" readonly>
    </div>
    <div class="field full">
      <label>Customization Notes</label>
      <textarea class="notes"></textarea>
    </div>
  `;

  card.querySelector('.remove-btn').addEventListener('click', () => removeCard(index));
  attachAutocomplete(card, '.style-input', 'style');
  attachAutocomplete(card, '.print-input', 'print');
  attachFieldListeners(card, index);

  return card;
}

function attachAutocomplete(card, selector, type) {
  const input = card.querySelector(selector);
  input.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    if (term.length < 2) return;
    const results = productData.filter(p => p.brandName === state.currentBrand &&
      (p.productName.toLowerCase().includes(term) || p.skuId.toLowerCase().includes(term))
    ).slice(0, 5);
    // simple datalist-like dropdown
    let box = input.nextElementSibling;
    if (!box || !box.classList.contains('suggestions')) {
      box = document.createElement('div');
      box.className = 'suggestions';
      input.parentNode.appendChild(box);
    }
    box.innerHTML = '';
    results.forEach(r => {
      const item = document.createElement('div');
      item.textContent = `${r.skuId} – ${r.productName}`;
      item.addEventListener('click', () => {
        selectProduct(card, type, r);
        input.value = `${r.skuId} – ${r.productName}`;
        box.innerHTML = '';
      });
      box.appendChild(item);
    });
  });
}

function selectProduct(card, type, prod) {
  const index = parseInt(card.dataset.index, 10);
  const line = state.orderLines[index];
  if (type === 'style') {
    line.style = prod;
    line.unitPrice = prod.landingPrice;
    card.querySelector('.productName').textContent = prod.productName;
    card.querySelector('.productLink').textContent = 'View Product Details';
    card.querySelector('.productLink').href = prod.productLink;
    card.querySelector('.sizes').textContent = `Available Sizes: ${prod.availableSizes.join(', ')}`;
    card.querySelector('.landing').textContent = `$${prod.landingPrice}`;
    card.querySelector('.retail').textContent = `$${prod.recommendedRetailPrice}`;
    const styleImgCol = card.querySelector('.style-img');
    styleImgCol.innerHTML = `<img src="${prod.imageUrl}"><span>Style</span>`;
    updateSubtotal(line, card);
  } else {
    line.print = prod;
    const printImgCol = card.querySelector('.print-img');
    printImgCol.style.display = 'block';
    printImgCol.innerHTML = `<img src="${prod.imageUrl}"><span>Print</span>`;
  }
}

function attachFieldListeners(card, index) {
  card.querySelector('.qty').addEventListener('input', e => {
    state.orderLines[index].quantity = parseInt(e.target.value || '0', 10);
    updateSubtotal(state.orderLines[index], card);
  });
  card.querySelector('.unitPrice').addEventListener('input', e => {
    state.orderLines[index].unitPrice = parseFloat(e.target.value || '0');
    updateSubtotal(state.orderLines[index], card);
  });
  card.querySelector('.sizeText').addEventListener('input', e => {
    state.orderLines[index].sizeText = e.target.value;
  });
  card.querySelector('.notes').addEventListener('input', e => {
    state.orderLines[index].notes = e.target.value;
  });
}

function updateSubtotal(line, card) {
  line.subtotal = (line.quantity || 0) * (line.unitPrice || 0);
  card.querySelector('.subtotal').value = `$${line.subtotal.toFixed(2)}`;
  updateSummary();
}

function updateSummary() {
  const totalQty = state.orderLines.reduce((s, l) => s + (l.quantity || 0), 0);
  const totalAmt = state.orderLines.reduce((s, l) => s + (l.subtotal || 0), 0);
  elements.totalQty.textContent = `Total Quantity: ${totalQty}`;
  elements.totalAmt.textContent = `Total Amount: $${totalAmt.toFixed(2)}`;
  if (state.orderLines.length) {
    elements.summaryBar.classList.remove('hidden');
  } else {
    elements.summaryBar.classList.add('hidden');
  }
}

function removeCard(index) {
  state.orderLines.splice(index, 1);
  elements.productList.innerHTML = '';
  state.orderLines.forEach((_, i) => {
    const card = renderCard(i);
    elements.productList.appendChild(card);
  });
  updateSummary();
}

function handleSubmit() {
  if (!validateHeader()) {
    alert('Please fill required buyer information.');
    return;
  }
  const header = collectHeader();
  const exportPayload = {
    order: header,
    lineItems: state.orderLines
  };
  console.log('Export JSON', exportPayload);
  generatePDF(header, state.orderLines);
}

function validateHeader() {
  const required = ['orderNumber', 'storeName', 'email', 'phone', 'shippingAddress'];
  for (const id of required) {
    if (!document.getElementById(id).value.trim()) return false;
  }
  return true;
}

function collectHeader() {
  const get = id => document.getElementById(id).value.trim();
  return {
    orderNumber: get('orderNumber'),
    storeName: get('storeName'),
    email: get('email'),
    phone: get('phone'),
    shippingAddress: get('shippingAddress'),
    comments: get('comments'),
    brand: state.currentBrand,
    totalQty: elements.totalQty.textContent.split(': ')[1],
    totalAmt: elements.totalAmt.textContent.split('$')[1]
  };
}

function generatePDF(header, lines) {
  const doc = new jspdf.jsPDF();
  let y = 10;
  doc.setFontSize(18);
  doc.text('Order Sheet', 10, y);
  y += 8;
  doc.setFontSize(12);
  for (const [k, v] of Object.entries(header)) {
    doc.text(`${k}: ${v}`, 10, y);
    y += 6;
  }
  y += 4;
  doc.setFontSize(14);
  doc.text('Line Items', 10, y);
  y += 8;
  lines.forEach(l => {
    doc.setFontSize(12);
    doc.text(`${l.style.skuId} | ${l.style.productName} | Qty: ${l.quantity} | $${l.unitPrice} | Sub: $${l.subtotal}`, 10, y);
    if (l.print) {
      y += 6;
      doc.text(`Print: ${l.print.skuId} – ${l.print.productName}`, 14, y);
    }
    if (l.sizeText) {
      y += 6;
      doc.text(`Sizes: ${l.sizeText}`, 14, y);
    }
    if (l.notes) {
      y += 6;
      doc.text(`Notes: ${l.notes}`, 14, y);
    }
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });
  doc.save(`Order-${header.orderNumber}.pdf`);
}
