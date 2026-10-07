export type SlideLayout = 
  | 'title'
  | 'team'
  | 'content_split'
  | 'stats_grid'
  | 'cards_3col'
  | 'timeline'
  | 'quote_impact'
  | 'comparison'
  | 'conclusion'
  | 'image_focus';

export interface StatItem {
  label: string;
  value: string;
  detail?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface CardItem {
  title: string;
  subtitle?: string;
  content: string;
  icon?: string;
  badge?: string;
  color?: string;
}

export interface TimelineItem {
  phase: string;
  title: string;
  description: string;
  tag?: string;
}

export interface QuoteItem {
  text: string;
  author: string;
  role?: string;
}

export interface ComparisonItem {
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}

export interface CallToAction {
  text: string;
  highlight: string;
}

export interface Slide {
  id: string;
  layout: SlideLayout;
  kicker?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  stats?: StatItem[];
  cards?: CardItem[];
  timeline?: TimelineItem[];
  quote?: QuoteItem;
  comparison?: ComparisonItem;
  callToAction?: CallToAction;
  image?: string;
  imageCaption?: string;
  speakerNotes?: string;
  customBadge?: string;
  accentOverride?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  category: 'dark' | 'light' | 'vibrant';
  previewGradient: string;
  background: string;
  slideCardBg: string;
  slideCardBorder: string;
  textHeading: string;
  textBody: string;
  textMuted: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  badgeBg: string;
  badgeText: string;
  cardSurface: string;
  cardSurfaceBorder: string;
  highlightGlow: string;
  fontFamily: string;
}

export interface PresentationDeck {
  id: string;
  title: string;
  subtitle: string;
  category?: string;
  author?: string;
  themeId: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}
