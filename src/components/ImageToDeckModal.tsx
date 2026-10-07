import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  X, 
  Sliders, 
  Palette, 
  FileText, 
  Check, 
  Loader2,
  Wand2,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';
import { THEMES } from '../theme/themes';
import { PresentationDeck } from '../types/presentation';

interface ImageToDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckGenerated: (deck: PresentationDeck) => void;
}

// Sample starter images with base64/SVG or inline visuals so the user can test immediately if they don't have a picture on hand right this second
const SAMPLE_INSPIRATIONS = [
  {
    title: 'Executive Whiteboard & Strategy',
    description: 'Brainstorm sketch with 3 growth pillars & KPI targets',
    category: 'Business Strategy',
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23131722"><rect width="400" height="250" fill="%230f172a"/><text x="30" y="40" fill="%2338bdf8" font-family="sans-serif" font-size="16" font-weight="bold">Q4 Strategic Roadmap & Targets</text><line x1="30" y1="55" x2="370" y2="55" stroke="%23334155" stroke-width="2"/><rect x="30" y="75" width="100" height="70" rx="8" fill="%231e293b" stroke="%2338bdf8" stroke-width="1.5"/><text x="45" y="105" fill="%23ffffff" font-size="12">Pillar 1: Scale</text><text x="45" y="125" fill="%2394a3b8" font-size="10">+240% Growth</text><rect x="150" y="75" width="100" height="70" rx="8" fill="%231e293b" stroke="%23818cf8" stroke-width="1.5"/><text x="165" y="105" fill="%23ffffff" font-size="12">Pillar 2: AI Core</text><text x="165" y="125" fill="%2394a3b8" font-size="10">Auto-generation</text><rect x="270" y="75" width="100" height="70" rx="8" fill="%231e293b" stroke="%23f43f5e" stroke-width="1.5"/><text x="285" y="105" fill="%23ffffff" font-size="12">Pillar 3: Brand</text><text x="285" y="125" fill="%2394a3b8" font-size="10">Global Reach</text><circle cx="200" cy="195" r="30" fill="%2306b6d4" opacity="0.2"/><text x="145" y="200" fill="%23a5f3fc" font-size="11">Target Valuation: $50M</text></svg>`,
    promptText: 'Create a visionary pitch deck based on this whiteboard strategy showing 3 growth pillars, aggressive market adoption, and target valuation.',
    recommendedTheme: 'neo_prism'
  },
  {
    title: 'Product Launch & Architecture',
    description: 'System diagram with modular framework and workflow',
    category: 'Product & Tech',
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23061410"><rect width="400" height="250" fill="%23061410"/><text x="30" y="40" fill="%2334d399" font-family="sans-serif" font-size="16" font-weight="bold">Modular Next-Gen System</text><rect x="40" y="70" width="320" height="40" rx="6" fill="%23064e3b" stroke="%2310b981"/><text x="110" y="95" fill="%23ecfdf5" font-size="12">Client Experience & UI Studio</text><rect x="40" y="130" width="320" height="40" rx="6" fill="%23064e3b" stroke="%23059669"/><text x="100" y="155" fill="%23a7f3d0" font-size="12">Intelligent Multimodal Engine</text><rect x="40" y="190" width="320" height="40" rx="6" fill="%23064e3b" stroke="%23047857"/><text x="120" y="215" fill="%236ee7b7" font-size="12">Cloud Deployment & Scale</text></svg>`,
    promptText: 'Build an engineering & product launch deck detailing this modular 3-tier architecture, delivery timeline, and technical edge.',
    recommendedTheme: 'nordic_forest'
  },
  {
    title: 'Brand Creative Moodboard',
    description: 'Vibrant color aesthetics, typography, and design manifesto',
    category: 'Creative Design',
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%23140c13"><rect width="400" height="250" fill="%23140c13"/><text x="30" y="40" fill="%23fb7185" font-family="sans-serif" font-size="16" font-weight="bold">Brand Manifesto & Palette</text><circle cx="80" cy="110" r="35" fill="%23f43f5e"/><circle cx="160" cy="110" r="35" fill="%23f97316"/><circle cx="240" cy="110" r="35" fill="%23fbbf24"/><circle cx="320" cy="110" r="35" fill="%23c084fc"/><text x="30" y="195" fill="%23ffe4e6" font-size="14">Uncompromising luxury meets digital boldness.</text></svg>`,
    promptText: 'Generate a high-fashion creative agency presentation highlighting brand emotion, bespoke color story, and creative deliverables.',
    recommendedTheme: 'sunset_editorial'
  }
];

export const ImageToDeckModal: React.FC<ImageToDeckModalProps> = ({
  isOpen,
  onClose,
  onDeckGenerated,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/png');
  const [prompt, setPrompt] = useState<string>('');
  const [slideCount, setSlideCount] = useState<number>(6);
  const [selectedTheme, setSelectedTheme] = useState<string>('neo_prism');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_INSPIRATIONS[0]) => {
    setSelectedImage(sample.previewSvg);
    setImageMimeType('image/svg+xml');
    setPrompt(sample.promptText);
    setSelectedTheme(sample.recommendedTheme);
    setErrorMessage(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep('Analyzing picture details & color balance...');

    try {
      const stepTimer1 = setTimeout(() => {
        setGenerationStep('Synthesizing structured slide outlines and key metrics...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Styling typography, timelines, and visual layout cards...');
      }, 3200);

      const res = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMimeType,
          prompt: prompt || (selectedImage ? 'Create a presentation based on this image' : 'Executive Innovation Presentation'),
          slideCount,
          themeStyle: selectedTheme,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();

      if (!data.success || !data.deck) {
        throw new Error(data.error || 'Failed to generate presentation');
      }

      const generatedDeck: PresentationDeck = {
        id: `deck-${Date.now()}`,
        title: data.deck.title || 'Custom Presentation',
        subtitle: data.deck.subtitle || 'Generated from image inspiration',
        themeId: selectedTheme,
        slides: data.deck.slides || [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      onDeckGenerated(generatedDeck);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error occurred while generating presentation. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d101d] border border-violet-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-6 md:px-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-violet-900/30 to-indigo-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Turn Your Picture into a Presentation
                <span className="text-xs font-mono uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full">
                  Gemini Vision
                </span>
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Upload your picture, sketch, whiteboard, or slide snapshot to instantly design a complete deck
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content with scrolling */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Picture Dropzone */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
              1. Your Picture or Sketch
            </label>

            {selectedImage ? (
              <div className="relative rounded-2xl border border-violet-500/40 bg-[#141829] p-4 flex flex-col items-center">
                <div className="relative max-h-56 max-w-full rounded-xl overflow-hidden border border-white/20 shadow-xl bg-black/40">
                  <img
                    src={selectedImage}
                    alt="Upload preview"
                    className="max-h-52 w-auto object-contain mx-auto"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors"
                    title="Remove picture"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Picture uploaded & ready for analysis
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Replace image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-violet-500/30 hover:border-cyan-400/60 rounded-2xl p-8 text-center cursor-pointer bg-[#121524]/60 hover:bg-[#161a2e] transition-all group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Click to browse or drag & drop your picture
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Supports whiteboard photos, handwritten notes, diagrams, wireframes, screenshots, or posters (PNG, JPG, WEBP, SVG)
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    Ctrl + V / Paste supported
                  </span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Quick preset pictures / inspirations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Or select an instant sample inspiration:
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SAMPLE_INSPIRATIONS.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="p-3 rounded-xl border border-slate-800 hover:border-violet-500/50 bg-[#131626] hover:bg-[#1a1e33] cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div className="h-24 rounded-lg overflow-hidden mb-2 bg-black/40 border border-white/10 relative">
                    <img src={sample.previewSvg} alt={sample.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sample.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {sample.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Prompt / Notes */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
              2. Additional Directions or Context (Optional)
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Focus on financial metrics, make it persuasive for executive stakeholders"
              className="w-full px-4 py-3 rounded-xl bg-[#141828] border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Theme & Slides Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Color Theme Selector */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4 text-violet-400" />
                3. Designer Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      selectedTheme === t.id
                        ? 'border-cyan-400 bg-cyan-400/10 ring-1 ring-cyan-400'
                        : 'border-slate-800 bg-[#121524] hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${t.previewGradient} shrink-0 shadow`} />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-white truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{t.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slide Count */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                4. Number of Slides
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSlideCount(num)}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                      slideCount === num
                        ? 'border-violet-400 bg-violet-500/20 text-white ring-1 ring-violet-400'
                        : 'border-slate-800 bg-[#121524] text-slate-400 hover:text-white'
                    }`}
                  >
                    {num} Slides
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-slate-300">
                <span className="font-semibold text-cyan-300">Automated Layouts Included:</span> Title, Split thesis, Metric KPI grids, Feature pillars, Milestone roadmaps & Call to action.
              </div>
            </div>
          </div>

          {/* Error display */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 md:px-8 border-t border-white/10 bg-[#0b0e1a] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-xl shadow-violet-500/25 flex items-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{generationStep || 'Generating Presentation...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Make My Presentation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
