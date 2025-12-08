import React, { useState } from 'react';
import { ComicProject, ComicSection, Bubble } from '../../types/editor';
import { useI18n } from '../../i18n';

interface ExportModalProps {
  project: ComicProject;
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'html' | 'json';

const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { t } = useI18n();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('html');

  if (!isOpen) return null;

  const generateBubbleHTML = (bubble: Bubble, sectionHeight: number): string => {
    const { position, size, text, style } = bubble;
    
    const leftPercent = (position.x / project.width) * 100;
    const topPercent = (position.y / sectionHeight) * 100;
    const widthPercent = (size.width / project.width) * 100;
    const heightPercent = (size.height / sectionHeight) * 100;
    
    const fontSizeVw = (style.fontSize / project.width) * 100;
    
    const getBubbleClasses = (): string => {
      switch (style.type) {
        case 'thought': return 'border-radius: 50%;';
        case 'whisper': return 'border-style: dashed;';
        case 'narrator': return 'border-radius: 0;';
        case 'shout': return 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);';
        default: return 'border-radius: 16px;';
      }
    };

    const getTailHTML = (): string => {
      if (style.tailPosition === 'none' || style.type === 'shout') return '';
      
      let tailStyle = '';
      
      switch (style.tailPosition) {
        case 'left':
          tailStyle = `left: -15px; top: 50%; transform: translateY(-50%); border-width: 15px 15px 15px 0; border-color: transparent ${style.borderColor} transparent transparent;`;
          break;
        case 'right':
          tailStyle = `right: -15px; top: 50%; transform: translateY(-50%); border-width: 15px 0 15px 15px; border-color: transparent transparent transparent ${style.borderColor};`;
          break;
        case 'top':
          tailStyle = `top: -15px; left: 50%; transform: translateX(-50%); border-width: 0 15px 15px 15px; border-color: transparent transparent ${style.borderColor} transparent;`;
          break;
        case 'bottom':
          tailStyle = `bottom: -15px; left: 50%; transform: translateX(-50%); border-width: 15px 15px 0 15px; border-color: ${style.borderColor} transparent transparent transparent;`;
          break;
      }
      
      return `<div class="bubble-tail" style="position: absolute; width: 0; height: 0; border-style: solid; ${tailStyle}"></div>`;
    };

    return `
      <div class="bubble" data-font-size="${style.fontSize}" style="
        position: absolute;
        left: ${leftPercent}%;
        top: ${topPercent}%;
        width: ${widthPercent}%;
        height: ${heightPercent}%;
        background-color: ${style.backgroundColor};
        border: ${style.borderWidth}px ${style.type === 'whisper' ? 'dashed' : 'solid'} ${style.borderColor};
        padding: clamp(4px, 2vw, 12px);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
        z-index: 100;
        ${getBubbleClasses()}
      ">
        <span style="
          color: ${style.textColor};
          font-size: clamp(10px, ${fontSizeVw}vw, ${style.fontSize}px);
          font-weight: ${style.fontWeight};
          font-style: ${style.fontStyle};
          text-align: center;
          word-break: break-word;
          line-height: 1.2;
        ">${text}</span>
        ${getTailHTML()}
      </div>
    `;
  };

  const generateZoneHTML = (zone: any): string => {

    const shadowHTML = zone.comicEffect?.enabled ? `
      <div class="zone-shadow" style="
        position: absolute;
        top: clamp(2px, 1vw, ${zone.comicEffect.shadowOffset}px);
        left: clamp(2px, 1vw, ${zone.comicEffect.shadowOffset}px);
        right: calc(-1 * clamp(2px, 1vw, ${zone.comicEffect.shadowOffset}px));
        bottom: calc(-1 * clamp(2px, 1vw, ${zone.comicEffect.shadowOffset}px));
        background-color: ${zone.comicEffect.shadowColor};
        border-radius: ${zone.borderRadius}px;
        z-index: -1;
      "></div>
    ` : '';

    const imageHTML = zone.imageUrl 
      ? `<img src="${zone.imageUrl}" alt="" style="width: 100%; height: 100%; object-fit: ${zone.imageFit};" />`
      : `<div style="width: 100%; height: 100%; background: #e5e5e5; display: flex; align-items: center; justify-content: center; color: #999; font-size: clamp(10px, 3vw, 16px);">Image</div>`;

    return `
      <div class="zone" style="
        position: absolute;
        left: ${zone.position.x}%;
        top: ${zone.position.y}%;
        width: ${zone.size.width}%;
        height: ${zone.size.height}%;
        transform: rotate(${zone.rotation}deg);
        z-index: ${zone.zIndex};
      ">
        ${shadowHTML}
        <div style="
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: ${zone.borderRadius}px;
          ${zone.comicEffect?.enabled ? `border: clamp(1px, 0.5vw, ${zone.comicEffect.borderWidth}px) solid ${zone.comicEffect.borderColor};` : ''}
        ">
          ${imageHTML}
        </div>
      </div>
    `;
  };

  const generateSectionHTML = (section: ComicSection, offsetPercent: number, totalHeight: number): string => {
    const zonesHTML = section.layout.zones.map(zone => generateZoneHTML(zone)).join('\n');
    const bubblesHTML = section.bubbles.map(bubble => generateBubbleHTML(bubble, section.height)).join('\n');
    const heightPercent = (section.height / totalHeight) * 100;

    return `
      <div class="section" data-height="${section.height}" style="
        position: relative;
        width: 100%;
        background-color: ${section.backgroundColor};
      ">
        <div class="section-content" style="
          position: relative;
          width: 100%;
          padding-bottom: ${(section.height / project.width) * 100}%;
        ">
          <div style="position: absolute; inset: 0;">
            ${zonesHTML}
            ${bubblesHTML}
          </div>
        </div>
      </div>
    `;
  };

  const generateFullHTML = (): string => {
    const sortedSections = [...project.sections].sort((a, b) => a.order - b.order);
    const totalHeight = sortedSections.reduce((acc, s) => acc + s.height, 0);
    
    let currentOffset = 0;
    const sectionsHTML = sortedSections.map(section => {
      const html = generateSectionHTML(section, currentOffset, totalHeight);
      currentOffset += section.height;
      return html;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title} - ${project.author}</title>
  <meta name="author" content="${project.author}">
  ${project.description ? `<meta name="description" content="${project.description}">` : ''}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      font-size: 16px;
    }
    
    body {
      font-family: 'Comic Neue', 'Bangers', cursive, sans-serif;
      background-color: #171717;
      min-height: 100vh;
      line-height: 1.4;
    }
    
    .comic-header {
      position: sticky;
      top: 0;
      background: rgba(10, 10, 10, 0.95);
      backdrop-filter: blur(8px);
      z-index: 1000;
      border-bottom: 1px solid #333;
      padding: clamp(8px, 2vw, 16px);
    }
    
    .comic-header-content {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    
    .comic-title {
      font-size: clamp(1rem, 4vw, 1.5rem);
      font-weight: bold;
      color: white;
    }
    
    .comic-author {
      font-size: clamp(0.65rem, 2vw, 0.875rem);
      color: #666;
    }
    
    .comic-container {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      padding: clamp(8px, 2vw, 16px);
    }
    
    .comic-content {
      position: relative;
      width: 100%;
      max-width: ${project.width}px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border-left: clamp(2px, 0.5vw, 4px) solid black;
      border-right: clamp(2px, 0.5vw, 4px) solid black;
      overflow: hidden;
    }
    
    .section {
      width: 100%;
    }
    
    .section-content {
      position: relative;
      width: 100%;
    }
    
    .bubble {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }
    
    .zone {
      opacity: 0;
      transform: translateY(30px);
    }
    
    .comic-footer {
      padding: clamp(32px, 8vw, 64px) 16px;
      text-align: center;
      border-top: 1px solid #333;
      background: #0a0a0a;
    }
    
    .comic-footer h2 {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      color: white;
      margin-bottom: 16px;
    }
    
    .back-to-top {
      padding: clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px);
      background: white;
      color: black;
      font-weight: bold;
      font-size: clamp(0.875rem, 2vw, 1rem);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .back-to-top:hover {
      background: #e5e5e5;
    }
    
    .scroll-indicator {
      position: fixed;
      bottom: clamp(8px, 2vw, 16px);
      right: clamp(8px, 2vw, 16px);
      background: rgba(0,0,0,0.7);
      color: white;
      font-size: clamp(10px, 2vw, 12px);
      padding: clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px);
      border-radius: 20px;
      z-index: 100;
    }
    
    /* Responsive adjustments */
    @media (max-width: 480px) {
      .bubble {
        box-shadow: 2px 2px 0px rgba(0,0,0,0.3) !important;
      }
      
      .bubble-tail {
        transform: scale(0.7) !important;
      }
    }
    
    /* Print styles */
    @media print {
      .comic-header,
      .scroll-indicator,
      .comic-footer {
        display: none;
      }
      
      body {
        background: white;
      }
      
      .comic-content {
        border: none;
        box-shadow: none;
      }
      
      .bubble, .zone {
        opacity: 1 !important;
        transform: none !important;
      }
    }
  </style>
</head>
<body>
  <header class="comic-header">
    <div class="comic-header-content">
      <div>
        <h1 class="comic-title">📖 ${project.title}</h1>
        <p class="comic-author">par ${project.author}</p>
      </div>
    </div>
  </header>

  <main class="comic-container">
    <div class="comic-content" style="background-color: ${project.backgroundColor};">
      ${sectionsHTML}
    </div>
  </main>

  <footer class="comic-footer">
    <h2>Fin</h2>
    <button class="back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
      ↑ Relire
    </button>
  </footer>

  <div class="scroll-indicator">↓ ${t.scrollToRead}</div>
  <script>
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.utils.toArray('.zone').forEach((zone, i) => {
      gsap.to(zone, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: zone,
          start: 'top 90%',
          end: 'top 60%',
          toggleActions: 'play none none none',
        }
      });
    });
    
    gsap.utils.toArray('.bubble').forEach((bubble, i) => {
      gsap.to(bubble, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: bubble,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      });
    });
    
    setTimeout(() => {
      document.querySelector('.scroll-indicator').style.opacity = '0';
      document.querySelector('.scroll-indicator').style.transition = 'opacity 0.5s';
    }, 5000);
  </script>
</body>
</html>`;
  };

  const handleExportHTML = async () => {
    setIsExporting(true);
    try {
      const html = generateFullHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    }
    setIsExporting(false);
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const json = JSON.stringify(project, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    }
    setIsExporting(false);
  };

  const handleExport = () => {
    if (exportFormat === 'html') {
      handleExportHTML();
    } else {
      handleExportJSON();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-neutral-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {t.export}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-neutral-400 text-sm">
            {t.chooseExportFormat} "{project.title}"
          </p>

          {/* Format selection */}
          <div className="space-y-3">
            <label 
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                exportFormat === 'html' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-neutral-700 hover:border-neutral-600'
              }`}
              onClick={() => setExportFormat('html')}
            >
              <input 
                type="radio" 
                name="format" 
                checked={exportFormat === 'html'}
                onChange={() => setExportFormat('html')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="font-medium text-white">{t.websiteHtml}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {t.htmlDescription}
                </p>
              </div>
            </label>

            <label 
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                exportFormat === 'json' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-neutral-700 hover:border-neutral-600'
              }`}
              onClick={() => setExportFormat('json')}
            >
              <input 
                type="radio" 
                name="format" 
                checked={exportFormat === 'json'}
                onChange={() => setExportFormat('json')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span className="font-medium text-white">{t.projectJson}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {t.jsonDescription}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t.exporting}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {t.exportButton}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
