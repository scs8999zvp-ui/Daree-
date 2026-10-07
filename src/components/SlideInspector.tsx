import React, { useState } from 'react';
import { Slide, SlideLayout, StatItem, CardItem, TimelineItem } from '../types/presentation';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  FileText, 
  Layout, 
  Type, 
  ListOrdered, 
  BarChart3, 
  SlidersHorizontal,
  Loader2,
  Check
} from 'lucide-react';

interface SlideInspectorProps {
  slide: Slide;
  slideIndex: number;
  onUpdateSlide: (updated: Slide) => void;
}

export const SlideInspector: React.FC<SlideInspectorProps> = ({
  slide,
  slideIndex,
  onUpdateSlide,
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceSuccess, setEnhanceSuccess] = useState(false);

  const handleLayoutChange = (layout: SlideLayout) => {
    onUpdateSlide({
      ...slide,
      layout,
    });
  };

  const handleFieldChange = (field: keyof Slide, value: any) => {
    onUpdateSlide({
      ...slide,
      [field]: value,
    });
  };

  // Bullet points handlers
  const handleBulletChange = (idx: number, text: string) => {
    const nextBullets = [...(slide.bullets || [])];
    nextBullets[idx] = text;
    handleFieldChange('bullets', nextBullets);
  };

  const handleAddBullet = () => {
    const nextBullets = [...(slide.bullets || []), 'New key takeaway or supporting evidence'];
    handleFieldChange('bullets', nextBullets);
  };

  const handleRemoveBullet = (idx: number) => {
    const nextBullets = (slide.bullets || []).filter((_, i) => i !== idx);
    handleFieldChange('bullets', nextBullets);
  };

  // Stats handlers
  const handleStatChange = (idx: number, key: keyof StatItem, val: string) => {
    const nextStats = [...(slide.stats || [])];
    if (nextStats[idx]) {
      nextStats[idx] = { ...nextStats[idx], [key]: val };
      handleFieldChange('stats', nextStats);
    }
  };

  // Cards handlers
  const handleCardChange = (idx: number, key: keyof CardItem, val: string) => {
    const nextCards = [...(slide.cards || [])];
    if (nextCards[idx]) {
      nextCards[idx] = { ...nextCards[idx], [key]: val };
      handleFieldChange('cards', nextCards);
    }
  };

  // AI Enhance single slide
  const handleAiPolish = async () => {
    setIsEnhancing(true);
    setEnhanceSuccess(false);
    try {
      const res = await fetch('/api/enhance-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slide,
          instruction: 'Make copy punchy, articulate, and generate rich presenter notes',
        }),
      });
      const data = await res.json();
      if (data.success && data.slide) {
        onUpdateSlide(data.slide);
        setEnhanceSuccess(true);
        setTimeout(() => setEnhanceSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-80 border-l border-white/10 bg-[#0a0d18] flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Slide {slideIndex + 1} Inspector
          </span>
        </div>

        {/* AI Polish Button */}
        <button
          onClick={handleAiPolish}
          disabled={isEnhancing}
          className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Enhance copy and speaker notes with AI"
        >
          {isEnhancing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-300" />
          ) : enhanceSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span>{isEnhancing ? 'Polishing...' : enhanceSuccess ? 'Polished!' : 'AI Polish'}</span>
        </button>
      </div>

      {/* Form sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-white">
        
        {/* Layout Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-cyan-400" />
            Slide Layout
          </label>
          <select
            value={slide.layout}
            onChange={(e) => handleLayoutChange(e.target.value as SlideLayout)}
            className="w-full px-3 py-2 rounded-xl bg-[#13172b] border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="title">Title / Keynote Hero</option>
            <option value="team">Team Members Showcase</option>
            <option value="content_split">2-Column Split Thesis</option>
            <option value="stats_grid">Stats & Metrics Grid (KPIs)</option>
            <option value="cards_3col">3-Pillars / Feature Cards</option>
            <option value="timeline">Roadmap Timeline & Phases</option>
            <option value="quote_impact">Quote & Manifesto</option>
            <option value="image_focus">Image Visual Focus</option>
            <option value="conclusion">Conclusion & Call to Action</option>
          </select>
        </div>

        {/* Category Kicker */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Category Kicker
          </label>
          <input
            type="text"
            value={slide.kicker || ''}
            onChange={(e) => handleFieldChange('kicker', e.target.value)}
            placeholder="e.g. Strategic Architecture"
            className="w-full px-3 py-2 rounded-xl bg-[#13172b] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Main Title */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Headline Title
          </label>
          <textarea
            rows={2}
            value={slide.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#13172b] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none font-semibold"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Subtitle / Context
          </label>
          <textarea
            rows={2}
            value={slide.subtitle || ''}
            onChange={(e) => handleFieldChange('subtitle', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#13172b] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
          />
        </div>

        {/* Bullets List (if layout supports or has bullets) */}
        {(slide.layout === 'content_split' || slide.layout === 'conclusion' || slide.layout === 'title' || (slide.bullets && slide.bullets.length > 0)) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
                Takeaways ({slide.bullets?.length || 0})
              </label>
              <button
                onClick={handleAddBullet}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {(slide.bullets || []).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(idx, e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#13172b] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => handleRemoveBullet(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stat Cards (if stats_grid) */}
        {slide.layout === 'stats_grid' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              Metric Cards
            </label>
            <div className="space-y-3">
              {(slide.stats || []).map((stat, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-700 bg-[#121528] space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      className="w-1/2 px-2 py-1 rounded bg-[#181d33] border border-slate-700 text-[11px] text-white"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. +140%)"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      className="w-1/2 px-2 py-1 rounded bg-[#181d33] border border-slate-700 text-[11px] text-cyan-300 font-bold"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Detail / context description"
                    value={stat.detail || ''}
                    onChange={(e) => handleStatChange(idx, 'detail', e.target.value)}
                    className="w-full px-2 py-1 rounded bg-[#181d33] border border-slate-700 text-[11px] text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cards (if cards_3col) */}
        {slide.layout === 'cards_3col' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Feature Cards
            </label>
            <div className="space-y-3">
              {(slide.cards || []).map((c, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-700 bg-[#121528] space-y-2">
                  <input
                    type="text"
                    placeholder="Card Title"
                    value={c.title}
                    onChange={(e) => handleCardChange(idx, 'title', e.target.value)}
                    className="w-full px-2 py-1 rounded bg-[#181d33] border border-slate-700 text-[11px] font-semibold text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Content description"
                    value={c.content}
                    onChange={(e) => handleCardChange(idx, 'content', e.target.value)}
                    className="w-full px-2 py-1 rounded bg-[#181d33] border border-slate-700 text-[11px] text-slate-300 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speaker Notes */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            Speaker Notes (Presenter View)
          </label>
          <textarea
            rows={4}
            value={slide.speakerNotes || ''}
            onChange={(e) => handleFieldChange('speakerNotes', e.target.value)}
            placeholder="Key talking points, cues, and tone reminders..."
            className="w-full px-3 py-2 rounded-xl bg-[#13172b] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
