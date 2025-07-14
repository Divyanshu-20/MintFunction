import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import NFTMinting from '../abi/NFTMinting.json';
import { parseEther } from 'viem';
import { NFTUploadForm } from '../components/NFTUploadForm';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

function NFTMintingApp() {
  const [tokenURI, setTokenURI] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const deployedContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //deployed contract on anvil
  
  // Get real connection state from wagmi
  const { address, isConnected } = useAccount();
  
  // Mock state for UI demonstration
  const [userTokenCount, setUserTokenCount] = useState(0);

  const handleUploadComplete = (uploadedTokenURI: string) => {
    setTokenURI(uploadedTokenURI);
    setShowUploadForm(false);
  };

  const fetchNFTMetadata = async (uri: string) => {
    setLoadingMetadata(true);
    try {
      let fetchUrl = uri;
      
      // Convert IPFS URI to HTTP if needed
      if (uri.startsWith('ipfs://')) {
        const hash = uri.replace('ipfs://', '');
        
        // Try multiple IPFS gateways for better reliability
        const gateways = [
          `https://gateway.pinata.cloud/ipfs/${hash}`,
          `https://ipfs.io/ipfs/${hash}`,
          `https://cloudflare-ipfs.com/ipfs/${hash}`,
          `https://dweb.link/ipfs/${hash}`
        ];
        
        let metadata: NFTMetadata | null = null;
        let lastError: Error | null = null;
        
        // Try each gateway until one works
        for (const gateway of gateways) {
          try {
            console.log(`Trying gateway: ${gateway}`);
            const response = await fetch(gateway, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (response.ok) {
              metadata = await response.json();
              fetchUrl = gateway; // Remember which gateway worked
              break;
            }
          } catch (error) {
            lastError = error as Error;
            console.warn(`Gateway ${gateway} failed:`, error);
            continue;
          }
        }
        
        if (!metadata) {
          throw lastError || new Error('All IPFS gateways failed');
        }
        
        // Convert image IPFS URI to HTTP using the same working gateway
        if (metadata.image && metadata.image.startsWith('ipfs://')) {
          const imageHash = metadata.image.replace('ipfs://', '');
          const workingGateway = fetchUrl.split('/ipfs/')[0];
          metadata.image = `${workingGateway}/ipfs/${imageHash}`;
        }
        
        setNftMetadata(metadata);
      } else if (uri.startsWith('data:application/json,')) {
        // Handle data URI (inline JSON)
        try {
          const jsonData = decodeURIComponent(uri.replace('data:application/json,', ''));
          const metadata: NFTMetadata = JSON.parse(jsonData);
          setNftMetadata(metadata);
        } catch (error) {
          throw new Error('Invalid JSON in data URI');
        }
      } else {
        // Handle regular HTTP URLs
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const metadata: NFTMetadata = await response.json();
        setNftMetadata(metadata);
      }
      
      setShowNFTModal(true);
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to load NFT metadata: ${errorMessage}\n\nTried URI: ${uri}`);
    } finally {
      setLoadingMetadata(false);
    }
  };

  const { writeContract, data, isPending, isSuccess, error } = useWriteContract();
  const abi = NFTMinting.abi;

  const handleMint = async () => {
    if (!tokenURI.trim()) {
      alert('Please enter a token URI');
      return;
    }

    setIsLoading(true);
    setMintStatus('idle');

    try {
      await writeContract({
        address: deployedContractAddress,
        abi,
        functionName: 'mintNFT',
        args: [tokenURI],
        value: parseEther("0.01"),
      });
      // txHash and status will be set in useEffect
    } catch (err) {
      setMintStatus('error');
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (data) {
      setTxHash(data as string);
      setMintStatus('success');
      setUserTokenCount(prev => prev + 1);
      setIsLoading(false);
    }
    if (error) {
      setMintStatus('error');
      setIsLoading(false);
    }
  }, [data, error]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Connect Button - Top Right with custom color/hover only */}
      <div className="absolute top-6 right-6 z-20">
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Mint Your NFT
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create unique digital assets on the blockchain. Each NFT is one-of-a-kind and permanently yours.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-lg"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Connection Status */}
            <div className="mb-6">
              {isConnected ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-green-400"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  {userTokenCount !== undefined && (
                    <span className="text-xs text-slate-400 ml-2">
                      ({userTokenCount}/5 minted)
                    </span>
                  )}
                </motion.div>
              ) : (
                <div className="text-amber-400 text-sm font-medium">
                  Please connect your wallet to mint
                </div>
              )}
            </div>

            {/* Upload Method Selector */}
            <div className="mb-6">
              <div className="flex space-x-2 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setShowUploadForm(true)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    showUploadForm
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  📤 Upload Image
                </button>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !showUploadForm
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🔗 Enter URI
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {showUploadForm ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NFTUploadForm 
                      onUploadComplete={handleUploadComplete}
                      isDisabled={!isConnected || isLoading}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="manual"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Token URI Input */}
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Token URI
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        value={tokenURI}
                        onChange={(e) => setTokenURI(e.target.value)}
                        placeholder="ipfs://your-metadata-hash"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Enter an IPFS URI pointing to your NFT metadata JSON
                      </p>
                      
                      {/* Quick Test Button */}
                      <button
                        onClick={() => {
                          // Use a real working NFT metadata for testing
                          const testUri = "https://ipfs.io/ipfs/QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o";
                          setTokenURI(testUri);
                        }}
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline"
                      >
                        🔧 Use Test Metadata (Verified Working)
                      </button>
                      
                      <button
                        onClick={() => {
                          // Create and test with local metadata (no IPFS dependency)
                          const metadata = {
                            name: "Test Local NFT",
                            description: "This is a locally generated NFT for testing the view functionality",
                            image: "https://picsum.photos/400/400?random=1",
                            attributes: [
                              { trait_type: "Type", value: "Test" },
                              { trait_type: "Generated", value: "Locally" },
                              { trait_type: "Status", value: "Working" }
                            ]
                          };
                          
                          // Set the metadata directly and show modal
                          setNftMetadata(metadata);
                          setShowNFTModal(true);
                          
                          // Also set a dummy URI for the mint process
                          setTokenURI("data:application/json," + encodeURIComponent(JSON.stringify(metadata)));
                        }}
                        className="mt-2 ml-2 text-xs text-green-400 hover:text-green-300 underline"
                      >
                        🚀 Quick Test (No Network)
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mint Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMint}
                disabled={!isConnected || isLoading || !tokenURI.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center space-x-2"
                    >
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Minting...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="mint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Mint NFT (0.01 ETH)
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Token URI Display */}
              {tokenURI && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl"
                >
                  <p className="text-blue-400 text-xs font-medium mb-1">Ready to mint:</p>
                  <p className="text-slate-300 text-xs break-all">
                    {tokenURI}
                  </p>
                </motion.div>
              )}

              {/* Status Messages */}
              <AnimatePresence>
                {mintStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl"
                  >
                    <p className="text-green-400 text-sm font-medium">
                      ✅ NFT minted successfully!
                    </p>
                    {txHash && (
                      <p className="text-slate-300 text-xs mt-1">
                        Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      </p>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchNFTMetadata(tokenURI)}
                      disabled={loadingMetadata}
                      className="mt-3 w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loadingMetadata ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>🖼️</span>
                          <span>View Your NFT</span>
                        </>
                      )}
                    </motion.button>
                    
                    {/* Debug Info */}
                    <div className="mt-2 p-2 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Token URI:</p>
                      <p className="text-xs text-slate-300 break-all font-mono">{tokenURI}</p>
                      <button
                        onClick={() => window.open(tokenURI, '_blank')}
                        className="mt-1 text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        🔗 Open URI directly
                      </button>
                      <button
                        onClick={() => {
                          // Debug: Log the current tokenURI
                          console.log("=== DEBUG INFO ===");
                          console.log("Current tokenURI:", tokenURI);
                          console.log("Is IPFS?", tokenURI.startsWith('ipfs://'));
                          console.log("================");
                          
                          // Test modal with dummy data
                          setNftMetadata({
                            name: "Test NFT",
                            description: "This is a test NFT to verify the modal works",
                            image: "https://via.placeholder.com/400x400/9333ea/ffffff?text=Test+NFT",
                            attributes: [
                              { trait_type: "Test", value: "Modal" },
                              { trait_type: "Status", value: "Working" }
                            ]
                          });
                          setShowNFTModal(true);
                        }}
                        className="ml-2 text-xs text-purple-400 hover:text-purple-300 underline"
                      >
                        🧪 Test Modal
                      </button>
                      <button
                        onClick={async () => {
                          // Debug: Try to fetch the URI manually
                          console.log("=== MANUAL FETCH TEST ===");
                          try {
                            let testUrl = tokenURI;
                            if (tokenURI.startsWith('ipfs://')) {
                              testUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
                            }
                            console.log("Trying URL:", testUrl);
                            const response = await fetch(testUrl);
                            console.log("Response status:", response.status);
                            console.log("Response headers:", Object.fromEntries(response.headers.entries()));
                            if (response.ok) {
                              const data = await response.json();
                              console.log("Response data:", data);
                              alert("✅ Fetch successful! Check console for details.");
                            } else {
                              console.log("Response error:", response.statusText);
                              alert(`❌ Fetch failed: ${response.status} ${response.statusText}`);
                            }
                          } catch (error) {
                            console.error("Fetch error:", error);
                            alert(`❌ Fetch error: ${error}`);
                          }
                          console.log("=====================");
                        }}
                        className="ml-2 text-xs text-orange-400 hover:text-orange-300 underline"
                      >
                        🔍 Debug Fetch
                      </button>
                    </div>
                  </motion.div>
                )}

                {mintStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
                  >
                    <p className="text-red-400 text-sm font-medium">
                      ❌ Minting failed. Please try again.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl"
        >
          {[
            { title: "Price", value: "0.01 ETH", icon: "💰" },
            { title: "Limit", value: "5 per wallet", icon: "🎯" },
            { title: "Network", value: "Ethereum", icon: "⚡" }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="text-white font-semibold">{item.title}</h3>
              <p className="text-slate-400">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* NFT Modal */}
      <AnimatePresence>
        {showNFTModal && nftMetadata && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowNFTModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowNFTModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* NFT Image */}
              <div className="mb-4">
                <img
                  src={nftMetadata.image}
                  alt={nftMetadata.name}
                  className="w-full h-64 object-cover rounded-xl border border-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23374151"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%239CA3AF" font-family="Arial" font-size="12">Image not found</text></svg>';
                  }}
                />
              </div>

              {/* NFT Details */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{nftMetadata.name}</h3>
                  <p className="text-slate-300 text-sm">{nftMetadata.description}</p>
                </div>

                {/* Attributes */}
                {nftMetadata.attributes && nftMetadata.attributes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-2">Attributes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {nftMetadata.attributes.map((attr, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-2">
                          <p className="text-xs text-slate-400">{attr.trait_type}</p>
                          <p className="text-sm text-white font-medium">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => {
                      if (tokenURI.startsWith('data:application/json,')) {
                        // Pretty-print JSON in a new tab
                        try {
                          const jsonData = decodeURIComponent(tokenURI.replace('data:application/json,', ''));
                          const parsed = JSON.parse(jsonData);
                          const pretty = JSON.stringify(parsed, null, 2);
                          const html = `<!DOCTYPE html><html><head><title>NFT Metadata</title><style>body{background:#181825;color:#e0e0e0;font-family:monospace;padding:2rem;}pre{background:#232336;padding:1rem;border-radius:8px;overflow:auto;}</style></head><body><h2>NFT Metadata</h2><pre>${pretty.replace(/</g, '&lt;')}</pre></body></html>`;
                          const blob = new Blob([html], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        } catch (e) {
                          alert('Failed to display metadata.');
                        }
                      } else {
                        window.open(tokenURI, '_blank');
                      }
                    }}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    📋 View Metadata
                  </button>
                  <button
                    onClick={() => window.open(nftMetadata.image, '_blank')}
                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    🔍 Full Image
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NFTMintingApp;