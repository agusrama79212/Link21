import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FaCopy, FaDownload, FaStar, FaStarHalfAlt, FaRegStar, FaEye, FaSpinner, FaShareAlt } from 'react-icons/fa';

const fakeStatsData = [
  { views: '2.1M', rating: 4.8 },
  { views: '876K', rating: 4.5 },
  { views: '1.5M', rating: 4.7 },
  { views: '452K', rating: 4.3 },
  { views: '3.2M', rating: 4.9 },
  { views: '981K', rating: 4.6 },
  { views: '1.9M', rating: 4.8 },
  { views: '623K', rating: 4.4 },
  { views: '5.4M', rating: 4.9 },
  { views: '712K', rating: 4.5 },
  { views: '1.1M', rating: 4.6 },
  { views: '301K', rating: 4.2 },
  { views: '2.8M', rating: 4.8 },
  { views: '95K', rating: 3.9 },
  { views: '4.1M', rating: 4.9 },
];

declare global {
  interface Window {
    fluidPlayer?: (elementId: string, options?: any) => void;
  }
}

export function PlayVideo() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [fakeStats, setFakeStats] = useState<{ views: string; rating: number } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const randomUrls = [
    'https://agungwandev.com',
  ];

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/AgungDevlop/Viral/refs/heads/main/Video.json'
        );
        const data = await response.json();
        const video = data.find((item: { id: string }) => item.id === id);

        if (video) {
          document.title = video.Judul;
          setVideoUrl(video.Url);
          setVideoTitle(video.Judul);
          sessionStorage.setItem('videoUrl', video.Url);
          sessionStorage.setItem('videoTitle', video.Judul);
          const randomIndex = Math.floor(Math.random() * fakeStatsData.length);
          setFakeStats(fakeStatsData[randomIndex]);
        } else {
          setVideoTitle('Video not found');
        }
      } catch (error) {
        setVideoTitle('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  useEffect(() => {
    if (!loading && videoUrl && window.fluidPlayer) {
      const shouldAutoplay = searchParams.get('autoplay') === 'true';
      window.fluidPlayer('video-player', {
        layoutControls: {
          controlBar: { autoHideTimeout: 3, animated: true, autoHide: true },
          autoPlay: shouldAutoplay,
          mute: false,
          allowTheatre: true,
          playPauseAnimation: true,
          playbackRateEnabled: true,
          allowDownload: false,
          playButtonShowing: true,
          fillToContainer: true,
          primaryColor: '#0f172a',
        }
      });
    }
  }, [loading, videoUrl, searchParams]);

  const handleCopy = () => {
    const linkToCopy = `https://${window.location.hostname}/v/?v=${id}`;
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadClick = () => {
    if (isDownloading || !videoUrl) return;

    setIsDownloading(true);

    sessionStorage.setItem('videoUrl', videoUrl);
    sessionStorage.setItem('videoTitle', videoTitle);
    window.open('/download', '_blank');
    
    const randomAdUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];
    setTimeout(() => {
      window.location.href = randomAdUrl;
    }, 2000);
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-slate-200 text-sm" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <span className="text-slate-500 font-medium animate-pulse">Loading content...</span>
      </div>
    );
  }
  
  if (!videoUrl) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaEye className="text-2xl text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Video Unavailable</h1>
            <p className="text-slate-500">The video you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="w-full aspect-video bg-black rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden mb-8 ring-1 ring-black/5">
          <video id="video-player" className="w-full h-full object-cover">
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {videoTitle}
              </h1>
              
              {fakeStats && (
                <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <FaEye className="text-slate-400" />
                    <span>{fakeStats.views} views</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <div className="flex">{renderStars(fakeStats.rating)}</div>
                    <span className="text-slate-700">{fakeStats.rating}</span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleDownloadClick}
              disabled={!videoUrl || isDownloading}
              className="group flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isDownloading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaDownload className="text-lg group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Video</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-3 text-slate-900 font-bold text-sm uppercase tracking-wide">
                <FaShareAlt className="text-slate-400" />
                <span>Share Verification Link</span>
            </div>
            <div className="relative group">
                <input
                  type="text"
                  value={`https://${window.location.hostname}/v/?v=${id}`}
                  readOnly
                  className="w-full bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl py-4 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 bottom-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 rounded-lg font-semibold text-xs transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <span className="text-green-600">Copied!</span>
                  ) : (
                    <>
                        <FaCopy />
                        <span>Copy</span>
                    </>
                  )}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}