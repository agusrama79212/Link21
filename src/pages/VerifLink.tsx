import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaExclamationTriangle, FaSpinner, FaPlay } from 'react-icons/fa';

export const VerifLink: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionTriggered, setActionTriggered] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const adUrls = [
    'https://agungwandev.com',
  ];

  const getRandomAdUrl = () => {
    const randomIndex = Math.floor(Math.random() * adUrls.length);
    return adUrls[randomIndex];
  };

  useEffect(() => {
    if (!videoId) {
      setIsLoading(false);
      return;
    }

    const fetchVideoData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/AgungDevlop/Viral/refs/heads/main/Video.json'
        );
        const data = await response.json();
        const video = data.find((item: { id: string }) => item.id === videoId);

        if (video) {
          setVideoUrl(video.Url);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleVideoPlay = () => {
    if (videoId && !actionTriggered) {
      setActionTriggered(true);
      setIsRedirecting(true);

      window.open(`/e/${videoId}?autoplay=true`, '_blank');

      setTimeout(() => {
        window.location.href = getRandomAdUrl();
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-slate-900">
        <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 border-4 border-slate-200 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-semibold tracking-wide text-gray-500 uppercase">Loading Preview</p>
      </div>
    );
  }

  if (!videoId || !videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-2xl text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Video Unavailable</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            The video link is invalid or the content has been removed. Please verify your URL.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to Watch?
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            Click the play button below to start streaming your video in high quality.
          </p>
        </div>
        
        <div 
            className="group relative w-full aspect-video bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden cursor-pointer ring-1 ring-black/5 transform transition-all duration-300 hover:scale-[1.01]"
            onClick={handleVideoPlay}
        >
          {!isRedirecting && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/10 group-hover:bg-black/20 transition-all duration-300">
              <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/30 transition-transform duration-300 group-hover:scale-110">
                <FaPlay className="text-3xl md:text-4xl text-white ml-2" />
                <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-30"></div>
              </div>
            </div>
          )}

          {isRedirecting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-900/90 backdrop-blur-sm transition-all duration-500">
              <FaSpinner className="animate-spin text-white text-4xl mb-4" />
              <p className="text-white text-base font-medium tracking-wide">Launching Player...</p>
            </div>
          )}

          <video
            key={videoUrl}
            width="100%"
            height="100%"
            preload="metadata"
            muted
            className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};