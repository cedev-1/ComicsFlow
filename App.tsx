import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import WebtoonContinuousEditor, { createInitialProject } from './components/editor/WebtoonContinuousEditor';
import WebtoonPreview from './components/editor/WebtoonPreview';
import MetadataModal from './components/editor/MetadataModal';
import ExportModal from './components/editor/ExportModal';
import { ComicProject } from './types/editor';
import { I18nProvider, useI18n, LanguageSelector } from './i18n';

type AppMode = 'editor' | 'preview';

const AppContent: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('editor');
  const { t } = useI18n();
  const [project, setProject] = useState<ComicProject>(() => createInitialProject(t));
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
  }, []);

  const handleMetadataSave = (updates: Partial<ComicProject>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        let importedProject = data;
        
        if (data.project) {
          importedProject = data.project;
        }
        
        if (importedProject.id && importedProject.sections && Array.isArray(importedProject.sections)) {
          setProject(importedProject);
        } else {
          alert('Invalid project file');
        }
      } catch (error) {
        alert('Import error');
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="h-screen flex flex-col font-comic">
      <div className="bg-neutral-950 text-neutral-200 px-4 py-2 flex items-center justify-between border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMetadataModalOpen(true)}
            className="flex items-center gap-2 text-lg font-medium hover:text-white transition-colors group"
            title={t.editMetadata}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="group-hover:underline">{project.title || t.untitledProject}</span>
            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {project.author && (
            <span className="text-sm text-neutral-500">{t.by} {project.author}</span>
          )}
          <div className="flex bg-neutral-900 rounded overflow-hidden border border-neutral-800">
            <button
              onClick={() => setMode('editor')}
              className={`px-4 py-1 text-sm transition-colors ${
                mode === 'editor' ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {t.editing}
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-4 py-1 text-sm transition-colors ${
                mode === 'preview' ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {t.preview}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-neutral-600">
            {mode === 'editor' 
              ? `${project.sections?.length || 0} sections • ${t.editMode}` 
              : t.readMode}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-colors text-sm"
            title={t.import}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t.import}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-colors text-sm"
            title={t.export}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {t.export}
          </button>
          <LanguageSelector />
          <a
            href="https://github.com/cedev-1/ComicsFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {mode === 'editor' ? (
          <WebtoonContinuousEditor 
            project={project} 
            onProjectChange={setProject} 
          />
        ) : (
          <WebtoonPreview 
            project={project} 
            onBack={() => setMode('editor')} 
          />
        )}
      </div>

      <MetadataModal
        project={project}
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        onSave={handleMetadataSave}
      />

      <ExportModal
        project={project}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <div className="bg-neutral-950 text-neutral-500 text-xs text-center py-1.5 border-t border-neutral-800 shrink-0">
        2025 - ComicsFlow by{' '}
        <a
          href="https://github.com/cedev-1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-white transition-colors"
        >
          cedev-1
        </a>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};

export default App;