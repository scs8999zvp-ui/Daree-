import React from 'react';
import { Slide, ThemeConfig } from '../types/presentation';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Layout,
  Layers
} from 'lucide-react';

interface SlideThumbnailListProps {
  slides: Slide[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (index: number, direction: 'up' | 'down') => void;
  theme: ThemeConfig;
}

export const SlideThumbnailList: React.FC<SlideThumbnailListProps> = ({
  slides,
  currentIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  theme,
}) => {
  return (
    <div className="w-64 border-r border-white/10 bg-[#0a0d18] flex flex-col h-full shrink-0 select-none">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Slides ({slides.length})</span>
        </div>
        <button
          onClick={onAddSlide}
          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          title="Add New Slide"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Thumbnails scroll list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(idx)}
              className={`group relative rounded-xl p-2.5 transition-all cursor-pointer border ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400/50 shadow-lg'
                  : 'border-slate-800/80 bg-[#121629]/60 hover:border-slate-700 hover:bg-[#151a30]'
              }`}
            >
              {/* Top thumbnail bar */}
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className={`font-mono font-bold ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                  0{idx + 1}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 opacity-80">
                  {slide.layout.replace('_', ' ')}
                </span>
              </div>

              {/* Micro Slide Preview Box */}
              <div className={`aspect-[16/9] w-full rounded-lg ${theme.background} p-2 border ${theme.slideCardBorder} flex flex-col justify-between overflow-hidden relative shadow-inner`}>
                <div className="space-y-1">
                  {slide.kicker && (
                    <div className="w-12 h-1 bg-cyan-400/60 rounded" />
                  )}
                  <div className="text-[10px] font-bold text-white line-clamp-1 leading-tight">
                    {slide.title}
                  </div>
                  {slide.subtitle && (
                    <div className="text-[8px] text-slate-400 line-clamp-1">
                      {slide.subtitle}
                    </div>
                  )}
                </div>

                {/* Mini mockup elements */}
                <div className="flex items-center gap-1 opacity-60">
                  <div className="w-4 h-1 bg-white/30 rounded" />
                  <div className="w-6 h-1 bg-white/20 rounded" />
                </div>
              </div>

              {/* Action Buttons on Hover */}
              <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="p-1 hover:text-cyan-300 text-slate-400 disabled:opacity-20 disabled:hover:text-slate-400"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(idx, 'down');
                    }}
                    disabled={idx === slides.length - 1}
                    className="p-1 hover:text-cyan-300 text-slate-400 disabled:opacity-20 disabled:hover:text-slate-400"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSlide(idx);
                    }}
                    className="p-1 hover:text-violet-300 text-slate-400"
                    title="Duplicate Slide"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (slides.length > 1) onDeleteSlide(idx);
                    }}
                    disabled={slides.length <= 1}
                    className="p-1 hover:text-rose-400 text-slate-400 disabled:opacity-20"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Add button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onAddSlide}
          className="w-full py-2.5 rounded-xl border border-dashed border-cyan-500/30 hover:border-cyan-400/80 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Slide</span>
        </button>
      </div>
    </div>
  );
};
