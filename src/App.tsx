/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PresentationDeck, Slide, SlideLayout } from './types/presentation';
import { SHOWCASE_DECKS } from './data/defaultDeck';
import { THEMES } from './theme/themes';
import { SlideViewer } from './components/SlideViewer';
import { Navbar } from './components/Navbar';
import { SlideThumbnailList } from './components/SlideThumbnailList';
import { SlideInspector } from './components/SlideInspector';
import { ImageToDeckModal } from './components/ImageToDeckModal';
import { PresenterModal } from './components/PresenterModal';
import { ExportModal } from './components/ExportModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Wand2, 
  Plus, 
  SlidersHorizontal,
  Layers,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [deck, setDeck] = useState<PresentationDeck>(SHOWCASE_DECKS[0]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isPresenterOpen, setIsPresenterOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [showInspector, setShowInspector] = useState<boolean>(true);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);

  // Active theme configuration
  const currentTheme = THEMES[deck.themeId] || THEMES.neo_prism;
  const activeSlide = deck.slides[activeSlideIndex] || deck.slides[0];

  // Global hotkeys (when modals aren't open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (!isPresenterOpen && !isImageModalOpen && !isExportOpen) {
        if (e.key === 'ArrowRight' || e.key === 'j') {
          setActiveSlideIndex((prev) => Math.min(deck.slides.length - 1, prev + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'k') {
          setActiveSlideIndex((prev) => Math.max(0, prev - 1));
        } else if (e.key === 'p' || e.key === 'F5') {
          e.preventDefault();
          setIsPresenterOpen(true);
        } else if (e.key === 'u') {
          e.preventDefault();
          setIsImageModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck.slides.length, isPresenterOpen, isImageModalOpen, isExportOpen]);

  // Deck Title update
  const handleUpdateTitle = (newTitle: string) => {
    setDeck((prev) => ({
      ...prev,
      title: newTitle,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Theme update
  const handleChangeTheme = (themeId: string) => {
    setDeck((prev) => ({
      ...prev,
      themeId,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Update specific active slide
  const handleUpdateSlide = (updatedSlide: Slide) => {
    setDeck((prev) => {
      const nextSlides = [...prev.slides];
      nextSlides[activeSlideIndex] = updatedSlide;
      return {
        ...prev,
        slides: nextSlides,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Add new slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      layout: 'content_split',
      kicker: 'Key Focus',
      title: 'New Slide Title',
      subtitle: 'Add clear explanation or supporting context here.',
      bullets: [
        'First compelling takeaway point',
        'Second key finding with supporting metrics',
        'Actionable insight for stakeholders',
      ],
      speakerNotes: 'Talking points for this slide.',
    };

    setDeck((prev) => {
      const nextSlides = [...prev.slides];
      nextSlides.splice(activeSlideIndex + 1, 0, newSlide);
      return {
        ...prev,
        slides: nextSlides,
      };
    });
    setActiveSlideIndex((prev) => prev + 1);
  };

  // Duplicate slide
  const handleDuplicateSlide = (index: number) => {
    const target = deck.slides[index];
    if (!target) return;
    const duplicated: Slide = {
      ...JSON.parse(JSON.stringify(target)),
      id: `slide-${Date.now()}`,
      title: `${target.title} (Copy)`,
    };

    setDeck((prev) => {
      const nextSlides = [...prev.slides];
      nextSlides.splice(index + 1, 0, duplicated);
      return { ...prev, slides: nextSlides };
    });
    setActiveSlideIndex(index + 1);
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (deck.slides.length <= 1) return;
    setDeck((prev) => {
      const nextSlides = prev.slides.filter((_, i) => i !== index);
      return { ...prev, slides: nextSlides };
    });
    setActiveSlideIndex((prev) => Math.min(prev, deck.slides.length - 2));
  };

  // Move slide up / down
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= deck.slides.length) return;

    setDeck((prev) => {
      const nextSlides = [...prev.slides];
      const temp = nextSlides[index];
      nextSlides[index] = nextSlides[targetIndex];
      nextSlides[targetIndex] = temp;
      return { ...prev, slides: nextSlides };
    });
    setActiveSlideIndex(targetIndex);
  };

  // Handle deck generated from Image / Multimodal
  const handleDeckGenerated = (newDeck: PresentationDeck) => {
    setDeck(newDeck);
    setActiveSlideIndex(0);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070912] font-sans text-slate-100">
      
      {/* Top Navigation */}
      <Navbar
        deckTitle={deck.title}
        onUpdateTitle={handleUpdateTitle}
        currentThemeId={deck.themeId}
        onChangeTheme={handleChangeTheme}
        onOpenImageModal={() => setIsImageModalOpen(true)}
        onStartPresenting={() => setIsPresenterOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onAddSlide={handleAddSlide}
        onLoadPresetDeck={(preset) => {
          setDeck(preset);
          setActiveSlideIndex(0);
        }}
      />

      {/* Main Studio Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left: Slide Thumbnails */}
        {showThumbnails && (
          <SlideThumbnailList
            slides={deck.slides}
            currentIndex={activeSlideIndex}
            onSelectSlide={(idx) => setActiveSlideIndex(idx)}
            onAddSlide={handleAddSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onMoveSlide={handleMoveSlide}
            theme={currentTheme}
          />
        )}

        {/* Center: Stage / Slide Canvas */}
        <main className="flex-1 flex flex-col justify-between items-center p-4 md:p-8 overflow-y-auto bg-[#060810] relative">
          
          {/* Top Stage Control Strip */}
          <div className="w-full max-w-5xl flex items-center justify-between mb-3 text-xs text-slate-400 select-none">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowThumbnails((p) => !p)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title="Toggle Thumbnails Panel"
              >
                <Layers className="w-4 h-4" />
              </button>
              <span className="font-medium text-slate-300">
                Slide {activeSlideIndex + 1} of {deck.slides.length}
              </span>
              <span className="text-slate-600">·</span>
              <span className="capitalize font-mono text-[11px] text-cyan-400">
                {activeSlide?.layout.replace('_', ' ')} layout
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPresenterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 transition-colors cursor-pointer"
                title="Full-Screen Presentation Mode (Press P)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fullscreen</span>
              </button>
              <button
                onClick={() => setShowInspector((p) => !p)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title="Toggle Inspector Editor"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central 16:9 Canvas Viewport */}
          <div className="w-full max-w-5xl my-auto flex items-center justify-center transition-all duration-300">
            {activeSlide ? (
              <SlideViewer
                slide={activeSlide}
                theme={currentTheme}
                slideNumber={activeSlideIndex + 1}
                totalSlides={deck.slides.length}
              />
            ) : (
              <div className="p-12 text-center text-slate-500">
                No slide selected
              </div>
            )}
          </div>

          {/* Bottom Stage Navigation Strip */}
          <div className="w-full max-w-5xl flex items-center justify-between mt-3 text-xs select-none">
            {/* Quick jump navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSlideIndex((p) => Math.max(0, p - 1))}
                disabled={activeSlideIndex === 0}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => setActiveSlideIndex((p) => Math.min(deck.slides.length - 1, p + 1))}
                disabled={activeSlideIndex === deck.slides.length - 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Picture to Presentation</span>
              </button>
            </div>
          </div>
        </main>

        {/* Right: Slide Inspector Editor */}
        {showInspector && activeSlide && (
          <SlideInspector
            slide={activeSlide}
            slideIndex={activeSlideIndex}
            onUpdateSlide={handleUpdateSlide}
          />
        )}
      </div>

      {/* Modals */}
      <ImageToDeckModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onDeckGenerated={handleDeckGenerated}
      />

      <PresenterModal
        isOpen={isPresenterOpen}
        onClose={() => setIsPresenterOpen(false)}
        slides={deck.slides}
        theme={currentTheme}
        initialSlideIndex={activeSlideIndex}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        deck={deck}
        theme={currentTheme}
        onImportDeck={(imported) => {
          setDeck(imported);
          setActiveSlideIndex(0);
        }}
      />

      {/* Hidden Print Container for High-Res PDF Export */}
      <div className="print-only-container">
        {deck.slides.map((s, idx) => (
          <div key={s.id} className="print-slide-page">
            <SlideViewer
              slide={s}
              theme={currentTheme}
              slideNumber={idx + 1}
              totalSlides={deck.slides.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
