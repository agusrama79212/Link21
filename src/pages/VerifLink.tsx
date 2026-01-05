import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaLink, FaShieldAlt, FaExternalLinkAlt, FaExclamationCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';

export const VerifLink: React.FC = () => {
  const { id } = useParams();
  const cleanId = id ? id.replace('.mp4', '') : null;

  const [destinationUrl, setDestinationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const adUrls = [
    'https://otieu.com/4/10423056',
  ];

  useEffect(() => {
    if (!cleanId) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/agusrama79212/Database21/refs/heads/main/database.json');
        const data = await response.json();
        
        // Key 'url' disesuaikan menjadi huruf kecil
        const foundData = data.find((item: { id: string; url: string }) => item.id === cleanId);

        // Menggunakan foundData.url (kecil)
        if (foundData && foundData.url) {
          setDestinationUrl(foundData.url);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cleanId]);

  const handleOpenLink = () => {
    if (!destinationUrl) return;

    setIsProcessing(true);

    window.open(destinationUrl, '_blank');

    setTimeout(() => {
      const randomAd = adUrls[Math.floor(Math.random() * adUrls.length)];
      window.location.href = randomAd;
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <CgSpinner className="animate-spin text-4xl text-blue-600" />
          <p className="text-gray-500 font-medium">Verifying Link...</p>
        </div>
      </div>
    );
  }

  if (error || !destinationUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationCircle className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Not Found</h2>
          <p className="text-gray-500 mb-8">The link you are looking for does not exist or has expired.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60">
        
        <div className="bg-blue-600 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <FaShieldAlt className="text-xl" />
            <span className="font-bold text-lg tracking-wide">SecureLink</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <FaLink className="text-4xl text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-3">
              Klik Tombol di Bawah Untuk Menonton
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Your secure link has been generated successfully. Click the button below to proceed to your destination.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleOpenLink}
              disabled={isProcessing}
              className="group relative w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <CgSpinner className="animate-spin text-2xl" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Open Link</span>
                  <FaExternalLinkAlt className="text-sm group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-xs text-center text-slate-400 mt-6">
              Protected by SecureLink Encryption • ID: {cleanId}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-center text-slate-400 text-xs">
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </div>
      </div>
    </div>
  );
};