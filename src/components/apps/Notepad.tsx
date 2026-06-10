import React, { useState } from 'react';

interface NotepadProps {
  initialContent?: string;
  filename?: string;
}

const Notepad: React.FC<NotepadProps> = ({ initialContent = '', filename = 'Untitled' }) => {
  const [content, setContent] = useState(initialContent);
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const [saved, setSaved] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
    alert(`فایل "${filename}" ذخیره شد.`);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const lineCount = content.split('\n').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Menu bar */}
      <div style={{ background: '#f0f0f0', borderBottom: '1px solid #ccc', display: 'flex', fontSize: 12 }}>
        {['فایل', 'ویرایش', 'قالب', 'نما', 'راهنما'].map(m => (
          <div key={m} style={{ padding: '3px 10px', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#4a90e2'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            {m}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={save} style={{ margin: '2px 4px', padding: '1px 10px', fontSize: 11, cursor: 'pointer', background: saved ? '#e0e0e0' : '#4a90e2', color: saved ? '#333' : '#fff', border: '1px solid #aaa', borderRadius: 2 }}>
          {saved ? '✓ Saved' : '💾 Save'}
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ background: '#f8f8f8', borderBottom: '1px solid #ddd', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
        <span>اندازه:</span>
        <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ fontSize: 11, border: '1px solid #ccc', padding: '1px 2px' }}>
          {[10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={wordWrap} onChange={e => setWordWrap(e.target.checked)} />
          <span>Word Wrap</span>
        </label>
      </div>

      {/* Text area */}
      <textarea
        value={content}
        onChange={handleChange}
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize,
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowX: wordWrap ? 'hidden' : 'auto',
          flex: 1,
          resize: 'none',
          outline: 'none',
          border: 'none',
          padding: 8
        }}
      />

      {/* Status bar */}
      <div style={{ background: '#f0f0f0', borderTop: '1px solid #ccc', padding: '2px 8px', display: 'flex', gap: 16, fontSize: 11, color: '#555' }}>
        <span>خط: {lineCount}</span>
        <span>کلمه: {wordCount}</span>
        <span>کاراکتر: {charCount}</span>
        <span>{saved ? '✓ ذخیره شده' : '● تغییر یافته'}</span>
      </div>
    </div>
  );
};

export default Notepad;
