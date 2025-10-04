// Google Apps Script for Order Number Generation
// Deploy this as a web app with execute permissions for "Anyone"
//test statement added
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
  
      console.log("=== DEBUG: Order Number Generation ===");
      console.log("Current month:", currentMonth);
      console.log("Brand:", brand);
      console.log("Brand type:", typeof brand);
  
      // Get all data from the sheet
      const data = sheet.getDataRange().getValues();
      console.log("Total rows in sheet:", data.length);
      console.log("All data:", data);
  
      let maxSequence = 0;
      let matchingRows = [];
      console.info('starting the process');
  
      // Skip header row (row 0), start from row 1
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rowBrand = row[1];       // Column B (Brand)
        const rowMonth = row[2];       // Column C (Month)
        const rowSequence = row[3];    // Column D (Sequence)
  
        console.log(`Row ${i}: Brand='${rowBrand}' (type: ${typeof rowBrand}), Month='${rowMonth}' (type: ${typeof rowMonth}), Sequence=${rowSequence} (type: ${typeof rowSequence})`);
        console.info('hi it me arush');
  
        // Check if this row matches our brand and month
        // Use trim() and case-insensitive comparison for safety
        const brandMatch = rowBrand && rowBrand.toString().trim().toLowerCase() === brand.toString().trim().toLowerCase();
        const monthMatch = rowMonth && rowMonth.toString().trim().toUpperCase() === currentMonth;
        
        console.log(`Row ${i} matches: brand=${brandMatch}, month=${monthMatch}`);
  
        if (brandMatch) {
          const currentSequence = parseInt(rowSequence) || 0;
          matchingRows.push({row: i, sequence: currentSequence, brand: rowBrand, month: rowMonth});
          console.log(`Found matching row ${i} with sequence ${currentSequence}`);
          
          if (currentSequence > maxSequence) {
            maxSequence = currentSequence;
            console.log("New max sequence found:", maxSequence);
          }
        }
      }
  
      console.log("Matching rows found:", matchingRows.length);
      console.log("Matching rows:", matchingRows);
      console.log("Final max sequence for", brand, "in", currentMonth, ":", maxSequence);
  
      // Increment sequence
      const newSequence = maxSequence + 1;
      const sequenceStr = newSequence.toString().padStart(3, '0');
  
      // Create brand initials
      const brandInitials = getBrandInitials(brand);
      const orderId = `${brandInitials}-${currentMonth}-${sequenceStr}`;
  
      console.log("Generated order ID:", orderId);
      console.log("=== DEBUG: New sequence:", newSequence);
      console.info("=== DEBUG: New sequence:", newSequence);
      console.info("=== DEBUG: max sequence:", maxSequence);
  
      // Add new record: [OrderID, Brand, Month, Sequence, Timestamp]
      sheet.appendRow([orderId, brand, currentMonth, newSequence, timestamp]);
  
      // Force refresh the data to ensure it's updated
      SpreadsheetApp.flush();
      
      // Wait a moment for the data to be written
      Utilities.sleep(100);
  
      console.log("=== DEBUG: Order Number Generation Complete ===");
  
      return ContentService.createTextOutput(JSON.stringify({
        result: "SUCCESS",
        orderId: orderId,
        debug: {
          currentMonth: currentMonth,
          brand: brand,
          maxSequence: maxSequence,
          newSequence: newSequence,
          matchingRows: matchingRows.length
        }
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
  
  // Helper function to test the script - DIRECT VERSION (no web interface)
  function testOrderNumberGeneration() {
    console.log("=== TESTING ORDER NUMBER GENERATION ===");
    
    try {
      // First, check current sheet state
      console.log("=== CHECKING INITIAL STATE ===");
      checkSheetData();
      
      // Test with Khara Kapas (same as your form)
      console.log("\n=== Test 1: First order for Khara Kapas ===");
      const result1 = generateOrderNumberDirect('Khara Kapas');
      console.log('Test 1 result:', result1);
      
      // Wait a moment for data to be written
      console.log("Waiting for data to be written...");
      Utilities.sleep(2000);
      
      // Check sheet state after first order
      console.log("\n=== CHECKING STATE AFTER FIRST ORDER ===");
      checkSheetData();
      
      // Test again with same brand
      console.log("\n=== Test 2: Second order for Khara Kapas ===");
      const result2 = generateOrderNumberDirect('Khara Kapas');
      console.log('Test 2 result:', result2);
      
      // Check final state
      console.log("\n=== CHECKING FINAL STATE ===");
      checkSheetData();
      
      console.log("\n=== TEST COMPLETE ===");
      console.log("Expected: First order should be KK-SEP25-001, Second should be KK-SEP25-002");
      console.log("Actual: First order =", result1.orderId, ", Second order =", result2.orderId);
      
    } catch (error) {
      console.error("Error in test:", error);
    }
  }
  
  // Direct version of order number generation (no web interface)
  function generateOrderNumberDirect(brand) {
    try {
      const ss = SpreadsheetApp.openById('1iRUhcOm7-pmKvsTvSWSNX4nxm17kiEaTqxhwJ84Jhjo');
      const sheet = ss.getSheetByName('OrderNumbers');
  
      const currentMonth = Utilities.formatDate(new Date(), 'GMT-7', 'MMMyy').toUpperCase();
      const timestamp = Utilities.formatDate(new Date(), 'GMT-7', 'MM/dd/yyyy HH:mm:ss');
  
      console.log("=== DEBUG: Order Number Generation ===");
      console.log("Current month:", currentMonth);
      console.log("Brand:", brand);
      console.log("Brand type:", typeof brand);
  
      // Get all data from the sheet
      const data = sheet.getDataRange().getValues();
      console.log("Total rows in sheet:", data.length);
      console.log("All data:", data);
  
      let maxSequence = 0;
      let matchingRows = [];
  
      // Skip header row (row 0), start from row 1
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rowBrand = row[1];       // Column B (Brand)
        const rowMonth = row[2];       // Column C (Month)
        const rowSequence = row[3];    // Column D (Sequence)
  
        console.log(`Row ${i}: Brand='${rowBrand}' (type: ${typeof rowBrand}), Month='${rowMonth}' (type: ${typeof rowMonth}), Sequence=${rowSequence} (type: ${typeof rowSequence})`);
  
        // Check if this row matches our brand and month
        // Use trim() and case-insensitive comparison for safety
        const brandMatch = rowBrand && rowBrand.toString().trim().toLowerCase() === brand.toString().trim().toLowerCase();
        const monthMatch = rowMonth && rowMonth.toString().trim().toUpperCase() === currentMonth;
        
        console.log(`Row ${i} matches: brand=${brandMatch}, month=${monthMatch}`);
  
        if (brandMatch && monthMatch) {
          const currentSequence = parseInt(rowSequence) || 0;
          matchingRows.push({row: i, sequence: currentSequence, brand: rowBrand, month: rowMonth});
          console.log(`Found matching row ${i} with sequence ${currentSequence}`);
          
          if (currentSequence > maxSequence) {
            maxSequence = currentSequence;
            console.log("New max sequence found:", maxSequence);
          }
        }
      }
  
      console.log("Matching rows found:", matchingRows.length);
      console.log("Matching rows:", matchingRows);
      console.log("Final max sequence for", brand, "in", currentMonth, ":", maxSequence);
  
      // Increment sequence
      const newSequence = maxSequence + 1;
      const sequenceStr = newSequence.toString().padStart(3, '0');
  
      // Create brand initials
      const brandInitials = getBrandInitials(brand);
      const orderId = `${brandInitials}-${currentMonth}-${sequenceStr}`;
  
      console.log("Generated order ID:", orderId);
      console.log("New sequence:", newSequence);
  
      // Add new record: [OrderID, Brand, Month, Sequence, Timestamp]
      sheet.appendRow([orderId, brand, currentMonth, newSequence, timestamp]);
  
      // Force refresh the data to ensure it's updated
      SpreadsheetApp.flush();
      
      // Wait a moment for the data to be written
      Utilities.sleep(100);
  
      console.log("=== DEBUG: Order Number Generation Complete ===");
  
      return {
        result: "SUCCESS",
        orderId: orderId,
        debug: {
          currentMonth: currentMonth,
          brand: brand,
          maxSequence: maxSequence,
          newSequence: newSequence,
          matchingRows: matchingRows.length
        }
      };
  
    } catch (error) {
      console.error("Error in generateOrderNumberDirect:", error);
      return {
        result: "ERROR",
        error: error.toString()
      };
    }
  }
  
  // Function to check current sheet data - DIRECT VERSION
  function checkSheetData() {
    try {
      console.log("=== CHECKING SHEET DATA ===");
      const ss = SpreadsheetApp.openById('1iRUhcOm7-pmKvsTvSWSNX4nxm17kiEaTqxhwJ84Jhjo');
      const sheet = ss.getSheetByName('OrderNumbers');
      
      const data = sheet.getDataRange().getValues();
      console.log("Total rows:", data.length);
      console.log("All data:", data);
      
      // Check for Khara Kapas entries
      const kharaKapasEntries = data.filter((row, index) => {
        if (index === 0) return false; // Skip header
        return row[1] && row[1].toString().toLowerCase().includes('khara');
      });
      
      console.log("Khara Kapas entries found:", kharaKapasEntries.length);
      console.log("Khara Kapas entries:", kharaKapasEntries);
      
      // Check for any entries with sequence > 1
      const entriesWithSequence = data.filter((row, index) => {
        if (index === 0) return false; // Skip header
        const sequence = parseInt(row[3]) || 0;
        return sequence > 1;
      });
      
      console.log("Entries with sequence > 1:", entriesWithSequence.length);
      console.log("Entries with sequence > 1:", entriesWithSequence);
      
      return data;
    } catch (error) {
      console.error("Error checking sheet data:", error);
      return null;
    }
  }
  