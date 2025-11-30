export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type BubbleType = 'speech' | 'thought' | 'shout' | 'whisper' | 'narrator';
export type TailPosition = 'left' | 'right' | 'bottom' | 'top' | 'none';

export interface BubbleStyle {
  type: BubbleType;
  tailPosition: TailPosition;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

export interface Bubble {
  id: string;
  position: Position;
  size: Size;
  text: string;
  style: BubbleStyle;
  sectionId?: string;
  animation?: {
    type: 'pop' | 'fade' | 'slide';
    delay: number;
    duration: number;
  };
}

export interface ImageZone {
  id: string;
  position: Position;
  size: Size;
  imageUrl: string | null;
  imageFit: 'cover' | 'contain' | 'fill' | 'none';
  borderRadius: number;
  rotation: number;
  zIndex: number;
  comicEffect: {
    enabled: boolean;
    borderWidth: number;
    borderColor: string;
    shadowOffset: number;
    shadowColor: string;
  };
}

export type PageLayoutType = 
  | 'full'
  | 'split-h'
  | 'split-v'
  | 'grid-2x2'
  | 'grid-3'
  | 'manga-3'
  | 'diagonal'
  | 'custom';

export interface PageLayout {
  type: PageLayoutType;
  zones: ImageZone[];
}

export interface ComicSection {
  id: string;
  order: number;
  layout: PageLayout;
  bubbles: Bubble[];
  backgroundColor: string;
  height: number;
}

export interface ComicPage {
  id: string;
  order: number;
  layout: PageLayout;
  bubbles: Bubble[];
  backgroundColor: string;
  height: number;
}

export interface Panel {
  id: string;
  imageUrl: string;
  imageName: string;
  bubbles: Bubble[];
  order: number;
}

export interface ComicProject {
  id: string;
  title: string;
  author: string;
  description?: string;
  sections: ComicSection[];
  backgroundColor: string;
  width: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebtoonProject {
  id: string;
  title: string;
  author: string;
  panels: Panel[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_BUBBLE_STYLE: BubbleStyle = {
  type: 'speech',
  tailPosition: 'left',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  borderColor: '#000000',
  borderWidth: 3,
  fontSize: 16,
  fontWeight: 'bold',
  fontStyle: 'normal',
};

export const createDefaultBubble = (id: string, position: Position, sectionId?: string): Bubble => ({
  id,
  position,
  size: { width: 200, height: 100 },
  text: 'Text...',
  style: { ...DEFAULT_BUBBLE_STYLE },
  sectionId,
});

export const DEFAULT_COMIC_EFFECT = {
  enabled: true,
  borderWidth: 4,
  borderColor: '#000000',
  shadowOffset: 8,
  shadowColor: '#333333',
};

export const createDefaultImageZone = (id: string, position: Position, size: Size): ImageZone => ({
  id,
  position,
  size,
  imageUrl: null,
  imageFit: 'cover',
  borderRadius: 0,
  rotation: 0,
  zIndex: 0,
  comicEffect: { ...DEFAULT_COMIC_EFFECT },
});

export const createDefaultPage = (id: string, order: number): ComicPage => ({
  id,
  order,
  layout: {
    type: 'full',
    zones: [createDefaultImageZone(`${id}-zone-1`, { x: 0, y: 0 }, { width: 100, height: 100 })],
  },
  bubbles: [],
  backgroundColor: '#ffffff',
  height: 800,
});

export const createDefaultSection = (id: string, order: number): ComicSection => ({
  id,
  order,
  layout: {
    type: 'full',
    zones: [createDefaultImageZone(`${id}-zone-1`, { x: 2, y: 2 }, { width: 96, height: 96 })],
  },
  bubbles: [],
  backgroundColor: '#ffffff',
  height: 400,
});

export const PAGE_LAYOUTS: Record<PageLayoutType, (pageId: string) => ImageZone[]> = {
  'full': (pageId) => [
    createDefaultImageZone(`${pageId}-zone-1`, { x: 0, y: 0 }, { width: 100, height: 100 }),
  ],
  'split-h': (pageId) => [
    createDefaultImageZone(`${pageId}-zone-1`, { x: 0, y: 0 }, { width: 100, height: 50 }),
    createDefaultImageZone(`${pageId}-zone-2`, { x: 0, y: 50 }, { width: 100, height: 50 }),
  ],
  'split-v': (pageId) => [
    createDefaultImageZone(`${pageId}-zone-1`, { x: 0, y: 0 }, { width: 50, height: 100 }),
    createDefaultImageZone(`${pageId}-zone-2`, { x: 50, y: 0 }, { width: 50, height: 100 }),
  ],
  'grid-2x2': (pageId) => [
    createDefaultImageZone(`${pageId}-zone-1`, { x: 0, y: 0 }, { width: 50, height: 50 }),
    createDefaultImageZone(`${pageId}-zone-2`, { x: 50, y: 0 }, { width: 50, height: 50 }),
    createDefaultImageZone(`${pageId}-zone-3`, { x: 0, y: 50 }, { width: 50, height: 50 }),
    createDefaultImageZone(`${pageId}-zone-4`, { x: 50, y: 50 }, { width: 50, height: 50 }),
  ],
  'grid-3': (pageId) => [
    createDefaultImageZone(`${pageId}-zone-1`, { x: 0, y: 0 }, { width: 60, height: 100 }),
    createDefaultImageZone(`${pageId}-zone-2`, { x: 60, y: 0 }, { width: 40, height: 50 }),
    createDefaultImageZone(`${pageId}-zone-3`, { x: 60, y: 50 }, { width: 40, height: 50 }),
  ],
  'manga-3': (pageId) => [
    createDefaultImageZone(`${pageId}-zone-1`, { x: 0, y: 0 }, { width: 100, height: 50 }),
    createDefaultImageZone(`${pageId}-zone-2`, { x: 0, y: 50 }, { width: 50, height: 50 }),
    createDefaultImageZone(`${pageId}-zone-3`, { x: 50, y: 50 }, { width: 50, height: 50 }),
  ],
  'diagonal': (pageId) => [
    createDefaultImageZone(`${pageId}-zone-1`, { x: 0, y: 0 }, { width: 65, height: 55 }),
    createDefaultImageZone(`${pageId}-zone-2`, { x: 35, y: 45 }, { width: 65, height: 55 }),
  ],
  'custom': (pageId) => [
    createDefaultImageZone(`${pageId}-zone-1`, { x: 10, y: 10 }, { width: 80, height: 80 }),
  ],
};
