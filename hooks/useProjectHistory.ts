import { useState, useRef, useCallback } from 'react';

const MAX_HISTORY = 50;
const DEBOUNCE_MS = 500;

export function useProjectHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);
  const lastPushRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = history[index];
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  const push = useCallback((newState: T) => {
    const now = Date.now();

    // Si un timer est en cours, on l'annule et on repousse
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Si la dernière push date de moins de DEBOUNCE_MS, on remplace l'état courant
    if (now - lastPushRef.current < DEBOUNCE_MS) {
      timerRef.current = setTimeout(() => {
        setHistory(prev => {
          const trimmed = prev.slice(0, index + 1);
          const last = trimmed[trimmed.length - 1];
          // Ne pas pousser si identique au dernier état
          if (JSON.stringify(last) === JSON.stringify(newState)) return prev;
          const next = [...trimmed, newState];
          if (next.length > MAX_HISTORY) next.shift();
          return next;
        });
        setIndex(prev => {
          const nextIndex = Math.min(prev + 1, MAX_HISTORY - 1);
          return nextIndex;
        });
        lastPushRef.current = Date.now();
        timerRef.current = null;
      }, DEBOUNCE_MS);
    } else {
      // Push immédiat
      setHistory(prev => {
        const trimmed = prev.slice(0, index + 1);
        const last = trimmed[trimmed.length - 1];
        if (JSON.stringify(last) === JSON.stringify(newState)) return prev;
        const next = [...trimmed, newState];
        if (next.length > MAX_HISTORY) next.shift();
        return next;
      });
      setIndex(prev => {
        const nextIndex = Math.min(prev + 1, MAX_HISTORY - 1);
        return nextIndex;
      });
      lastPushRef.current = now;
    }
  }, [index]);

  const undo = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIndex(prev => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex(prev => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  const replace = useCallback((newState: T) => {
    // Remplace l'état courant sans ajouter à l'historique (pour undo/redo interne)
    setHistory(prev => {
      const next = [...prev];
      next[index] = newState;
      return next;
    });
  }, [index]);

  return {
    current,
    push,
    undo,
    redo,
    canUndo,
    canRedo,
    replace,
  };
}
