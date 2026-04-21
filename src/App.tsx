import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, Trophy, Gamepad2, Volume2 } from 'lucide-react';
import SnakeGame from './components/SnakeGame';

// Dummy Music Data
const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthAI",
    duration: "2:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#ff00ff",
    cover: "https://picsum.photos/seed/neon/200/200"
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "GlitchBot",
    duration: "3:12",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#00ffff",
    cover: "https://picsum.photos/seed/cyber/200/200"
  },
  {
    id: 3,
    title: "Deep Space",
    artist: "Orion",
    duration: "4:05",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ff0080",
    cover: "https://picsum.photos/seed/space/200/200"
  }
];

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleLevelUp = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30 overflow-hidden relative">
      {/* Background Atmosphere */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 blur-[100px] transition-colors duration-1000"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, ${currentTrack.color} 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, #00ffff 0%, transparent 40%)
          `
        }}
      />

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 h-screen flex flex-col items-center justify-center gap-8 py-8">
        
        {/* Header Section */}
        <header className="w-full max-w-4xl flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              Live Session
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
              Neon<span className="text-transparent border-b-4 border-pink-500 pb-1 px-1" style={{ WebkitTextStroke: '1px white' }}>Glide</span>
            </h1>
          </div>

          <div className="flex gap-6 text-right">
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Score</p>
              <p className="text-3xl font-black font-mono text-pink-500 leading-none">{score.toString().padStart(4, '0')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Best</p>
              <p className="text-3xl font-black font-mono text-zinc-300 leading-none">{highScore.toString().padStart(4, '0')}</p>
            </div>
          </div>
        </header>

        {/* Center Stage - The Game */}
        <div className="flex-1 w-full max-w-4xl flex flex-col md:flex-row gap-8 items-stretch">
          
          {/* Game Window */}
          <div className="flex-[2] relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-pink-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
              <Gamepad2 className="w-4 h-4 text-pink-500" />
              <span className="text-[10px] font-mono uppercase tracking-tighter text-zinc-400">System Ready</span>
            </div>

            <SnakeGame onScoreChange={handleLevelUp} />
          </div>

          {/* Music Player Sideboard */}
          <aside className="flex-1 flex flex-col gap-6">
            
            {/* Now Playing Card */}
            <div className="flex-1 rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/50 group">
                   <img 
                    src={currentTrack.cover} 
                    alt={currentTrack.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  
                  {/* Rotating Vinyl Effect during play */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-1/2 h-1/2 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <AnimatePresence mode="wait">
                    <motion.h2 
                      key={currentTrack.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-2xl font-bold tracking-tight"
                    >
                      {currentTrack.title}
                    </motion.h2>
                  </AnimatePresence>
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{currentTrack.artist}</p>
                </div>
              </div>

              {/* Progress Bar (Visual Only for now) */}
              <div className="space-y-2">
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={isPlaying ? { width: '100%' } : { width: '45%' }}
                    transition={isPlaying ? { duration: 165, ease: "linear" } : { duration: 0.5 }}
                    className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                  <span>0:00</span>
                  <span>{currentTrack.duration}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={handlePrev}
                  className="p-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                  {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                </button>

                <button 
                  onClick={handleNext}
                  className="p-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>

            {/* Visualizer Mini-Widget */}
            <div className="h-24 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 flex items-end gap-1 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={isPlaying ? { height: `${Math.random() * 80 + 20}%` } : { height: '15%' }}
                  transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: i * 0.05 }}
                  className="flex-1 bg-white/10 rounded-full"
                  style={{ backgroundColor: i % 2 === 0 ? currentTrack.color : 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>
          </aside>
        </div>

        {/* Hidden Audio */}
        <audio 
          ref={audioRef}
          src={currentTrack.url}
          onEnded={handleNext}
        />

        {/* Footer controls instruction */}
        <footer className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">WASD</span>
            Navigate
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">SPACE</span>
            Pause/Play
          </div>
        </footer>
      </main>
    </div>
  );
}
