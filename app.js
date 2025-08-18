/* const productData = [
  // --- Khara Kapas (10 products) ---
  {
    skuId: "KK01",
    brandName: "Khara Kapas",
    productName: "DAISY DANCE",
    imageUrl: "https://doodlage.in/cdn/shop/files/DL25-DR-015-01_2b628836-d07a-4e96-85c1-b5c9aeb6bece.jpg?v=1750658908&width=1000",
    productLink: "https://kharakapas.com/products/daisy-dance?_pos=1&_sid=ba4bd3a82&_ss=r",
    landingPrice: 100,
    recommendedRetailPrice: 250,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK02",
    brandName: "Khara Kapas",
    productName: "PATIO JUMPSUIT",
    imageUrl: "https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800",
    productLink: "https://kharakapas.com/products/patio-jumpsuit?_pos=1&_sid=e0d625e6b&_ss=r",
    landingPrice: 101,
    recommendedRetailPrice: 252.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK03",
    brandName: "Khara Kapas",
    productName: "MIST VEIL GOWN",
    imageUrl: "https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800",
    productLink: "https://kharakapas.com/products/mist-veil-gown?_pos=1&_sid=fe173a638&_ss=r",
    landingPrice: 102,
    recommendedRetailPrice: 255,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK04",
    brandName: "Khara Kapas",
    productName: "GARNET GROVE DRESS",
    imageUrl: "https://kharakapas.com/cdn/shop/files/KKSpring2137_8c6e5c18-9704-4b36-b2b1-d387e34817e4.jpg?v=1740160276&width=1080",
    productLink: "https://kharakapas.com/products/garnet-grove-dress?_pos=1&_sid=2015cd3be&_ss=r",
    landingPrice: 103,
    recommendedRetailPrice: 257.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK05",
    brandName: "Khara Kapas",
    productName: "ELYSIAN FERN JUMPSUIT",
    imageUrl: "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080",
    productLink: "https://kharakapas.com/products/off-white-jumpsuit-printed?_pos=1&_sid=9a6fd6d67&_ss=r",
    landingPrice: 104,
    recommendedRetailPrice: 260,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK06",
    brandName: "Khara Kapas",
    productName: "DACNIS DRESS",
    imageUrl: "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080",
    productLink: "https://kharakapas.com/products/dacnis-dress?_pos=1&_sid=a44b3c934&_ss=r",
    landingPrice: 105,
    recommendedRetailPrice: 262.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK07",
    brandName: "Khara Kapas",
    productName: "WISTERIA",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "https://kharakapas.com/search?q=WISTERIA&options%5Bprefix%5D=last",
    landingPrice: 106,
    recommendedRetailPrice: 265,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK08",
    brandName: "Khara Kapas",
    productName: "RAIN FOREST",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "https://kharakapas.com/products/rain-forest?_pos=1&_sid=7647bf992&_ss=r",
    landingPrice: 107,
    recommendedRetailPrice: 267.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK09",
    brandName: "Khara Kapas",
    productName: "CHERRY FROST",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "https://kharakapas.com/products/cherry-frost?_pos=1&_sid=90b0680ca&_ss=r",
    landingPrice: 108,
    recommendedRetailPrice: 270,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "KK10",
    brandName: "Khara Kapas",
    productName: "SWAN LAKE",
    imageUrl: "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    productLink: "https://kharakapas.com/search?q=SWAN+LAKE&options%5Bprefix%5D=last",
    landingPrice: 109,
    recommendedRetailPrice: 272.5,
    availableSizes: ["XS","S","M","L","XL"]
  },

  // --- Doodlage (10 products, dummy names where blank) ---
  {
    skuId: "DO1",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 1",
    imageUrl: "https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800",
    productLink: "",
    landingPrice: 150,
    recommendedRetailPrice: 375,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO2",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 2",
    imageUrl: "https://kharakapas.com/cdn/shop/files/KKSpring2137_8c6e5c18-9704-4b36-b2b1-d387e34817e4.jpg?v=1740160276&width=1080",
    productLink: "",
    landingPrice: 151,
    recommendedRetailPrice: 377.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO3",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 3",
    imageUrl: "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080",
    productLink: "",
    landingPrice: 152,
    recommendedRetailPrice: 380,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO4",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 4",
    imageUrl: "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080",
    productLink: "",
    landingPrice: 153,
    recommendedRetailPrice: 382.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO5",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 5",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "",
    landingPrice: 154,
    recommendedRetailPrice: 385,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO6",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 6",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "",
    landingPrice: 155,
    recommendedRetailPrice: 387.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO7",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 7",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "",
    landingPrice: 156,
    recommendedRetailPrice: 390,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO8",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 8",
    imageUrl: "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    productLink: "",
    landingPrice: 157,
    recommendedRetailPrice: 392.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO9",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 9",
    imageUrl: "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    productLink: "",
    landingPrice: 158,
    recommendedRetailPrice: 395,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "DO10",
    brandName: "Doodlage",
    productName: "Doodlage Style Product 10",
    imageUrl: "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    productLink: "",
    landingPrice: 159,
    recommendedRetailPrice: 397.5,
    availableSizes: ["XS","S","M","L","XL"]
  },

  // --- Naushad Ali (10 products, dummied names where blank) ---
  {
    skuId: "NA01",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 1",
    imageUrl: "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080",
    productLink: "",
    landingPrice: 200,
    recommendedRetailPrice: 500,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA02",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 2",
    imageUrl: "https://kharakapas.com/cdn/shop/files/KK4856.jpg?v=1724948498&width=1080",
    productLink: "",
    landingPrice: 201,
    recommendedRetailPrice: 502.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA03",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 3",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "",
    landingPrice: 202,
    recommendedRetailPrice: 505,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA04",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 4",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "",
    landingPrice: 203,
    recommendedRetailPrice: 507.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA05",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 5",
    imageUrl: "https://www.hindostanarchive.com/cdn/shop/files/DSC01165.jpg?v=1749744353&width=3000",
    productLink: "",
    landingPrice: 204,
    recommendedRetailPrice: 510,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA06",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 6",
    imageUrl: "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    productLink: "",
    landingPrice: 205,
    recommendedRetailPrice: 512.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA07",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 7",
    imageUrl: "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    productLink: "",
    landingPrice: 206,
    recommendedRetailPrice: 515,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA08",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 8",
    imageUrl: "https://rasti.in/cdn/shop/files/blue-meadow-vest-01.jpg?v=1739684714&width=1100",
    productLink: "",
    landingPrice: 207,
    recommendedRetailPrice: 517.5,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA09",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 9",
    imageUrl: "https://doodlage.in/cdn/shop/files/DL25-DR-015-01_2b628836-d07a-4e96-85c1-b5c9aeb6bece.jpg?v=1750658908&width=1000",
    productLink: "",
    landingPrice: 208,
    recommendedRetailPrice: 520,
    availableSizes: ["XS","S","M","L","XL"]
  },
  {
    skuId: "NA10",
    brandName: "Naushad Ali",
    productName: "Naushad Ali Apparel 10",
    imageUrl: "https://doodlage.in/cdn/shop/files/FullSizeRender_b181d93f-ae20-43b4-a9ae-b178da08d1cc.jpg?v=1750658882&width=800",
    productLink: "",
    landingPrice: 209,
    recommendedRetailPrice: 522.5,
    availableSizes: ["XS","S","M","L","XL"]
  }
]; */

 // Trying to connect with Google Spreadsheet - database of products

let productData = [];
async function loadProductsFromSheet() {
  const url = "https://docs.google.com/spreadsheets/d/2PACX-1vSNVrRrsiEXVml8Ecuq7kmaEh9JY1G0_X5-PGtvoXvHo37yGGGFuT9aysBUHf0LKzel73hRUWq3IWys/export?format=csv";
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
