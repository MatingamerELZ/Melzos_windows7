import React, { useRef, useState, useEffect } from 'react';

const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pencil' | 'brush' | 'eraser' | 'line' | 'rect' | 'circle' | 'fill' | 'text'>('pencil');
  const [color, setColor] = useState('#000000');
  const bgColor = '#ffffff';
  const [size, setSize] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [zoom, setZoom] = useState(100);

  const colors = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
    '#ff8040', '#804000', '#008040', '#004080', '#8000ff', '#ff0080', '#ff8080', '#ffd700',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    setDrawing(true);
    const pos = getPos(e);
    setStartPos(pos);
    if (['line', 'rect', 'circle'].includes(tool)) {
      setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    }
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);

    ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
    ctx.fillStyle = color;
    ctx.lineWidth = tool === 'brush' ? size * 3 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pencil' || tool === 'brush') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.clearRect(pos.x - size * 5, pos.y - size * 5, size * 10, size * 10);
      ctx.fillStyle = bgColor;
      ctx.fillRect(pos.x - size * 5, pos.y - size * 5, size * 10, size * 10);
    } else if (tool === 'line') {
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'rect') {
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (tool === 'circle') {
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      const rx = Math.abs(pos.x - startPos.x) / 2;
      const ry = Math.abs(pos.y - startPos.y) / 2;
      const cx = startPos.x + (pos.x - startPos.x) / 2;
      const cy = startPos.y + (pos.y - startPos.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    setDrawing(false);
    setSnapshot(null);
  };

  const floodFill = (x: number, y: number, fillColor: string) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const idx = (Math.round(y) * canvas.width + Math.round(x)) * 4;
    const targetR = data[idx], targetG = data[idx + 1], targetB = data[idx + 2];
    const [fillR, fillG, fillB] = [parseInt(fillColor.slice(1, 3), 16), parseInt(fillColor.slice(3, 5), 16), parseInt(fillColor.slice(5, 7), 16)];
    if (targetR === fillR && targetG === fillG && targetB === fillB) return;
    const stack = [[Math.round(x), Math.round(y)]];
    const match = (i: number) => Math.abs(data[i] - targetR) < 30 && Math.abs(data[i + 1] - targetG) < 30 && Math.abs(data[i + 2] - targetB) < 30;
    while (stack.length) {
      const [px, py] = stack.pop()!;
      if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) continue;
      const i = (py * canvas.width + px) * 4;
      if (!match(i)) continue;
      data[i] = fillR; data[i + 1] = fillG; data[i + 2] = fillB; data[i + 3] = 255;
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'paint-melz.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const tools = [
    { id: 'pencil', icon: '✏️', label: 'مداد' },
    { id: 'brush', icon: '🖌️', label: 'قلم‌مو' },
    { id: 'eraser', icon: '🧹', label: 'پاک‌کن' },
    { id: 'fill', icon: '🪣', label: 'رنگ‌آمیزی' },
    { id: 'line', icon: '╱', label: 'خط' },
    { id: 'rect', icon: '▭', label: 'مستطیل' },
    { id: 'circle', icon: '◯', label: 'دایره' },
    { id: 'text', icon: 'T', label: 'متن' },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f0f0' }}>
      {/* Menu bar */}
      <div style={{ background: '#f0f0f0', borderBottom: '1px solid #ccc', display: 'flex', fontSize: 12 }}>
        {['File', 'Edit', 'View', 'Image', 'Colors', 'Help'].map(m => (
          <div key={m} style={{ padding: '3px 10px', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#e0e0e0'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            {m}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={saveImage} style={{ margin: '2px 4px', padding: '1px 10px', fontSize: 11, cursor: 'pointer', background: '#4a90e2', color: '#fff', border: 'none', borderRadius: 2 }}>💾 ذخیره</button>
        <button onClick={clearCanvas} style={{ margin: '2px 4px', padding: '1px 10px', fontSize: 11, cursor: 'pointer', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 2 }}>🗑 پاک</button>
      </div>

      {/* Toolbar */}
      <div style={{ background: '#f8f8f8', borderBottom: '1px solid #ccc', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Tools */}
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {tools.map(t => (
            <button key={t.id} title={t.label}
              onClick={() => setTool(t.id)}
              style={{
                width: 28, height: 28, border: '1px solid',
                borderColor: tool === t.id ? '#4a90e2' : '#ccc',
                background: tool === t.id ? '#d0e8ff' : '#f0f0f0',
                cursor: 'pointer', borderRadius: 3, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
              {t.icon}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 30, background: '#ccc' }} />

        {/* Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span>اندازه:</span>
          <input type="range" min={1} max={30} value={size} onChange={e => setSize(Number(e.target.value))} style={{ width: 80 }} />
          <span style={{ minWidth: 20 }}>{size}</span>
        </div>

        <div style={{ width: 1, height: 30, background: '#ccc' }} />

        {/* Colors */}
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 200 }}>
          {colors.map(c => (
            <div key={c}
              onClick={() => setColor(c)}
              style={{
                width: 16, height: 16, background: c,
                border: color === c ? '2px solid #000' : '1px solid #aaa',
                cursor: 'pointer', borderRadius: 2
              }} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          <span>رنگ:</span>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 30, height: 24, cursor: 'pointer', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          <span>زوم:</span>
          <select value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ fontSize: 11 }}>
            {[25, 50, 75, 100, 150, 200, 400].map(z => <option key={z} value={z}>{z}%</option>)}
          </select>
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, overflow: 'auto', background: '#808080', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 16 }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="paint-canvas"
          style={{
            background: '#fff',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            cursor: tool === 'fill' ? 'crosshair' : tool === 'eraser' ? 'cell' : tool === 'text' ? 'text' : 'crosshair'
          }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onClick={(e) => {
            if (tool === 'fill') {
              const pos = getPos(e);
              floodFill(pos.x, pos.y, color);
            }
          }}
        />
      </div>

      {/* Status bar */}
      <div style={{ background: '#f0f0f0', borderTop: '1px solid #ccc', padding: '2px 8px', fontSize: 11, color: '#555', display: 'flex', gap: 16 }}>
        <span>ابزار: {tools.find(t => t.id === tool)?.label}</span>
        <span>رنگ: {color}</span>
        <span>اندازه: {size}</span>
        <span>بوم: 800×600</span>
      </div>
    </div>
  );
};

export default Paint;
