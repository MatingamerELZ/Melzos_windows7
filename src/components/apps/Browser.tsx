import React, { useState } from 'react';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('http://www.msn.com');
  const [inputUrl, setInputUrl] = useState('http://www.msn.com');
  const [history, setHistory] = useState<string[]>(['http://www.msn.com']);
  const [histIdx, setHistIdx] = useState(0);
  const [favorites, setFavorites] = useState([
    { name: 'MSN', url: 'http://www.msn.com' },
    { name: 'Microsoft', url: 'http://www.microsoft.com' },
    { name: 'Windows Update', url: 'http://update.microsoft.com' },
    { name: 'Bing', url: 'http://www.bing.com' },
  ]);
  const [showFavs, setShowFavs] = useState(false);
  const [tab, setTab] = useState(0);
  const [tabs, setTabs] = useState([{ title: 'MSN', url: 'http://www.msn.com' }]);

  const pages: Record<string, { title: string; content: React.ReactNode }> = {
    'http://www.msn.com': {
      title: 'MSN - Windows 7',
      content: (
        <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
          <div style={{ background: 'linear-gradient(to right, #0067c0, #00a4ef)', padding: '12px 20px', color: '#fff', marginBottom: 16, borderRadius: 4 }}>
            <h1 style={{ fontSize: 24, margin: 0 }}>🌐 MSN</h1>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {['اخبار روز', 'ورزش', 'هواشناسی', 'سرگرمی', 'مالی', 'سلامت'].map(c => (
              <div key={c} style={{ background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: 4, padding: 12, cursor: 'pointer' }}>
                <h3 style={{ fontSize: 14, color: '#0067c0', margin: '0 0 6px' }}>{c}</h3>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>آخرین خبرها و اطلاعات {c}...</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'http://www.microsoft.com': {
      title: 'Microsoft - Windows 7',
      content: (
        <div style={{ padding: 20, background: '#fff' }}>
          <div style={{ background: '#f2f2f2', padding: '16px 20px', borderBottom: '3px solid #0067c0', marginBottom: 20 }}>
            <h1 style={{ color: '#0067c0', margin: 0, fontSize: 28 }}>🪟 Microsoft</h1>
            <p style={{ color: '#666', margin: '6px 0 0', fontSize: 14 }}>Technology for everyone</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { name: 'Windows 7', icon: '🪟', desc: 'Your PC, Simplified.' },
              { name: 'Office 2010', icon: '📊', desc: 'Productivity suite for home and business.' },
              { name: 'Xbox', icon: '🎮', desc: 'Gaming for everyone.' },
              { name: 'Azure', icon: '☁️', desc: 'Cloud computing platform.' },
            ].map(p => (
              <div key={p.name} style={{ border: '1px solid #ddd', borderRadius: 4, padding: 16, cursor: 'pointer' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
                <h3 style={{ color: '#0067c0', margin: '0 0 4px' }}>{p.name}</h3>
                <p style={{ color: '#666', fontSize: 12, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'http://www.bing.com': {
      title: 'Bing - Windows 7',
      content: (
        <div style={{ padding: 40, textAlign: 'center', background: 'linear-gradient(to bottom, #fff, #e8f4ff)', height: '100%' }}>
          <div style={{ marginBottom: 30 }}>
            <span style={{ fontSize: 60 }}>🔍</span>
            <h1 style={{ color: '#0067c0', fontSize: 42, fontWeight: 300, margin: '8px 0' }}>Bing</h1>
          </div>
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', maxWidth: 500, margin: '0 auto' }}>
            <input style={{ flex: 1, padding: '12px 16px', fontSize: 16, border: '2px solid #0067c0', borderRadius: '4px 0 0 4px', outline: 'none' }} placeholder="جستجو در وب..." />
            <button style={{ padding: '12px 20px', background: '#0067c0', color: '#fff', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontSize: 16 }}>🔍</button>
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 16, justifyContent: 'center', fontSize: 13, color: '#666' }}>
            {['وب', 'تصویر', 'ویدئو', 'اخبار', 'نقشه'].map(t => (
              <span key={t} style={{ cursor: 'pointer', color: '#0067c0' }}>{t}</span>
            ))}
          </div>
        </div>
      )
    },
    'http://update.microsoft.com': {
      title: 'Windows Update - Windows 7',
      content: (
        <div style={{ padding: 20 }}>
          <h2 style={{ color: '#0067c0', borderBottom: '1px solid #ccc', paddingBottom: 8 }}>🔄 Windows Update</h2>
          <div style={{ background: '#e8f8e8', border: '1px solid #98d88d', borderRadius: 4, padding: 16, marginBottom: 16 }}>
            <h3 style={{ color: '#2d7a2d', margin: '0 0 4px' }}>✓ Windows 7 به‌روز است</h3>
            <p style={{ color: '#555', fontSize: 13, margin: 0 }}>آخرین به‌روزرسانی: ۱ فروردین ۱۴۰۳</p>
          </div>
          <div style={{ fontSize: 13, color: '#555' }}>
            <p>تمام به‌روزرسانی‌های مهم نصب شده‌اند.</p>
            <p style={{ marginTop: 8 }}>نسخه: Windows 7 SP1 (6.1.7601.17514)</p>
          </div>
        </div>
      )
    }
  };

  const navigate = (newUrl: string) => {
    setUrl(newUrl);
    setInputUrl(newUrl);
    const newHist = [...history.slice(0, histIdx + 1), newUrl];
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
    setTabs(t => t.map((tab2, i) => i === tab ? { ...tab2, url: newUrl, title: pages[newUrl]?.title || newUrl } : tab2));
  };

  const page = pages[url] || {
    title: url,
    content: (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌐</div>
        <h2 style={{ color: '#e74c3c', marginBottom: 8 }}>صفحه پیدا نشد</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>{url}</p>
        <p style={{ color: '#999', fontSize: 13 }}>آدرس را بررسی کنید یا از لینک‌های پیش‌فرض استفاده کنید.</p>
      </div>
    )
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Tabs */}
      <div style={{ background: '#e8f0ff', borderBottom: '1px solid #c0d0f0', display: 'flex', alignItems: 'flex-end', padding: '4px 4px 0' }}>
        {tabs.map((t, i) => (
          <div key={i} style={{
            padding: '4px 12px', cursor: 'pointer', fontSize: 12,
            background: tab === i ? '#fff' : 'rgba(255,255,255,0.5)',
            border: '1px solid #c0d0f0', borderBottom: tab === i ? '1px solid #fff' : 'none',
            borderRadius: '4px 4px 0 0', marginRight: 2, display: 'flex', alignItems: 'center', gap: 6
          }} onClick={() => { setTab(i); setUrl(t.url); setInputUrl(t.url); }}>
            <span>🌐</span>
            <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
            {tabs.length > 1 && <span onClick={e => { e.stopPropagation(); const nt = tabs.filter((_, idx) => idx !== i); setTabs(nt); setTab(Math.min(tab, nt.length - 1)); }} style={{ color: '#aaa', fontSize: 14, lineHeight: 1 }}>×</span>}
          </div>
        ))}
        <button onClick={() => { setTabs(t => [...t, { title: 'New Tab', url: 'http://www.msn.com' }]); setTab(tabs.length); }}
          style={{ padding: '2px 8px', background: 'transparent', border: '1px solid #c0d0f0', borderRadius: '3px 3px 0 0', cursor: 'pointer', fontSize: 16, marginLeft: 2, color: '#666' }}>+</button>
      </div>

      {/* Toolbar */}
      <div style={{ background: '#f5f8ff', borderBottom: '1px solid #c0d0f0', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <button className="toolbar-btn" onClick={() => { if (histIdx > 0) { const prev = history[histIdx - 1]; setHistIdx(h => h - 1); setUrl(prev); setInputUrl(prev); } }} disabled={histIdx === 0} style={{ opacity: histIdx === 0 ? 0.4 : 1 }}>◀</button>
        <button className="toolbar-btn" onClick={() => { if (histIdx < history.length - 1) { const next = history[histIdx + 1]; setHistIdx(h => h + 1); setUrl(next); setInputUrl(next); } }} disabled={histIdx === history.length - 1} style={{ opacity: histIdx === history.length - 1 ? 0.4 : 1 }}>▶</button>
        <button className="toolbar-btn" onClick={() => navigate(url)}>🔄</button>
        <button className="toolbar-btn" onClick={() => navigate('http://www.msn.com')}>🏠</button>

        <div className="address-bar">
          <span style={{ fontSize: 14 }}>🌐</span>
          <input
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit' }}
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(inputUrl)}
          />
          <button onClick={() => navigate(inputUrl)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>→</button>
        </div>

        <button className="toolbar-btn" onClick={() => setShowFavs(!showFavs)}>⭐</button>
        <button className="toolbar-btn" onClick={() => setFavorites(f => [...f, { name: page.title, url }])}>➕⭐</button>
      </div>

      {/* Favorites bar */}
      {showFavs && (
        <div style={{ background: '#f0f4ff', borderBottom: '1px solid #c0d0f0', padding: '3px 8px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {favorites.map((f, i) => (
            <button key={i} onClick={() => { navigate(f.url); setShowFavs(false); }}
              style={{ padding: '2px 10px', fontSize: 11, cursor: 'pointer', background: '#fff', border: '1px solid #c0d0f0', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              ⭐ {f.name}
            </button>
          ))}
        </div>
      )}

      {/* Page content */}
      <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
        {page.content}
      </div>

      {/* Status bar */}
      <div style={{ background: '#e8f0ff', borderTop: '1px solid #c0d0f0', padding: '2px 10px', fontSize: 11, color: '#555', display: 'flex', justifyContent: 'space-between' }}>
        <span>✓ Done</span>
        <span>Internet Explorer 8 — Windows 7 Protected Mode: On</span>
      </div>
    </div>
  );
};

export default Browser;
