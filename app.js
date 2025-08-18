// Product data
const productData = [
  {
    "productName": "Noor Scarf Tube Dress",
    "imageUrl": "https://doodlage.in/cdn/shop/files/DL25-DR-015-01_2b628836-d07a-4e96-85c1-b5c9aeb6bece.jpg?v=1750658908&width=1000",
    "productLink": "https://doodlage.in/products/dl25-dr-015-mudpie-maker-dress",
    "landingPrice": 100,
    "recommendedRetailPrice": 250,
    "availableSizes": ["XXS", "M", "XL", "L"],
    "brandName": "Doodlage"
  },
  {
    "productName": "Noor Draped Toga Maxi Dress",
    "imageUrl": "https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800",
    "productLink": "https://doodlage.in/products/dl25-dr-014-kiteberry-dress",
    "landingPrice": 200,
    "recommendedRetailPrice": 500,
    "availableSizes": ["XXS", "M", "XL"],
    "brandName": "Doodlage"
  },
  {
    "productName": "Noor Sundown Maxi Dress",
    "imageUrl": "https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800",
    "productLink": "https://doodlage.in/products/dl25-dr-014-kiteberry-dress",
    "landingPrice": 300,
    "recommendedRetailPrice": 750,
    "availableSizes": ["XXS", "M", "XL", "XXL"],
    "brandName": "Doodlage"
  },
  {
    "productName": "English Rose",
    "imageUrl": "https://kharakapas.com/cdn/shop/files/KKSpring2137_8c6e5c18-9704-4b36-b2b1-d387e34817e4.jpg?v=1740160276&width=1080",
    "productLink": "https://kharakapas.com/products/daisy-dance?_pos=1&_sid=ba4bd3a82&_ss=r",
    "landingPrice": 100,
    "recommendedRetailPrice": 250,
    "availableSizes": ["XXS", "M", "XL", "XXL"],
    "brandName": "Khara Kapas"
  },
  {
    "productName": "Daisy Dance",
    "imageUrl": "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080",
    "productLink": "https://kharakapas.com/products/patio-jumpsuit?_pos=1&_sid=e0d625e6b&_ss=r",
    "landingPrice": 123,
    "recommendedRetailPrice": 308,
    "availableSizes": ["XXS", "M", "XL"],
    "brandName": "Khara Kapas"
  },
  {
    "productName": "Patio Jumpsuit",
    "imageUrl": "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080",
    "productLink": "https://kharakapas.com/products/mist-veil-gown?_pos=1&_sid=fe173a638&_ss=r",
    "landingPrice": 122,
    "recommendedRetailPrice": 305,
    "availableSizes": ["XXS", "M", "XL"],
    "brandName": "Khara Kapas"
  },
  {
    "productName": "Dress 1",
    "imageUrl": "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    "productLink": "https://www.hindostanarchive.com/products/shibori-indigo-slik-shirt?_pos=1&_psq=SHIBORI&_ss=e&_v=1.0",
    "landingPrice": 114,
    "recommendedRetailPrice": 285,
    "availableSizes": ["XXS", "M", "XL", "L"],
    "brandName": "Naushad Ali"
  },
  {
    "productName": "Jacket 1",
    "imageUrl": "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    "productLink": "https://www.hindostanarchive.com/products/paisley-silk-shirt?_pos=1&_psq=PAI&_ss=e&_v=1.0",
    "landingPrice": 100,
    "recommendedRetailPrice": 250,
    "availableSizes": ["XXS", "M", "XL", "S"],
    "brandName": "Naushad Ali"
  },
  {
    "productName": "Shirt 1",
    "imageUrl": "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    "productLink": "https://www.hindostanarchive.com/products/mankolam-handblocked-shirt",
    "landingPrice": 56,
    "recommendedRetailPrice": 140,
    "availableSizes": ["XXS", "M", "XL", "S", "XS"],
    "brandName": "Naushad Ali"
  },
  {
    "productName": "Dress 2",
    "imageUrl": "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    "productLink": "https://rasti.in/products/blue-meadow-crochet-vest",
    "landingPrice": 99,
    "recommendedRetailPrice": 248,
    "availableSizes": ["XXS", "M", "XL"],
    "brandName": "The Raw India"
  },
  {
    "productName": "Dress 3",
    "imageUrl": "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    "productLink": "https://rasti.in/products/hand-knitted-fading-fire-dress",
    "landingPrice": 89,
    "recommendedRetailPrice": 223,
    "availableSizes": ["XXS", "M", "XL", "XS"],
    "brandName": "The Raw India"
  },
  {
    "productName": "Jacket 2",
    "imageUrl": "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    "productLink": "https://rasti.in/products/knit-citrus-skirt",
    "landingPrice": 167,
    "recommendedRetailPrice": 418,
    "availableSizes": ["XXS", "M", "XL", "XS"],
    "brandName": "The Raw India"
  }
];

// Application state
let productCounter = 0;
let selectedMainBrand = '';

// Utility functions
function getUniqueBrands() {
  return [...new Set(productData.map(product => product.brandName))].sort();
}

function getProductsByBrand(brandName) {
  return productData.filter(product => product.brandName === brandName);
}

function getProduct(brandName, productName) {
  return productData.find(product => 
    product.brandName === brandName && product.productName === productName
  );
}

function formatUSD(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

// Initialize application when DOM is ready
function initializeApp() {
  console.log('App initializing...');
  
  // Initialize main brand dropdown
  initializeMainBrandDropdown();
  
  // Add main event listeners
  setupMainEventListeners();
  
  console.log('App initialized successfully');
}

function initializeMainBrandDropdown() {
  const mainBrandSelect = document.getElementById('mainBrandSelect');
  if (!mainBrandSelect) return;
  
  const brands = getUniqueBrands();
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    mainBrandSelect.appendChild(option);
  });
}

function setupMainEventListeners() {
  const addProductBtn = document.getElementById('addProductBtn');
  const orderForm = document.getElementById('orderForm');
  const closeModalBtn = document.getElementById('closeModal');
  const downloadPDFBtn = document.getElementById('downloadPDF');
  const mainBrandSelect = document.getElementById('mainBrandSelect');
  
  if (addProductBtn) {
    addProductBtn.onclick = function(e) {
      e.preventDefault();
      if (!selectedMainBrand) {
        alert('Please select a brand first');
        return;
      }
      addProduct();
    };
  }
  
  if (orderForm) {
    orderForm.onsubmit = function(e) {
      e.preventDefault();
      handleOrderSubmit();
    };
  }
  
  if (closeModalBtn) {
    closeModalBtn.onclick = closeModal;
  }
  
  if (downloadPDFBtn) {
    downloadPDFBtn.onclick = downloadPDF;
  }
  
  if (mainBrandSelect) {
    mainBrandSelect.onchange = function() {
      selectedMainBrand = this.value;
      // Clear existing products when brand changes
      const container = document.getElementById('productsContainer');
      if (container) {
        container.innerHTML = '';
        productCounter = 0;
      }
      updateOrderSummary();
    };
  }
  
  // Modal click outside to close
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.onclick = function(e) {
      if (e.target === modal) {
        closeModal();
      }
    };
  }
}

// Add new product section
function addProduct() {
  if (!selectedMainBrand) {
    alert('Please select a brand first');
    return;
  }
  
  productCounter++;
  console.log('Adding product #', productCounter);
  
  const container = document.getElementById('productsContainer');
  if (!container) {
    console.error('Products container not found');
    return;
  }
  
  const productElement = document.createElement('div');
  productElement.className = 'product-item';
  productElement.setAttribute('data-product-id', productCounter);
  
  const products = getProductsByBrand(selectedMainBrand);
  
  let styleOptionsHTML = '<option value="">Select Style</option>';
  let printOptionsHTML = '<option value="">Select Print (Visual Reference)</option>';
  
  products.forEach(product => {
    styleOptionsHTML += `<option value="${product.productName}">${product.productName}</option>`;
    printOptionsHTML += `<option value="${product.productName}">${product.productName}</option>`;
  });
  
  productElement.innerHTML = `
    <div class="product-header">
      <h3>
        Product Selection
        <span class="product-number">#${productCounter}</span>
      </h3>
    </div>
    <div class="product-body">
      <div class="product-selection-grid">
        <div class="form-group">
          <label class="form-label">Style Selection *</label>
          <select class="form-control style-select" required>
            ${styleOptionsHTML}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Print Selection</label>
          <select class="form-control print-select">
            ${printOptionsHTML}
          </select>
          <small class="form-text text-muted">For visual reference only</small>
        </div>
      </div>
      
      <div class="product-info-display">
        <div class="product-info-header">
          <div class="product-image-wrapper">
            <img src="STYLE_IMAGE_URL" class="product-image" alt="Style Image">
            <div class="image-label">Style</div>
          </div>
          <div class="product-image-wrapper" id="printImageWrapper" style="display:none">
            <img src="" class="product-image" alt="Print Image" id="printImage">
              <div class="image-label">Print</div>
            </div>

          <div class="product-details-content">
            <h3 class="product-title"></h3>
            <div class="product-link-display">
              <a href="#" target="_blank" class="product-link">View Product Details</a>
            </div>
            <div class="available-sizes-display">
              <span class="label">Available Sizes:</span>
              <div class="sizes-list"></div>
            </div>
          </div>
        </div>
        <div class="product-pricing">
          <div class="price-box">
            <span class="price-label">Landing Price</span>
            <span class="price-amount landing-price">$0.00</span>
          </div>
          <div class="price-box">
            <span class="price-label">Recommended Retail Price</span>
            <span class="price-amount retail-price">$0.00</span>
          </div>
        </div>
      </div>
      
      <div class="size-quantities-section">
        <div class="size-quantity-header">
          <h4>Size & Quantity Selection</h4>
        </div>
        <div class="form-group">
          <label class="form-label">Selected Sizes</label>
          <input type="text" class="form-control selected-sizes" placeholder="e.g., 2 XS, 2 M, 2 L">
          <small class="form-text text-muted">Enter your size selections in free text format</small>
        </div>
        <div class="size-quantity-row">
          <div class="form-group">
            <label class="form-label">Quantity *</label>
            <input type="number" class="form-control quantity-input" min="1" value="1" required>
          </div>
          <div class="form-group">
            <label class="form-label">Unit Price (USD) *</label>
            <input type="number" class="form-control unit-price-input" step="0.01" min="0" required>
          </div>
          <div class="form-group">
            <label class="form-label">Subtotal</label>
            <div class="subtotal-display">$0.00</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Customization Notes</label>
          <textarea class="form-control customization-notes" rows="2" placeholder="Any special customization for this product..."></textarea>
        </div>
      </div>
      
      <div class="product-total-section">
        <div class="product-total">
          <span>Product Total:</span>
          <span class="product-total-amount">$0.00</span>
        </div>
        <button type="button" class="remove-product-btn">Remove Product</button>
      </div>
    </div>
  `;
  
  container.appendChild(productElement);
  
  // Set up event listeners for this product
  setTimeout(() => {
    setupProductEventListeners(productElement);
  }, 50);
  
  updateOrderSummary();
}

// Setup event listeners for a product element
function setupProductEventListeners(productElement) {
  const styleSelect = productElement.querySelector('.style-select');
  const printSelect = productElement.querySelector('.print-select');
  const quantityInput = productElement.querySelector('.quantity-input');
  const unitPriceInput = productElement.querySelector('.unit-price-input');
  const removeProductBtn = productElement.querySelector('.remove-product-btn');
  
  console.log('Setting up event listeners for product element');
  
  if (styleSelect) {
    styleSelect.onchange = function() {
      handleStyleChange(productElement);
    };
  }
  
  if (printSelect) {
    printSelect.onchange = function() {
      handlePrintChange(productElement);
    };
  }
  
  if (quantityInput) {
    quantityInput.oninput = function() {
      calculateProductSubtotal(productElement);
    };
    quantityInput.onchange = function() {
      calculateProductSubtotal(productElement);
    };
  }
  
  if (unitPriceInput) {
    unitPriceInput.oninput = function() {
      calculateProductSubtotal(productElement);
    };
    unitPriceInput.onchange = function() {
      calculateProductSubtotal(productElement);
    };
  }
  
  if (removeProductBtn) {
    removeProductBtn.onclick = function(e) {
      e.preventDefault();
      removeProduct(productElement);
    };
  }
}

// Handle style selection change
function handleStyleChange(productElement) {
  const styleSelect = productElement.querySelector('.style-select');
  const productInfoDisplay = productElement.querySelector('.product-info-display');
  const sizeQuantitiesSection = productElement.querySelector('.size-quantities-section');
  
  if (!styleSelect) return;
  
  const selectedStyle = styleSelect.value;
  console.log('Handling style change:', selectedStyle);
  
  if (selectedStyle && selectedMainBrand) {
    const product = getProduct(selectedMainBrand, selectedStyle);
    
    if (product) {
      // Show product information
      displayProductInfo(productElement, product);
      
      // Pre-fill unit price with landing price
      const unitPriceInput = productElement.querySelector('.unit-price-input');
      if (unitPriceInput) {
        unitPriceInput.value = product.landingPrice.toString();
      }
      
      productInfoDisplay.classList.add('visible');
      sizeQuantitiesSection.classList.add('visible');
      
      // Calculate initial subtotal
      calculateProductSubtotal(productElement);
    }
  } else {
    productInfoDisplay.classList.remove('visible');
    sizeQuantitiesSection.classList.remove('visible');
    
    // Hide images
    const styleImage = productElement.querySelector('.style-image');
    const printImage = productElement.querySelector('.print-image');
    if (styleImage) styleImage.style.display = 'none';
    if (printImage) printImage.style.display = 'none';
  }
  
  updateOrderSummary();
}

// Handle print selection change (visual only)
function handlePrintChange(productElement) {
  const printSelect = productElement.querySelector('.print-select');
  const printImage = productElement.querySelector('.print-image');
  
  if (!printSelect || !printImage) return;
  
  const selectedPrint = printSelect.value;
  console.log('Handling print change:', selectedPrint);
  
  if (selectedPrint && selectedMainBrand) {
    const printProduct = getProduct(selectedMainBrand, selectedPrint);
    
    if (printProduct) {
      printImage.src = printProduct.imageUrl;
      printImage.alt = `Print: ${printProduct.productName}`;
      printImage.style.display = 'block';
      printImage.onerror = function() {
        console.warn('Print image failed to load:', printProduct.imageUrl);
        this.style.display = 'none';
      };
    }
  } else {
    printImage.style.display = 'none';
  }
}

// Display product information
function displayProductInfo(productElement, product) {
  const styleImage = productElement.querySelector('.style-image');
  const productTitle = productElement.querySelector('.product-title');
  const productLink = productElement.querySelector('.product-link');
  const landingPrice = productElement.querySelector('.landing-price');
  const retailPrice = productElement.querySelector('.retail-price');
  const sizesContainer = productElement.querySelector('.sizes-list');
  
  console.log('Displaying product info for:', product.productName);
  
  if (styleImage) {
    styleImage.src = product.imageUrl;
    styleImage.alt = `Style: ${product.productName}`;
    styleImage.style.display = 'block';
    styleImage.onerror = function() {
      console.warn('Style image failed to load:', product.imageUrl);
      this.style.display = 'none';
    };
  }
  
  if (productTitle) productTitle.textContent = product.productName;
  if (landingPrice) landingPrice.textContent = formatUSD(product.landingPrice);
  if (retailPrice) retailPrice.textContent = formatUSD(product.recommendedRetailPrice);
  
  if (productLink) {
    productLink.href = product.productLink;
    productLink.style.display = 'inline-block';
  }
  
  // Show available sizes
  if (sizesContainer) {
    sizesContainer.innerHTML = '';
    product.availableSizes.forEach(size => {
      const sizeTag = document.createElement('span');
      sizeTag.className = 'size-tag';
      sizeTag.textContent = size;
      sizesContainer.appendChild(sizeTag);
    });
  }
}

// Calculate product subtotal
function calculateProductSubtotal(productElement) {
  const quantityInput = productElement.querySelector('.quantity-input');
  const unitPriceInput = productElement.querySelector('.unit-price-input');
  const subtotalDisplay = productElement.querySelector('.subtotal-display');
  const productTotalSection = productElement.querySelector('.product-total-section');
  const productTotalAmount = productElement.querySelector('.product-total-amount');
  
  if (!quantityInput || !unitPriceInput || !subtotalDisplay) return;
  
  // Get values and convert to numbers properly
  const quantity = Math.max(0, parseInt(quantityInput.value) || 0);
  const unitPrice = Math.max(0, parseFloat(unitPriceInput.value) || 0);
  const subtotal = quantity * unitPrice;
  
  console.log('Calculating subtotal:', { quantity, unitPrice, subtotal });
  
  subtotalDisplay.textContent = formatUSD(subtotal);
  
  if (productTotalAmount) {
    productTotalAmount.textContent = formatUSD(subtotal);
  }
  
  if (productTotalSection) {
    if (quantity > 0 && unitPrice > 0) {
      productTotalSection.classList.add('visible');
    } else {
      productTotalSection.classList.remove('visible');
    }
  }
  
  updateOrderSummary();
}

// Remove product
function removeProduct(productElement) {
  const allProducts = document.querySelectorAll('.product-item');
  productElement.remove();
  updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
  const productItems = document.querySelectorAll('.product-item');
  let totalQuantity = 0;
  let totalAmount = 0;
  
  productItems.forEach(productElement => {
    const quantityInput = productElement.querySelector('.quantity-input');
    const unitPriceInput = productElement.querySelector('.unit-price-input');
    
    if (quantityInput && unitPriceInput && quantityInput.value && unitPriceInput.value) {
      const quantity = Math.max(0, parseInt(quantityInput.value) || 0);
      const unitPrice = Math.max(0, parseFloat(unitPriceInput.value) || 0);
      const subtotal = quantity * unitPrice;
      
      totalQuantity += quantity;
      totalAmount += subtotal;
    }
  });
  
  const totalQuantityEl = document.getElementById('totalQuantity');
  const totalAmountEl = document.getElementById('totalAmount');
  
  if (totalQuantityEl) totalQuantityEl.textContent = totalQuantity;
  if (totalAmountEl) totalAmountEl.textContent = formatUSD(totalAmount);
}

// Handle order submit
function handleOrderSubmit() {
  console.log('Handling order submit');
  
  if (!validateForm()) {
    return;
  }
  
  const orderData = collectOrderData();
  const productSelections = collectProductSelections();
  
  showConfirmationModal(orderData, productSelections);
}

// Validate form
function validateForm() {
  // Check required fields
  const requiredFields = ['orderNumber', 'buyerStoreName', 'email', 'phone', 'shippingAddress'];
  for (let fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      alert(`Please fill in the ${fieldId.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
      return false;
    }
  }
  
  // Check main brand selection
  if (!selectedMainBrand) {
    alert('Please select a brand for this order.');
    return false;
  }
  
  // Check products
  const productItems = document.querySelectorAll('.product-item');
  let hasAnyValidProduct = false;
  
  productItems.forEach(productElement => {
    const styleSelect = productElement.querySelector('.style-select');
    const quantityInput = productElement.querySelector('.quantity-input');
    const unitPriceInput = productElement.querySelector('.unit-price-input');
    
    if (styleSelect && styleSelect.value && quantityInput && quantityInput.value && 
        unitPriceInput && unitPriceInput.value && 
        parseInt(quantityInput.value) > 0 && parseFloat(unitPriceInput.value) > 0) {
      hasAnyValidProduct = true;
    }
  });
  
  if (!hasAnyValidProduct) {
    alert('Please add at least one product with valid style, quantity, and price.');
    return false;
  }
  
  return true;
}

// Collect order data
function collectOrderData() {
  const getData = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : '';
  };
  
  const totalQuantityEl = document.getElementById('totalQuantity');
  const totalAmountEl = document.getElementById('totalAmount');
  
  const totalQuantity = totalQuantityEl ? parseInt(totalQuantityEl.textContent) : 0;
  const totalAmountText = totalAmountEl ? totalAmountEl.textContent : '$0.00';
  const totalAmount = parseFloat(totalAmountText.replace('$', '')) || 0;
  
  return {
    orderNumber: getData('orderNumber'),
    brand: selectedMainBrand,
    buyerInfo: {
      buyerStoreName: getData('buyerStoreName'),
      email: getData('email'),
      phone: getData('phone'),
      shippingAddress: getData('shippingAddress')
    },
    totalQuantity,
    totalAmount,
    comments: getData('orderComments'),
    createdAt: new Date().toISOString()
  };
}

// Collect product selections
function collectProductSelections() {
  const orderNumberEl = document.getElementById('orderNumber');
  const orderNumber = orderNumberEl ? orderNumberEl.value : '';
  const productSelections = [];
  
  const productItems = document.querySelectorAll('.product-item');
  
  productItems.forEach(productElement => {
    const styleSelect = productElement.querySelector('.style-select');
    const printSelect = productElement.querySelector('.print-select');
    const selectedSizes = productElement.querySelector('.selected-sizes');
    const quantityInput = productElement.querySelector('.quantity-input');
    const unitPriceInput = productElement.querySelector('.unit-price-input');
    const customizationNotes = productElement.querySelector('.customization-notes');
    
    if (styleSelect && styleSelect.value && quantityInput && quantityInput.value && 
        unitPriceInput && unitPriceInput.value && 
        parseInt(quantityInput.value) > 0 && parseFloat(unitPriceInput.value) > 0) {
      
      const product = getProduct(selectedMainBrand, styleSelect.value);
      const quantity = parseInt(quantityInput.value);
      const unitPrice = parseFloat(unitPriceInput.value);
      const subtotal = quantity * unitPrice;
      
      productSelections.push({
        orderNumber,
        brand: selectedMainBrand,
        style: styleSelect.value,
        print: printSelect ? printSelect.value || '' : '',
        productLink: product ? product.productLink : '',
        selectedSizes: selectedSizes ? selectedSizes.value : '',
        quantity,
        unitPrice,
        subtotal,
        customization: customizationNotes ? customizationNotes.value || '' : ''
      });
    }
  });
  
  return productSelections;
}

// Show confirmation modal
function showConfirmationModal(orderData, productSelections) {
  const modal = document.getElementById('confirmationModal');
  const content = document.getElementById('confirmationContent');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div class="confirmation-section">
      <h3>📄 Order Sheet Summary</h3>
      <div class="order-summary-display">
        <h4>Order #${orderData.orderNumber}</h4>
        <p><strong>Brand:</strong> ${orderData.brand}</p>
        <p><strong>Buyer/Store:</strong> ${orderData.buyerInfo.buyerStoreName}</p>
        <p><strong>Email:</strong> ${orderData.buyerInfo.email}</p>
        <p><strong>Phone:</strong> ${orderData.buyerInfo.phone}</p>
        <p><strong>Shipping Address:</strong> ${orderData.buyerInfo.shippingAddress}</p>
        <p><strong>Total Quantity:</strong> ${orderData.totalQuantity} pieces</p>
        <p><strong>Total Amount:</strong> ${formatUSD(orderData.totalAmount)}</p>
        ${orderData.comments ? `<p><strong>Comments:</strong> ${orderData.comments}</p>` : ''}
      </div>
      
      <h4>Product Line Items:</h4>
      <div class="product-line-item">
        <span>Style</span>
        <span>Print</span>
        <span>Sizes</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Total</span>
      </div>
      ${productSelections.map(item => `
        <div class="product-line-item">
          <span>${item.style}</span>
          <span>${item.print || 'None'}</span>
          <span>${item.selectedSizes || 'Not specified'}</span>
          <span>${item.quantity}</span>
          <span>${formatUSD(item.unitPrice)}</span>
          <span>${formatUSD(item.subtotal)}</span>
        </div>
      `).join('')}
    </div>
    
    <div class="confirmation-section">
      <h3>🗄️ Database Export Data</h3>
      
      <h4>Orders Database Record:</h4>
      <div class="data-structure">
        <pre>${JSON.stringify(orderData, null, 2)}</pre>
      </div>
      
      <h4>Product Selections Database Records:</h4>
      <div class="data-structure">
        <pre>${JSON.stringify(productSelections, null, 2)}</pre>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Download PDF (simulation)
function downloadPDF() {
  alert('PDF generation feature would be implemented here. The order data has been structured and is ready for PDF export.');
}

// Start the app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
