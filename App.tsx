import React, { useState, useEffect } from 'react';
import { ViewState, GenerationConfig, GeneratedVideo, AspectRatio } from './types';
import { DEFAULT_CONFIG, APP_NAME } from './constants';
import { checkApiKey, promptForKey, generateVeoVideo } from './services/geminiService';
import Button from './components/Button';
import ImageUpload from './components/ImageUpload';
import SettingsPanel from './components/SettingsPanel';
import ApiKeyModal from './components/ApiKeyModal';
import { Sparkles, ArrowLeft, Download, RefreshCw, Share2, Play, Film } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [config, setConfig] = useState<GenerationConfig>(DEFAULT_CONFIG);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("Initializing...");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check key on mount
  useEffect(() => {
    const init = async () => {
      const hasKey = await checkApiKey();
      if (!hasKey) setShowKeyModal(true);
    };
    init();
  }, []);

  const handleConnectKey = async () => {
    try {
      await promptForKey();
      setShowKeyModal(false);
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    
    // Double check key
    const hasKey = await checkApiKey();
    if (!hasKey) {
      setShowKeyModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setView('processing');
    setProgressMessage("Queuing job on Veo 3.1...");

    // Simulate detailed progress steps for UX since backend polling happens
    const progressInterval = setInterval(() => {
      setProgressMessage(prev => {
        if (prev.startsWith("Queuing")) return "Analyzing image structure...";
        if (prev.startsWith("Analyzing")) return "Applying cinematic motion...";
        if (prev.startsWith("Applying")) return "Rendering high-fidelity frames...";
        if (prev.startsWith("Rendering")) return "Finalizing video encoding...";
        return prev;
      });
    }, 4000);

    try {
      const videoUrl = await generateVeoVideo(selectedImage, config);
      setGeneratedVideoUrl(videoUrl);
      clearInterval(progressInterval);
      setView('result');
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || "Generation failed");
      setView('editor'); // Go back to editor on error
    } finally {
      setIsLoading(false);
    }
  };

  const renderHome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="relative z-10 text-center max-w-3xl">
        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-8 border border-white/10 backdrop-blur-sm">
          <Film className="text-indigo-400 mr-2" size={24} />
          <span className="text-indigo-200 font-medium tracking-wide uppercase text-sm">Powered by Google Veo 3</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 tracking-tight">
          Cinematic Reality <br /> from Still Images
        </h1>
        
        <p className="text-xl text-zinc-400 mb-10 font-light">
          Transform your photography into hyper-realistic video with <br className="hidden md:block"/> precise camera control and identity preservation.
        </p>
        
        <Button 
          onClick={() => setView('editor')} 
          size="lg" 
          variant="primary"
          className="shadow-indigo-500/30 shadow-2xl scale-105 hover:scale-110 transition-transform"
          icon={<Sparkles size={20} />}
        >
          Start Creating
        </Button>

        {/* Mock Gallery */}
        <div className="grid grid-cols-3 gap-4 mt-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {[1, 2, 3].map((i) => (
             <div key={i} className="aspect-video bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <img src={`https://picsum.photos/400/225?random=${i}`} alt="Demo" className="w-full h-full object-cover" />
             </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="min-h-screen flex flex-col pt-20 pb-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => setView('home')} icon={<ArrowLeft size={18} />}>Back</Button>
        <h2 className="text-xl font-semibold">Studio Editor</h2>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex-1 relative">
            <ImageUpload 
              selectedImage={selectedImage} 
              onImageSelect={setSelectedImage}
              onClear={() => setSelectedImage(null)}
            />
          </div>
          
          {/* Floating Action Bar on Mobile / Bottom on Desktop */}
          <div className="mt-6 glass-panel p-4 rounded-2xl flex items-center justify-between">
             <div className="text-sm text-zinc-400 px-2">
               {selectedImage ? 'Image ready' : 'Please upload an image'}
             </div>
             <Button 
               onClick={handleGenerate} 
               disabled={!selectedImage}
               size="lg"
               className="w-full md:w-auto px-12"
               icon={<Sparkles size={20} />}
             >
               Generate Video
             </Button>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="lg:col-span-4 h-full">
          <SettingsPanel config={config} setConfig={setConfig} />
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-indigo-400 animate-pulse" size={32} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Generating Video</h2>
      <p className="text-zinc-400 animate-pulse">{progressMessage}</p>
      <p className="text-zinc-600 text-sm mt-8 max-w-md">
        This allows the AI to simulate light physics and construct 3D geometry from your image. It may take a minute.
      </p>
    </div>
  );

  const renderResult = () => (
    <div className="min-h-screen flex flex-col pt-20 pb-6 px-4 items-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => setView('editor')} icon={<ArrowLeft size={18} />}>Back to Editor</Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setView('editor')} icon={<RefreshCw size={16} />}>Regenerate</Button>
            <Button variant="primary" onClick={() => {
                const a = document.createElement('a');
                a.href = generatedVideoUrl!;
                a.download = `veo-video-${Date.now()}.mp4`;
                a.click();
            }} icon={<Download size={16} />}>Download</Button>
          </div>
        </div>

        <div className="glass-panel p-1 rounded-3xl overflow-hidden shadow-2xl bg-black border border-zinc-800 relative">
            <video 
              src={generatedVideoUrl!} 
              controls 
              autoPlay 
              loop 
              className="w-full h-auto max-h-[70vh] rounded-2xl mx-auto block bg-black"
            />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Motion</h4>
              <p className="text-lg font-medium">{config.motion}</p>
           </div>
           <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Atmosphere</h4>
              <p className="text-lg font-medium">{config.atmosphere}</p>
           </div>
           <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Details</h4>
              <p className="text-lg font-medium truncate">{config.sceneMotion}</p>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#09090b] text-white min-h-screen font-sans selection:bg-indigo-500/30">
      <ApiKeyModal isOpen={showKeyModal} onConnect={handleConnectKey} />
      
      {/* Main Header */}
      {view !== 'home' && (
        <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md z-40 flex items-center px-6 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">V</div>
            <span className="font-bold tracking-tight">{APP_NAME}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-zinc-400">
             <span>Identity Lock: {config.identityLock ? 'Active' : 'Off'}</span>
             <span className="w-1 h-1 bg-zinc-700 rounded-full" />
             <span>Mode: {config.aspectRatio}</span>
          </div>
        </header>
      )}

      <main>
        {view === 'home' && renderHome()}
        {view === 'editor' && renderEditor()}
        {view === 'processing' && renderProcessing()}
        {view === 'result' && renderResult()}
      </main>
    </div>
  );
};

export default App;