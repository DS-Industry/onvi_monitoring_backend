# Postman Collection for Device Loyalty API

This directory contains Postman collections and environments for testing the Device Loyalty API endpoints.

## Files

- `postman-card-oper-collection.json` - Postman collection with requests for card operations
- `postman-device-loyalty-environment.json` - Postman environment with default variables

## Import Instructions

1. Open Postman
2. Click **Import** button (top left)
3. Select the `postman-card-oper-collection.json` file
4. Import the environment file: **Environments** → **Import** → Select `postman-device-loyalty-environment.json`
5. Select the "Device Loyalty API - Local" environment from the environment dropdown

## Endpoints

### Card Operation (`POST /cwash/api/service/card_oper`)

Performs a transaction on a loyalty card.

**Required Headers:**
- `dev_id`: Device ID (number)
- `token`: Device authentication token
- `ucn`: Card device number (unique card number)
- `sum`: Transaction amount (number)

**Response Format:**
The response is a formatted string (not standard JSON) with newlines:
```
{
"errcode":200,
"errmes":"",
"balance":950,
"oper_id":12345
}
```

**Error Codes:**
- `200`: Success - Operation completed successfully
- `1`: Card not found
- `2`: Unexpected error
- `3`: No access by card (organization mismatch)
- `4`: Insufficient funds
- `5`: Card not activated

### Card Balance (`POST /cwash/api/service/card_balance_2`)

Gets the current balance for a loyalty card.

**Required Headers:**
- `dev_id`: Device ID
- `token`: Device authentication token
- `ucn`: Card device number

## Environment Variables

Update these variables in the Postman environment:

- `base_url`: API base URL (default: `http://localhost:3000`)
- `device_id`: Your device ID (default: `1`)
- `device_token`: Your device authentication token (update this!)
- `card_dev_number`: Card device number to test with (default: `1234567890`)
- `transaction_sum`: Transaction amount in cents/currency units (default: `100`)

## Test Scripts

The collection includes automated test scripts that:

1. ✅ Verify status code is 200
2. ✅ Validate response structure (errcode, errmes, balance, oper_id)
3. ✅ Check data types (numbers, strings)
4. ✅ Validate error codes are in expected range
5. ✅ Store response data for use in subsequent requests

## Usage Tips

1. **Before running card-oper**: Run `Card Balance` first to check the card balance
2. **Update variables**: Make sure to set `device_token` and `card_dev_number` to valid values
3. **Check response**: The response format uses newlines, so it may look unusual in Postman's response viewer, but the tests will parse it correctly
4. **Error handling**: The endpoint catches all errors and returns error code 2 with "Unexpected error" message

## Troubleshooting

- **403 Forbidden**: Check that `device_token` is valid
- **Card not found (errcode: 1)**: Verify `card_dev_number` exists in the system
- **No access (errcode: 3)**: The card's loyalty program doesn't include the device's organization
- **Insufficient funds (errcode: 4)**: Card balance is less than transaction sum
- **Card not activated (errcode: 5)**: Card status is not ACTIVE

