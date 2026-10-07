import React from 'react';
import { Slide, ThemeConfig } from '../types/presentation';
import { 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Quote, 
  CheckCircle2, 
  Calendar,
  Layers, 
  Target, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Star,
  Activity,
  Award,
  Users
} from 'lucide-react';

interface SlideViewerProps {
  slide: Slide;
  theme: ThemeConfig;
  slideNumber: number;
  totalSlides: number;
  isPresenter?: boolean;
  onEditField?: (field: keyof Slide, value: any) => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slide,
  theme,
  slideNumber,
  totalSlides,
  isPresenter = false,
  onEditField,
}) => {
  // Render layouts
  const renderLayoutContent = () => {
    switch (slide.layout) {
      case 'title':
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            {/* Header / Kicker */}
            <div className="flex items-center justify-between">
              {slide.kicker ? (
                <div className={`px-3.5 py-1 text-xs uppercase tracking-widest font-semibold rounded-full border ${theme.badgeBg}`}>
                  {slide.kicker}
                </div>
              ) : <div />}
              {slide.customBadge && (
                <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {slide.customBadge}
                </div>
              )}
            </div>

            {/* Central Title and Subtitle */}
            <div className="my-auto max-w-4xl space-y-5">
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] ${theme.textHeading}`}>
                <span className={`bg-gradient-to-r ${theme.accentPrimary} bg-clip-text text-transparent`}>
                  {slide.title}
                </span>
              </h1>
              {slide.subtitle && (
                <p className={`text-lg md:text-2xl font-normal leading-relaxed max-w-3xl ${theme.textBody}`}>
                  {slide.subtitle}
                </p>
              )}

              {/* Optional bullets under title */}
              {slide.bullets && slide.bullets.length > 0 && (
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
                  {slide.bullets.map((b, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border ${theme.cardSurface} ${theme.cardSurfaceBorder}`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className={`text-sm md:text-base ${theme.textBody}`}>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer metadata */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <div className="flex items-center gap-3">
                <span className="font-semibold uppercase tracking-wider text-white">Prism Deck Studio</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className={theme.textMuted}>Executive Presentation</span>
              </div>
              <div className="font-mono text-xs">{slideNumber} / {totalSlides}</div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                {slide.kicker && (
                  <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${theme.badgeText}`}>
                    {slide.kicker}
                  </p>
                )}
                {slide.customBadge && (
                  <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                    <Users className="w-3.5 h-3.5 text-amber-300" />
                    {slide.customBadge}
                  </div>
                )}
              </div>
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${theme.textHeading}`}>
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`mt-2 text-base md:text-lg max-w-3xl ${theme.textBody}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Team Grid */}
            <div className="my-auto py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Column 1 */}
                <div className={`p-5 rounded-2xl border ${theme.cardSurface} ${theme.cardSurfaceBorder} space-y-2.5 shadow-xl`}>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs uppercase tracking-wider font-bold text-cyan-300">
                      Research & Operations Group
                    </span>
                    <span className="text-[11px] font-mono opacity-70 text-slate-300">7 Members</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { name: 'Aljoory Alhadi', highlight: true },
                      { name: 'Haya Adel Alsaadoon' },
                      { name: 'Fajer Shabbir' },
                      { name: 'Jood Hussain Haji' },
                      { name: 'Almezayan Abdulraoof' },
                      { name: 'Asma Mohammed' },
                      { name: 'Muneera Alnaami' },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
                          m.highlight
                            ? 'bg-amber-400/20 border border-amber-400/50 text-amber-200'
                            : 'bg-white/5 border border-white/5 text-slate-200'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {m.name.charAt(0)}
                        </div>
                        <span className="truncate font-medium">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2 */}
                <div className={`p-5 rounded-2xl border ${theme.cardSurface} ${theme.cardSurfaceBorder} space-y-2.5 shadow-xl`}>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
                      Product & Commercial Group
                    </span>
                    <span className="text-[11px] font-mono opacity-70 text-slate-300">8 Members</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { name: 'Noor Mohamed' },
                      { name: 'Sharifa Khalid' },
                      { name: 'Nayla Aldoseri' },
                      { name: 'Nadia Walid' },
                      { name: 'Dana Ali' },
                      { name: 'Raafa Hanouf' },
                      { name: 'Moza Aljenaiad' },
                      { name: 'Maria Majed' },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-slate-200"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {m.name.charAt(0)}
                        </div>
                        <span className="truncate font-medium">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <span className={theme.textMuted}>Team 1 · INJAZ Bahrain Company Program</span>
              <span className="font-mono">{slideNumber} / {totalSlides}</span>
            </div>
          </div>
        );

      case 'stats_grid':
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            {/* Header */}
            <div>
              {slide.kicker && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${theme.badgeText}`}>
                  {slide.kicker}
                </p>
              )}
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${theme.textHeading}`}>
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`mt-2 text-base md:text-lg max-w-3xl ${theme.textBody}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 my-auto">
              {(slide.stats && slide.stats.length > 0 ? slide.stats : [
                { label: 'Efficiency', value: '+140%', detail: 'Sprint cycle speed', trend: 'up' },
                { label: 'Retention', value: '94.8%', detail: 'Active client engagement', trend: 'up' },
                { label: 'Coverage', value: '100%', detail: 'Multi-platform ready', trend: 'stable' },
                { label: 'Impact', value: '5.2x', detail: 'Market transformation', trend: 'up' },
              ]).map((st, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border ${theme.cardSurface} ${theme.cardSurfaceBorder} relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] shadow-xl`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-70 text-slate-400">
                      {st.label}
                    </span>
                    <span className="p-1 rounded-full bg-cyan-400/10 text-cyan-400">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                  <div className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r ${theme.accentPrimary} bg-clip-text text-transparent my-1`}>
                    {st.value}
                  </div>
                  {st.detail && (
                    <p className={`text-xs md:text-sm mt-2 ${theme.textBody} opacity-80`}>
                      {st.detail}
                    </p>
                  )}
                  {/* Visual micro meter bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${theme.accentPrimary}`} 
                      style={{ width: `${Math.min(100, 60 + i * 12)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <span className={theme.textMuted}>Benchmarked against verified industry metrics</span>
              <span className="font-mono">{slideNumber} / {totalSlides}</span>
            </div>
          </div>
        );

      case 'content_split':
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            {/* Slide Header */}
            <div>
              {slide.kicker && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${theme.badgeText}`}>
                  {slide.kicker}
                </p>
              )}
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${theme.textHeading}`}>
                {slide.title}
              </h2>
            </div>

            {/* Split Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto items-center">
              {/* Left Column / Thesis Card */}
              <div className="md:col-span-5 space-y-4">
                {slide.subtitle && (
                  <p className={`text-lg md:text-xl font-medium leading-relaxed ${theme.textBody}`}>
                    {slide.subtitle}
                  </p>
                )}
                
                {slide.image ? (
                  <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl max-h-56">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`p-6 rounded-2xl border ${theme.cardSurface} ${theme.cardSurfaceBorder} relative overflow-hidden`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-white uppercase tracking-wider">Key Takeaway</span>
                    </div>
                    <p className={`text-sm md:text-base leading-relaxed ${theme.textBody}`}>
                      Transformative momentum occurs when strategic focus meets frictionless, intuitive tools.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column / Bullets & Cards */}
              <div className="md:col-span-7 space-y-3.5">
                {(slide.bullets || [
                  'Dynamic context extraction preserves nuance from uploaded sketches and notes.',
                  'Automated color balance guarantees readable contrast across all projection systems.',
                  'Real-time presenter notes guide confidence and pacing during key deliveries.',
                  'Zero cognitive overload: modern typography paired with high-impact data visualization.'
                ]).map((b, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border ${theme.cardSurface} ${theme.cardSurfaceBorder} transition-all hover:translate-x-1 duration-200`}
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                      {idx + 1}
                    </div>
                    <span className={`text-sm md:text-base leading-snug ${theme.textBody}`}>
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <span className={theme.textMuted}>Strategic Overview</span>
              <span className="font-mono">{slideNumber} / {totalSlides}</span>
            </div>
          </div>
        );

      case 'cards_3col':
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            {/* Header */}
            <div>
              {slide.kicker && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${theme.badgeText}`}>
                  {slide.kicker}
                </p>
              )}
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${theme.textHeading}`}>
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`mt-2 text-base md:text-lg max-w-3xl ${theme.textBody}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 my-auto">
              {(slide.cards && slide.cards.length > 0 ? slide.cards : [
                { title: 'Ingestion', subtitle: 'Step 01', content: 'Drop pictures, whiteboard sketches, or quick outlines.', badge: 'Input' },
                { title: 'Synthesis', subtitle: 'Step 02', content: 'Gemini formats cohesive structure, narrative flow, and data.', badge: 'Process' },
                { title: 'Excellence', subtitle: 'Step 03', content: 'Deliver with presenter view, PDF export, and custom palettes.', badge: 'Output' },
              ]).map((c, i) => (
                <div
                  key={i}
                  className={`p-6 md:p-7 rounded-2xl border ${theme.cardSurface} ${theme.cardSurfaceBorder} flex flex-col justify-between relative group hover:border-violet-400/50 transition-all duration-300 shadow-xl`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-mono text-cyan-400">
                        {c.subtitle || `Pillar 0${i + 1}`}
                      </span>
                      {c.badge && (
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${theme.badgeBg}`}>
                          {c.badge}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold ${theme.textHeading}`}>
                      {c.title}
                    </h3>
                    <p className={`text-sm md:text-base leading-relaxed ${theme.textBody} opacity-90`}>
                      {c.content}
                    </p>
                  </div>
                  
                  <div className="pt-6 mt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-cyan-300">
                    <span>Explore details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <span className={theme.textMuted}>Core Architecture Framework</span>
              <span className="font-mono">{slideNumber} / {totalSlides}</span>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            {/* Header */}
            <div>
              {slide.kicker && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${theme.badgeText}`}>
                  {slide.kicker}
                </p>
              )}
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${theme.textHeading}`}>
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`mt-2 text-base md:text-lg max-w-3xl ${theme.textBody}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Timeline progression */}
            <div className="my-auto py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Connecting accent line behind on md screens */}
                <div className="hidden md:block absolute top-8 left-6 right-6 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-amber-300 rounded-full z-0 opacity-40" />

                {(slide.timeline && slide.timeline.length > 0 ? slide.timeline : [
                  { phase: 'Phase 1', title: 'Conceptualization', description: 'Brainstorm ideas, sketch wireframes, and outline key objectives.', tag: 'Complete' },
                  { phase: 'Phase 2', title: 'Prototyping', description: 'Interactive visual models, palette tuning, and team review.', tag: 'Active' },
                  { phase: 'Phase 3', title: 'Production', description: 'Final asset rendering, speech rehearsals, and review feedback.', tag: 'Upcoming' },
                  { phase: 'Phase 4', title: 'Keynote Delivery', description: 'Executive stage presentation, live Q&A, and PDF distribution.', tag: 'Goal' },
                ]).map((step, idx) => (
                  <div 
                    key={idx}
                    className={`relative z-10 p-5 rounded-2xl border ${theme.cardSurface} ${theme.cardSurfaceBorder} space-y-3 shadow-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold text-xs font-mono">
                        0{idx + 1}
                      </div>
                      <span className="text-[11px] font-medium font-mono uppercase text-amber-300">
                        {step.phase}
                      </span>
                    </div>

                    <h4 className={`text-lg font-bold ${theme.textHeading}`}>
                      {step.title}
                    </h4>

                    <p className={`text-xs md:text-sm leading-relaxed ${theme.textBody} opacity-85`}>
                      {step.description}
                    </p>

                    {step.tag && (
                      <div className="pt-2">
                        <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${theme.badgeBg}`}>
                          {step.tag}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <span className={theme.textMuted}>Milestone Trajectory</span>
              <span className="font-mono">{slideNumber} / {totalSlides}</span>
            </div>
          </div>
        );

      case 'quote_impact':
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            <div>
              {slide.kicker && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${theme.badgeText}`}>
                  {slide.kicker}
                </p>
              )}
            </div>

            {/* Massive typographic quote */}
            <div className="my-auto max-w-4xl space-y-8">
              <div className="text-cyan-400 opacity-60">
                <Quote className="w-16 h-16 md:w-20 md:h-20" />
              </div>
              <blockquote className={`text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight ${theme.textHeading}`}>
                "{slide.quote?.text || slide.title || 'Exceptional design turns complex logic into intuitive human emotion.'}"
              </blockquote>
              
              <div className="flex items-center gap-4 pt-4 border-t border-white/15">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 flex items-center justify-center font-bold text-lg text-white">
                  {(slide.quote?.author || 'V')[0]}
                </div>
                <div>
                  <div className={`text-lg md:text-xl font-bold ${theme.textHeading}`}>
                    {slide.quote?.author || 'Creative Leadership'}
                  </div>
                  <div className={`text-sm ${theme.textMuted}`}>
                    {slide.quote?.role || 'Keynote Presentation 2026'}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <span className={theme.textMuted}>Vision & Thesis</span>
              <span className="font-mono">{slideNumber} / {totalSlides}</span>
            </div>
          </div>
        );

      case 'image_focus':
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            <div>
              {slide.kicker && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${theme.badgeText}`}>
                  {slide.kicker}
                </p>
              )}
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${theme.textHeading}`}>
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`mt-2 text-base md:text-lg max-w-3xl ${theme.textBody}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto items-center">
              <div className="md:col-span-7 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/40">
                {slide.image ? (
                  <img src={slide.image} alt={slide.title} className="w-full max-h-[380px] object-contain" />
                ) : (
                  <div className="p-16 text-center text-slate-400">
                    <Layers className="w-12 h-12 mx-auto mb-2 text-violet-400 opacity-60" />
                    <p className="text-sm">Uploaded visual artifact analyzed by Gemini</p>
                  </div>
                )}
                {slide.imageCaption && (
                  <p className="p-3 text-xs text-center text-slate-400 bg-black/40 border-t border-white/10">
                    {slide.imageCaption}
                  </p>
                )}
              </div>

              <div className="md:col-span-5 space-y-4">
                {(slide.bullets || [
                  'Extracted structure captures the essence of the source image.',
                  'Key themes translated into visual presentation components.',
                  'Color harmony applied across typographic highlights.'
                ]).map((b, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${theme.cardSurface} ${theme.cardSurfaceBorder}`}>
                    <p className={`text-sm md:text-base ${theme.textBody}`}>{b}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <span className={theme.textMuted}>Multimodal Analysis</span>
              <span className="font-mono">{slideNumber} / {totalSlides}</span>
            </div>
          </div>
        );

      case 'conclusion':
      default:
        return (
          <div className="flex flex-col justify-between h-full p-8 md:p-14 relative z-10">
            {/* Header */}
            <div>
              {slide.kicker && (
                <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${theme.badgeText}`}>
                  {slide.kicker}
                </p>
              )}
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${theme.textHeading}`}>
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className={`mt-2 text-base md:text-lg max-w-3xl ${theme.textBody}`}>
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Bullets & Call to Action */}
            <div className="my-auto max-w-3xl space-y-6">
              <div className="space-y-3">
                {(slide.bullets || [
                  'Every presentation is an opportunity to communicate with unforgettable clarity.',
                  'Upload photos of sketches, notes, or ideas anytime to generate fresh slides in seconds.',
                  'Edit any detail, toggle themes, or present fullscreen with zero friction.'
                ]).map((item, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-xl border ${theme.cardSurface} ${theme.cardSurfaceBorder}`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className={`text-base md:text-lg ${theme.textBody}`}>{item}</span>
                  </div>
                ))}
              </div>

              {slide.callToAction && (
                <div className={`p-6 rounded-2xl bg-gradient-to-r ${theme.accentPrimary} text-white shadow-2xl flex items-center justify-between`}>
                  <div>
                    <h4 className="text-xl font-extrabold">{slide.callToAction.text}</h4>
                    <p className="text-sm opacity-90">{slide.callToAction.highlight}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10 opacity-70">
              <span className={theme.textMuted}>Prism Deck Studio · Thank You</span>
              <span className="font-mono">{slideNumber} / {totalSlides}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative w-full aspect-[16/9] ${theme.background} rounded-2xl md:rounded-3xl overflow-hidden border ${theme.slideCardBorder} shadow-2xl transition-all duration-300 select-text`}
      style={{
        boxShadow: `0 25px 60px -15px ${theme.highlightGlow}`,
      }}
    >
      {/* Decorative ambient background mesh & gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-right radial glow */}
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-35"
          style={{ background: `radial-gradient(circle, ${theme.accentSecondary} 0%, transparent 70%)` }}
        />
        {/* Bottom-left radial glow */}
        <div 
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${theme.accentTertiary} 0%, transparent 70%)` }}
        />
        {/* Subtle geometric dot grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Main Slide Content */}
      {renderLayoutContent()}
    </div>
  );
};
