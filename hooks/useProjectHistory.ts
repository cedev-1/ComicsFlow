import { useState, useRef, useCallback } from 'react';

const MAX_HISTORY = 50;

export function useProjectHistory<T>(initialState: T) {
  const [current, setCurrent] = useState<T>(initialState);
  
  const historyRef = useRef<T[]>([initialState]);
  const indexRef = useRef(0);

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  const push = useCallback((newState: T) => {
    const lastState = historyRef.current[indexRef.current];
    if (JSON.stringify(lastState) === JSON.stringify(newState)) {
      return;
    }

    const trimmed = historyRef.current.slice(0, indexRef.current + 1);
    
    const next = [...trimmed, newState];
    if (next.length > MAX_HISTORY) {
      next.shift();
      indexRef.current = MAX_HISTORY - 1;
    } else {
      indexRef.current += 1;
    }
    
    historyRef.current = next;
    setCurrent(newState);
  }, []);

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return;
    indexRef.current -= 1;
    setCurrent(historyRef.current[indexRef.current]);
  }, []);

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current += 1;
    setCurrent(historyRef.current[indexRef.current]);
  }, []);

  const reset = useCallback((newState: T) => {
    historyRef.current = [newState];
    indexRef.current = 0;
    setCurrent(newState);
  }, []);

  return {
    current,
    push,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  };
}
