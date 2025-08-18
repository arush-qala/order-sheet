// Product catalog - paste your actual data here!
const productData = [
  { "productName": "Noor Scarf Tube Dress", "imageUrl": "https://doodlage.in/cdn/shop/files/DL25-DR-015-01_2b628836-d07a-4e96-85c1-b5c9aeb6bece.jpg?v=1750658908&width=1000", "productLink": "https://doodlage.in/products/dl25-dr-015-mudpie-maker-dress", "landingPrice": 100, "recommendedRetailPrice": 250, "availableSizes": ["XXS", "M", "XL", "L"], "brandName": "Doodlage" },
  { "productName": "Noor Draped Toga Maxi Dress", "imageUrl": "https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800", "productLink": "https://doodlage.in/products/dl25-dr-014-kiteberry-dress", "landingPrice": 200, "recommendedRetailPrice": 500, "availableSizes": ["XXS", "M", "XL"], "brandName": "Doodlage" },
  { "productName": "Noor Sundown Maxi Dress", "imageUrl": "https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800", "productLink": "https://doodlage.in/products/dl25-dr-014-kiteberry-dress", "landingPrice": 300, "recommendedRetailPrice": 750, "availableSizes": ["XXS", "M", "XL", "XXL"], "brandName": "Doodlage" },
  { "productName": "English Rose", "imageUrl": "https://kharakapas.com/cdn/shop/files/KKSpring2137_8c6e5c18-9704-4b36-b2b1-d387e34817e4.jpg?v=1740160276&width=1080", "productLink": "https://kharakapas.com/products/daisy-dance?_pos=1&_sid=ba4bd3a82&_ss=r", "landingPrice": 100, "recommendedRetailPrice": 250, "availableSizes": ["XXS", "M", "XL", "XXL"], "brandName": "Khara Kapas" },
  { "productName": "Daisy Dance", "imageUrl": "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080", "productLink": "https://kharakapas.com/products/patio-jumpsuit?_pos=1&_sid=e0d625e6b&_ss=r", "landingPrice": 123, "recommendedRetailPrice": 308, "availableSizes": ["XXS", "M", "XL"], "brandName": "Khara Kapas" },
  { "productName": "Patio Jumpsuit", "imageUrl": "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080", "productLink": "https://kharakapas.com/products/mist-veil-gown?_pos=1&_sid=fe173a638&_ss=r", "landingPrice": 122, "recommendedRetailPrice": 305, "availableSizes": ["XXS", "M", "XL"], "brandName": "Khara Kapas" },
  { "productName": "Dress 1", "imageUrl": "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000", "productLink": "https://www.hindostanarchive.com/products/shibori-indigo-slik-shirt?_pos=1&_psq=SHIBORI&_ss=e&_v=1.0", "landingPrice": 114, "recommendedRetailPrice": 285, "availableSizes": ["XXS", "M", "XL", "L"], "brandName": "Naushad Ali" },
  { "productName": "Jacket 1", "imageUrl": "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000", "productLink": "https://www.hindostanarchive.com/products/paisley-silk-shirt?_pos=1&_psq=PAI&_ss=e&_v=1.0", "landingPrice": 100, "recommendedRetailPrice": 250, "availableSizes": ["XXS", "M", "XL", "S"], "brandName": "Naushad Ali" },
  { "productName": "Shirt 1", "imageUrl": "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000", "productLink": "https://www.hindostanarchive.com/products/mankolam-handblocked-shirt", "landingPrice": 56, "recommendedRetailPrice": 140, "availableSizes": ["XXS", "M", "XL", "S", "XS"], "brandName": "Naushad Ali" },
  { "productName": "Dress 2", "imageUrl": "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100", "productLink": "https://rasti.in/products/blue-meadow-crochet-vest", "landingPrice": 99, "recommendedRetailPrice": 248, "availableSizes": ["XXS", "M", "XL"], "brandName": "The Raw India" },
  { "productName": "Dress 3", "imageUrl": "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100", "productLink": "https://rasti.in/products/hand-knitted-fading-fire-dress", "landingPrice": 89, "recommendedRetailPrice": 223, "availableSizes": ["XXS", "M", "XL", "XS"], "brandName": "The Raw India" },
  { "productName": "Jacket 2", "imageUrl": "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100", "productLink": "https://rasti.in/products/knit-citrus-skirt", "landingPrice": 167, "recommendedRetailPrice": 418, "availableSizes": ["XXS", "M", "XL", "XS"], "brandName": "The Raw India" }
];

// Utility
function formatUSD(val) { return `$${Number(val).toFixed(2)}`; }
function getUniqueBrands() {
  return [...new Set(productData.map(p => p.brandName))].sort();
}
function getProductsByBrand(brand) {
  return productData.filter(p => p.brandName === brand);
}
function getProductByName(brand, name) {
  return productData.find(p => p.brandName === brand && p.productName === name);
}

// State & Launch
let selectedBrand = "";
let productCounter = 0;

window.onload = function() {
  const mainBrandSelect = document.getElementById('mainBrandSelect');
  getUniqueBrands().forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    mainBrandSelect.appendChild(opt);
  });

  mainBrandSelect.addEventListener('change', () => {
    selectedBrand = mainBrandSelect.value;
    document.getElementById('productsContainer').innerHTML = '';
    productCounter = 0;
    updateOrderSummary();
  });
  document.getElementById('addProductBtn').onclick = addProduct;
  document.getElementById('orderForm').onsubmit = handleOrderSubmit;
};

function addProduct() {
  if (!selectedBrand) { alert('Select a brand first'); return; }
  const container = document.getElementById('productsContainer');
  const pIndex = ++productCounter;
  const products = getProductsByBrand(selectedBrand);

  // Build HTML for style/print and product info
  let html = `
  <div class="product-item" id="productItem-${pIndex}">
    <div style="display:flex;justify-content:space-between;">
      <span style="font-weight:600;font-size:16px;">Product ${pIndex}</span>
      <button class="remove-product-btn" onclick="removeProduct(${pIndex})" type="button">Remove</button>
    </div>
    <div style="margin:6px 0 12px 0;">
      <label>Style *</label>
      <select class="form-control" id="styleSelect-${pIndex}">
        <option value="">-- Select Style --</option>
        ${products.map(p=>`<option value="${p.productName}">${p.productName}</option>`).join("")}
      </select>
    </div>
    <div style="margin-bottom:12px;">
      <label>Print (optional)</label>
      <select class="form-control" id="printSelect-${pIndex}">
        <option value="">-- Select Print --</option>
        ${products.map(p=>`<option value="${p.productName}">${p.productName}</option>`).join("")}
      </select>
    </div>
    <div class="product-images" id="imagesContainer-${pIndex}">
      <div class="product-image-wrapper">
        <img class="product-image" id="styleImg-${pIndex}" src="" style="display:none">
        <div class="image-label">Style</div>
      </div>
      <div class="product-image-wrapper">
        <img class="product-image" id="printImg-${pIndex}" src="" style="display:none">
        <div class="image-label">Print</div>
      </div>
    </div>
    <div id="productInfo-${pIndex}" style="margin-bottom:10px;font-size:15px;"></div>
    <div class="form-group">
      <label>Selected Sizes</label>
      <input type="text" class="form-control" id="sizes-${pIndex}" placeholder="e.g. 2 XS, 3 M">
    </div>
    <div class="form-group">
      <label>Quantity</label>
      <input type="number" min="0" class="form-control" id="qty-${pIndex}" value="0">
    </div>
    <div class="form-group">
      <label>Unit Price ($)</label>
      <input type="number" step="0.01" min="0" class="form-control" id="unitPrice-${pIndex}" value="">
    </div>
    <div class="subtotal-display" id="subtotal-${pIndex}">$0.00</div>
    <div class="form-group">
      <label>Customization Notes</label>
      <textarea class="form-control" id="customNotes-${pIndex}" style="min-height:32px;"></textarea>
    </div>
  </div>`;
  const d = document.createElement('div');
  d.innerHTML = html;
  container.appendChild(d);

  // Style Selection Handler
  document.getElementById(`styleSelect-${pIndex}`).onchange = function() {
    const styleName = this.value;
    const infoDiv = document.getElementById(`productInfo-${pIndex}`);
    const img = document.getElementById(`styleImg-${pIndex}`);
    if (!styleName) {
      infoDiv.innerHTML = '';
      img.style.display = 'none';
      document.getElementById(`unitPrice-${pIndex}`).value = '';
      updateSubtotal(pIndex);
      return;
    }
    const p = getProductByName(selectedBrand, styleName);
    img.src = p.imageUrl; img.style.display = '';
    // Info
    infoDiv.innerHTML = `
      <div class="product-info-header">${p.productName}</div>
      <div class="product-link-display"><a href="${p.productLink}" target="_blank">View Product Details</a></div>
      <div>Available Sizes: <span class="sizes-list">${p.availableSizes.map(s=>`<span class="size-tag">${s}</span>`).join(' ')}</span></div>
      <div>Landing Price: <b>${formatUSD(p.landingPrice)}</b> &nbsp; Recommended Retail Price: <b>${formatUSD(p.recommendedRetailPrice)}</b></div>
    `;
    document.getElementById(`unitPrice-${pIndex}`).value = p.landingPrice;
    updateSubtotal(pIndex);
  };

  // Print Selection Handler
  document.getElementById(`printSelect-${pIndex}`).onchange = function() {
    const printName = this.value;
    const printImg = document.getElementById(`printImg-${pIndex}`);
    if (!printName) {
      printImg.style.display = "none";
      return;
    }
    const p = getProductByName(selectedBrand, printName);
    printImg.src = p.imageUrl; printImg.style.display='';
  };

  // Quantity/Price changes update subtotal
  document.getElementById(`qty-${pIndex}`).oninput =
  document.getElementById(`unitPrice-${pIndex}`).oninput = function() {
    updateSubtotal(pIndex);
  };
}

function updateSubtotal(idx) {
  const qty = +document.getElementById(`qty-${idx}`).value || 0;
  const unit = +document.getElementById(`unitPrice-${idx}`).value || 0;
  document.getElementById(`subtotal-${idx}`).textContent = formatUSD(qty * unit);
  updateOrderSummary();
}

function removeProduct(idx) {
  let el = document.getElementById(`productItem-${idx}`);
  if (el) el.remove();
  updateOrderSummary();
}

function updateOrderSummary() {
  // Scan all current .product-item
  let totalQty = 0, totalAmt = 0;
  document.querySelectorAll('.product-item').forEach((item, i) => {
    const idx = item.id.split('-')[1];
    totalQty += Number(document.getElementById(`qty-${idx}`).value || 0);
    totalAmt += (Number(document.getElementById(`qty-${idx}`).value || 0) *
                Number(document.getElementById(`unitPrice-${idx}`).value || 0));
  });
  document.getElementById('orderSummary').innerHTML =
    `<b>Total Quantity:</b> ${totalQty} &nbsp; &nbsp; <b>Total Amount:</b> ${formatUSD(totalAmt)}`;
}

// PDF logic placeholder - users may want to export/print the final order or use browser print.
function handleOrderSubmit(e) {
  e.preventDefault();
  alert('PDF download/print functionality would go here!\nYou can use browser Print or integrate jsPDF.');
  // Add your PDF/export code as needed here
}
