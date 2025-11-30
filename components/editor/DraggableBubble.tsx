import React, { useRef, useState, useEffect } from 'react';
import { Bubble } from '../../types/editor';

interface DraggableBubbleProps {
  bubble: Bubble;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (bubble: Bubble) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const DraggableBubble: React.FC<DraggableBubbleProps> = ({
  bubble,
  isSelected,
  onSelect,
  onUpdate,
  containerRef,
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    onSelect();

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollTop = containerRef.current.scrollTop;
      const scrollLeft = containerRef.current.scrollLeft;
      
      setDragOffset({
        x: e.clientX - containerRect.left + scrollLeft - bubble.position.x,
        y: e.clientY - containerRect.top + scrollTop - bubble.position.y,
      });
      setIsDragging(true);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: bubble.size.width,
      height: bubble.size.height,
    });
    setIsResizing(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...bubble,
      text: e.target.value,
    });
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const scrollTop = containerRef.current.scrollTop;
        const scrollLeft = containerRef.current.scrollLeft;
        
        const newX = e.clientX - containerRect.left + scrollLeft - dragOffset.x;
        const newY = e.clientY - containerRect.top + scrollTop - dragOffset.y;

        const contentHeight = containerRef.current.scrollHeight;
        const contentWidth = containerRef.current.scrollWidth;

        onUpdate({
          ...bubble,
          position: {
            x: Math.max(0, Math.min(newX, contentWidth - bubble.size.width)),
            y: Math.max(0, Math.min(newY, contentHeight - bubble.size.height)),
          },
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        onUpdate({
          ...bubble,
          size: {
            width: Math.max(100, resizeStart.width + deltaX),
            height: Math.max(50, resizeStart.height + deltaY),
          },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, bubble, onUpdate, containerRef]);

  const getBubbleClasses = () => {
    const { type, tailPosition } = bubble.style;
    let classes = 'bubble-element absolute cursor-move transition-shadow ';
    
    switch (type) {
      case 'thought':
        classes += 'rounded-[50%] ';
        break;
      case 'shout':
        classes += 'rounded-lg ';
        break;
      case 'whisper':
        classes += 'rounded-2xl border-dashed ';
        break;
      case 'narrator':
        classes += 'rounded-sm ';
        break;
      default: // speech
        classes += 'rounded-2xl ';
    }

    if (isSelected) {
      classes += 'ring-2 ring-neutral-400 ring-offset-2 ';
    }

    return classes;
  };

  const renderTail = () => {
    const { tailPosition, borderColor, backgroundColor } = bubble.style;
    if (tailPosition === 'none') return null;

    const tailStyle: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
    };

    switch (tailPosition) {
      case 'left':
        return (
          <>
            <div style={{
              ...tailStyle,
              left: -16,
              bottom: 15,
              borderWidth: '12px 18px 12px 0',
              borderColor: `transparent ${borderColor} transparent transparent`,
            }} />
            <div style={{
              ...tailStyle,
              left: -10,
              bottom: 18,
              borderWidth: '9px 14px 9px 0',
              borderColor: `transparent ${backgroundColor} transparent transparent`,
            }} />
          </>
        );
      case 'right':
        return (
          <>
            <div style={{
              ...tailStyle,
              right: -16,
              bottom: 15,
              borderWidth: '12px 0 12px 18px',
              borderColor: `transparent transparent transparent ${borderColor}`,
            }} />
            <div style={{
              ...tailStyle,
              right: -10,
              bottom: 18,
              borderWidth: '9px 0 9px 14px',
              borderColor: `transparent transparent transparent ${backgroundColor}`,
            }} />
          </>
        );
      case 'bottom':
        return (
          <>
            <div style={{
              ...tailStyle,
              bottom: -16,
              left: '20%',
              borderWidth: '18px 12px 0 12px',
              borderColor: `${borderColor} transparent transparent transparent`,
            }} />
            <div style={{
              ...tailStyle,
              bottom: -10,
              left: 'calc(20% + 3px)',
              borderWidth: '14px 9px 0 9px',
              borderColor: `${backgroundColor} transparent transparent transparent`,
            }} />
          </>
        );
      case 'top':
        return (
          <>
            <div style={{
              ...tailStyle,
              top: -16,
              left: '20%',
              borderWidth: '0 12px 18px 12px',
              borderColor: `transparent transparent ${borderColor} transparent`,
            }} />
            <div style={{
              ...tailStyle,
              top: -10,
              left: 'calc(20% + 3px)',
              borderWidth: '0 9px 14px 9px',
              borderColor: `transparent transparent ${backgroundColor} transparent`,
            }} />
          </>
        );
    }
  };

  return (
    <div
      ref={bubbleRef}
      className={getBubbleClasses()}
      style={{
        left: bubble.position.x,
        top: bubble.position.y,
        width: bubble.size.width,
        height: bubble.size.height,
        backgroundColor: bubble.style.backgroundColor,
        borderColor: bubble.style.borderColor,
        borderWidth: bubble.style.borderWidth,
        borderStyle: bubble.style.type === 'whisper' ? 'dashed' : 'solid',
        zIndex: 100,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Tail */}
      {renderTail()}

      {/* Text content */}
      {isEditing ? (
        <textarea
          autoFocus
          className="w-full h-full p-3 resize-none bg-transparent outline-none text-center"
          style={{
            color: bubble.style.textColor,
            fontSize: bubble.style.fontSize,
            fontWeight: bubble.style.fontWeight,
            fontStyle: bubble.style.fontStyle,
          }}
          value={bubble.text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="w-full h-full p-3 flex items-center justify-center text-center overflow-hidden"
          style={{
            color: bubble.style.textColor,
            fontSize: bubble.style.fontSize,
            fontWeight: bubble.style.fontWeight,
            fontStyle: bubble.style.fontStyle,
          }}
        >
          {bubble.text}
        </div>
      )}

      {/* Resize handle */}
      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-neutral-500 cursor-se-resize rounded-tl"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

export default DraggableBubble;
