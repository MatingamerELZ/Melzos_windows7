import React from 'react';
import { User } from '../types';

interface StartMenuProps {
  user: User;
  onOpen: (app: string, title: string, icon: string, data?: any) => void;
  onClose: () => void;
  onShutdown: () => void;
  onLogout: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ user, onOpen, onClose, onShutdown, onLogout }) => {
  const leftItems = [
    { icon: '🌐', name: 'Internet Explorer', app: 'browser' },
    { icon: '📧', name: 'Windows Mail', app: 'notepad', data: { content: 'Windows Mail\n\nاین یک شبیه‌ساز ایمیل است', filename: 'Mail.eml' } },
    { icon: '🎵', name: 'Windows Media Player', app: 'mediaplayer' },
    { icon: '📝', name: 'Notepad', app: 'notepad' },
    { icon: '🔢', name: 'Calculator', app: 'calculator' },
    { icon: '🎨', name: 'Paint', app: 'paint' },
    { icon: '💻', name: 'Code Editor', app: 'codeeditor' },
    { icon: '⬛', name: 'Command Prompt', app: 'cmd' },
    { icon: '📊', name: 'Task Manager', app: 'taskmanager' },
    { icon: '📁', name: 'Windows Explorer', app: 'explorer' },
  ];

  const rightItems = [
    { icon: '👤', name: `${user.username}`, app: 'explorer', path: `C:\\Users\\${user.username}` },
    { icon: '📄', name: 'Documents', app: 'explorer', path: `C:\\Users\\${user.username}\\Documents` },
    { icon: '🖼️', name: 'Pictures', app: 'explorer', path: `C:\\Users\\${user.username}\\Pictures` },
    { icon: '🎵', name: 'Music', app: 'explorer', path: `C:\\Users\\${user.username}\\Music` },
    { icon: '🎬', name: 'Videos', app: 'explorer', path: `C:\\Users\\${user.username}\\Videos` },
    { icon: '💾', name: 'Computer', app: 'explorer', path: 'C:\\' },
    { icon: '🌐', name: 'Network', app: 'browser' },
    { icon: '🔧', name: 'Control Panel', app: 'controlpanel' },
    { icon: '🔍', name: 'Devices and Printers', app: 'notepad', data: { content: 'Devices and Printers\n\nلیست دستگاه‌های متصل:\n- Printer: HP LaserJet\n- Mouse: Generic USB Mouse\n- Keyboard: USB Keyboard' } },
    { icon: '⚙️', name: 'Default Programs', app: 'notepad', data: { content: 'Default Programs\n\nبرنامه‌های پیش‌فرض سیستم' } },
    { icon: '❓', name: 'Help and Support', app: 'notepad', data: { content: 'Windows 7 Help and Support\n\nبرای دریافت کمک، با M ELZ تماس بگیرید.\n\nسایت: melz.win7.sim\nایمیل: support@melz.dev' } },
  ];

  const open = (item: any) => {
    onOpen(item.app, item.name, item.icon, item.data || (item.path ? { path: item.path } : undefined));
    onClose();
  };

  return (
    <div className="start-menu" onClick={e => e.stopPropagation()}>
      {/* User header */}
      <div className="start-menu-user">
        <div className="start-menu-avatar">{user.avatar || '👤'}</div>
        <div>
          <div className="start-menu-username">{user.username}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
            {user.accountType === 'admin' ? '👑 Administrator' : user.accountType === 'pro' ? '⭐ Pro User' : user.accountType === 'elite' ? '💎 Elite User' : user.accountType === 'developer' ? '💻 Developer' : '👤 Standard User'}
          </div>
        </div>
      </div>

      <div className="start-menu-top">
        {/* Left panel */}
        <div className="start-menu-left">
          <div style={{ padding: '4px 0' }}>
            {leftItems.map((item, i) => (
              <div key={i} className="start-item start-item-left" onClick={() => open(item)}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>

          <div className="start-separator" />

          {/* Search box */}
          <div className="search-box">
            <span style={{ fontSize: 12 }}>🔍</span>
            <input placeholder="Search programs and files..." />
          </div>
        </div>

        {/* Right panel */}
        <div className="start-menu-right">
          {rightItems.map((item, i) => (
            <div key={i} className="start-item start-item-right" onClick={() => open(item)}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span>{item.name}</span>
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)' }}>›</span>
            </div>
          ))}

          <div className="start-separator-right" />

          <div className="start-item start-item-right" onClick={() => { onOpen('notepad', 'Run', '🏃', { content: '' }); onClose(); }}>
            <span style={{ fontSize: 14 }}>🏃</span>
            <span>Run...</span>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)' }}>›</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="start-menu-bottom">
        <button className="power-btn" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12 }} onClick={onLogout}>
          🔄 خروج
        </button>
        <div style={{ flex: 1 }} />
        <button className="power-btn" onClick={onShutdown}>
          ⏻ خاموش
        </button>
        <button className="power-btn" style={{ background: 'linear-gradient(to bottom, #6080c0, #405090)', padding: '4px 10px', fontSize: 12 }}>
          ⟳ راه‌اندازی مجدد
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
