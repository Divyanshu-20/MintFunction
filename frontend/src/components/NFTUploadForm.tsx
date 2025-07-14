import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadToPinata, NFTAttribute } from '../utils/pinata';

interface NFTUploadFormProps {
  onUploadComplete: (tokenURI: string) => void;
  isDisabled?: boolean;
}

export function NFTUploadForm({ onUploadComplete, isDisabled = false }: NFTUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    attributes: [{ trait_type: '', value: '' }] as NFTAttribute[]
  });
  const [error, setError] = useState<string>('');

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.name.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields and select an image');
      return;
    }

    setIsUploading(true);
    setError('');
    
    try {
      setUploadProgress('Preparing files...');
      
      // Filter out empty attributes
      const validAttributes = formData.attributes.filter(
        attr => attr.trait_type.trim() && attr.value.toString().trim()
      );

      setUploadProgress('Uploading to IPFS...');
      const tokenURI = await uploadToPinata(
        selectedFile,
        formData.name,
        formData.description,
        validAttributes
      );

      setUploadProgress('Upload complete!');
      onUploadComplete(tokenURI);
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      setFormData({
        name: '',
        description: '',
        attributes: [{ trait_type: '', value: '' }]
      });
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          NFT Image *
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isDisabled || isUploading}
            className="hidden"
            id="nft-image-upload"
          />
          <label
            htmlFor="nft-image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-purple-500 transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl">
                  <span className="text-white text-sm">Click to change</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">📁</div>
                <div className="text-slate-300 text-sm">
                  Click to upload image
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  PNG, JPG, GIF up to 10MB
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          NFT Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter NFT name"
          disabled={isDisabled || isUploading}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your NFT"
          rows={3}
          disabled={isDisabled || isUploading}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
        />
      </div>

      {/* Attributes */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Attributes (Optional)
        </label>
        <div className="space-y-3">
          {formData.attributes.map((attr, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={attr.trait_type}
                onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                placeholder="Trait type (e.g., Color)"
                disabled={isDisabled || isUploading}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <input
                type="text"
                value={attr.value}
                onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                placeholder="Value (e.g., Blue)"
                disabled={isDisabled || isUploading}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              {formData.attributes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  disabled={isDisabled || isUploading}
                  className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors duration-200 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAttribute}
            disabled={isDisabled || isUploading}
            className="w-full py-2 border border-dashed border-white/30 rounded-lg text-slate-300 hover:border-purple-500 hover:text-purple-400 transition-colors duration-200 text-sm"
          >
            + Add Attribute
          </button>
        </div>
      </div>

      {/* Upload Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUpload}
        disabled={isDisabled || isUploading || !selectedFile || !formData.name.trim() || !formData.description.trim()}
        className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
      >
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{uploadProgress || 'Uploading...'}</span>
            </motion.div>
          ) : (
            <motion.span
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Upload to IPFS
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
