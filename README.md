# NFT Minting App - Complete Setup & Usage Guide

## 🎯 Overview

This guide covers the complete setup and usage of your NFT minting application that uses:
- **Frontend**: Next.js + React + TypeScript
- **Blockchain**: Ethereum (local Anvil network)
- **Storage**: Pinata IPFS (replacing discontinued NFT.Storage)
- **Wallet**: RainbowKit + wagmi
- **Smart Contract**: Custom ERC-721 with minting functionality

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Pinata Setup](#pinata-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [How to Use](#how-to-use)
6. [Technical Details](#technical-details)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- pnpm (or npm/yarn)
- Foundry (for smart contracts)
- MetaMask or compatible wallet

### Installation
```bash
# Navigate to frontend directory
cd /home/divyanshu/blockchain-projects/nft-minting-app/frontend

# Install dependencies (already done)
pnpm install

# Start development server
pnpm dev
```

---

## 🔑 Pinata Setup

### Step 1: Create Pinata Account
1. Go to [https://app.pinata.cloud/register](https://app.pinata.cloud/register)
2. Sign up for a free account
3. Verify your email

### Step 2: Get API Keys
1. Navigate to **API Keys** in the sidebar
2. Click **"New Key"** in the top right
3. Select **Admin privileges** and **unlimited uses**
4. Copy the **JWT token** (this is your `PINATA_JWT`)

### Step 3: Get Gateway Domain
1. Click **"Gateways"** in the sidebar
2. Copy your gateway domain (format: `your-name-123.mypinata.cloud`)

### Step 4: Configure Environment
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your credentials:
   ```bash
   NEXT_PUBLIC_PINATA_JWT=your_actual_jwt_token_here
   NEXT_PUBLIC_PINATA_GATEWAY=your-gateway-name.mypinata.cloud
   ```

---

## ⚙️ Environment Configuration

### Required Environment Variables

```bash
# .env.local
NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_PINATA_GATEWAY=fun-llama-300.mypinata.cloud
```

### Security Notes
- ⚠️ **Never commit `.env.local` to git**
- 🔒 Keep your JWT token secure
- 🌐 The `NEXT_PUBLIC_` prefix makes these accessible to the browser

---

## 🏃‍♂️ Running the Application

### 1. Start Local Blockchain (if needed)
```bash
# In contracts directory
cd ../contracts
anvil
```

### 2. Deploy Smart Contract (if needed)
```bash
# In contracts directory
forge script script/DeployMint.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

### 3. Start Frontend
```bash
# In frontend directory
cd ../frontend
pnpm dev
```

### 4. Access Application
- Open [http://localhost:3000](http://localhost:3000)
- Go to `/mint` page for minting interface

---

## 🎨 How to Use

### Method 1: Upload Image & Generate Metadata

1. **Connect Wallet**
   - Click "Connect Wallet" in top right
   - Select MetaMask or your preferred wallet

2. **Upload Mode**
   - Click **"📤 Upload Image"** tab
   - Select an image file (PNG, JPG, GIF up to 10MB)

3. **Fill Metadata**
   - **Name**: Enter your NFT name
   - **Description**: Describe your NFT
   - **Attributes** (optional): Add traits like "Color: Blue", "Rarity: Rare"

4. **Upload to IPFS**
   - Click **"Upload to IPFS"**
   - Wait for upload completion
   - Your tokenURI will be automatically generated

5. **Mint NFT**
   - Click **"Mint NFT (0.01 ETH)"**
   - Confirm transaction in wallet
   - Wait for confirmation

### Method 2: Manual Token URI Entry

1. **Connect Wallet** (same as above)

2. **Manual Mode**
   - Click **"🔗 Enter URI"** tab
   - Paste your IPFS metadata URI: `ipfs://bafybei...`

3. **Mint NFT**
   - Click **"Mint NFT (0.01 ETH)"**
   - Confirm transaction

---

## 🔧 Technical Details

### Smart Contract
- **Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (Anvil)
- **Standard**: ERC-721 with URI storage
- **Price**: 0.01 ETH per mint
- **Limit**: 5 NFTs per wallet

### NFT Metadata Standard
```json
{
  "name": "Your NFT Name",
  "description": "Your NFT Description",
  "image": "ipfs://bafybei.../image.png",
  "attributes": [
    {
      "trait_type": "Color",
      "value": "Blue"
    }
  ],
  "external_url": "",
  "background_color": ""
}
```

### IPFS URLs
- **Metadata**: `ipfs://bafybei.../metadata.json`
- **Images**: `ipfs://bafybei.../image.png`
- **Gateway**: `https://your-gateway.mypinata.cloud/ipfs/...`

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to upload to Pinata"
**Cause**: Invalid API credentials
**Solution**: 
- Check your `.env.local` file
- Verify JWT token is correct
- Ensure no extra spaces/characters

#### 2. "Property 'file' does not exist"
**Cause**: Wrong Pinata SDK version
**Solution**: 
```bash
pnpm install pinata@latest
```

#### 3. Wallet Connection Issues
**Cause**: Network mismatch
**Solution**:
- Switch to localhost:8545 in MetaMask
- Chain ID: 31337

#### 4. Transaction Fails
**Cause**: Insufficient ETH or gas
**Solution**:
- Ensure you have >0.01 ETH
- Check if you've reached 5 NFT limit

### Debug Tips

1. **Check Console Logs**
   - Open browser DevTools (F12)
   - Look for upload progress messages

2. **Verify IPFS URLs**
   - Test URLs in browser: `https://your-gateway.mypinata.cloud/ipfs/...`

3. **Test Pinata Connection**
   ```javascript
   // In browser console
   fetch('https://api.pinata.cloud/data/testAuthentication', {
     headers: { 'Authorization': 'Bearer YOUR_JWT' }
   })
   ```

---

## 🚀 Advanced Features

### CSV Batch Upload (Future Feature)
The app supports individual uploads. For batch operations:

1. Create CSV with columns: `name,description,image_path`
2. Use Pinata's bulk upload API
3. Generate metadata programmatically

### Server-Side Uploads
For better security, use the included API route:

```typescript
// /api/upload/route.ts (already created)
// Keeps JWT secret on server
// Better for production apps
```

### Custom Attributes
Add rich metadata:
```javascript
const attributes = [
  { trait_type: "Rarity", value: "Legendary" },
  { trait_type: "Power", value: 95 },
  { trait_type: "Element", value: "Fire" },
  { trait_type: "Artist", value: "Your Name" }
];
```

### Multiple Networks
Update contract address for different networks:
```typescript
const deployedContractAddress = {
  31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Anvil
  1: "0x...", // Mainnet
  11155111: "0x..." // Sepolia
}[chainId];
```

---

## 📝 File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── NFTUploadForm.tsx     # Upload interface
│   ├── pages/
│   │   └── mint.tsx              # Main minting page
│   ├── utils/
│   │   └── pinata.ts             # Pinata integration
│   ├── abi/
│   │   └── NFTMinting.json       # Contract ABI
│   └── app/
│       └── api/
│           └── upload/
│               └── route.ts      # Server-side upload API
├── .env.example                  # Environment template
├── .env.local                    # Your credentials (create this)
└── package.json                  # Dependencies
```

---

## 🤝 Support

### Getting Help
1. Check this guide first
2. Review browser console for errors
3. Test Pinata credentials separately
4. Verify smart contract deployment

### Useful Links
- [Pinata Documentation](https://docs.pinata.cloud/)
- [NFT Metadata Standards](https://docs.opensea.io/docs/metadata-standards)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [RainbowKit Docs](https://www.rainbowkit.com/)

---

## ✅ Checklist

Before minting your first NFT:

- [ ] Pinata account created
- [ ] API keys configured in `.env.local`
- [ ] Wallet connected to localhost:8545
- [ ] Smart contract deployed
- [ ] Frontend running on localhost:3000
- [ ] Test image uploaded successfully
- [ ] Metadata generated and visible
- [ ] Transaction confirmed on blockchain

---

## 🎉 Success!

You now have a fully functional NFT minting application with:
- ✅ Modern React/Next.js frontend
- ✅ IPFS storage via Pinata
- ✅ ERC-721 smart contract
- ✅ Wallet integration
- ✅ Image upload & metadata generation
- ✅ Production-ready architecture

**Your token ID starts at "1" and increments automatically - this is perfect and standard practice!**

Happy minting! 🚀
