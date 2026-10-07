import React, { useState } from 'react';
import { PresentationDeck, ThemeConfig } from '../types/presentation';
import { 
  X, 
  Printer, 
  FileCode, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Share2,
  FileText
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: PresentationDeck;
  theme: ThemeConfig;
  onImportDeck: (imported: PresentationDeck) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  deck,
  theme,
  onImportDeck,
}) => {
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Print as PDF handler
  const handlePrint = () => {
    window.print();
  };

  // Export JSON file
  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deck, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${deck.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_deck.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download Standalone HTML presentation
  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${deck.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #080911; color: #fff; margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; overflow: hidden; height: 100vh; }
    .slide-page { display: none; height: 100vh; width: 100vw; padding: 2rem; box-sizing: border-box; }
    .slide-page.active { display: flex; align-items: center; justify-content: center; }
    .aspect-slide { aspect-ratio: 16/9; width: 100%; max-width: 1400px; max-height: 85vh; border-radius: 1.5rem; overflow: hidden; position: relative; }
  </style>
</head>
<body>
  <div id="deck-container">
    ${deck.slides.map((s, idx) => `
      <div class="slide-page ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div class="aspect-slide bg-[#0f111d] border border-violet-500/20 p-10 flex flex-col justify-between shadow-2xl relative">
          <div>
            ${s.kicker ? `<div class="text-xs uppercase font-mono tracking-widest text-cyan-400 mb-2">${s.kicker}</div>` : ''}
            <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight">${s.title}</h1>
            ${s.subtitle ? `<p class="text-lg text-slate-300 mt-3 max-w-3xl">${s.subtitle}</p>` : ''}
          </div>
          ${s.bullets ? `
            <div class="space-y-3 my-auto max-w-3xl">
              ${s.bullets.map(b => `<div class="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-200">✓ ${b}</div>`).join('')}
            </div>
          ` : ''}
          <div class="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/10">
            <span>${deck.title}</span>
            <span>Slide ${idx + 1} of ${deck.slides.length}</span>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  <div style="position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); padding: 0.5rem 1rem; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 1rem; font-size: 0.875rem;">
    <button onclick="prevSlide()" style="color: #38bdf8; cursor: pointer;">← Previous</button>
    <span id="counter" style="color: #94a3b8;">1 / ${deck.slides.length}</span>
    <button onclick="nextSlide()" style="color: #38bdf8; cursor: pointer;">Next (Space/→) →</button>
  </div>
  <script>
    let cur = 0;
    const slides = document.querySelectorAll('.slide-page');
    const counter = document.getElementById('counter');
    function show(i) {
      if(i < 0 || i >= slides.length) return;
      slides[cur].classList.remove('active');
      cur = i;
      slides[cur].classList.add('active');
      counter.textContent = (cur + 1) + ' / ' + slides.length;
    }
    function prevSlide() { show(cur - 1); }
    function nextSlide() { show(cur + 1); }
    window.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if(e.key === 'ArrowLeft') prevSlide();
    });
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `${deck.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_presentation.html`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  // Copy Markdown presentation outline
  const handleCopyMarkdown = () => {
    let md = `# ${deck.title}\n${deck.subtitle ? `> ${deck.subtitle}\n\n` : '\n'}`;
    deck.slides.forEach((s, idx) => {
      md += `## Slide ${idx + 1}: ${s.title}\n`;
      if (s.kicker) md += `*${s.kicker}*\n\n`;
      if (s.subtitle) md += `${s.subtitle}\n\n`;
      if (s.bullets && s.bullets.length > 0) {
        s.bullets.forEach(b => {
          md += `- ${b}\n`;
        });
        md += '\n';
      }
      if (s.stats && s.stats.length > 0) {
        s.stats.forEach(st => {
          md += `* **${st.label}**: ${st.value} (${st.detail || ''})\n`;
        });
        md += '\n';
      }
      if (s.speakerNotes) {
        md += `*Presenter Notes:* ${s.speakerNotes}\n\n`;
      }
      md += '---\n\n';
    });

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  // Import JSON handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          onImportDeck(parsed);
          onClose();
        } else {
          setImportError('Invalid JSON structure: missing slides array');
        }
      } catch (err: any) {
        setImportError('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0e111e] border border-violet-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-white space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Export & Share Deck</h3>
              <p className="text-xs text-slate-400">Save, print, or download your presentation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Print to PDF */}
          <button
            onClick={handlePrint}
            className="p-4 rounded-2xl bg-[#14182a] border border-slate-700/80 hover:border-cyan-400/80 hover:bg-[#191f36] transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Printer className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-300">
                PDF
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Save / Print as PDF</h4>
              <p className="text-xs text-slate-400 mt-1">High-resolution print layout with 16:9 slides</p>
            </div>
          </button>

          {/* Standalone HTML */}
          <button
            onClick={handleDownloadHtml}
            className="p-4 rounded-2xl bg-[#14182a] border border-slate-700/80 hover:border-violet-400/80 hover:bg-[#191f36] transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <FileCode className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-violet-400/10 text-violet-300">
                Offline
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Standalone HTML</h4>
              <p className="text-xs text-slate-400 mt-1">Self-contained presentation to email or open anywhere</p>
            </div>
          </button>

          {/* Download JSON */}
          <button
            onClick={handleDownloadJson}
            className="p-4 rounded-2xl bg-[#14182a] border border-slate-700/80 hover:border-emerald-400/80 hover:bg-[#191f36] transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Download className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300">
                Data
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Export JSON Deck</h4>
              <p className="text-xs text-slate-400 mt-1">Full backup to restore or import anytime</p>
            </div>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="p-4 rounded-2xl bg-[#14182a] border border-slate-700/80 hover:border-amber-400/80 hover:bg-[#191f36] transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              {copiedMarkdown ? (
                <Check className="w-6 h-6 text-emerald-400" />
              ) : (
                <Copy className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-amber-300">
                Markdown
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {copiedMarkdown ? 'Copied to Clipboard!' : 'Copy Text Outline'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">Markdown formatted speaker summary</p>
            </div>
          </button>
        </div>

        {/* Import JSON section */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Load an existing presentation (.json):
          </label>
          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-400/60 bg-[#121524] hover:bg-[#161a2e] transition-colors cursor-pointer text-xs text-slate-300">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Select JSON File to Import</span>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          {importError && (
            <p className="text-xs text-rose-400 mt-1.5">{importError}</p>
          )}
        </div>
      </div>
    </div>
  );
};
