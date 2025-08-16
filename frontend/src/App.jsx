import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => { /* ... function is unchanged ... */ if (!imageFile) { setError("Please select an image file first."); return; } setIsLoading(true); setError(null); setPrediction(null); const formData = new FormData(); formData.append('file', imageFile); try { const response = await fetch('http://localhost:5000/predict', { method: 'POST', body: formData, }); if (!response.ok) { const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' })); throw new Error(errorData.error || `Server responded with status: ${response.status}`); } const data = await response.json(); setPrediction(data); } catch (err) { console.error("Analysis Error:", err); setError(err.message || 'Failed to analyze the image. Please ensure the backend server is running.'); } finally { setIsLoading(false); } };
  const handleFileSelect = (file) => { /* ... function is unchanged ... */ setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); setPrediction(null); setError(null); };
  const handleReset = () => { /* ... function is unchanged ... */ setImageFile(null); setPreviewUrl(''); setPrediction(null); setError(null); };

  return (
    <div className="min-h-screen gradient-bg-light relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
      </div>

      <Header />
      
      <main className="relative w-full max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <ImageUploader 
          onFileSelect={handleFileSelect}
          previewUrl={previewUrl}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          isLoading={isLoading}
          prediction={prediction}
          error={error}
        />
      </main>
    </div>
  );
}

export default App;
