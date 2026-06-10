import React, { useState } from 'react';
import { User } from '../../types';

interface ControlPanelProps {
  user: User;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [view, setView] = useState<'category' | 'large' | 'small'>('category');
  const [wallpaper, setWallpaper] = useState('aurora');
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [resolution, setResolution] = useState('1920x1080');
  const [theme, setTheme] = useState('Aero');
  const [computerName] = useState('MELZ-PC');

  const categories = [
    {
      name: 'System and Security', icon: '🛡️', color: '#e8f4ff',
      items: ['Windows Firewall', 'Windows Update', 'Backup and Restore', 'BitLocker Drive Encryption', 'Action Center']
    },
    {
      name: 'Network and Internet', icon: '🌐', color: '#e8fff0',
      items: ['Network and Sharing Center', 'HomeGroup', 'Internet Options']
    },
    {
      name: 'Hardware and Sound', icon: '🔊', color: '#fff8e8',
      items: ['Devices and Printers', 'AutoPlay', 'Sound', 'Power Options', 'Display']
    },
    {
      name: 'Programs', icon: '📦', color: '#f8e8ff',
      items: ['Programs and Features', 'Default Programs', 'Desktop Gadgets']
    },
    {
      name: 'User Accounts and Family Safety', icon: '👤', color: '#ffe8f0',
      items: ['User Accounts', 'Parental Controls', 'Credential Manager']
    },
    {
      name: 'Appearance and Personalization', icon: '🎨', color: '#f0ffe8',
      items: ['Personalization', 'Display', 'Desktop Gadgets', 'Taskbar and Start Menu', 'Folder Options', 'Fonts']
    },
    {
      name: 'Clock, Language, and Region', icon: '🕐', color: '#fff0e8',
      items: ['Date and Time', 'Region and Language']
    },
    {
      name: 'Ease of Access', icon: '♿', color: '#e8f8ff',
      items: ['Ease of Access Center', 'Speech Recognition']
    },
  ];

  const renderSection = () => {
    if (!activeSection) return null;

    if (activeSection === 'Sound') {
      return (
        <div style={{ padding: 20 }}>
          <h3>🔊 Sound Settings</h3>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Master Volume: {volume}%</label>
            <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['Windows Start', 'Windows Shutdown', 'Notification', 'Error', 'Mail', 'Calendar'].map(s => (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: 3, fontSize: 12 }}>
                <span>{s}</span>
                <button style={{ fontSize: 11, padding: '1px 6px', cursor: 'pointer' }}>▶</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'Display') {
      return (
        <div style={{ padding: 20 }}>
          <h3>🖥️ Display Settings</h3>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13 }}>Brightness: {brightness}%</label>
            <input type="range" min={0} max={100} value={brightness} onChange={e => setBrightness(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13 }}>Resolution:</label>
            <select value={resolution} onChange={e => setResolution(e.target.value)} style={{ display: 'block', marginTop: 6, padding: '4px 8px', fontSize: 13, width: 200 }}>
              {['800x600', '1024x768', '1280x720', '1366x768', '1920x1080', '2560x1440', '3840x2160'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
            <p>Monitor: Generic PnP Monitor</p>
            <p>Graphics: NVIDIA GTX 4090 (M ELZ Edition)</p>
          </div>
        </div>
      );
    }

    if (activeSection === 'Personalization') {
      return (
        <div style={{ padding: 20 }}>
          <h3>🎨 Personalization</h3>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Theme:</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Aero', 'Windows Basic', 'Windows Classic', 'High Contrast'].map(t => (
                <div key={t} onClick={() => setTheme(t)} style={{
                  padding: '8px 16px', cursor: 'pointer', borderRadius: 4, fontSize: 12,
                  border: theme === t ? '2px solid #0067c0' : '1px solid #ccc',
                  background: theme === t ? '#e8f0ff' : '#f8f8f8',
                  fontWeight: theme === t ? 600 : 400
                }}>{t}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Wallpaper:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ id: 'aurora', label: 'Aurora', color: '#2a5a9a' }, { id: 'nature', label: 'Nature', color: '#2a7a2a' }, { id: 'space', label: 'Space', color: '#1a1a4a' }].map(w => (
                <div key={w.id} onClick={() => setWallpaper(w.id)} style={{
                  width: 80, height: 50, borderRadius: 4, cursor: 'pointer',
                  background: w.color,
                  border: wallpaper === w.id ? '3px solid #0067c0' : '2px solid #ccc',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4
                }}>
                  <span style={{ fontSize: 10, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{w.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Window Color:</label>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {['#1e6fbe', '#e05020', '#20a040', '#a020a0', '#e0a020', '#204080'].map(c => (
                <div key={c} style={{ width: 30, height: 30, background: c, borderRadius: 4, cursor: 'pointer', border: '2px solid rgba(0,0,0,0.2)' }} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === 'User Accounts') {
      return (
        <div style={{ padding: 20 }}>
          <h3>👤 User Accounts</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, padding: 16, background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: 4 }}>
            <div style={{ fontSize: 48 }}>{user.avatar || '👤'}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{user.username}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{user.accountType} Account</div>
              {user.isAdmin && <div style={{ fontSize: 12, color: '#0067c0', marginTop: 4 }}>👑 System Administrator</div>}
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Change account name', 'Change your password', 'Change your picture', 'Manage another account', 'Change User Account Control settings'].map(a => (
              <button key={a} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 13, cursor: 'pointer', background: 'none', border: '1px solid transparent', borderRadius: 3, color: '#0067c0' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f0f4ff'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}>
                › {a}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === 'Date and Time') {
      const now = new Date();
      return (
        <div style={{ padding: 20 }}>
          <h3>🕐 Date and Time</h3>
          <div style={{ marginTop: 16, display: 'flex', gap: 20 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 48, color: '#0067c0', fontWeight: 300 }}>{now.toLocaleTimeString()}</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>{now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, marginBottom: 8, fontWeight: 600 }}>Time Zone:</div>
              <div style={{ fontSize: 13, color: '#555' }}>(UTC+03:30) Tehran</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Daylight saving time currently in use</div>
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === 'System') {
      return (
        <div style={{ padding: 20 }}>
          <h3>🖥️ System Information</h3>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 6, fontSize: 13 }}>
            {[
              ['OS', 'Windows 7 Ultimate — M ELZ Edition'],
              ['Version', '6.1.7601 Service Pack 1'],
              ['Owner', 'M ELZ'],
              ['Computer Name', computerName],
              ['Processor', 'Intel Core i9-13900K @ 3.00 GHz'],
              ['RAM', '16.00 GB'],
              ['System Type', '64-bit Operating System'],
              ['Windows Experience Index', '7.9'],
            ].map(([label, value]) => (
              <React.Fragment key={label}>
                <span style={{ color: '#666', fontWeight: 500 }}>{label}:</span>
                <span style={{ color: '#222' }}>{value}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: 20 }}>
        <h3>{activeSection}</h3>
        <p style={{ color: '#666', fontSize: 13, marginTop: 12 }}>بخش "{activeSection}" در Windows 7 M ELZ Edition موجود است.</p>
        <div style={{ marginTop: 16, padding: 16, background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: 4, fontSize: 13, color: '#555' }}>
          <p>این تنظیمات در این شبیه‌ساز به صورت کامل پشتیبانی می‌شود.</p>
          <p style={{ marginTop: 8 }}>برای اعمال تنظیمات واقعی، از سیستم‌عامل اصلی استفاده کنید.</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: '#fff' }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: '#e8f0ff', borderRight: '1px solid #c0d0f0', padding: '8px 0', overflowY: 'auto' }}>
        <div style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, color: '#1a4f9f', textTransform: 'uppercase' }}>Control Panel</div>
        <div style={{ height: 1, background: '#c0d0f0', margin: '4px 8px' }} />
        {['System', 'Display', 'Sound', 'Personalization', 'User Accounts', 'Date and Time', 'Windows Update', 'Firewall', 'Network'].map(item => (
          <div key={item} style={{ padding: '5px 12px', cursor: 'pointer', fontSize: 12, color: activeSection === item ? '#0067c0' : '#333', background: activeSection === item ? 'rgba(0,103,192,0.1)' : 'transparent', fontWeight: activeSection === item ? 600 : 400 }}
            onClick={() => setActiveSection(item)}>
            {item}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeSection ? (
          <div>
            <div style={{ padding: '6px 16px', background: '#f0f4ff', borderBottom: '1px solid #c0d0f0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setActiveSection(null)} style={{ background: 'none', border: 'none', color: '#0067c0', cursor: 'pointer', fontSize: 12 }}>← Control Panel</button>
              <span style={{ color: '#888' }}>›</span>
              <span style={{ color: '#333' }}>{activeSection}</span>
            </div>
            {renderSection()}
          </div>
        ) : (
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, color: '#1a4f9f', margin: 0 }}>Control Panel</h2>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['category', 'large', 'small'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ padding: '3px 8px', fontSize: 11, cursor: 'pointer', background: view === v ? '#d0e4ff' : '#f0f0f0', border: '1px solid #ccc', borderRadius: 3 }}>
                    {v === 'category' ? 'Category' : v === 'large' ? 'Large Icons' : 'Small Icons'}
                  </button>
                ))}
              </div>
            </div>

            {view === 'category' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {categories.map(cat => (
                  <div key={cat.name} style={{ background: cat.color, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}
                      onClick={() => setActiveSection(cat.items[0])}>
                      <span style={{ fontSize: 28 }}>{cat.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0067c0' }}>{cat.name}</span>
                    </div>
                    <div style={{ paddingLeft: 38 }}>
                      {cat.items.slice(0, 3).map(item => (
                        <div key={item} onClick={() => setActiveSection(item)} style={{ fontSize: 12, color: '#0067c0', cursor: 'pointer', marginBottom: 2 }}>
                          › {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: view === 'large' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: 8 }}>
                {categories.flatMap(c => c.items).map(item => (
                  <div key={item} onClick={() => setActiveSection(item)} style={{
                    display: 'flex', flexDirection: view === 'large' ? 'column' : 'row', alignItems: 'center', gap: 8,
                    padding: '8px', cursor: 'pointer', borderRadius: 4, fontSize: 12,
                    border: '1px solid transparent'
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e8f0ff'; (e.currentTarget as HTMLElement).style.borderColor = '#c0d0f0'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}>
                    <span style={{ fontSize: view === 'large' ? 32 : 16 }}>⚙️</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
