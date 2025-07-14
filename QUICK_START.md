# NFT Minting App - Quick Reference

## 🚀 Start Development

```bash
# Terminal 1: Start blockchain
cd contracts && anvil

# Terminal 2: Deploy contract (if needed)
cd contracts && forge script script/DeployMint.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Terminal 3: Start frontend
cd frontend && pnpm dev
```

## 🔑 Environment Setup

1. **Create Pinata account**: https://app.pinata.cloud/register
2. **Get JWT token**: API Keys → New Key → Admin privileges
3. **Get gateway**: Gateways → copy domain (e.g., `fun-llama-300.mypinata.cloud`)
4. **Configure**:
   ```bash
   cp frontend/.env.example frontend/.env.local
   # Edit .env.local with your credentials
   ```

## 📱 Usage Flow

1. **Connect Wallet** → localhost:8545 (Chain ID: 31337)
2. **Choose Upload Method**:
   - 📤 Upload Image: Select file → Fill metadata → Upload to IPFS
   - 🔗 Enter URI: Paste `ipfs://...` directly
3. **Mint NFT** → Pay 0.01 ETH → Confirm transaction

## 🔧 Key Files

- `frontend/src/pages/mint.tsx` - Main minting interface
- `frontend/src/components/NFTUploadForm.tsx` - Upload component
- `frontend/src/utils/pinata.ts` - IPFS integration
- `contracts/src/mint.sol` - ERC-721 smart contract

## 🐛 Quick Fixes

- **Upload fails**: Check `.env.local` credentials
- **Can't connect**: Switch MetaMask to localhost:8545
- **Transaction fails**: Need >0.01 ETH or hit 5 NFT limit
- **Console errors**: Restart dev server

## 📋 Contract Info

- **Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Price**: 0.01 ETH per mint
- **Limit**: 5 NFTs per wallet
- **Token ID**: Starts at 1, auto-increments

## 🌐 URLs

- Frontend: http://localhost:3000/mint
- Anvil RPC: http://localhost:8545
- IPFS Gateway: https://YOUR_GATEWAY.mypinata.cloud/ipfs/CID
