# Order Number Generation Setup Instructions

## Overview
This system automatically generates sequential order numbers for each brand and month combination. The format is: `{BRAND}-{MONTH}{YEAR}-{SEQUENCE}` (e.g., `KK-Dec25-001`, `NA-Dec25-002`).

## Google Apps Script Setup

### Step 1: Create Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the contents of `google-apps-script.js`
4. Save the project with a name like "Order Number Generator"

### Step 2: Create Google Sheet
1. Create a new Google Sheet
2. Name it "Order Management" or similar
3. Create two sheets within it:
   - **OrderNumbers** - for tracking order number sequences
   - **OrderLineItems** - for storing order details

### Step 3: Set up OrderNumbers Sheet
Create the following columns in the OrderNumbers sheet:
- **OrderID** (Column A) - The generated order number
- **Brand** (Column B) - Brand name (KK, NA, DL, TRI, etc.)
- **Month** (Column C) - Month/Year format (Dec25, Jan26, etc.)
- **Sequence** (Column D) - Sequential number for that brand/month
- **Timestamp** (Column E) - When the order number was generated

### Step 4: Set up OrderLineItems Sheet
Create the following columns in the OrderLineItems sheet:
- **OrderID** (Column A) - The order number
- **SubmissionTimestamp** (Column B) - When the order was submitted
- **BuyerName** (Column C) - Customer name
- **Email** (Column D) - Customer email
- **Phone** (Column E) - Customer phone
- **ShippingAddress** (Column F) - Delivery address
- **Brand** (Column G) - Brand name
- **OrderComments** (Column H) - Order notes
- **ProductSelectionID** (Column I) - Line item number
- **ProductSKU** (Column J) - Product SKU
- **ProductName** (Column K) - Product name
- **CustomPrintSKU** (Column L) - Custom print SKU (if any)
- **SizesAndQuantities** (Column M) - Size and quantity details
- **UnitPrice** (Column N) - Price per unit
- **Subtotal** (Column O) - Line total
- **Notes** (Column P) - Product-specific notes

### Step 5: Link Apps Script to Sheet
1. In your Apps Script project, click on "Resources" > "Libraries"
2. Click "Add a library" and paste your Google Sheet ID
3. Or, in the Apps Script editor, replace `SpreadsheetApp.getActiveSpreadsheet()` with:
   ```javascript
   SpreadsheetApp.openById('YOUR_SHEET_ID_HERE')
   ```

### Step 6: Deploy as Web App
1. In Apps Script, click "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the web app URL

### Step 7: Update Your Web App
1. Open your `app.js` file
2. Replace the `ORDER_NUMBER_ENDPOINT` URL with your deployed web app URL:
   ```javascript
   const ORDER_NUMBER_ENDPOINT = "YOUR_DEPLOYED_WEB_APP_URL_HERE";
   ```

## How It Works

### Order Number Generation
1. When a user submits an order, the system calls `fetchOrderNumber(brand)`
2. The function generates the current month/year (e.g., "Dec25")
3. It sends a request to your Google Apps Script with the brand and month
4. The script finds the highest sequence number for that brand/month combination
5. It generates the next sequential number (001, 002, 003, etc.)
6. It creates the order ID in format: `{BRAND}-{MONTH}{YEAR}-{SEQUENCE}`
7. It saves this to the OrderNumbers sheet and returns the order ID

### Example Sequence
- First order for KK in Dec25: `KK-Dec25-001`
- Second order for KK in Dec25: `KK-Dec25-002`
- First order for NA in Dec25: `NA-Dec25-001`
- First order for KK in Jan26: `KK-Jan26-001`

## Testing

### Test the Order Number Generation
1. Open your web app
2. Select a brand
3. Add a product
4. Fill in the form and submit
5. Check the OrderNumbers sheet to see the generated order number
6. Submit another order with the same brand to verify sequence increment

### Test with Different Brands/Months
1. Test with different brands to ensure separate sequences
2. Wait until next month to test month-based separation
3. Verify that each brand/month combination has its own sequence

## Troubleshooting

### Common Issues
1. **"Could not access OrderNumbers sheet"** - Make sure the sheet exists and has the correct name
2. **"Invalid action"** - Check that your web app URL is correct
3. **CORS errors** - Ensure your Apps Script is deployed as a web app with "Anyone" access
4. **Permission denied** - Make sure the Apps Script has access to the Google Sheet

### Debug Steps
1. Check the browser console for error messages
2. Check the Apps Script execution log
3. Verify the Google Sheet has the correct structure
4. Test the Apps Script functions individually

## Security Notes
- The web app is set to "Anyone" access for simplicity
- For production, consider implementing authentication
- The Apps Script has full access to your Google Sheet
- Consider using a service account for better security

## Maintenance
- Monitor the OrderNumbers sheet for any duplicate sequences
- Regularly backup your Google Sheet
- Update the Apps Script if you need to modify the order number format
- Consider archiving old orders periodically

