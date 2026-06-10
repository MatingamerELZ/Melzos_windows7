import React, { useState, useEffect, useCallback, useRef } from 'react';
import RegisterScreen from './components/RegisterScreen';
import WindowFrame from './components/WindowFrame';
import StartMenu from './components/StartMenu';
import Notepad from './components/apps/Notepad';
import Calculator from './components/apps/Calculator';
import CMD from './components/apps/CMD';
import FileExplorer from './components/apps/FileExplorer';
import MediaPlayer from './components/apps/MediaPlayer';
import CodeEditor from './components/apps/CodeEditor';
import TaskManager from './components/apps/TaskManager';
import Paint from './components/apps/Paint';
import Browser from './components/apps/Browser';
import ControlPanel from './components/apps/ControlPanel';
import { User, Window, AppScreen, DesktopIcon } from './types';
import { buildFileSystem } from './data/fileSystem';

let windowCounter = 0;
const makeId = () => `win-${++windowCounter}`;

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('register');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [clock, setClock] = useState(new Date());
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showShutdown, setShowShutdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [trayExpanded, setTrayExpanded] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const topZ = useRef(100);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRegister = (user: User) => {
    // Add/update user in list
    setUsers(u => {
      const exists = u.find(x => x.username === user.username);
      if (exists) return u.map(x => x.username === user.username ? user : x);
      return [...u, user];
    });
    setCurrentUser(user);
    setScreen('desktop');
    showNotification(`خوش آمدید، ${user.username}! 🎉`);
  };

  const openApp = useCallback((app: string, title: string, icon: string, data?: any) => {
    const z = ++topZ.current;
    const w: Window = {
      id: makeId(),
      title,
      icon,
      app,
      x: 80 + (windowCounter % 8) * 30,
      y: 60 + (windowCounter % 6) * 25,
      width: app === 'calculator' ? 340 : app === 'cmd' ? 700 : app === 'paint' ? 900 : app === 'mediaplayer' ? 480 : app === 'codeeditor' ? 900 : 780,
      height: app === 'calculator' ? 380 : app === 'cmd' ? 450 : app === 'paint' ? 580 : app === 'mediaplayer' ? 500 : app === 'codeeditor' ? 600 : 520,
      minimized: false,
      maximized: false,
      focused: true,
      zIndex: z,
      data
    };
    setWindows(wins => [...wins.map(win => ({ ...win, focused: false })), w]);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(wins => wins.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(wins => wins.map(w => w.id === id ? { ...w, minimized: true, focused: false } : w));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(wins => wins.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  }, []);

  const focusWindow = useCallback((id: string) => {
    const z = ++topZ.current;
    setWindows(wins => wins.map(w => ({
      ...w,
      focused: w.id === id,
      zIndex: w.id === id ? z : w.zIndex,
      minimized: w.id === id ? false : w.minimized
    })));
  }, []);

  const updateWindow = useCallback((id: string, updates: Partial<Window>) => {
    setWindows(wins => wins.map(w => w.id === id ? { ...w, ...updates } : w));
  }, []);

  const toggleTaskbarApp = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;
    if (win.minimized) {
      focusWindow(id);
    } else if (win.focused) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const desktopIcons: DesktopIcon[] = [
    { id: 'explorer', name: 'Computer', icon: '💻', app: 'explorer' },
    { id: 'docs', name: 'Documents', icon: '📄', app: 'explorer', data: { path: `C:\\Users\\${currentUser?.username}\\Documents` } },
    { id: 'recycle', name: 'Recycle Bin', icon: '🗑️', app: 'notepad', data: { content: 'Recycle Bin is empty.', filename: 'Recycle Bin' } },
    { id: 'ie', name: 'Internet Explorer', icon: '🌐', app: 'browser' },
    { id: 'media', name: 'Windows Media Player', icon: '🎵', app: 'mediaplayer' },
    { id: 'notepad', name: 'Notepad', icon: '📝', app: 'notepad' },
    { id: 'calc', name: 'Calculator', icon: '🔢', app: 'calculator' },
    { id: 'paint', name: 'Paint', icon: '🎨', app: 'paint' },
    { id: 'cmd', name: 'Command Prompt', icon: '⬛', app: 'cmd' },
    { id: 'code', name: 'Code Editor', icon: '💻', app: 'codeeditor' },
    { id: 'taskmgr', name: 'Task Manager', icon: '📊', app: 'taskmanager' },
    { id: 'controlpanel', name: 'Control Panel', icon: '🔧', app: 'controlpanel' },
  ];

  const renderAppContent = (win: Window) => {
    const user = currentUser!;
    const fs = buildFileSystem(user.username);

    switch (win.app) {
      case 'notepad':
        return <Notepad initialContent={win.data?.content || ''} filename={win.data?.filename || 'Untitled'} />;
      case 'calculator':
        return <Calculator />;
      case 'cmd':
        return <CMD username={user.username} />;
      case 'explorer':
        return <FileExplorer fileSystem={fs} initialPath={win.data?.path || 'C:\\'} username={user.username} />;
      case 'mediaplayer':
        return <MediaPlayer />;
      case 'codeeditor':
        return <CodeEditor />;
      case 'taskmanager':
        return <TaskManager />;
      case 'paint':
        return <Paint />;
      case 'browser':
        return <Browser />;
      case 'controlpanel':
        return <ControlPanel user={user} />;
      default:
        return (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>{win.icon}</div>
            <p style={{ marginTop: 12, color: '#666' }}>برنامه در حال بارگذاری...</p>
          </div>
        );
    }
  };

  // REGISTER / LOGIN SCREEN
  if (screen === 'register') {
    return (
      <RegisterScreen
        onRegister={handleRegister}
        onLogin={() => setScreen('desktop')}
        existingUsers={users}
      />
    );
  }

  // SHUTDOWN SCREEN
  if (showShutdown) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 999999, fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>⏻</div>
        <div style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>در حال خاموش کردن...</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Windows 7 — M ELZ Edition</div>
        <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
          <button onClick={() => { setShowShutdown(false); setScreen('register'); setWindows([]); setCurrentUser(null); }}
            style={{ padding: '10px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
            خاموش کردن
          </button>
          <button onClick={() => setShowShutdown(false)}
            style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
            لغو
          </button>
        </div>
      </div>
    );
  }

  // DESKTOP
  return (
    <div
      ref={desktopRef}
      style={{
        width: '100vw', height: '100vh', overflow: 'hidden',
        backgroundImage: 'url(/wallpaper.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        position: 'relative'
      }}
      onClick={() => { setStartMenuOpen(false); setContextMenu(null); setSelectedDesktopIcon(null); setShowCalendar(false); setTrayExpanded(false); }}
      onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); setStartMenuOpen(false); }}
    >
      {/* Desktop icons */}
      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 10 }}>
        {desktopIcons.map(icon => (
          <div
            key={icon.id}
            className={`desktop-icon ${selectedDesktopIcon === icon.id ? 'selected' : ''}`}
            onClick={e => { e.stopPropagation(); setSelectedDesktopIcon(icon.id); }}
            onDoubleClick={e => { e.stopPropagation(); openApp(icon.app, icon.name, icon.icon, icon.data); setSelectedDesktopIcon(null); }}
          >
            <span className="desktop-icon-img">{icon.icon}</span>
            <span className="desktop-icon-text">{icon.name}</span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map(win => (
        <WindowFrame
          key={win.id}
          win={win}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onUpdate={updateWindow}
        >
          {renderAppContent(win)}
        </WindowFrame>
      ))}

      {/* Start Menu */}
      {startMenuOpen && currentUser && (
        <StartMenu
          user={currentUser}
          onOpen={openApp}
          onClose={() => setStartMenuOpen(false)}
          onShutdown={() => { setStartMenuOpen(false); setShowShutdown(true); }}
          onLogout={() => { setStartMenuOpen(false); setScreen('register'); setWindows([]); setCurrentUser(null); }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: Math.min(contextMenu.x, window.innerWidth - 200), top: Math.min(contextMenu.y, window.innerHeight - 300) }}
          onClick={e => e.stopPropagation()}
        >
          <div className="context-item" onClick={() => { openApp('notepad', 'New Text Document', '📝'); setContextMenu(null); }}>
            <span>📝</span> سند متنی جدید
          </div>
          <div className="context-item" onClick={() => { openApp('explorer', 'Computer', '💻'); setContextMenu(null); }}>
            <span>📁</span> باز کردن Explorer
          </div>
          <div className="context-separator" />
          <div className="context-item" onClick={() => { openApp('controlpanel', 'Control Panel', '🔧', { section: 'Personalization' }); setContextMenu(null); }}>
            <span>🎨</span> شخصی‌سازی
          </div>
          <div className="context-item" onClick={() => { openApp('controlpanel', 'Display Settings', '🖥️', { section: 'Display' }); setContextMenu(null); }}>
            <span>🖥️</span> تنظیمات صفحه
          </div>
          <div className="context-separator" />
          <div className="context-item" onClick={() => { openApp('browser', 'Internet Explorer', '🌐'); setContextMenu(null); }}>
            <span>🌐</span> باز کردن مرورگر
          </div>
          <div className="context-item" onClick={() => { openApp('taskmanager', 'Task Manager', '📊'); setContextMenu(null); }}>
            <span>📊</span> Task Manager
          </div>
          <div className="context-separator" />
          <div className="context-item" onClick={() => { openApp('notepad', 'About Windows 7', 'ℹ️', { content: 'Windows 7 Ultimate\nM ELZ Edition\n\nVersion: 6.1.7601 SP1\nCreator: M ELZ\n\n© 2024 M ELZ Corporation\nAll rights reserved.\n\nSerial: MELZ-7777-PRO-00001\nRegistered to: M ELZ' }); setContextMenu(null); }}>
            <span>ℹ️</span> درباره Windows 7
          </div>
        </div>
      )}

      {/* TASKBAR */}
      <div className="taskbar" onClick={e => e.stopPropagation()}>
        {/* Start button */}
        <button
          className="start-btn"
          onClick={(e) => { e.stopPropagation(); setStartMenuOpen(s => !s); setContextMenu(null); }}
          title="Start"
        >
          <div className="start-orb">
            <span style={{ fontSize: 22 }}>🪟</span>
          </div>
        </button>

        {/* Taskbar apps */}
        <div className="taskbar-apps">
          {/* Pinned quick launch */}
          {[
            { icon: '🌐', label: 'Browser', app: 'browser', title: 'Internet Explorer' },
            { icon: '📁', label: 'Explorer', app: 'explorer', title: 'Computer' },
            { icon: '🎵', label: 'WMP', app: 'mediaplayer', title: 'Windows Media Player' },
          ].map(p => (
            <button
              key={p.app}
              className="taskbar-app-btn"
              style={{ minWidth: 36, maxWidth: 36, padding: 0, justifyContent: 'center' }}
              title={p.title}
              onClick={() => openApp(p.app, p.title, p.icon)}
            >
              <span style={{ fontSize: 18 }}>{p.icon}</span>
            </button>
          ))}

          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />

          {/* Open windows */}
          {windows.map(win => (
            <button
              key={win.id}
              className={`taskbar-app-btn ${win.focused && !win.minimized ? 'active' : ''}`}
              onClick={() => toggleTaskbarApp(win.id)}
              title={win.title}
            >
              <span style={{ fontSize: 14 }}>{win.icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>{win.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="system-tray">
          {/* Notification area expand */}
          <button onClick={() => setTrayExpanded(t => !t)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 10, padding: '2px 4px' }}>▲</button>

          {trayExpanded && (
            <div style={{ display: 'flex', gap: 4 }}>
              <span className="tray-icon" title="Volume">🔊</span>
              <span className="tray-icon" title="Network">🌐</span>
              <span className="tray-icon" title="Security">🛡️</span>
              <span className="tray-icon" title="Power">🔋</span>
              <span className="tray-icon" title="Language">🌏</span>
            </div>
          )}

          <span className="tray-icon" title="Network Connected">📡</span>
          <span className="tray-icon" onClick={() => openApp('mediaplayer', 'Windows Media Player', '🎵')} title="Volume">🔊</span>

          {/* Clock */}
          <div
            className="tray-clock"
            onClick={(e) => { e.stopPropagation(); setShowCalendar(c => !c); }}
            style={{ cursor: 'pointer' }}
          >
            <div>{clock.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div style={{ fontSize: 10 }}>{clock.toLocaleDateString('fa-IR')}</div>
          </div>

          {/* Show Desktop */}
          <div
            title="Show Desktop"
            onClick={() => setWindows(wins => wins.map(w => ({ ...w, minimized: true, focused: false })))}
            style={{ width: 8, height: 34, borderLeft: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', marginLeft: 4 }}
          />
        </div>
      </div>

      {/* Calendar popup */}
      {showCalendar && (
        <div
          style={{
            position: 'fixed', bottom: 44, right: 8,
            background: 'linear-gradient(to bottom, #f8f8ff, #e8f0ff)',
            border: '1px solid rgba(100,150,255,0.4)',
            borderRadius: 4, padding: 16, zIndex: 9999,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            width: 220
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#1a4f9f' }}>
            {clock.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 11, textAlign: 'center' }}>
            {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => (
              <div key={d} style={{ color: '#888', fontWeight: 600, padding: '2px 0' }}>{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 4;
              const today = clock.getDate();
              return (
                <div key={i} style={{
                  padding: '3px 0', borderRadius: 3, cursor: 'pointer', fontSize: 11,
                  background: day === today ? '#1a4f9f' : 'transparent',
                  color: day === today ? '#fff' : day > 0 && day <= 30 ? '#333' : '#ccc',
                  fontWeight: day === today ? 600 : 400
                }}>
                  {day > 0 && day <= 30 ? day : ''}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, textAlign: 'center', fontSize: 16, fontWeight: 300, color: '#1a4f9f' }}>
            {clock.toLocaleTimeString('fa-IR')}
          </div>
          <div style={{ marginTop: 6, textAlign: 'center', fontSize: 12, color: '#666' }}>
            {clock.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="notification">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🪟</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 12 }}>Windows 7 — M ELZ Edition</div>
              <div style={{ fontSize: 12, marginTop: 2 }}>{notification}</div>
            </div>
          </div>
        </div>
      )}

      {/* Creator watermark */}
      <div style={{ position: 'fixed', bottom: 45, right: 10, color: 'rgba(255,255,255,0.3)', fontSize: 10, textAlign: 'right', pointerEvents: 'none' }}>
        Windows 7 — M ELZ Edition<br />
        Build 7601.17514
      </div>
    </div>
  );
};

export default App;
