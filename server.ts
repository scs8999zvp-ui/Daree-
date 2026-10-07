import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Allow large payloads for base64 image uploads
app.use(express.json({ limit: '35mb' }));

// Helper to get GoogleGenAI client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found in process.env. Fallbacks will be used if generation fails.');
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
}

// System prompt to format presentation slides
const PRESENTATION_SYSTEM_PROMPT = `You are a world-class creative presentation designer and executive speechwriter.
Your task is to take an image (notes, sketches, slides, photos, whiteboards, diagrams, or documents) and/or a text prompt,
and generate an exceptional, visually cohesive, highly engaging multi-slide presentation deck.

Return ONLY a JSON object that adheres strictly to this format:
{
  "title": "Compelling Deck Title",
  "subtitle": "Clear, engaging subtitle",
  "recommendedTheme": "neo_prism" | "sunset_editorial" | "nordic_forest" | "oceanic_sapphire" | "obsidian_minimal" | "candy_pop",
  "category": "Technology | Business | Strategy | Creative | Education",
  "slides": [
    {
      "id": "slide-1",
      "layout": "title",
      "kicker": "Category or topic header",
      "title": "Bold Headline",
      "subtitle": "Context or thesis statement",
      "bullets": ["Point 1", "Point 2"],
      "speakerNotes": "Opening remarks and speaking points."
    },
    {
      "id": "slide-2",
      "layout": "stats_grid",
      "kicker": "Key Metrics",
      "title": "Performance & Impact",
      "subtitle": "Quantified results",
      "stats": [
        { "label": "Growth Rate", "value": "+148%", "detail": "Year-over-year surge", "trend": "up" },
        { "label": "Active Users", "value": "2.4M", "detail": "Global audience reach", "trend": "up" },
        { "label": "Retention", "value": "94.2%", "detail": "Industry-leading loyalty", "trend": "stable" }
      ],
      "speakerNotes": "Highlight these 3 statistics to build credibility."
    },
    {
      "id": "slide-3",
      "layout": "cards_3col",
      "kicker": "Core Pillars",
      "title": "Strategic Focus Areas",
      "subtitle": "How we achieve this vision",
      "cards": [
        { "title": "Pillar 1", "subtitle": "Foundation", "content": "Clear actionable description.", "badge": "Phase 1" },
        { "title": "Pillar 2", "subtitle": "Acceleration", "content": "Clear actionable description.", "badge": "Phase 2" },
        { "title": "Pillar 3", "subtitle": "Scale", "content": "Clear actionable description.", "badge": "Phase 3" }
      ],
      "speakerNotes": "Walk through each pillar sequentially."
    },
    {
      "id": "slide-4",
      "layout": "timeline",
      "kicker": "Execution Roadmap",
      "title": "Path to Milestones",
      "subtitle": "Chronological rollout",
      "timeline": [
        { "phase": "Q1 2026", "title": "Discovery & Alpha", "description": "Core foundation buildout" },
        { "phase": "Q2 2026", "title": "Ecosystem Beta", "description": "Public rollout and iteration" },
        { "phase": "Q3-Q4", "title": "Global Expansion", "description": "Scale and monetization" }
      ],
      "speakerNotes": "Emphasize realistic timelines and deliverables."
    },
    {
      "id": "slide-5",
      "layout": "conclusion",
      "kicker": "Next Horizon",
      "title": "Driving the Future Forward",
      "subtitle": "Key takeaways and next steps",
      "bullets": [
        "Immediate action item 1",
        "Strategic priority 2",
        "Expected milestone in next 90 days"
      ],
      "callToAction": {
        "text": "Join the Movement",
        "highlight": "Let's shape what's next together"
      },
      "speakerNotes": "Strong call to action and closing expression of gratitude."
    }
  ]
}

Available layouts:
- "title": Opening title slide
- "content_split": 2-column split with lead summary & bullet points
- "stats_grid": 3 or 4 metric cards with numbers
- "cards_3col": 3 feature/pillar cards
- "timeline": Sequential roadmap / progression
- "quote_impact": Memorable quote or bold vision statement
- "comparison": Two side-by-side comparative columns
- "conclusion": Wrap up, takeaways, call to action

Always produce vibrant, informative, highly articulate slide copy. Do not use generic placeholders.
Return VALID JSON ONLY.`;

app.post('/api/generate-deck', async (req, res) => {
  try {
    const { imageBase64, mimeType, prompt, slideCount = 6, themeStyle, targetAudience } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // If no key is configured, return a rich mock deck based on the prompt/image context
      console.log('No GEMINI_API_KEY found, generating curated thematic deck');
      const fallbackDeck = generateFallbackDeck(prompt || 'Visual Presentation Analysis', slideCount, themeStyle);
      return res.json({ success: true, deck: fallbackDeck, generatedBy: 'fallback' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      throw new Error('Gemini client could not be initialized');
    }

    const contents: any[] = [];

    // If an image was uploaded, include it as inlineData
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: cleanBase64,
        },
      });
    }

    let userPromptText = `Please generate a beautiful ${slideCount}-slide presentation deck.`;
    if (prompt) {
      userPromptText += ` The user specifies this request/context: "${prompt}".`;
    }
    if (targetAudience) {
      userPromptText += ` Target audience: ${targetAudience}.`;
    }
    if (themeStyle) {
      userPromptText += ` Suggested visual theme preference: ${themeStyle}.`;
    }
    if (imageBase64) {
      userPromptText += ` Carefully inspect the provided picture/notes/diagram. Extract all key concepts, topics, data points, visual structure, diagrams, or sketch details and translate them into a high-end presentation deck that fulfills the user's vision.`;
    }

    contents.push({ text: userPromptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: {
        systemInstruction: PRESENTATION_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      // Try extracting json inside code blocks if any
      const match = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        parsedData = JSON.parse(match[1]);
      } else {
        throw new Error('Failed to parse Gemini output as JSON: ' + responseText.slice(0, 200));
      }
    }

    // Ensure slides have proper ids and defaults
    if (!parsedData.slides || !Array.isArray(parsedData.slides)) {
      parsedData.slides = [];
    }

    parsedData.slides = parsedData.slides.map((slide: any, index: number) => ({
      ...slide,
      id: slide.id || `slide-${index + 1}`,
      layout: slide.layout || (index === 0 ? 'title' : index === parsedData.slides.length - 1 ? 'conclusion' : 'content_split'),
    }));

    return res.json({ success: true, deck: parsedData, generatedBy: 'gemini' });
  } catch (error: any) {
    console.error('Error generating deck:', error);
    // Graceful fallback to guarantee the user's flow is never blocked
    const fallbackDeck = generateFallbackDeck(req.body.prompt || 'Creative Presentation', req.body.slideCount || 6, req.body.themeStyle);
    return res.json({
      success: true,
      deck: fallbackDeck,
      generatedBy: 'fallback',
      warning: error.message || 'Used fallback generation engine',
    });
  }
});

// Endpoint to enhance or refine a single slide
app.post('/api/enhance-slide', async (req, res) => {
  try {
    const { slide, instruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        success: true,
        slide: {
          ...slide,
          speakerNotes: slide.speakerNotes ? slide.speakerNotes + ' (Polished for delivery)' : 'Clear and concise talking points for the presenter.',
        },
      });
    }

    const ai = getGeminiClient();
    if (!ai) throw new Error('AI not initialized');

    const promptText = `Given this current slide JSON:
${JSON.stringify(slide, null, 2)}

User request for this slide: "${instruction || 'Make the bullet points punchier and generate speaker notes'}"

Return ONLY updated JSON for this single slide with the same schema keys (id, layout, title, subtitle, kicker, bullets, stats, cards, timeline, speakerNotes).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, slide: { ...slide, ...parsed } });
  } catch (err: any) {
    console.error('Error enhancing slide:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback deck generator when offline or if key quota hit
function generateFallbackDeck(topic: string, count: number, theme?: string) {
  const safeTopic = topic && topic.trim() ? topic : 'Vision & Innovation Strategy';
  return {
    title: safeTopic,
    subtitle: 'Strategic Roadmap, Key Insights, and High-Impact Solutions',
    recommendedTheme: theme || 'neo_prism',
    category: 'Strategy & Innovation',
    slides: [
      {
        id: 'slide-1',
        layout: 'title',
        kicker: 'Keynote Presentation',
        title: safeTopic,
        subtitle: 'Transforming complex challenges into structured, high-value opportunities.',
        speakerNotes: 'Welcome everyone. Today we are exploring our overarching vision and concrete actions for execution.',
      },
      {
        id: 'slide-2',
        layout: 'stats_grid',
        kicker: 'Market Metrics',
        title: 'Measurable Velocity & Scale',
        subtitle: 'Key performance benchmarks illustrating substantial growth potential.',
        stats: [
          { label: 'Efficiency Gain', value: '3.8x', detail: 'Accelerated execution cycle', trend: 'up' },
          { label: 'Adoption Surge', value: '+215%', detail: 'Broadening user engagement', trend: 'up' },
          { label: 'Target Milestone', value: '$12M+', detail: 'Projected value generation', trend: 'stable' },
        ],
        speakerNotes: 'Walk through these three core indices. Point to the 3.8x velocity metric as the primary catalyst.',
      },
      {
        id: 'slide-3',
        layout: 'content_split',
        kicker: 'Core Insight',
        title: 'The Paradigm Shift',
        subtitle: 'Why traditional approaches fall short and modern frameworks win.',
        bullets: [
          'Unified workflows eliminate friction across fragmented stakeholder touchpoints.',
          'Autonomous intelligence shifts teams from manual maintenance to high-leverage innovation.',
          'Adaptive architecture ensures sustainability as scale accelerates.',
        ],
        speakerNotes: 'Highlight the contrast between legacy limitations and our agile, modern approach.',
      },
      {
        id: 'slide-4',
        layout: 'cards_3col',
        kicker: 'Strategic Pillars',
        title: 'Architecture for Success',
        subtitle: 'Three interconnected engines powering the implementation.',
        cards: [
          { title: 'Intelligent Core', subtitle: 'Foundation', content: 'Modern, resilient system logic with contextual data awareness.', badge: 'Core' },
          { title: 'Intuitive Experience', subtitle: 'Frontend', content: 'Seamless, frictionless user interfaces built for maximum clarity.', badge: 'Experience' },
          { title: 'Scalable Growth', subtitle: 'Expansion', content: 'Sustainable operational velocity with measurable feedback loops.', badge: 'Scale' },
        ],
        speakerNotes: 'Briefly explain each pillar and show how they reinforce each other.',
      },
      {
        id: 'slide-5',
        layout: 'timeline',
        kicker: 'Execution Plan',
        title: 'Delivery Milestones & Horizon',
        subtitle: 'Phase-by-phase rollout with distinct accountability checkpoints.',
        timeline: [
          { phase: 'Phase 1', title: 'Discovery & Prototyping', description: 'Validate core assumptions and establish baseline metrics' },
          { phase: 'Phase 2', title: 'Core Deployment', description: 'Launch flagship capabilities and onboard early champions' },
          { phase: 'Phase 3', title: 'Global Scale', description: 'Maximize distribution, iterate on analytics, and expand reach' },
        ],
        speakerNotes: 'Reassure stakeholders that each phase has defined success gates.',
      },
      {
        id: 'slide-6',
        layout: 'conclusion',
        kicker: 'Action & Next Steps',
        title: 'Bringing the Vision to Life',
        subtitle: 'Summary of critical takeaways and immediate sprint goals.',
        bullets: [
          'Finalize stakeholder alignment and core resource allocation.',
          'Initiate sprint 1 deliverables with weekly progress reviews.',
          'Establish open feedback channels for agile adjustments.',
        ],
        callToAction: {
          text: 'Get Started Today',
          highlight: 'The future begins with bold, deliberate execution.',
        },
        speakerNotes: 'Conclude with optimism and open the floor for questions and discussion.',
      },
    ].slice(0, Math.max(3, Math.min(count, 8))),
  };
}

// Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Prism Deck Studio server running at http://localhost:${port}`);
  });
}

startServer();
