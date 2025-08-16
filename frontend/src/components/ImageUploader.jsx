import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = () => (
  <motion.div 
    className="flex flex-col justify-center items-center p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="enhanced-spinner mb-4"></div>
    <motion.p 
      className="text-slate-600 font-medium"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      Analyzing your package...
    </motion.p>
  </motion.div>
);

const PredictionResult = ({ prediction }) => {
  const isDamaged = prediction.prediction === 'damaged';
  
  return (
    <motion.div 
      className="result-card border border-white border-opacity-30 p-8 rounded-2xl text-center shadow-elegant"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      {/* Result Icon */}
      <motion.div 
        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          isDamaged ? 'bg-red-100' : 'bg-green-100'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        {isDamaged ? (
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </motion.div>

      <h3 className="text-xl font-semibold text-slate-700 mb-2">Analysis Complete</h3>
      
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
      >
        <p className="text-5xl font-bold mb-2">
          <span className={isDamaged ? 'text-red-500' : 'text-green-500'}>
            {prediction.prediction.charAt(0).toUpperCase() + prediction.prediction.slice(1)}
          </span>
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-slate-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium">Confidence: {prediction.confidence}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

function ImageUploader({ onFileSelect, previewUrl, onAnalyze, onReset, isLoading, prediction, error }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFile = (file) => { 
    if (file && file.type.startsWith('image/')) { 
      onFileSelect(file); 
    } 
  };
  
  const handleImageChange = (e) => { 
    handleFile(e.target.files[0]); 
  };
  
  const handleDragOver = (e) => { 
    e.preventDefault(); 
    setIsDragging(true); 
  };
  
  const handleDragLeave = (e) => { 
    e.preventDefault(); 
    setIsDragging(false); 
  };
  
  const handleDrop = (e) => { 
    e.preventDefault(); 
    setIsDragging(false); 
    const files = e.dataTransfer.files; 
    if (files.length) { 
      handleFile(files[0]); 
    } 
  };

  return (
    <motion.div 
      className="glass rounded-3xl shadow-elegant w-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-br from-white to-slate-50 p-8">
        {/* Title Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Package Damage Detection
          </h2>
          <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
            Upload an image of your postal package to get instant AI-powered damage assessment.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging 
              ? 'drag-active border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50' 
              : 'border-slate-300 hover:border-slate-400 bg-gradient-to-br from-slate-50 to-white'
          }`}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <input 
            type="file" 
            id="imageUpload" 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={handleImageChange} 
          />
          
          {previewUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img 
                src={previewUrl} 
                alt="Package preview" 
                className="max-h-64 mx-auto rounded-xl shadow-soft border border-white" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </motion.div>
          ) : (
            <label htmlFor="imageUpload" className="flex flex-col items-center cursor-pointer group">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4 group-hover:from-purple-100 group-hover:to-blue-100 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <svg className="w-10 h-10 text-slate-500 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </motion.div>
              
              <h3 className="text-xl font-semibold text-slate-700 mb-2 group-hover:text-purple-700 transition-colors">
                Drop your image here
              </h3>
              <p className="text-slate-500 mb-4">or click to browse files</p>
              
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span className="px-3 py-1 bg-slate-100 rounded-full">PNG</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">JPG</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">JPEG</span>
              </div>
            </label>
          )}
        </motion.div>

        {/* Action Buttons */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div 
              className="mt-8 flex justify-center items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button 
                onClick={onAnalyze} 
                disabled={isLoading} 
                className="btn-primary text-white font-semibold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-soft"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Analyze Package</span>
                  </>
                )}
              </motion.button>
              
              <motion.button 
                onClick={onReset} 
                disabled={isLoading} 
                className="bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-soft"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Area */}
        <div className="mt-8 min-h-[140px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Loader key="loader" />
            ) : error ? (
              <motion.div 
                key="error" 
                className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center shadow-soft"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <strong className="text-lg">Analysis Error</strong>
                </div>
                <p>{error}</p>
              </motion.div>
            ) : prediction ? (
              <PredictionResult key="prediction" prediction={prediction} />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default ImageUploader;