import React from 'react';
import { ComicSection, ImageZone, PageLayoutType, PAGE_LAYOUTS } from '../../types/editor';
import { useI18n } from '../../i18n';

interface SectionSidebarProps {
  selectedSection: ComicSection | null;
  selectedZone: ImageZone | null;
  onUpdateSection: (section: ComicSection) => void;
  onUpdateZone: (zone: ImageZone) => void;
  onDeleteZone: (zoneId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onLayoutChange: (layoutType: PageLayoutType) => void;
  onAddZone: () => void;
}

const LAYOUT_PREVIEWS: Record<PageLayoutType, React.ReactNode> = {
  'full': (
    <div className="w-full h-full bg-neutral-600 rounded-sm" />
  ),
  'split-h': (
    <div className="w-full h-full flex flex-col gap-0.5">
      <div className="flex-1 bg-neutral-600 rounded-sm" />
      <div className="flex-1 bg-neutral-600 rounded-sm" />
    </div>
  ),
  'split-v': (
    <div className="w-full h-full flex gap-0.5">
      <div className="flex-1 bg-neutral-600 rounded-sm" />
      <div className="flex-1 bg-neutral-600 rounded-sm" />
    </div>
  ),
  'grid-2x2': (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
      <div className="bg-neutral-600 rounded-sm" />
      <div className="bg-neutral-600 rounded-sm" />
      <div className="bg-neutral-600 rounded-sm" />
      <div className="bg-neutral-600 rounded-sm" />
    </div>
  ),
  'grid-3': (
    <div className="w-full h-full flex gap-0.5">
      <div className="w-3/5 bg-neutral-600 rounded-sm" />
      <div className="w-2/5 flex flex-col gap-0.5">
        <div className="flex-1 bg-neutral-600 rounded-sm" />
        <div className="flex-1 bg-neutral-600 rounded-sm" />
      </div>
    </div>
  ),
  'manga-3': (
    <div className="w-full h-full flex flex-col gap-0.5">
      <div className="h-1/2 bg-neutral-600 rounded-sm" />
      <div className="h-1/2 flex gap-0.5">
        <div className="flex-1 bg-neutral-600 rounded-sm" />
        <div className="flex-1 bg-neutral-600 rounded-sm" />
      </div>
    </div>
  ),
  'diagonal': (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-neutral-600 rounded-sm" />
      <div className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-neutral-500 rounded-sm" />
    </div>
  ),
  'custom': (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 bg-neutral-600 rounded-sm border-2 border-dashed border-neutral-500" />
    </div>
  ),
};

const SectionSidebar: React.FC<SectionSidebarProps> = ({
  selectedSection,
  selectedZone,
  onUpdateSection,
  onUpdateZone,
  onDeleteZone,
  onDeleteSection,
  onLayoutChange,
  onAddZone,
}) => {
  const { t, language } = useI18n();

  const LAYOUT_NAMES: Record<PageLayoutType, Record<string, string>> = {
    'full': { fr: 'Pleine', en: 'Full' },
    'split-h': { fr: 'Split H', en: 'Split H' },
    'split-v': { fr: 'Split V', en: 'Split V' },
    'grid-2x2': { fr: 'Grille 2x2', en: 'Grid 2x2' },
    'grid-3': { fr: '1+2 Col', en: '1+2 Col' },
    'manga-3': { fr: 'Manga', en: 'Manga' },
    'diagonal': { fr: 'Diagonal', en: 'Diagonal' },
    'custom': { fr: 'Custom', en: 'Custom' },
  };

  return (
    <div className="w-72 bg-neutral-900 border-l border-neutral-800 overflow-y-auto">
      <div className="p-4 space-y-6">
        {selectedSection && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-neutral-300 mb-3 uppercase tracking-wider">
                Section #{selectedSection.order + 1}
              </h3>
              
              <div className="mb-4">
                <label className="block text-xs text-neutral-500 mb-1">{t.height} (px)</label>
                <input
                  type="number"
                  value={selectedSection.height}
                  onChange={(e) => onUpdateSection({ 
                    ...selectedSection, 
                    height: Math.max(100, Math.min(2000, parseInt(e.target.value) || 400)) 
                  })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white"
                  min={100}
                  max={2000}
                  step={50}
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs text-neutral-500 mb-1">{t.backgroundColor}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selectedSection.backgroundColor}
                    onChange={(e) => onUpdateSection({ ...selectedSection, backgroundColor: e.target.value })}
                    className="w-10 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedSection.backgroundColor}
                    onChange={(e) => onUpdateSection({ ...selectedSection, backgroundColor: e.target.value })}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-300 mb-3 uppercase tracking-wider">
                Layout
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(LAYOUT_PREVIEWS) as PageLayoutType[]).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => onLayoutChange(layout)}
                    className={`p-1.5 rounded border-2 transition-all ${
                      selectedSection.layout.type === layout
                        ? 'border-blue-500 bg-neutral-800'
                        : 'border-neutral-700 bg-neutral-850 hover:border-neutral-600'
                    }`}
                    title={LAYOUT_NAMES[layout][language]}
                  >
                    <div className="aspect-[3/4]">
                      {LAYOUT_PREVIEWS[layout]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={onAddZone}
                className="w-full px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.addZone}
              </button>
            </div>

            <button
              onClick={() => onDeleteSection(selectedSection.id)}
              className="w-full px-3 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded border border-red-900/50 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.deleteSection}
            </button>
          </>
        )}

        {selectedZone && (
          <div className="border-t border-neutral-800 pt-4">
            <h3 className="text-sm font-semibold text-neutral-300 mb-3 uppercase tracking-wider">
              {t.zoneProperties}
            </h3>

            <div className="mb-4">
              <label className="block text-xs text-neutral-500 mb-1">{t.imageFit}</label>
              <select
                value={selectedZone.imageFit}
                onChange={(e) => onUpdateZone({ ...selectedZone, imageFit: e.target.value as ImageZone['imageFit'] })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white"
              >
                <option value="cover">{t.cover}</option>
                <option value="contain">{t.contain}</option>
                <option value="fill">{t.fill}</option>
                <option value="none">Original</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-neutral-500 mb-1">{t.borderRadius} (px)</label>
              <input
                type="range"
                value={selectedZone.borderRadius}
                onChange={(e) => onUpdateZone({ ...selectedZone, borderRadius: parseInt(e.target.value) })}
                className="w-full"
                min={0}
                max={50}
              />
              <span className="text-xs text-neutral-500">{selectedZone.borderRadius}px</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">X (%)</label>
                <input
                  type="number"
                  value={Math.round(selectedZone.position.x)}
                  onChange={(e) => onUpdateZone({ ...selectedZone, position: { ...selectedZone.position, x: parseFloat(e.target.value) || 0 } })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                  min={0}
                  max={100}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Y (%)</label>
                <input
                  type="number"
                  value={Math.round(selectedZone.position.y)}
                  onChange={(e) => onUpdateZone({ ...selectedZone, position: { ...selectedZone.position, y: parseFloat(e.target.value) || 0 } })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                  min={0}
                  max={100}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">{t.width} (%)</label>
                <input
                  type="number"
                  value={Math.round(selectedZone.size.width)}
                  onChange={(e) => onUpdateZone({ ...selectedZone, size: { ...selectedZone.size, width: parseFloat(e.target.value) || 10 } })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                  min={5}
                  max={100}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">{t.height} (%)</label>
                <input
                  type="number"
                  value={Math.round(selectedZone.size.height)}
                  onChange={(e) => onUpdateZone({ ...selectedZone, size: { ...selectedZone.size, height: parseFloat(e.target.value) || 10 } })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                  min={5}
                  max={100}
                />
              </div>
            </div>

            <div className="border-t border-neutral-700 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
                  {t.comicEffect}
                </h4>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedZone.comicEffect?.enabled ?? true}
                    onChange={(e) => onUpdateZone({
                      ...selectedZone,
                      comicEffect: {
                        ...selectedZone.comicEffect,
                        enabled: e.target.checked,
                      },
                    })}
                    className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-blue-500"
                  />
                </label>
              </div>

              {selectedZone.comicEffect?.enabled && (
                <>
                  <div className="mb-3">
                    <label className="block text-xs text-neutral-500 mb-1">{t.borderWidth} (px)</label>
                    <input
                      type="range"
                      value={selectedZone.comicEffect?.borderWidth ?? 4}
                      onChange={(e) => onUpdateZone({
                        ...selectedZone,
                        comicEffect: {
                          ...selectedZone.comicEffect,
                          borderWidth: parseInt(e.target.value),
                        },
                      })}
                      className="w-full"
                      min={0}
                      max={10}
                    />
                    <span className="text-xs text-neutral-500">{selectedZone.comicEffect?.borderWidth ?? 4}px</span>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-neutral-500 mb-1">{t.borderColor}</label>
                    <input
                      type="color"
                      value={selectedZone.comicEffect?.borderColor ?? '#000000'}
                      onChange={(e) => onUpdateZone({
                        ...selectedZone,
                        comicEffect: {
                          ...selectedZone.comicEffect,
                          borderColor: e.target.value,
                        },
                      })}
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-neutral-500 mb-1">{t.shadowOffset} (px)</label>
                    <input
                      type="range"
                      value={selectedZone.comicEffect?.shadowOffset ?? 8}
                      onChange={(e) => onUpdateZone({
                        ...selectedZone,
                        comicEffect: {
                          ...selectedZone.comicEffect,
                          shadowOffset: parseInt(e.target.value),
                        },
                      })}
                      className="w-full"
                      min={0}
                      max={20}
                    />
                    <span className="text-xs text-neutral-500">{selectedZone.comicEffect?.shadowOffset ?? 8}px</span>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-neutral-500 mb-1">{t.shadowColor}</label>
                    <input
                      type="color"
                      value={selectedZone.comicEffect?.shadowColor ?? '#333333'}
                      onChange={(e) => onUpdateZone({
                        ...selectedZone,
                        comicEffect: {
                          ...selectedZone.comicEffect,
                          shadowColor: e.target.value,
                        },
                      })}
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => onDeleteZone(selectedZone.id)}
              className="w-full mt-4 px-3 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded border border-red-900 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.deleteZone}
            </button>
          </div>
        )}

        {!selectedSection && !selectedZone && (
          <div className="text-center text-neutral-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">{t.selectZoneToEdit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionSidebar;
