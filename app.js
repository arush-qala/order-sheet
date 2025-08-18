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
    this.recalculateTotals
