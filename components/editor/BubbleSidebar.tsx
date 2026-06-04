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
    <div className="w-80 bg-[var(--bg-app)] text-[var(--text-primary)] p-4 overflow-y-auto flex flex-col gap-4 border-r border-[var(--border-default)]">
      {/* Header */}
      <div className="border-b border-[var(--border-default)] pb-4">
        <h2 className="text-lg font-medium">{t.bubbleProperties}</h2>
        <p className="text-[var(--text-tertiary)] text-sm mt-1">{t.doubleClickToAddBubble}</p>
      </div>

      {/* Section active */}
      {activeSection && (
        <div className="bg-[var(--bg-surface)] rounded p-3 border border-[var(--border-default)]">
          <span className="text-xs text-[var(--text-tertiary)] uppercase">{t.section}</span>
          <p className="font-medium text-[var(--text-secondary)]">{activeSection}</p>
        </div>
      )}

      {selectedBubble ? (
        <div className="space-y-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-active)] rounded p-3">
            <span className="text-xs text-[var(--text-tertiary)] uppercase">{t.bubbleProperties}</span>
            <p className="font-medium text-[var(--text-secondary)] truncate">{selectedBubble.text.substring(0, 30)}...</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[var(--text-secondary)]">{t.bubbleText}</label>
            <textarea
              value={selectedBubble.text}
              onChange={(e) => updateText(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-active)] rounded px-3 py-2 text-sm resize-none h-24 focus:border-[var(--border-focus)] focus:outline-none"
              placeholder={t.bubbleTextPlaceholder}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[var(--text-secondary)]">{t.bubbleType}</label>
            <select
              value={selectedBubble.style.type}
              onChange={(e) => updateStyle('type', e.target.value as BubbleType)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-active)] rounded px-3 py-2 focus:border-[var(--border-focus)] focus:outline-none"
            >
              <option value="speech">{t.speech}</option>
              <option value="thought">{t.thought}</option>
              <option value="shout">{t.shout}</option>
              <option value="whisper">{t.whisper}</option>
              <option value="narrator">{t.narrator}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[var(--text-secondary)]">{t.tailPosition}</label>
            <select
              value={selectedBubble.style.tailPosition}
              onChange={(e) => updateStyle('tailPosition', e.target.value as TailPosition)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-active)] rounded px-3 py-2 focus:border-[var(--border-focus)] focus:outline-none"
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
              <label className="text-sm text-[var(--text-secondary)]">{t.backgroundColor}</label>
              <input
                type="color"
                value={selectedBubble.style.backgroundColor}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-[var(--border-active)] bg-[var(--bg-surface)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">{t.textColor}</label>
              <input
                type="color"
                value={selectedBubble.style.textColor}
                onChange={(e) => updateStyle('textColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-[var(--border-active)] bg-[var(--bg-surface)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">{t.borderColor}</label>
              <input
                type="color"
                value={selectedBubble.style.borderColor}
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-[var(--border-active)] bg-[var(--bg-surface)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-[var(--text-secondary)]">{t.borderWidth}</label>
              <input
                type="number"
                min="1"
                max="10"
                value={selectedBubble.style.borderWidth}
                onChange={(e) => updateStyle('borderWidth', parseInt(e.target.value))}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-active)] rounded px-3 py-2 focus:border-[var(--border-focus)] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[var(--text-secondary)]">{t.fontSize}: {selectedBubble.style.fontSize}px</label>
            <input
              type="range"
              min="12"
              max="36"
              value={selectedBubble.style.fontSize}
              onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
              className="w-full accent-[var(--text-tertiary)]"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => updateStyle('fontWeight', selectedBubble.style.fontWeight === 'bold' ? 'normal' : 'bold')}
              className={`flex-1 py-2 rounded font-bold text-lg border ${
                selectedBubble.style.fontWeight === 'bold' 
                  ? 'bg-[var(--bg-surface-active)] border-[var(--border-focus)]' 
                  : 'bg-[var(--bg-surface)] border-[var(--border-active)] hover:bg-[var(--bg-surface-raised)]'
              }`}
            >
              B
            </button>
            <button
              onClick={() => updateStyle('fontStyle', selectedBubble.style.fontStyle === 'italic' ? 'normal' : 'italic')}
              className={`flex-1 py-2 rounded italic text-lg border ${
                selectedBubble.style.fontStyle === 'italic' 
                  ? 'bg-[var(--bg-surface-active)] border-[var(--border-focus)]' 
                  : 'bg-[var(--bg-surface)] border-[var(--border-active)] hover:bg-[var(--bg-surface-raised)]'
              }`}
            >
              I
            </button>
          </div>

          <button
            onClick={() => onDeleteBubble(selectedBubble.id)}
            className="w-full py-2 px-4 bg-[var(--bg-surface)] hover:bg-red-950 border border-[var(--border-active)] hover:border-red-900 rounded text-[var(--text-secondary)] hover:text-red-400 transition-colors"
          >
            {t.deleteBubble}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-[var(--text-tertiary)] p-8">
            <div className="text-4xl mb-4 opacity-50">💬</div>
            <p className="font-medium">{t.selectBubbleToEdit}</p>
            <p className="text-sm mt-2">{t.doubleClickToAddBubble}</p>
          </div>
        </div>
      )}

      <div className="mt-auto border-t border-[var(--border-default)] pt-4 space-y-2">
        <button
          onClick={onExport}
          className="w-full py-2 px-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-raised)] border border-[var(--border-active)] rounded transition-colors"
        >
          {t.export} JSON
        </button>
        <label className="block w-full">
          <div className="w-full py-2 px-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-raised)] border border-[var(--border-active)] rounded cursor-pointer text-center transition-colors">
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
