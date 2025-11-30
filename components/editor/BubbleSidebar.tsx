import React from 'react';
import { Bubble, BubbleType, TailPosition } from '../../types/editor';
import { useI18n } from '../../i18n';

interface BubbleSidebarProps {
  selectedBubble: Bubble | null;
  onUpdateBubble: (bubble: Bubble) => void;
  onDeleteBubble: (id: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeSection: string | null;
}

const BubbleSidebar: React.FC<BubbleSidebarProps> = ({
  selectedBubble,
  onUpdateBubble,
  onDeleteBubble,
  onExport,
  onImport,
  activeSection,
}) => {
  const { t } = useI18n();
  
  const updateStyle = (key: string, value: any) => {
    if (!selectedBubble) return;
    onUpdateBubble({
      ...selectedBubble,
      style: {
        ...selectedBubble.style,
        [key]: value,
      },
    });
  };

  const updateText = (text: string) => {
    if (!selectedBubble) return;
    onUpdateBubble({ ...selectedBubble, text });
  };

  return (
    <div className="w-80 bg-neutral-950 text-neutral-200 p-4 overflow-y-auto flex flex-col gap-4 border-r border-neutral-800">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="text-lg font-medium">{t.bubbleProperties}</h2>
        <p className="text-neutral-500 text-sm mt-1">{t.doubleClickToAddBubble}</p>
      </div>

      {/* Section active */}
      {activeSection && (
        <div className="bg-neutral-900 rounded p-3 border border-neutral-800">
          <span className="text-xs text-neutral-500 uppercase">{t.section}</span>
          <p className="font-medium text-neutral-300">{activeSection}</p>
        </div>
      )}

      {selectedBubble ? (
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded p-3">
            <span className="text-xs text-neutral-500 uppercase">{t.bubbleProperties}</span>
            <p className="font-medium text-neutral-300 truncate">{selectedBubble.text.substring(0, 30)}...</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-neutral-400">Text</label>
            <textarea
              value={selectedBubble.text}
              onChange={(e) => updateText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm resize-none h-24 focus:border-neutral-500 focus:outline-none"
              placeholder="Bubble text..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-neutral-400">{t.bubbleType}</label>
            <select
              value={selectedBubble.style.type}
              onChange={(e) => updateStyle('type', e.target.value as BubbleType)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 focus:border-neutral-500 focus:outline-none"
            >
              <option value="speech">{t.speech}</option>
              <option value="thought">{t.thought}</option>
              <option value="shout">{t.shout}</option>
              <option value="whisper">{t.whisper}</option>
              <option value="narrator">{t.narrator}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-neutral-400">{t.tailPosition}</label>
            <select
              value={selectedBubble.style.tailPosition}
              onChange={(e) => updateStyle('tailPosition', e.target.value as TailPosition)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 focus:border-neutral-500 focus:outline-none"
            >
              <option value="left">{t.left}</option>
              <option value="right">{t.right}</option>
              <option value="bottom">{t.bottom}</option>
              <option value="top">{t.top}</option>
              <option value="none">{t.none}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-neutral-400">{t.backgroundColor}</label>
              <input
                type="color"
                value={selectedBubble.style.backgroundColor}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-neutral-700 bg-neutral-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-neutral-400">{t.textColor}</label>
              <input
                type="color"
                value={selectedBubble.style.textColor}
                onChange={(e) => updateStyle('textColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-neutral-700 bg-neutral-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-neutral-400">{t.borderColor}</label>
              <input
                type="color"
                value={selectedBubble.style.borderColor}
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-neutral-700 bg-neutral-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-neutral-400">{t.borderWidth}</label>
              <input
                type="number"
                min="1"
                max="10"
                value={selectedBubble.style.borderWidth}
                onChange={(e) => updateStyle('borderWidth', parseInt(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-neutral-400">{t.fontSize}: {selectedBubble.style.fontSize}px</label>
            <input
              type="range"
              min="12"
              max="36"
              value={selectedBubble.style.fontSize}
              onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
              className="w-full accent-neutral-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => updateStyle('fontWeight', selectedBubble.style.fontWeight === 'bold' ? 'normal' : 'bold')}
              className={`flex-1 py-2 rounded font-bold text-lg border ${
                selectedBubble.style.fontWeight === 'bold' 
                  ? 'bg-neutral-700 border-neutral-600' 
                  : 'bg-neutral-900 border-neutral-700 hover:bg-neutral-800'
              }`}
            >
              B
            </button>
            <button
              onClick={() => updateStyle('fontStyle', selectedBubble.style.fontStyle === 'italic' ? 'normal' : 'italic')}
              className={`flex-1 py-2 rounded italic text-lg border ${
                selectedBubble.style.fontStyle === 'italic' 
                  ? 'bg-neutral-700 border-neutral-600' 
                  : 'bg-neutral-900 border-neutral-700 hover:bg-neutral-800'
              }`}
            >
              I
            </button>
          </div>

          <button
            onClick={() => onDeleteBubble(selectedBubble.id)}
            className="w-full py-2 px-4 bg-neutral-900 hover:bg-red-950 border border-neutral-700 hover:border-red-900 rounded text-neutral-400 hover:text-red-400 transition-colors"
          >
            {t.deleteBubble}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-neutral-600 p-8">
            <div className="text-4xl mb-4 opacity-50">💬</div>
            <p className="font-medium">{t.selectBubbleToEdit}</p>
            <p className="text-sm mt-2">{t.doubleClickToAddBubble}</p>
          </div>
        </div>
      )}

      <div className="mt-auto border-t border-neutral-800 pt-4 space-y-2">
        <button
          onClick={onExport}
          className="w-full py-2 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors"
        >
          {t.export} JSON
        </button>
        <label className="block w-full">
          <div className="w-full py-2 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded cursor-pointer text-center transition-colors">
            {t.import} JSON
          </div>
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default BubbleSidebar;
