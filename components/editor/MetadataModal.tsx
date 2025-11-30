import React, { useState, useEffect } from 'react';
import { ComicProject } from '../../types/editor';
import { useI18n } from '../../i18n';

interface MetadataModalProps {
  project: ComicProject;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<ComicProject>) => void;
}

const MetadataModal: React.FC<MetadataModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useI18n();
  const [title, setTitle] = useState(project.title);
  const [author, setAuthor] = useState(project.author);
  const [description, setDescription] = useState(project.description || '');
  const [width, setWidth] = useState(project.width);
  const [backgroundColor, setBackgroundColor] = useState(project.backgroundColor);

  useEffect(() => {
    setTitle(project.title);
    setAuthor(project.author);
    setDescription(project.description || '');
    setWidth(project.width);
    setBackgroundColor(project.backgroundColor);
  }, [project]);

  const handleSave = () => {
    onSave({
      title: title.trim() || t.untitledProject,
      author: author.trim() || t.anonymousAuthor,
      description: description.trim(),
      width,
      backgroundColor,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      style={{ zIndex: 9999 }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="bg-neutral-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 border border-neutral-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t.metadata}
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
        <div className="p-6 space-y-5">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              {t.projectTitle}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.untitledProject}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Auteur */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              {t.author}
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={t.anonymousAuthor}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              {t.description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="..."
              rows={3}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                {t.projectWidth}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(400, Math.min(1200, parseInt(e.target.value) || 800)))}
                  min={400}
                  max={1200}
                  step={50}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <span className="text-neutral-400 text-sm">px</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                {t.globalBackgroundColor}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-neutral-600 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Info dates */}
          <div className="pt-3 border-t border-neutral-700 grid grid-cols-2 gap-4 text-xs text-neutral-500">
            <div>
              <span className="font-medium">{t.createdAt}:</span>{' '}
              {formatDate(project.createdAt)}
            </div>
            <div>
              <span className="font-medium">{t.updatedAt}:</span>{' '}
              {formatDate(project.updatedAt)}
            </div>
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
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t.saveMetadata}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetadataModal;
