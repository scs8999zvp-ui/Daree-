import { PresentationDeck } from '../types/presentation';

export const SHOWCASE_DECKS: PresentationDeck[] = [
  {
    id: 'deck-injaz-bahrain-ecotherm',
    title: 'EcoTherm Bahrain: Solution Canvas',
    subtitle: 'Transforming Industrial Textile Waste into Eco-Friendly Thermal Insulation Panels',
    category: 'INJAZ Bahrain · Team 1',
    author: 'Team 1 (Aljoory Alhadi & Team)',
    themeId: 'injaz_bahrain',
    createdAt: '2026-10-07',
    updatedAt: '2026-10-07',
    slides: [
      {
        id: 's-1',
        layout: 'title',
        kicker: 'INJAZ Bahrain · Solution Canvas · Team 1',
        title: 'EcoTherm Bahrain',
        subtitle: 'Transforming Factory Textile Waste into Sustainable Thermal Insulation Panels for Bahrain’s Hot Climate.',
        customBadge: 'Team 1 · 15 Innovators',
        bullets: [
          'Canvas Slogan: "Think beyond ideas, design solutions that matter"',
          'The Dual Challenge: Industrial cotton & polyester waste in landfills + extreme heat transfer driving up cooling bills in Bahrain',
          'Team 1: Aljoory Alhadi, Haya Alsaadoon, Fajer Shabbir, Jood Haji, Almezayan, Asma, Muneera, Noor, Sharifa, Nayla, Nadia, Dana, Raafa, Moza, Maria',
        ],
        speakerNotes: 'Welcome judges and mentors! We are Team 1. Bahrain faces severe summer heat that drives up cooling bills, alongside tons of discarded factory textile scraps. EcoTherm Bahrain upcycles this industrial waste into high-performance, eco-friendly thermal insulation panels.',
      },
      {
        id: 's-2',
        layout: 'cards_3col',
        kicker: 'Core Innovation & Execution',
        title: 'The Solution, Workflow & SMART Targets',
        subtitle: 'A circular manufacturing model validated through rigorous laboratory heat-transfer testing.',
        cards: [
          {
            title: 'Our Solution',
            subtitle: 'Circular Upcycling',
            content: 'Collect cotton and polyester fabric scraps from factories in Bahrain and transform them into eco-friendly building insulation panels that drastically reduce heat transfer.',
            badge: 'Innovation',
          },
          {
            title: '7-Step Workflow',
            subtitle: 'Delivery Process',
            content: 'Collect ➔ Sort ➔ Clean ➔ Process ➔ Make Panels ➔ Lab Test ➔ Commercial Sales. Starting with a lean pilot ensures safety, quality, and low initial costs.',
            badge: 'Operations',
          },
          {
            title: 'SMART Target',
            subtitle: 'Validation KPIs',
            content: 'Collect at least 100 kg of textile waste to produce 50 prototype insulation panels, then verify their thermal performance and safety through laboratory testing.',
            badge: '100kg / 50 Panels',
          },
        ],
        speakerNotes: 'Slide 2 details our innovation and operations: We collect scraps, clean and shred the fibers, and compress them into insulation panels. Our SMART goal is to collect 100+ kg of textile waste to produce 50 prototype panels and test thermal conductivity in an accredited lab.',
      },
      {
        id: 's-3',
        layout: 'conclusion',
        kicker: 'Market, Revenue & Sustainability',
        title: 'Target Market, Monetization & Long-Term Impact',
        subtitle: 'Generating revenue while boosting the Bahraini economy through local jobs and reduced import reliance.',
        bullets: [
          'Target Market: Construction companies, building owners, schools, offices, warehouses, and factories seeking lower air conditioning bills.',
          'Economic Impact: Creates local green jobs and reduces Bahrain’s reliance on costly imported synthetic insulation materials.',
          'Revenue Model: Direct sales of standard panels, volume bulk order discounts, and custom-cut architectural sizing.',
          'Long-Term Sustainability: Factory supply partnerships, low-cost recycled raw materials, and expanding into acoustic ceiling tiles and industrial insulation.',
        ],
        callToAction: {
          text: 'EcoTherm Bahrain · Team 1',
          highlight: 'Building a cooler, greener, and more sustainable Kingdom of Bahrain.',
        },
        speakerNotes: 'Who benefits? Contractors, schools, and the Bahraini economy through local job creation and reduced reliance on imported insulation. We monetize through direct and bulk panel sales, and sustain growth through long-term factory supply agreements. Thank you!',
      },
    ],
  },
  {
    id: 'deck-showcase-tech',
    title: 'The Next Era of Intelligent Design',
    subtitle: 'From Multimodal Vision to Autonomous Spatial Experiences',
    category: 'Technology & Design',
    author: 'Studio Vision Team',
    themeId: 'neo_prism',
    createdAt: '2026-10-07',
    updatedAt: '2026-10-07',
    slides: [
      {
        id: 'st-1',
        layout: 'title',
        kicker: 'Executive Keynote',
        title: 'The Next Era of Intelligent Design',
        subtitle: 'Bridging synthetic creativity, real-time spatial cognition, and human intuition into one unified canvas.',
        customBadge: 'Master Deck',
        bullets: [
          'Design thinking augmented by multimodal intelligence',
          'Accelerating from conceptual sketch to interactive prototype in seconds',
          'Crafted for high-impact presentations and executive storytelling',
        ],
        speakerNotes: 'Welcome everyone! Today we present how creative intuition and cutting-edge vision technology merge.',
      },
    ],
  },
];
