# 🔧 NFT Metadata Loading - Troubleshooting Guide

## Issue: "Failed to fetch metadata" Error

The error occurs when trying to view the NFT after minting. Here's how to debug and fix it:

## 🛠️ Enhanced Error Handling (Already Implemented)

### Multiple IPFS Gateway Fallbacks
The app now tries 4 different IPFS gateways:
1. **Pinata Gateway** - `https://gateway.pinata.cloud/ipfs/`
2. **IPFS.io** - `https://ipfs.io/ipfs/`
3. **Cloudflare** - `https://cloudflare-ipfs.com/ipfs/`
4. **Dweb.link** - `https://dweb.link/ipfs/`

### Debug Tools Added
- **URI Display** - Shows the exact token URI being used
- **Direct Link** - "🔗 Open URI directly" to test in browser
- **Test Modal** - "🧪 Test Modal" to verify modal functionality

## 🕵️ Debugging Steps

### 1. Check Token URI Format
After minting, look at the URI displayed. It should be:
```
ipfs://QmYourHashHere
```
or
```
https://gateway.pinata.cloud/ipfs/QmYourHashHere
```

### 2. Test Direct Access
Click "🔗 Open URI directly" to see if the metadata loads in your browser.

### 3. Verify Modal Works
Click "🧪 Test Modal" to confirm the modal displays correctly.

### 4. Check Browser Console
Open Developer Tools → Console to see detailed error messages:
```javascript
// Look for these logs:
"Trying gateway: https://gateway.pinata.cloud/ipfs/..."
"Gateway ... failed: [error details]"
```

## 🔍 Common Issues & Solutions

### Issue 1: CORS Errors
**Symptom**: Console shows CORS policy errors
**Solution**: The app tries multiple gateways automatically

### Issue 2: Invalid IPFS Hash
**Symptom**: All gateways fail
**Solution**: 
- Check if you uploaded the image correctly
- Verify the Pinata upload returned a valid hash
- Try minting a new NFT

### Issue 3: Network Issues
**Symptom**: All requests timeout
**Solution**:
- Check internet connection
- Try refreshing the page
- Wait a few seconds and try again

### Issue 4: Metadata Format
**Symptom**: JSON parsing errors
**Solution**: Ensure metadata follows ERC-721 standard:
```json
{
  "name": "Your NFT Name",
  "description": "Your NFT Description", 
  "image": "ipfs://QmImageHash",
  "attributes": [
    {
      "trait_type": "Property",
      "value": "Value"
    }
  ]
}
```

## ✅ Testing Workflow

1. **Upload Image** → Verify console shows successful Pinata upload
2. **Mint NFT** → Check transaction succeeds
3. **Click "View NFT"** → Should show loading spinner
4. **If fails** → Click "🔗 Open URI directly" 
5. **If URI works in browser** → It's a CORS/network issue
6. **If URI doesn't work** → Upload/metadata issue

## 🚀 Quick Fix Options

### Option 1: Manual Test
```typescript
// In browser console, test directly:
fetch('YOUR_IPFS_URI_HERE')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Option 2: Use Test Modal
Click "🧪 Test Modal" to verify the display works with sample data.

### Option 3: Check Upload Process
Ensure the image upload to Pinata completed successfully and returned a valid IPFS hash.

---

**The enhanced error handling should resolve most issues automatically by trying multiple gateways!** 🎯
