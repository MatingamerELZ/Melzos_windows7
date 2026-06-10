import React, { useState } from 'react';
import { FileSystemItem } from '../../data/fileSystem';

interface FileExplorerProps {
  fileSystem: FileSystemItem;
  initialPath?: string;
  username: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ fileSystem, initialPath, username }) => {
  const [currentPath, setCurrentPath] = useState(initialPath || 'C:\\');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'icons' | 'list' | 'details'>('details');
  const [showHidden, setShowHidden] = useState(false);
  const [history, setHistory] = useState<string[]>(['C:\\']);
  const [histIdx, setHistIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = (path: string) => {
    const newHist = [...history.slice(0, histIdx + 1), path];
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
    setCurrentPath(path);
    setSelectedItem(null);
    setSearchTerm('');
  };

  const goBack = () => {
    if (histIdx > 0) { setHistIdx(h => h - 1); setCurrentPath(history[histIdx - 1]); }
  };
  const goForward = () => {
    if (histIdx < history.length - 1) { setHistIdx(h => h + 1); setCurrentPath(history[histIdx + 1]); }
  };

  const getItemsAtPath = (path: string): FileSystemItem[] => {
    const cleanPath = path.replace(/\\+$/, '') || 'C:';
    const segments = cleanPath.split('\\').filter(Boolean);
    let current: FileSystemItem | undefined = fileSystem;
    if (segments[0] === 'C:') { segments.shift(); }
    for (const seg of segments) {
      current = current?.children?.find(c => c.name.toLowerCase() === seg.toLowerCase());
      if (!current) return [];
    }
    return current?.children || [];
  };

  const items = getItemsAtPath(currentPath).filter(i => showHidden ? true : !i.hidden);
  const filtered = searchTerm ? items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())) : items;

  const pathParts = currentPath.split('\\').filter(Boolean);

  const sidebarItems = [
    { icon: '⭐', name: 'Favorites', path: `C:\\Users\\${username}\\Favorites` },
    { icon: '⬇️', name: 'Downloads', path: `C:\\Users\\${username}\\Downloads` },
    { icon: '🖥️', name: 'Desktop', path: `C:\\Users\\${username}\\Desktop` },
    { icon: '📄', name: 'Documents', path: `C:\\Users\\${username}\\Documents` },
    { icon: '🎵', name: 'Music', path: `C:\\Users\\${username}\\Music` },
    { icon: '🖼️', name: 'Pictures', path: `C:\\Users\\${username}\\Pictures` },
    { icon: '🎬', name: 'Videos', path: `C:\\Users\\${username}\\Videos` },
    { icon: '💾', name: 'Computer', path: 'C:\\' },
    { icon: '🌐', name: 'Network', path: 'Network' },
  ];

  const getFileColor = (item: FileSystemItem) => {
    if (item.type === 'folder') return '#e8c900';
    const ext = item.extension || '';
    if (['exe', 'com'].includes(ext)) return '#4a90e2';
    if (['dll', 'sys'].includes(ext)) return '#e88020';
    if (['txt', 'log', 'bat'].includes(ext)) return '#666';
    if (['cpp', 'c', 'h', 'java', 'py', 'js', 'ts', 'html', 'css'].includes(ext)) return '#27ae60';
    if (['jpg', 'png', 'bmp', 'gif'].includes(ext)) return '#e91e63';
    if (['mp3', 'wav', 'flac'].includes(ext)) return '#9c27b0';
    if (['mp4', 'avi', 'mkv'].includes(ext)) return '#ff5722';
    return '#555';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Toolbar */}
      <div className="explorer-toolbar">
        <button className="toolbar-btn" onClick={goBack} disabled={histIdx === 0} style={{ opacity: histIdx === 0 ? 0.4 : 1 }}>◀</button>
        <button className="toolbar-btn" onClick={goForward} disabled={histIdx === history.length - 1} style={{ opacity: histIdx === history.length - 1 ? 0.4 : 1 }}>▶</button>
        <button className="toolbar-btn" onClick={() => {
          const parent = currentPath.split('\\').slice(0, -1).join('\\') || 'C:\\';
          navigate(parent || 'C:\\');
        }}>⬆</button>
        
        {/* Address bar */}
        <div className="address-bar" style={{ flex: 1 }}>
          {pathParts.map((part, i) => (
            <React.Fragment key={i}>
              <span
                style={{ cursor: 'pointer', color: '#1a4f9f', padding: '0 2px' }}
                onClick={() => navigate(pathParts.slice(0, i + 1).join('\\'))}
              >{part}</span>
              {i < pathParts.length - 1 && <span style={{ color: '#aaa', margin: '0 2px' }}>›</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #aac', borderRadius: 3, padding: '2px 6px', gap: 4 }}>
          <span style={{ fontSize: 12 }}>🔍</span>
          <input
            style={{ border: 'none', outline: 'none', fontSize: 12, width: 120 }}
            placeholder="جستجو..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View modes */}
        <div style={{ display: 'flex', gap: 2 }}>
          {(['icons', 'list', 'details'] as const).map(m => (
            <button key={m} className="toolbar-btn" onClick={() => setViewMode(m)}
              style={{ background: viewMode === m ? 'rgba(50,100,200,0.2)' : undefined }}>
              {m === 'icons' ? '⊞' : m === 'list' ? '☰' : '≡'}
            </button>
          ))}
        </div>

        <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
          <input type="checkbox" checked={showHidden} onChange={e => setShowHidden(e.target.checked)} style={{ cursor: 'pointer' }} />
          مخفی
        </label>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div className="explorer-sidebar">
          <div className="sidebar-section-title">📌 پیوندهای سریع</div>
          {sidebarItems.slice(0, 5).map(i => (
            <div key={i.name} className="sidebar-item" onClick={() => navigate(i.path)}>
              <span>{i.icon}</span><span>{i.name}</span>
            </div>
          ))}
          <div style={{ height: 1, background: '#c0d0f0', margin: '6px 8px' }} />
          <div className="sidebar-section-title">💻 کامپیوتر</div>
          {sidebarItems.slice(5).map(i => (
            <div key={i.name} className="sidebar-item" onClick={() => navigate(i.path)}>
              <span>{i.icon}</span><span>{i.name}</span>
            </div>
          ))}
          <div style={{ height: 1, background: '#c0d0f0', margin: '6px 8px' }} />
          <div className="sidebar-section-title">🌲 درخت پوشه</div>
          {getItemsAtPath(currentPath).filter(i => i.type === 'folder').slice(0, 8).map(f => (
            <div key={f.name} className="sidebar-item" style={{ paddingLeft: 16 }}
              onClick={() => navigate(`${currentPath}\\${f.name}`.replace(/\\\\+/g, '\\'))}>
              📂 {f.name}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
          {viewMode === 'icons' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filtered.map(item => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '8px 6px', width: 80, cursor: 'pointer', borderRadius: 4,
                    background: selectedItem === item.name ? 'rgba(50,120,220,0.2)' : 'transparent',
                    border: selectedItem === item.name ? '1px solid rgba(50,120,220,0.5)' : '1px solid transparent'
                  }}
                  onClick={() => setSelectedItem(item.name)}
                  onDoubleClick={() => {
                    if (item.type === 'folder' || item.type === 'shortcut') {
                      navigate(`${currentPath}\\${item.name}`.replace(/\\\\+/g, '\\'));
                    }
                  }}
                >
                  <span style={{ fontSize: 36 }}>{item.icon}</span>
                  <span style={{ fontSize: 11, textAlign: 'center', wordBreak: 'break-word', lineHeight: 1.2 }}>{item.name}</span>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div>
              {filtered.map(item => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '3px 6px',
                    cursor: 'pointer', fontSize: 12, borderRadius: 2,
                    background: selectedItem === item.name ? 'rgba(50,120,220,0.2)' : 'transparent'
                  }}
                  onClick={() => setSelectedItem(item.name)}
                  onDoubleClick={() => {
                    if (item.type === 'folder') navigate(`${currentPath}\\${item.name}`.replace(/\\\\+/g, '\\'));
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ color: getFileColor(item) }}>{item.name}</span>
                  {item.hidden && <span style={{ fontSize: 10, color: '#aaa' }}>(مخفی)</span>}
                  {item.system && <span style={{ fontSize: 10, color: '#e88020' }}>(سیستم)</span>}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'details' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#e8f0ff', borderBottom: '1px solid #c0d0f0' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 600, color: '#1a4f9f', cursor: 'pointer' }}>نام</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 600, color: '#1a4f9f', width: 80 }}>نوع</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 600, color: '#1a4f9f', width: 80 }}>اندازه</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 600, color: '#1a4f9f', width: 100 }}>تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr
                    key={item.name}
                    style={{
                      background: selectedItem === item.name ? 'rgba(50,120,220,0.15)' : i % 2 === 0 ? '#fff' : '#f8f9ff',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedItem(item.name)}
                    onDoubleClick={() => {
                      if (item.type === 'folder') navigate(`${currentPath}\\${item.name}`.replace(/\\\\+/g, '\\'));
                    }}
                  >
                    <td style={{ padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{item.icon}</span>
                      <span style={{ color: getFileColor(item) }}>{item.name}</span>
                      {item.hidden && <span style={{ fontSize: 10, color: '#aaa' }}>(H)</span>}
                      {item.system && <span style={{ fontSize: 10, color: '#e88020' }}>(S)</span>}
                    </td>
                    <td style={{ padding: '3px 8px', color: '#666' }}>
                      {item.type === 'folder' ? 'Folder' : item.extension ? `.${item.extension.toUpperCase()}` : 'File'}
                    </td>
                    <td style={{ padding: '3px 8px', color: '#666' }}>{item.size || (item.type === 'folder' ? '' : '—')}</td>
                    <td style={{ padding: '3px 8px', color: '#666' }}>{item.modified || '01/01/2024'}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                      این پوشه خالی است {searchTerm && `(جستجو: "${searchTerm}")`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ background: '#e8f0ff', borderTop: '1px solid #c0d0f0', padding: '2px 10px', fontSize: 11, color: '#555', display: 'flex', justifyContent: 'space-between' }}>
        <span>{filtered.length} آیتم{selectedItem ? ` — انتخاب: ${selectedItem}` : ''}</span>
        <span>{currentPath}</span>
      </div>
    </div>
  );
};

export default FileExplorer;
