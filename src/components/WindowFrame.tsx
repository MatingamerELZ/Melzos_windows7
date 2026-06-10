import React, { useRef, useState, useCallback } from 'react';
import { Window } from '../types';

interface WindowFrameProps {
  win: Window;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Window>) => void;
  children: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ win, onClose, onMinimize, onMaximize, onFocus, onUpdate, children }) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  if (win.minimized) return null;

  const style: React.CSSProperties = win.maximized
    ? { position: 'fixed', left: 0, top: 0, right: 0, bottom: 40, zIndex: win.zIndex }
    : { position: 'fixed', left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  const handleMouseDownTitle = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    onFocus(win.id);
    setDragging(true);
    dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y };

    const handleMouseMove = (e2: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - win.width, e2.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, e2.clientY - dragOffset.current.y));
      onUpdate(win.id, { x: newX, y: newY });
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [win, onFocus, onUpdate]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: win.width, h: win.height };

    const handleMouseMove = (e2: MouseEvent) => {
      const newW = Math.max(300, resizeStart.current.w + (e2.clientX - resizeStart.current.x));
      const newH = Math.max(200, resizeStart.current.h + (e2.clientY - resizeStart.current.y));
      onUpdate(win.id, { width: newW, height: newH });
    };
    const handleMouseUp = () => {
      setResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [win, onUpdate]);

  return (
    <div
      className="win7-window"
      style={style}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Title bar */}
      <div
        className="win7-titlebar"
        onMouseDown={handleMouseDownTitle}
        onDoubleClick={() => onMaximize(win.id)}
        style={{ cursor: dragging ? 'grabbing' : win.maximized ? 'default' : 'grab' }}
      >
        <span style={{ fontSize: 14, marginLeft: 4 }}>{win.icon}</span>
        <span className="win7-titlebar-text">{win.title}</span>

        <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
          <button
            className="win7-btn win7-btn-min"
            onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}
            title="Minimize"
          >
            <span style={{ fontSize: 10 }}>─</span>
          </button>
          <button
            className="win7-btn win7-btn-max"
            onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }}
            title={win.maximized ? 'Restore' : 'Maximize'}
          >
            <span style={{ fontSize: 10 }}>{win.maximized ? '❐' : '□'}</span>
          </button>
          <button
            className="win7-btn win7-btn-close"
            onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
            title="Close"
          >
            <span style={{ fontSize: 10, fontWeight: 'bold' }}>✕</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="win7-window-body">
        {children}
      </div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          style={{ cursor: resizing ? 'se-resize' : 'se-resize', position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, zIndex: 10 }}
        />
      )}
    </div>
  );
};

export default WindowFrame;
