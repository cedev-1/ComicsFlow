import React, { useEffect, useRef, useState } from 'react';
import { ComicProject, Bubble, BubbleType, TailPosition, ComicSection, ImageZone } from '../../types/editor';
import { useI18n } from '../../i18n';

interface WebtoonPreviewProps {
  project: ComicProject;
  onBack: () => void;
}

const AnimatedBubble: React.FC<{ bubble: Bubble; index: number; scroller: HTMLElement | null }> = ({ bubble, index, scroller }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const { position, size, text, style } = bubble;

  useEffect(() => {
    if (!bubbleRef.current || !window.gsap || !window.ScrollTrigger || !scroller) return;

    const element = bubbleRef.current;
    
    window.gsap.set(element, {
      opacity: 0,
      scale: 0.8,
      y: 30,
    });

    window.gsap.to(element, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: element,
        scroller: scroller,
        start: 'top 85%',
        end: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      window.ScrollTrigger?.getAll().forEach(t => {
        if (t.vars.trigger === element) t.kill();
      });
    };
  }, [scroller]);

  const getBubbleClasses = (type: BubbleType): string => {
    switch (type) {
      case 'thought':
        return 'rounded-[50%]';
      case 'shout':
        return '';
      case 'whisper':
        return 'border-dashed';
      case 'narrator':
        return 'rounded-none';
      default:
        return 'rounded-2xl';
    }
  };

  const getTailStyle = (tailPosition: TailPosition): React.CSSProperties => {
    if (tailPosition === 'none') return {};
    
    const tailSize = 15;
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };

    switch (tailPosition) {
      case 'left':
        return {
          ...base,
          left: -tailSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${tailSize}px ${tailSize}px ${tailSize}px 0`,
          borderColor: `transparent ${style.borderColor} transparent transparent`,
        };
      case 'right':
        return {
          ...base,
          right: -tailSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${tailSize}px 0 ${tailSize}px ${tailSize}px`,
          borderColor: `transparent transparent transparent ${style.borderColor}`,
        };
      case 'top':
        return {
          ...base,
          top: -tailSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${tailSize}px ${tailSize}px ${tailSize}px`,
          borderColor: `transparent transparent ${style.borderColor} transparent`,
        };
      case 'bottom':
        return {
          ...base,
          bottom: -tailSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${tailSize}px ${tailSize}px 0 ${tailSize}px`,
          borderColor: `${style.borderColor} transparent transparent transparent`,
        };
      default:
        return {};
    }
  };

  const getShoutStyle = (): React.CSSProperties => {
    if (style.type !== 'shout') return {};
    return {
      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    };
  };

  return (
    <div
      ref={bubbleRef}
      className={`absolute ${getBubbleClasses(style.type)}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: style.backgroundColor,
        border: `${style.borderWidth}px ${style.type === 'whisper' ? 'dashed' : 'solid'} ${style.borderColor}`,
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
        zIndex: 100,
        ...getShoutStyle(),
      }}
    >
      <span
        style={{
          color: style.textColor,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          textAlign: 'center',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </span>
      {style.tailPosition !== 'none' && style.type !== 'shout' && (
        <div style={getTailStyle(style.tailPosition)} />
      )}
    </div>
  );
};

const AnimatedImageZone: React.FC<{ zone: ImageZone; index: number; scroller: HTMLElement | null }> = ({ zone, index, scroller }) => {
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!zoneRef.current || !window.gsap || !window.ScrollTrigger || !scroller) return;

    const element = zoneRef.current;
    
    window.gsap.set(element, {
      opacity: 0,
      y: 50,
    });

    window.gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        scroller: scroller,
        start: 'top 90%',
        end: 'top 60%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      window.ScrollTrigger?.getAll().forEach(t => {
        if (t.vars.trigger === element) t.kill();
      });
    };
  }, [scroller]);

  return (
    <div
      ref={zoneRef}
      className="absolute"
      style={{
        left: `${zone.position.x}%`,
        top: `${zone.position.y}%`,
        width: `${zone.size.width}%`,
        height: `${zone.size.height}%`,
        transform: `rotate(${zone.rotation}deg)`,
        zIndex: zone.zIndex,
      }}
    >
      {/* Shadow effect */}
      {zone.comicEffect?.enabled && (
        <div
          className="absolute"
          style={{
            top: zone.comicEffect.shadowOffset,
            left: zone.comicEffect.shadowOffset,
            right: -zone.comicEffect.shadowOffset,
            bottom: -zone.comicEffect.shadowOffset,
            backgroundColor: zone.comicEffect.shadowColor,
            borderRadius: zone.borderRadius,
          }}
        />
      )}
      
      {/* Main container */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: zone.borderRadius,
          border: zone.comicEffect?.enabled
            ? `${zone.comicEffect.borderWidth}px solid ${zone.comicEffect.borderColor}`
            : undefined,
          backgroundColor: '#f5f5f5',
        }}
      >
        {zone.imageUrl ? (
          <img
            src={zone.imageUrl}
            alt=""
            className="w-full h-full"
            style={{ objectFit: zone.imageFit }}
          />
        ) : (
          <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
            <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

const WebtoonPreview: React.FC<WebtoonPreviewProps> = ({ project, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollerReady, setScrollerReady] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (containerRef.current) {
      setScrollerReady(true);
      
      containerRef.current.scrollTo(0, 0);
      
      if (window.ScrollTrigger) {
        setTimeout(() => {
          window.ScrollTrigger.refresh();
        }, 200);
      }
    }

    return () => {
      window.ScrollTrigger?.getAll().forEach(t => t.kill());
    };
  }, []);

  const scroller = containerRef.current;
  
  const sortedSections = [...(project.sections || [])].sort((a, b) => a.order - b.order);
  
  const totalHeight = sortedSections.reduce((acc, section) => acc + section.height, 0);
  
  const getSectionOffset = (sectionIndex: number): number => {
    return sortedSections.slice(0, sectionIndex).reduce((acc, s) => acc + s.height, 0);
  };

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto bg-neutral-900"
    >
      {/* Header fixe */}
      <header className="sticky top-0 bg-neutral-950/90 backdrop-blur-sm z-50 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">{project.title}</h1>
            <p className="text-xs text-neutral-500">{t.by} {project.author}</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded transition-colors"
          >
            ← {t.back}
          </button>
        </div>
      </header>

      {/* Contenu principal - Scroll continu avec sections */}
      <main className="pt-4 pb-32">
        <div className="max-w-4xl mx-auto px-4">
          <div
            className="relative mx-auto bg-white shadow-2xl border-x-4 border-black"
            style={{
              width: '100%',
              maxWidth: project.width || 800,
              minHeight: totalHeight || 800,
              backgroundColor: project.backgroundColor,
            }}
          >
            {/* Rendu des sections */}
            {scrollerReady && sortedSections.map((section, sectionIndex) => {
              const sectionOffset = getSectionOffset(sectionIndex);
              
              return (
                <div
                  key={section.id}
                  className="absolute left-0 right-0"
                  style={{
                    top: sectionOffset,
                    height: section.height,
                    backgroundColor: section.backgroundColor,
                  }}
                >
                  {/* Zones d'images de la section */}
                  {section.layout.zones.map((zone, index) => (
                    <AnimatedImageZone key={zone.id} zone={zone} index={index} scroller={scroller} />
                  ))}
                  
                  {/* Bulles de la section */}
                  {section.bubbles.map((bubble, index) => (
                    <AnimatedBubble key={bubble.id} bubble={bubble} index={index} scroller={scroller} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer - Fin */}
      <footer className="py-16 text-center border-t border-neutral-800 bg-neutral-950">
        <h2 className="text-3xl font-display text-white mb-4">{t.theEnd}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-colors"
          >
            ↑ {t.reread}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-neutral-800 text-white font-bold rounded hover:bg-neutral-700 transition-colors border border-neutral-600"
          >
            ← {t.backToEditor}
          </button>
        </div>
      </footer>

      {/* Indicateur de scroll */}
      <div className="fixed bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-full">
        ↓ {t.scrollToRead}
      </div>
    </div>
  );
};

export default WebtoonPreview;
