# Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. "Failed to upload to Pinata" Error

**Symptoms**: Upload button shows error, console shows authentication failed

**Causes & Solutions**:
```bash
# Check 1: Verify .env.local exists
ls frontend/.env.local

# Check 2: Verify credentials format
cat frontend/.env.local
# Should look like:
# NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# NEXT_PUBLIC_PINATA_GATEWAY=fun-llama-300.mypinata.cloud

# Check 3: Test API manually
curl -H "Authorization: Bearer YOUR_JWT" https://api.pinata.cloud/data/testAuthentication
```

**Fix**: Recreate API key in Pinata dashboard with Admin privileges

---

### 2. "Property 'file' does not exist on type 'Upload'"

**Symptoms**: TypeScript errors, build fails

**Cause**: Outdated Pinata SDK or incorrect API usage

**Solution**:
```bash
cd frontend
pnpm update pinata
# Or reinstall
pnpm remove pinata && pnpm install pinata@latest
```

---

### 3. Wallet Connection Issues

**Symptoms**: "Please connect your wallet" persists

**Solutions**:
```bash
# Check MetaMask network:
# - Network: Localhost 8545
# - Chain ID: 31337
# - Currency: ETH

# Reset MetaMask if needed:
# Settings → Advanced → Reset Account
```

**Manual Network Setup**:
- Network Name: `Anvil Local`
- RPC URL: `http://localhost:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`

---

### 4. "Insufficient ETH" or Transaction Fails

**Symptoms**: Transaction rejected, not enough gas

**Solutions**:
```bash
# Check balance in MetaMask
# Import Anvil test account:
# Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Or fund your account via Anvil
cast send YOUR_WALLET_ADDRESS --value 1ether --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545
```

---

### 5. Contract Not Found/Deployed

**Symptoms**: "Contract not found" errors

**Solution**:
```bash
cd contracts

# Check if Anvil is running
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545

# Redeploy contract
forge script script/DeployMint.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Update contract address in mint.tsx if changed
```

---

### 6. IPFS URLs Not Loading

**Symptoms**: Images/metadata show as broken links

**Cause**: Gateway issues or incorrect URLs

**Solutions**:
```bash
# Test gateway directly
curl https://YOUR_GATEWAY.mypinata.cloud/ipfs/QmYOUR_CID

# Alternative gateways:
# https://ipfs.io/ipfs/QmYOUR_CID
# https://gateway.pinata.cloud/ipfs/QmYOUR_CID
```

**Fix in code**: Update gateway URL in `pinata.ts`

---

### 7. File Upload Size Issues

**Symptoms**: Large files fail to upload

**Solutions**:
- Keep images under 10MB
- Compress images before upload
- Use optimized formats (WebP, optimized PNG/JPG)

```bash
# Compress images (if needed)
npx imagemin input.png --out-dir=output --plugin=pngquant
```

---

### 8. Development Server Issues

**Symptoms**: Hot reload not working, modules not found

**Solutions**:
```bash
cd frontend

# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Restart development server
pnpm dev
```

---

### 9. "Mint limit reached" Error

**Symptoms**: Cannot mint more NFTs

**Cause**: Each wallet can only mint 5 NFTs (contract limit)

**Solutions**:
- Use a different wallet address
- Or modify contract limit in `mint.sol` and redeploy

---

### 10. Token URI Not Set After Minting

**Symptoms**: NFT minted but no metadata visible

**Debug Steps**:
```bash
# Check if token exists
cast call CONTRACT_ADDRESS "ownerOf(uint256)" TOKEN_ID --rpc-url http://localhost:8545

# Check token URI
cast call CONTRACT_ADDRESS "tokenURI(uint256)" TOKEN_ID --rpc-url http://localhost:8545

# Verify IPFS content
curl https://YOUR_GATEWAY.mypinata.cloud/ipfs/YOUR_CID
```

---

## 🔍 Debug Tools

### Browser Console Commands
```javascript
// Check Pinata connection
fetch('https://api.pinata.cloud/data/testAuthentication', {
  headers: { 'Authorization': 'Bearer ' + 'YOUR_JWT' }
}).then(r => r.json()).then(console.log)

// Check environment variables
console.log(process.env.NEXT_PUBLIC_PINATA_JWT?.slice(0, 20) + '...')
console.log(process.env.NEXT_PUBLIC_PINATA_GATEWAY)
```

### Smart Contract Debug
```bash
# Check contract code
cast code 0x5FbDB2315678afecb367f032d93F642f64180aa3 --rpc-url http://localhost:8545

# Check mint price
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "MINIMUM_MINT_PRICE()" --rpc-url http://localhost:8545

# Check player token count
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "playerTokenCount(address)" YOUR_ADDRESS --rpc-url http://localhost:8545
```

---

## 📋 Health Check Checklist

Before reporting issues, verify:

- [ ] Anvil blockchain running (`curl http://localhost:8545`)
- [ ] Contract deployed (`cast code CONTRACT_ADDRESS`)
- [ ] Frontend server running (`curl http://localhost:3000`)
- [ ] Environment variables set (check `.env.local`)
- [ ] Pinata credentials valid (test API call)
- [ ] Wallet connected to correct network (localhost:8545)
- [ ] Sufficient ETH balance (>0.01 ETH)
- [ ] Under mint limit (<5 NFTs per wallet)

---

## 🆘 Still Having Issues?

1. **Check browser console** for detailed error messages
2. **Check terminal logs** where you started the dev server
3. **Verify all environment variables** are correctly set
4. **Test each component separately**:
   - Pinata upload works?
   - Wallet connects?
   - Contract responds?
5. **Try with a fresh wallet** to rule out account-specific issues

---

## 📞 Last Resort

If nothing works:
1. Delete `node_modules` and reinstall
2. Reset MetaMask account
3. Restart Anvil and redeploy contract
4. Create fresh Pinata API keys
5. Check this guide again step by step

Remember: Token ID starting at "1" is perfectly normal and correct! 🎉
