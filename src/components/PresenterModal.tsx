import React, { useState, useEffect, useRef } from 'react';
import { Slide, ThemeConfig } from '../types/presentation';
import { SlideViewer } from './SlideViewer';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Maximize2,
  Minimize2,
  MousePointer,
  Grid
} from 'lucide-react';

interface PresenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  theme: ThemeConfig;
  initialSlideIndex?: number;
}

export const PresenterModal: React.FC<PresenterModalProps> = ({
  isOpen,
  onClose,
  slides,
  theme,
  initialSlideIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [laserPointer, setLaserPointer] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [showOverview, setShowOverview] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialSlideIndex);
  }, [initialSlideIndex, isOpen]);

  // Presentation Timer
  useEffect(() => {
    let interval: any;
    if (isOpen && timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timerRunning]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'l') {
        setLaserPointer((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        setShowNotes((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  // Laser pointer mouse position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!laserPointer) return;
    setLaserPos({ x: e.clientX, y: e.clientY });
  };

  if (!isOpen) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 bg-black flex flex-col select-none overflow-hidden ${
        laserPointer ? 'cursor-none' : ''
      }`}
    >
      {/* Laser pointer dot */}
      {laserPointer && (
        <div 
          className="fixed pointer-events-none z-50 w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${laserPos.x}px`,
            top: `${laserPos.y}px`,
            background: 'radial-gradient(circle, #f43f5e 30%, rgba(244, 63, 94, 0.4) 70%, transparent 100%)',
            boxShadow: '0 0 15px 4px rgba(244, 63, 94, 0.8)',
          }}
        />
      )}

      {/* Main presentation canvas area */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 bg-[#07090f]">
        
        {/* Slide Canvas */}
        <div className="w-full max-w-[1550px] aspect-[16/9] max-h-[88vh] flex items-center justify-center shadow-2xl">
          {currentSlide && (
            <SlideViewer
              slide={currentSlide}
              theme={theme}
              slideNumber={currentIndex + 1}
              totalSlides={slides.length}
              isPresenter={true}
            />
          )}
        </div>

        {/* Floating Speaker Notes Panel */}
        {showNotes && (
          <div className="absolute bottom-20 right-8 w-96 max-h-72 bg-[#121626]/95 backdrop-blur-md border border-violet-500/40 rounded-2xl p-5 shadow-2xl text-white z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <FileText className="w-4 h-4" />
                Speaker Notes · Slide {currentIndex + 1}
              </div>
              <button 
                onClick={() => setShowNotes(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-48 text-sm leading-relaxed text-slate-200 pr-1">
              {currentSlide?.speakerNotes ? (
                currentSlide.speakerNotes
              ) : (
                <span className="text-slate-500 italic">No speaker notes recorded for this slide.</span>
              )}
            </div>
          </div>
        )}

        {/* Thumbnail Overview Drawer */}
        {showOverview && (
          <div className="absolute inset-x-8 bottom-20 top-20 bg-[#0d101d]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl z-40 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Slide Index & Quick Jump</h3>
              <button onClick={() => setShowOverview(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slides.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowOverview(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    idx === currentIndex
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-slate-800 bg-[#141829] hover:border-slate-600'
                  }`}
                >
                  <div className="text-xs font-mono text-cyan-300 mb-1">Slide {idx + 1}</div>
                  <div className="text-sm font-semibold text-white truncate">{s.title}</div>
                  <div className="text-xs text-slate-400 capitalize mt-1">{s.layout.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Presenter Control Bar */}
      <div className="h-16 bg-[#0a0d17] border-t border-white/10 px-6 flex items-center justify-between text-white z-30">
        
        {/* Left: Navigation Controls & Slide Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous Slide (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-mono text-sm px-2">
            <span className="text-cyan-400 font-bold">{currentIndex + 1}</span> / {slides.length}
          </span>

          <button
            onClick={() => setCurrentIndex((p) => Math.min(slides.length - 1, p + 1))}
            disabled={currentIndex === slides.length - 1}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next Slide (Right Arrow or Space)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="h-5 w-px bg-white/15 mx-1" />

          {/* Quick jump overview */}
          <button
            onClick={() => setShowOverview((prev) => !prev)}
            className={`p-2 rounded-xl border transition-colors ${
              showOverview ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
            }`}
            title="Grid Overview"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Middle: Presentation Timer */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm font-semibold tracking-wider text-slate-200">
            {formatTimer(timerSeconds)}
          </span>
          <button 
            onClick={() => setTimerRunning((p) => !p)}
            className="p-1 hover:text-cyan-300 transition-colors"
            title={timerRunning ? 'Pause timer' : 'Resume timer'}
          >
            {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={() => { setTimerSeconds(0); setTimerRunning(true); }}
            className="p-1 hover:text-cyan-300 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Tools & Exit */}
        <div className="flex items-center gap-3">
          {/* Laser Pointer Toggle */}
          <button
            onClick={() => setLaserPointer((p) => !p)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              laserPointer 
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-1 ring-rose-500' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="Toggle Laser Pointer (Key: L)"
          >
            <MousePointer className="w-4 h-4 text-rose-400" />
            <span>Laser {laserPointer ? 'ON' : 'OFF'}</span>
          </button>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes((p) => !p)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              showNotes 
                ? 'bg-violet-500/20 border-violet-500 text-violet-300' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="Toggle Speaker Notes (Key: N)"
          >
            <FileText className="w-4 h-4 text-violet-400" />
            <span>Notes</span>
          </button>

          <div className="h-5 w-px bg-white/15 mx-1" />

          {/* Close presentation */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 transition-colors"
            title="Exit Presenter Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
