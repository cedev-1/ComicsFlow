import React, { useRef, useState, useEffect } from 'react';
import { ImageZone } from '../../types/editor';
import { useI18n } from '../../i18n';

interface DraggableImageZoneProps {
  zone: ImageZone;
  containerRef: React.RefObject<HTMLDivElement>;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (zone: ImageZone) => void;
  pageHeight: number;
}

const DraggableImageZone: React.FC<DraggableImageZoneProps> = ({
  zone,
  containerRef,
  isSelected,
  onSelect,
  onUpdate,
  pageHeight,
}) => {
  const { t } = useI18n();
  const zoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, zoneX: 0, zoneY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, zoneX: 0, zoneY: 0 });

  const getContainerSize = () => {
    if (!containerRef.current) return { width: 800, height: pageHeight };
    const rect = containerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSelect();

    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      zoneX: zone.position.x,
      zoneY: zone.position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const containerSize = getContainerSize();
      const deltaX = ((e.clientX - dragStartRef.current.x) / containerSize.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.y) / containerSize.height) * 100;

      const newX = Math.max(0, Math.min(100 - zone.size.width, dragStartRef.current.zoneX + deltaX));
      const newY = Math.max(0, Math.min(100 - zone.size.height, dragStartRef.current.zoneY + deltaY));

      onUpdate({
        ...zone,
        position: { x: newX, y: newY },
      });
    }

    if (isResizing && resizeHandle) {
      const containerSize = getContainerSize();
      const deltaX = ((e.clientX - resizeStartRef.current.x) / containerSize.width) * 100;
      const deltaY = ((e.clientY - resizeStartRef.current.y) / containerSize.height) * 100;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      let newX = resizeStartRef.current.zoneX;
      let newY = resizeStartRef.current.zoneY;

      if (resizeHandle.includes('e')) {
        newWidth = Math.max(10, resizeStartRef.current.width + deltaX);
      }
      if (resizeHandle.includes('w')) {
        newWidth = Math.max(10, resizeStartRef.current.width - deltaX);
        newX = resizeStartRef.current.zoneX + (resizeStartRef.current.width - newWidth);
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(10, resizeStartRef.current.height + deltaY);
      }
      if (resizeHandle.includes('n')) {
        newHeight = Math.max(10, resizeStartRef.current.height - deltaY);
        newY = resizeStartRef.current.zoneY + (resizeStartRef.current.height - newHeight);
      }

      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      newWidth = Math.min(newWidth, 100 - newX);
      newHeight = Math.min(newHeight, 100 - newY);

      onUpdate({
        ...zone,
        position: { x: newX, y: newY },
        size: { width: newWidth, height: newHeight },
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, zone]);

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setIsResizing(true);
    setResizeHandle(handle);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: zone.size.width,
      height: zone.size.height,
      zoneX: zone.position.x,
      zoneY: zone.position.y,
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onUpdate({
        ...zone,
        imageUrl: event.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({
          ...zone,
          imageUrl: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const resizeHandles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
  const handlePositions: Record<string, string> = {
    nw: 'top-0 left-0 cursor-nw-resize',
    n: 'top-0 left-1/2 -translate-x-1/2 cursor-n-resize',
    ne: 'top-0 right-0 cursor-ne-resize',
    w: 'top-1/2 left-0 -translate-y-1/2 cursor-w-resize',
    e: 'top-1/2 right-0 -translate-y-1/2 cursor-e-resize',
    sw: 'bottom-0 left-0 cursor-sw-resize',
    s: 'bottom-0 left-1/2 -translate-x-1/2 cursor-s-resize',
    se: 'bottom-0 right-0 cursor-se-resize',
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={zoneRef}
      className="absolute pointer-events-none"
      style={{
        left: `${zone.position.x}%`,
        top: `${zone.position.y}%`,
        width: `${zone.size.width}%`,
        height: `${zone.size.height}%`,
        transform: `rotate(${zone.rotation}deg)`,
        zIndex: zone.zIndex,
        paddingRight: zone.comicEffect?.enabled ? zone.comicEffect.shadowOffset : 0,
        paddingBottom: zone.comicEffect?.enabled ? zone.comicEffect.shadowOffset : 0,
      }}
    >
      {zone.comicEffect?.enabled && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: zone.comicEffect.shadowOffset,
            left: zone.comicEffect.shadowOffset,
            right: 0,
            bottom: 0,
            backgroundColor: zone.comicEffect.shadowColor,
            borderRadius: zone.borderRadius,
          }}
        />
      )}

      <div
        className={`relative w-full h-full overflow-hidden pointer-events-auto ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          borderRadius: zone.borderRadius,
          border: zone.comicEffect?.enabled 
            ? `${zone.comicEffect.borderWidth}px solid ${zone.comicEffect.borderColor}`
            : undefined,
          backgroundColor: '#f5f5f5',
          width: zone.comicEffect?.enabled ? `calc(100% - ${zone.comicEffect.shadowOffset}px)` : '100%',
          height: zone.comicEffect?.enabled ? `calc(100% - ${zone.comicEffect.shadowOffset}px)` : '100%',
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {zone.imageUrl ? (
          <img
            src={zone.imageUrl}
            alt="Zone"
            className="w-full h-full pointer-events-none"
            style={{ objectFit: zone.imageFit }}
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full bg-neutral-200 border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">{t.clickOrDragImage}</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Bouton pour changer l'image si elle existe */}
        {zone.imageUrl && isSelected && (
          <div className="absolute top-2 right-2 flex gap-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="p-1.5 bg-white/90 rounded shadow hover:bg-white transition-colors"
              title={t.changeImage}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ ...zone, imageUrl: null });
              }}
              className="p-1.5 bg-red-500/90 text-white rounded shadow hover:bg-red-600 transition-colors"
              title={t.removeImage}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Resize handles - à l'intérieur du container pour positionnement correct */}
        {isSelected && (
          <>
            {resizeHandles.map((handle) => (
              <div
                key={handle}
                className={`resize-handle absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm z-10 ${handlePositions[handle]}`}
                onMouseDown={(e) => handleResizeStart(e, handle)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DraggableImageZone;
