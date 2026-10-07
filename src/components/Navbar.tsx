import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Palette, 
  Download, 
  Plus, 
  Wand2, 
  ChevronDown,
  Layers,
  FolderOpen,
  Edit2
} from 'lucide-react';
import { THEMES } from '../theme/themes';
import { SHOWCASE_DECKS } from '../data/defaultDeck';
import { PresentationDeck } from '../types/presentation';

interface NavbarProps {
  deckTitle: string;
  onUpdateTitle: (newTitle: string) => void;
  currentThemeId: string;
  onChangeTheme: (themeId: string) => void;
  onOpenImageModal: () => void;
  onStartPresenting: () => void;
  onOpenExport: () => void;
  onAddSlide: () => void;
  onLoadPresetDeck: (deck: PresentationDeck) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  deckTitle,
  onUpdateTitle,
  currentThemeId,
  onChangeTheme,
  onOpenImageModal,
  onStartPresenting,
  onOpenExport,
  onAddSlide,
  onLoadPresetDeck,
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(deckTitle);

  const currentTheme = THEMES[currentThemeId] || THEMES.neo_prism;

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    }
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#080a14] px-4 md:px-6 flex items-center justify-between text-white shrink-0 relative z-30 select-none">
      
      {/* Brand & Presentation Title */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              Prism Deck
            </span>
            <span className="text-[10px] block font-mono text-cyan-400 -mt-0.5 uppercase tracking-wider">
              Studio
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        {/* Editable Title */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="px-2.5 py-1 text-sm font-semibold rounded bg-[#131627] border border-cyan-400 focus:outline-none text-white max-w-[260px] md:max-w-[360px]"
            />
          ) : (
            <div 
              onClick={() => {
                setTempTitle(deckTitle);
                setIsEditingTitle(true);
              }}
              className="group flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <h1 className="text-sm md:text-base font-semibold text-slate-100 truncate max-w-[180px] sm:max-w-[260px] md:max-w-[380px]">
                {deckTitle}
              </h1>
              <Edit2 className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          {/* Preset Decks dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresetMenu((p) => !p)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Load Sample Presentations"
            >
              <FolderOpen className="w-4 h-4" />
            </button>

            {showPresetMenu && (
              <div 
                className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0e1120] border border-violet-500/30 p-2 shadow-2xl z-50 animate-in fade-in"
                onClick={() => setShowPresetMenu(false)}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Sample Showcases
                </div>
                {SHOWCASE_DECKS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLoadPresetDeck(preset)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors flex flex-col"
                  >
                    <span className="text-xs font-bold text-white">{preset.title}</span>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">{preset.category} · {preset.slides.length} slides</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Turn Picture Into Presentation CTA */}
        <button
          onClick={onOpenImageModal}
          className="px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-lg shadow-violet-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Wand2 className="w-4 h-4 text-cyan-200" />
          <span>Upload Picture</span>
        </button>

        {/* Theme Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu((p) => !p)}
            className="px-3 py-2 rounded-xl bg-[#14182a] border border-slate-700/80 hover:border-slate-600 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
            title="Change Presentation Palette"
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${currentTheme.previewGradient} shadow`} />
            <span className="hidden md:inline text-slate-200">{currentTheme.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showThemeMenu && (
            <div 
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e1120] border border-violet-500/30 p-2 shadow-2xl z-50 animate-in fade-in"
              onClick={() => setShowThemeMenu(false)}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1.5 flex items-center gap-1.5">
                <Palette className="w-3 h-3 text-cyan-400" />
                Color Theme Styles
              </div>
              <div className="space-y-1">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onChangeTheme(t.id)}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                      currentThemeId === t.id ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300' : 'hover:bg-white/5 text-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${t.previewGradient} shrink-0 shadow`} />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{t.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Present Fullscreen Button */}
        <button
          onClick={onStartPresenting}
          className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          title="Start Presentation (Press Space or Arrows to advance)"
        >
          <Play className="w-3.5 h-3.5 fill-emerald-300" />
          <span className="hidden sm:inline">Present</span>
        </button>

        {/* Export Dropdown / Trigger */}
        <button
          onClick={onOpenExport}
          className="p-2 md:px-3 md:py-2 rounded-xl bg-[#14182a] border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Export Deck (PDF, HTML, JSON)"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Export</span>
        </button>
      </div>
    </header>
  );
};
