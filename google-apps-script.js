// Google Apps Script for Order Number Generation
// Deploy this as a web app with execute permissions for "Anyone"

function doGet(e) {
  try {
    const params = e.parameter;
    console.log("Received GET request with params:", params);

    if (params.action === "getNextOrderNumber") {
      return getNextOrderNumber(params);
    } else if (params.action === "getOrderNumber") {
      return getOrderNumber(params.brand);
    } else if (params.action === "addOrderLineItem") {
      return addOrderLineItem(params);
    } else if (params.getOrderNumber === "Yes") {
      // Legacy format support
      return getOrderNumber(params.brand);
    }

    return ContentService.createTextOutput(JSON.stringify({
      result: "ERROR",
      error: "Unknown action: " + (params.action || "none")
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("Error in doGet:", error);
    return ContentService.createTextOutput(JSON.stringify({
      result: "ERROR",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrderNumber(brand) {
  try {
    const ss = SpreadsheetApp.openById('1iRUhcOm7-pmKvsTvSWSNX4nxm17kiEaTqxhwJ84Jhjo');
    const sheet = ss.getSheetByName('OrderNumbers');

    const currentMonth = Utilities.formatDate(new Date(), 'GMT-7', 'MMMyy').toUpperCase();
    const timestamp = Utilities.formatDate(new Date(), 'GMT-7', 'MM/dd/yyyy HH:mm:ss');

    console.log("Current month:", currentMonth);
    console.log("Brand:", brand);

    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    console.log("Total rows in sheet:", data.length);

    let maxSequence = 0;

    // Skip header row (row 0), start from row 1
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowBrand = row[1];       // Column B (Brand)
      const rowMonth = row[2];       // Column C (Month)
      const rowSequence = row[3];    // Column D (Sequence)

      console.log(`Row ${i}: Brand='${rowBrand}', Month='${rowMonth}', Sequence=${rowSequence}`);

      // Check if this row matches our brand and month
      if (rowBrand === brand && rowMonth === currentMonth) {
        const currentSequence = parseInt(rowSequence) || 0;
        if (currentSequence > maxSequence) {
          maxSequence = currentSequence;
          console.log("New max sequence found:", maxSequence);
        }
      }
    }

    console.log("Final max sequence for", brand, "in", currentMonth, ":", maxSequence);

    // Increment sequence
    const newSequence = maxSequence + 1;
    const sequenceStr = newSequence.toString().padStart(3, '0');

    // Create brand initials
    const brandInitials = getBrandInitials(brand);
    const orderId = `${brandInitials}-${currentMonth}-${sequenceStr}`;

    console.log("Generated order ID:", orderId);

    // Add new record: [OrderID, Brand, Month, Sequence, Timestamp]
    sheet.appendRow([orderId, brand, currentMonth, newSequence, timestamp]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "SUCCESS",
      orderId: orderId
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("Error in getOrderNumber:", error);
    return ContentService.createTextOutput(JSON.stringify({
      result: "ERROR",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getNextOrderNumber(params) {
  try {
    const brand = params.brand;
    const month = params.month;
    
    console.log('Getting next order number for brand:', brand, 'month:', month);
    
    if (!brand || !month) {
      throw new Error('Brand and month are required');
    }
    
    // Open the OrderNumbers sheet
    const ss = SpreadsheetApp.openById('1iRUhcOm7-pmKvsTvSWSNX4nxm17kiEaTqxhwJ84Jhjo');
    let orderNumbersSheet;
    
    try {
      orderNumbersSheet = ss.getSheetByName('OrderNumbers');
    } catch (error) {
      // Create the sheet if it doesn't exist
      orderNumbersSheet = ss.insertSheet('OrderNumbers');
      orderNumbersSheet.getRange(1, 1, 1, 5).setValues([['OrderID', 'Brand', 'Month', 'Sequence', 'Timestamp']]);
    }
    
    if (!orderNumbersSheet) {
      throw new Error('Could not access OrderNumbers sheet');
    }
    
    // Get all data from the sheet
    const data = orderNumbersSheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log('Current data rows:', rows.length);
    
    // Find the highest sequence number for this brand and month
    let maxSequence = 0;
    const brandMonthEntries = rows.filter(row => {
      const rowBrand = row[1]; // Brand column
      const rowMonth = row[2]; // Month column
      return rowBrand === brand && rowMonth === month;
    });
    
    console.log('Found entries for brand/month:', brandMonthEntries.length);
    
    // Get the maximum sequence number
    brandMonthEntries.forEach(row => {
      const sequence = parseInt(row[3]) || 0; // Sequence column
      if (sequence > maxSequence) {
        maxSequence = sequence;
      }
    });
    
    // Generate next sequence number
    const nextSequence = maxSequence + 1;
    const sequenceStr = nextSequence.toString().padStart(3, '0');
    
    // Generate order ID
    const orderId = `${brand}-${month}-${sequenceStr}`;
    
    // Add new entry to the sheet
    const timestamp = new Date();
    const newRow = [orderId, brand, month, nextSequence, timestamp];
    
    orderNumbersSheet.appendRow(newRow);
    
    console.log('Generated order ID:', orderId);
    console.log('Next sequence:', nextSequence);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      orderId: orderId,
      brand: brand,
      month: month,
      sequence: nextSequence,
      timestamp: timestamp.toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in getNextOrderNumber:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function addOrderLineItem(params) {
  try {
    const ss = SpreadsheetApp.openById('1iRUhcOm7-pmKvsTvSWSNX4nxm17kiEaTqxhwJ84Jhjo');
    const sheet = ss.getSheetByName('OrderLineItems');

    // Add row with all the parameters
    sheet.appendRow([
      params.OrderID,
      params.SubmissionTimestamp,
      params.BuyerName,
      params.Email,
      params.Phone,
      params.ShippingAddress,
      params.Brand,
      params.OrderComments,
      params.ProductSelectionID,
      params.ProductSKU,
      params.ProductName,
      params.CustomPrintSKU,
      params.SizesAndQuantities,
      params.UnitPrice,
      params.Subtotal,
      params.Notes
    ]);

    console.log("Added line item for order:", params.OrderID);

    return ContentService.createTextOutput(JSON.stringify({
      result: "SUCCESS",
      message: "Line item added"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("Error in addOrderLineItem:", error);
    return ContentService.createTextOutput(JSON.stringify({
      result: "ERROR",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getBrandInitials(brand) {
  const brandMap = {
    'Doodlage': 'DL',
    'Khara Kapas': 'KK',
    'Naushad Ali': 'NA',
    'The Raw India': 'TRI'
  };
  return brandMap[brand] || 'XX';
}

// Helper function to test the script
function testOrderNumberGeneration() {
  const testParams = {
    brand: 'KK',
    month: 'Dec25'
  };
  
  const result = getNextOrderNumber(testParams);
  console.log('Test result:', result.getContent());
}
