import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ComicSection,
  ComicProject,
  Bubble,
  ImageZone,
  PageLayoutType,
  PAGE_LAYOUTS,
  createDefaultSection,
  createDefaultBubble,
  createDefaultImageZone,
  DEFAULT_COMIC_EFFECT,
} from '../../types/editor';
import DraggableImageZone from './DraggableImageZone';
import DraggableBubble from './DraggableBubble';
import BubbleSidebar from './BubbleSidebar';
import SectionSidebar from './SectionSidebar';
import { useI18n, Translations } from '../../i18n';

export const createInitialProject = (t: Translations): ComicProject => {
  const now = new Date().toISOString();
  
  const sections: ComicSection[] = [
    {
      id: 'section-1',
      order: 0,
      layout: {
        type: 'full',
        zones: [{
          id: 'zone-1-1',
          position: { x: 2, y: 2 },
          size: { width: 96, height: 96 },
          imageUrl: null,
          imageFit: 'cover',
          borderRadius: 0,
          rotation: 0,
          zIndex: 0,
          comicEffect: { ...DEFAULT_COMIC_EFFECT },
        }],
      },
      bubbles: [{
        id: 'bubble-1',
        position: { x: 50, y: 50 },
        size: { width: 280, height: 80 },
        text: t.yourTitleHere,
        style: {
          type: 'narrator',
          tailPosition: 'none',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 0,
          fontSize: 24,
          fontWeight: 'bold',
          fontStyle: 'normal',
        },
        sectionId: 'section-1',
      }],
      backgroundColor: '#ffffff',
      height: 500,
    },
    {
      id: 'section-2',
      order: 1,
      layout: {
        type: 'split-v',
        zones: [
          {
            id: 'zone-2-1',
            position: { x: 2, y: 2 },
            size: { width: 47, height: 96 },
            imageUrl: null,
            imageFit: 'cover',
            borderRadius: 0,
            rotation: 0,
            zIndex: 0,
            comicEffect: { ...DEFAULT_COMIC_EFFECT },
          },
          {
            id: 'zone-2-2',
            position: { x: 51, y: 2 },
            size: { width: 47, height: 96 },
            imageUrl: null,
            imageFit: 'cover',
            borderRadius: 0,
            rotation: 0,
            zIndex: 0,
            comicEffect: { ...DEFAULT_COMIC_EFFECT },
          },
        ],
      },
      bubbles: [],
      backgroundColor: '#ffffff',
      height: 400,
    },
    {
      id: 'section-3',
      order: 2,
      layout: {
        type: 'manga-3',
        zones: [
          {
            id: 'zone-3-1',
            position: { x: 2, y: 2 },
            size: { width: 96, height: 47 },
            imageUrl: null,
            imageFit: 'cover',
            borderRadius: 0,
            rotation: 0,
            zIndex: 0,
            comicEffect: { ...DEFAULT_COMIC_EFFECT },
          },
          {
            id: 'zone-3-2',
            position: { x: 2, y: 51 },
            size: { width: 47, height: 47 },
            imageUrl: null,
            imageFit: 'cover',
            borderRadius: 0,
            rotation: 0,
            zIndex: 0,
            comicEffect: { ...DEFAULT_COMIC_EFFECT },
          },
          {
            id: 'zone-3-3',
            position: { x: 51, y: 51 },
            size: { width: 47, height: 47 },
            imageUrl: null,
            imageFit: 'cover',
            borderRadius: 0,
            rotation: 0,
            zIndex: 0,
            comicEffect: { ...DEFAULT_COMIC_EFFECT },
          },
        ],
      },
      bubbles: [],
      backgroundColor: '#ffffff',
      height: 600,
    },
  ];

  return {
    id: 'project-1',
    title: t.untitledProject,
    author: t.anonymousAuthor,
    sections,
    backgroundColor: '#f0f0f0',
    width: 800,
    createdAt: now,
    updatedAt: now,
  };
};

interface WebtoonContinuousEditorProps {
  project: ComicProject;
  onProjectChange: (project: ComicProject) => void;
}

const WebtoonContinuousEditor: React.FC<WebtoonContinuousEditorProps> = ({
  project,
  onProjectChange,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'zones' | 'bubbles'>('zones');
  const { t } = useI18n();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const selectedSection = project.sections.find(s => s.id === selectedSectionId) || null;
  const selectedZone = selectedSection?.layout.zones.find(z => z.id === selectedZoneId) || null;
  const selectedBubble = project.sections
    .flatMap(s => s.bubbles)
    .find(b => b.id === selectedBubbleId) || null;

  const updateProject = useCallback((updates: Partial<ComicProject>) => {
    onProjectChange({
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }, [project, onProjectChange]);

  const handleAddSection = useCallback(() => {
    const newSectionId = `section-${Date.now()}`;
    const newOrder = project.sections.length;
    const newSection = createDefaultSection(newSectionId, newOrder);
    
    updateProject({
      sections: [...project.sections, newSection],
    });
    setSelectedSectionId(newSectionId);
    setSelectedZoneId(null);
    setSelectedBubbleId(null);
  }, [project.sections, updateProject]);

  const handleUpdateSection = useCallback((updatedSection: ComicSection) => {
    updateProject({
      sections: project.sections.map(s => 
        s.id === updatedSection.id ? updatedSection : s
      ),
    });
  }, [project.sections, updateProject]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    if (project.sections.length <= 1) return;
    
    const newSections = project.sections
      .filter(s => s.id !== sectionId)
      .map((s, i) => ({ ...s, order: i }));
    
    updateProject({ sections: newSections });
    
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(newSections[0]?.id || null);
      setSelectedZoneId(null);
      setSelectedBubbleId(null);
    }
  }, [project.sections, updateProject, selectedSectionId]);

  const handleSectionLayoutChange = useCallback((sectionId: string, layoutType: PageLayoutType) => {
    const section = project.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newZones = PAGE_LAYOUTS[layoutType](sectionId).map(zone => ({
      ...zone,
      position: { x: zone.position.x + 2, y: zone.position.y + 2 },
      size: { width: zone.size.width - 4, height: zone.size.height - 4 },
    }));

    handleUpdateSection({
      ...section,
      layout: {
        type: layoutType,
        zones: newZones,
      },
    });
    setSelectedZoneId(null);
  }, [project.sections, handleUpdateSection]);

  const handleAddZone = useCallback((sectionId: string) => {
    const section = project.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newZoneId = `zone-${Date.now()}`;
    const newZone = createDefaultImageZone(
      newZoneId,
      { x: 10, y: 10 },
      { width: 80, height: 40 }
    );

    handleUpdateSection({
      ...section,
      layout: {
        ...section.layout,
        type: 'custom',
        zones: [...section.layout.zones, newZone],
      },
    });
    setSelectedZoneId(newZoneId);
    setEditMode('zones');
  }, [project.sections, handleUpdateSection]);

  const handleUpdateZone = useCallback((sectionId: string, updatedZone: ImageZone) => {
    const section = project.sections.find(s => s.id === sectionId);
    if (!section) return;

    handleUpdateSection({
      ...section,
      layout: {
        ...section.layout,
        zones: section.layout.zones.map(z => 
          z.id === updatedZone.id ? updatedZone : z
        ),
      },
    });
  }, [project.sections, handleUpdateSection]);

  const handleDeleteZone = useCallback((sectionId: string, zoneId: string) => {
    const section = project.sections.find(s => s.id === sectionId);
    if (!section || section.layout.zones.length <= 1) return;

    handleUpdateSection({
      ...section,
      layout: {
        ...section.layout,
        type: 'custom',
        zones: section.layout.zones.filter(z => z.id !== zoneId),
      },
    });
    
    if (selectedZoneId === zoneId) {
      setSelectedZoneId(null);
    }
  }, [project.sections, handleUpdateSection, selectedZoneId]);

  const handleAddBubble = useCallback((sectionId: string, position?: { x: number; y: number }) => {
    const section = project.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newBubbleId = `bubble-${Date.now()}`;
    const defaultPosition = position || { x: 50, y: 50 };
    const newBubble = createDefaultBubble(newBubbleId, defaultPosition, sectionId);

    handleUpdateSection({
      ...section,
      bubbles: [...section.bubbles, newBubble],
    });
    setSelectedBubbleId(newBubbleId);
    setSelectedSectionId(sectionId);
    setEditMode('bubbles');
  }, [project.sections, handleUpdateSection]);

  const handleUpdateBubble = useCallback((updatedBubble: Bubble) => {
    const sectionId = updatedBubble.sectionId;
    if (!sectionId) return;

    const section = project.sections.find(s => s.id === sectionId);
    if (!section) return;

    handleUpdateSection({
      ...section,
      bubbles: section.bubbles.map(b => 
        b.id === updatedBubble.id ? updatedBubble : b
      ),
    });
  }, [project.sections, handleUpdateSection]);

  const handleDeleteBubble = useCallback((bubbleId: string) => {
    for (const section of project.sections) {
      const bubble = section.bubbles.find(b => b.id === bubbleId);
      if (bubble) {
        handleUpdateSection({
          ...section,
          bubbles: section.bubbles.filter(b => b.id !== bubbleId),
        });
        break;
      }
    }
    if (selectedBubbleId === bubbleId) {
      setSelectedBubbleId(null);
    }
  }, [project.sections, handleUpdateSection, selectedBubbleId]);

  const handleSectionDoubleClick = (sectionId: string, e: React.MouseEvent) => {
    if (editMode !== 'bubbles') return;
    if (e.target !== e.currentTarget) return;
    
    const sectionEl = sectionRefs.current[sectionId];
    if (!sectionEl) return;

    const rect = sectionEl.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left - 100,
      y: e.clientY - rect.top - 50,
    };
    handleAddBubble(sectionId, position);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if ((e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        if (editMode === 'bubbles' && selectedBubbleId) {
          handleDeleteBubble(selectedBubbleId);
        } else if (editMode === 'zones' && selectedZoneId && selectedSectionId) {
          handleDeleteZone(selectedSectionId, selectedZoneId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, selectedBubbleId, selectedZoneId, selectedSectionId, handleDeleteBubble, handleDeleteZone]);

  const handleExport = () => {
    const data = JSON.stringify({ project }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.project) {
          onProjectChange(data.project);
          setSelectedSectionId(null);
          setSelectedZoneId(null);
          setSelectedBubbleId(null);
        }
      } catch {
        alert('Import error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const totalHeight = project.sections.reduce((sum, s) => sum + s.height, 0);

  return (
    <div className="h-full flex">
      <div className="w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-300 mb-2">Sections</h3>
          <button
            onClick={handleAddSection}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Section
          </button>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {project.sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => {
                setSelectedSectionId(section.id);
                setSelectedZoneId(null);
                setSelectedBubbleId(null);
              }}
              className={`w-full p-2 rounded border text-left transition-colors ${
                selectedSectionId === section.id
                  ? 'bg-neutral-700 border-neutral-500'
                  : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">Section {index + 1}</span>
                <span className="text-xs text-neutral-500">{section.height}px</span>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {section.layout.type} • {section.layout.zones.length} zones
              </div>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="p-3 border-t border-neutral-800">
          <div className="text-xs text-neutral-500 space-y-1">
            <div className="flex justify-between">
              <span>Sections:</span>
              <span className="text-neutral-300">{project.sections.length}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.height}:</span>
              <span className="text-neutral-300">{totalHeight}px</span>
            </div>
          </div>
        </div>

        {/* Export/Import */}
        <div className="p-3 border-t border-neutral-800 space-y-2">
          <button
            onClick={handleExport}
            className="w-full px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 text-xs transition-colors"
          >
            {t.export} JSON
          </button>
          <label className="block w-full px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 text-xs text-center cursor-pointer transition-colors">
            {t.import} JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Main Canvas (center) */}
      <div className="flex-1 flex flex-col bg-neutral-800 overflow-hidden">
        {/* Toolbar */}
        <div className="bg-neutral-900 border-b border-neutral-700 px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Mode switcher */}
            <div className="flex bg-neutral-800 rounded overflow-hidden border border-neutral-700">
              <button
                onClick={() => setEditMode('zones')}
                className={`px-3 py-1.5 text-sm flex items-center gap-2 transition-colors ${
                  editMode === 'zones' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t.zonesMode}
              </button>
              <button
                onClick={() => setEditMode('bubbles')}
                className={`px-3 py-1.5 text-sm flex items-center gap-2 transition-colors ${
                  editMode === 'bubbles' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t.bubblesMode}
              </button>
            </div>

            {/* Add buttons */}
            {selectedSectionId && (
              <>
                <button
                  onClick={() => handleAddZone(selectedSectionId)}
                  className="px-3 py-1.5 bg-black hover:bg-neutral-900 text-white rounded text-sm border border-white transition-colors"
                >
                  + {t.addZone}
                </button>
                <button
                  onClick={() => handleAddBubble(selectedSectionId)}
                  className="px-3 py-1.5 bg-black hover:bg-neutral-900 text-white rounded text-sm border border-white transition-colors"
                >
                  + {t.addBubble}
                </button>
              </>
            )}

            <span className="text-xs text-neutral-500">
              {editMode === 'bubbles' 
                ? t.doubleClickToAddBubble
                : t.selectZoneToEdit}
            </span>
          </div>
        </div>

        {/* Canvas area - Scroll continu */}
        <div 
          ref={canvasRef}
          className="flex-1 overflow-auto"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex justify-center py-8">
            <div
              className="relative shadow-2xl"
              style={{
                width: project.width,
                backgroundColor: project.backgroundColor,
              }}
            >
              {/* Sections empilées */}
              {project.sections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el; }}
                  className={`relative border-b-4 border-dashed transition-all ${
                    selectedSectionId === section.id 
                      ? 'border-blue-500' 
                      : 'border-neutral-400 hover:border-neutral-300'
                  }`}
                  style={{
                    height: section.height,
                    backgroundColor: section.backgroundColor,
                  }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setSelectedSectionId(section.id);
                      setSelectedZoneId(null);
                      setSelectedBubbleId(null);
                    }
                  }}
                  onDoubleClick={(e) => handleSectionDoubleClick(section.id, e)}
                >
                  {/* Section header */}
                  <div 
                    className={`absolute top-0 left-0 px-2 py-1 text-xs font-medium z-50 ${
                      selectedSectionId === section.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    Section {sectionIndex + 1} - {section.layout.type}
                  </div>

                  {/* Resize handle */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-4 bg-neutral-600/50 cursor-ns-resize hover:bg-neutral-500/50 flex items-center justify-center z-50"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const startY = e.clientY;
                      const startHeight = section.height;
                      
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const delta = moveEvent.clientY - startY;
                        const newHeight = Math.max(200, Math.min(2000, startHeight + delta));
                        handleUpdateSection({ ...section, height: newHeight });
                      };
                      
                      const handleMouseUp = () => {
                        window.removeEventListener('mousemove', handleMouseMove);
                        window.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      window.addEventListener('mousemove', handleMouseMove);
                      window.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <div className="w-16 h-1 bg-neutral-400 rounded" />
                  </div>

                  {/* Image Zones */}
                  {section.layout.zones.map((zone) => (
                    <DraggableImageZone
                      key={zone.id}
                      zone={zone}
                      containerRef={{ current: sectionRefs.current[section.id] } as React.RefObject<HTMLDivElement>}
                      isSelected={selectedZoneId === zone.id}
                      onSelect={() => {
                        setEditMode('zones');
                        setSelectedSectionId(section.id);
                        setSelectedZoneId(zone.id);
                        setSelectedBubbleId(null);
                      }}
                      onUpdate={(updatedZone) => handleUpdateZone(section.id, updatedZone)}
                      pageHeight={section.height}
                    />
                  ))}

                  {/* Bubbles */}
                  {section.bubbles.map((bubble) => (
                    <DraggableBubble
                      key={bubble.id}
                      bubble={bubble}
                      containerRef={{ current: sectionRefs.current[section.id] } as React.RefObject<HTMLDivElement>}
                      isSelected={selectedBubbleId === bubble.id}
                      onSelect={() => {
                        setEditMode('bubbles');
                        setSelectedSectionId(section.id);
                        setSelectedBubbleId(bubble.id);
                        setSelectedZoneId(null);
                      }}
                      onUpdate={handleUpdateBubble}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      {editMode === 'zones' ? (
        <SectionSidebar
          selectedSection={selectedSection}
          selectedZone={selectedZone}
          onUpdateSection={handleUpdateSection}
          onUpdateZone={(zone) => selectedSectionId && handleUpdateZone(selectedSectionId, zone)}
          onDeleteZone={(zoneId) => selectedSectionId && handleDeleteZone(selectedSectionId, zoneId)}
          onDeleteSection={handleDeleteSection}
          onLayoutChange={(layoutType) => selectedSectionId && handleSectionLayoutChange(selectedSectionId, layoutType)}
          onAddZone={() => selectedSectionId && handleAddZone(selectedSectionId)}
        />
      ) : (
        <BubbleSidebar
          selectedBubble={selectedBubble}
          onUpdateBubble={handleUpdateBubble}
          onDeleteBubble={handleDeleteBubble}
          onExport={handleExport}
          onImport={handleImport}
          activeSection={selectedSectionId}
        />
      )}
    </div>
  );
};

export default WebtoonContinuousEditor;
