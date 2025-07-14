import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import '../abi/NFTMinting.json';

function NFTMintingApp() {
  const [tokenURI, setTokenURI] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  
  // Get real connection state from wagmi
  const { address, isConnected } = useAccount();
  
  // Mock state for UI demonstration
  const [userTokenCount, setUserTokenCount] = useState(0);

  const handleMint = async () => {
    if (!tokenURI.trim()) {
      alert('Please enter a token URI');
      return;
    }

    setIsLoading(true);
    setMintStatus('idle');

    // Simulate minting process - replace with real minting logic when you deploy your contract
    setTimeout(() => {
      setTxHash('0xabcdef1234567890...');
      setMintStatus('success');
      setUserTokenCount(prev => prev + 1);
      setIsLoading(false);
    }, 2000);
  };

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
          className="w-full max-w-md"
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

            {/* Token URI Input */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Token URI
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                  placeholder="https://your-metadata.json"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

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
    </div>
  );
}

export default NFTMintingApp;