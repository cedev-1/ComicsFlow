# Web Comics Editor

A web-based WYSIWYG editor for creating and publishing webtoons and web comics. Build your comic with sections, image zones, speech bubbles, and export it as a standalone HTML file ready to host anywhere.

<img width="1860" height="896" alt="image" src="https://github.com/user-attachments/assets/2bfe492e-ebd3-4d92-9fd0-733ef5029ad9" />

## Features

- Section-based layout system with predefined templates (full page, split, grid, manga-style)
- Drag-and-drop image zones with comic-style effects (borders, shadows)
- Customizable speech bubbles (dialogue, thought, shout, whisper, narrator)
- Real-time preview with scroll-based animations (GSAP)
- Export to standalone HTML (responsive, includes animations)
- Export/Import projects as JSON
- Multilingual interface (English, French)

## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Export Options

### HTML Export
Generates a self-contained HTML file with:
- All images embedded as base64
- GSAP animations included via CDN
- Fully responsive layout
- Ready to deploy on any static hosting (GitHub Pages, Netlify, Vercel)

### JSON Export
Saves the complete project state for later editing.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- GSAP (ScrollTrigger)

## Project Structure

```
/
├── App.tsx                 # Main application
├── components/editor/      # Editor components
│   ├── WebtoonContinuousEditor.tsx
│   ├── WebtoonPreview.tsx
│   ├── DraggableImageZone.tsx
│   ├── DraggableBubble.tsx
│   ├── SectionSidebar.tsx
│   ├── BubbleSidebar.tsx
│   ├── MetadataModal.tsx
│   └── ExportModal.tsx
├── types/editor.ts         # TypeScript definitions
└── i18n/                   # Internationalization
```

## Todo

- [ ] Add Light theme
- [ ] Add Docker image
- [ ] Add more section templates
- [ ] Improve mobile editing experience
- [ ] Implement Cloud storage
