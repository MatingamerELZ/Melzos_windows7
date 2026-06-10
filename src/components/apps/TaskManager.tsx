import React, { useState, useEffect } from 'react';

const TaskManager: React.FC = () => {
  const [tab, setTab] = useState<'apps' | 'processes' | 'performance' | 'services' | 'networking'>('processes');
  const [cpuUsage, setCpuUsage] = useState(15);
  const [memUsage, setMemUsage] = useState(42);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(50).fill(0).map(() => Math.random() * 30));
  const [memHistory, setMemHistory] = useState<number[]>(Array(50).fill(0).map(() => 40 + Math.random() * 10));

  const processes = [
    { name: 'explorer.exe', pid: 2428, cpu: 1.2, mem: 64328, user: 'm.elz', priority: 'Normal' },
    { name: 'System', pid: 4, cpu: 0.1, mem: 8720, user: 'SYSTEM', priority: 'Realtime' },
    { name: 'svchost.exe', pid: 748, cpu: 0.5, mem: 12400, user: 'SYSTEM', priority: 'Normal' },
    { name: 'svchost.exe', pid: 820, cpu: 0.3, mem: 8840, user: 'NETWORK', priority: 'Normal' },
    { name: 'dwm.exe', pid: 1064, cpu: 2.1, mem: 34128, user: 'SYSTEM', priority: 'High' },
    { name: 'csrss.exe', pid: 476, cpu: 0.2, mem: 5504, user: 'SYSTEM', priority: 'High' },
    { name: 'taskmgr.exe', pid: 4188, cpu: 0.8, mem: 15200, user: 'm.elz', priority: 'High' },
    { name: 'notepad.exe', pid: 3100, cpu: 0.0, mem: 8240, user: 'm.elz', priority: 'Normal' },
    { name: 'calc.exe', pid: 3200, cpu: 0.0, mem: 6120, user: 'm.elz', priority: 'Normal' },
    { name: 'winlogon.exe', pid: 524, cpu: 0.1, mem: 7200, user: 'SYSTEM', priority: 'High' },
    { name: 'services.exe', pid: 532, cpu: 0.1, mem: 9840, user: 'SYSTEM', priority: 'Normal' },
    { name: 'lsass.exe', pid: 548, cpu: 0.2, mem: 12000, user: 'SYSTEM', priority: 'Normal' },
    { name: 'audiodg.exe', pid: 1532, cpu: 0.4, mem: 18000, user: 'LOCAL', priority: 'Normal' },
    { name: 'wmpnetwk.exe', pid: 2100, cpu: 0.1, mem: 11000, user: 'NETWORK', priority: 'BelowNormal' },
    { name: 'SearchIndexer.exe', pid: 2800, cpu: 1.5, mem: 32000, user: 'SYSTEM', priority: 'BelowNormal' },
  ];

  const [processList, setProcessList] = useState(processes.map(p => ({ ...p, cpu: p.cpu + Math.random() * 2 })));

  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = Math.max(5, Math.min(95, cpuUsage + (Math.random() - 0.5) * 10));
      const newMem = Math.max(30, Math.min(90, memUsage + (Math.random() - 0.5) * 3));
      setCpuUsage(parseFloat(newCpu.toFixed(1)));
      setMemUsage(parseFloat(newMem.toFixed(1)));
      setCpuHistory(h => [...h.slice(1), newCpu]);
      setMemHistory(h => [...h.slice(1), newMem]);
      setProcessList(p => p.map(proc => ({ ...proc, cpu: Math.max(0, proc.cpu + (Math.random() - 0.5) * 0.5) })));
    }, 1000);
    return () => clearInterval(interval);
  }, [cpuUsage, memUsage]);

  const renderChart = (data: number[], color: string, label: string, value: number) => (
    <div style={{ background: '#000', border: '1px solid #006600', borderRadius: 4, padding: 8, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
        <span style={{ color: '#00cc00', fontWeight: 600 }}>{label}</span>
        <span style={{ color: '#00cc00' }}>{value.toFixed(1)}%</span>
      </div>
      <svg width="100%" height="70" style={{ display: 'block' }}>
        <rect width="100%" height="100%" fill="#001200" />
        {[25, 50, 75].map(v => (
          <line key={v} x1="0" y1={`${100 - v}%`} x2="100%" y2={`${100 - v}%`} stroke="#003300" strokeWidth="1" />
        ))}
        <polyline
          points={data.map((v, i) => `${(i / (data.length - 1)) * 100}%,${70 - (v / 100) * 60}`).join(' ')}
          fill="none" stroke={color} strokeWidth="1.5"
        />
        <polyline
          points={[`0,70`, ...data.map((v, i) => `${(i / (data.length - 1)) * 100}%,${70 - (v / 100) * 60}`), `100%,70`].join(' ')}
          fill={color + '20'} stroke="none"
        />
      </svg>
    </div>
  );

  const services = [
    { name: 'AudioSrv', display: 'Windows Audio', status: 'Running', startup: 'Automatic', pid: 1532 },
    { name: 'DHCP', display: 'DHCP Client', status: 'Running', startup: 'Automatic', pid: 820 },
    { name: 'Dnscache', display: 'DNS Client', status: 'Running', startup: 'Automatic', pid: 748 },
    { name: 'EventLog', display: 'Windows Event Log', status: 'Running', startup: 'Automatic', pid: 532 },
    { name: 'LanmanServer', display: 'Server', status: 'Running', startup: 'Automatic', pid: 748 },
    { name: 'MpsSvc', display: 'Windows Firewall', status: 'Running', startup: 'Automatic', pid: 748 },
    { name: 'MSSQL', display: 'SQL Server Express', status: 'Stopped', startup: 'Manual', pid: 0 },
    { name: 'RemoteRegistry', display: 'Remote Registry', status: 'Stopped', startup: 'Disabled', pid: 0 },
    { name: 'Schedule', display: 'Task Scheduler', status: 'Running', startup: 'Automatic', pid: 748 },
    { name: 'Themes', display: 'Themes', status: 'Running', startup: 'Automatic', pid: 748 },
    { name: 'W32Time', display: 'Windows Time', status: 'Running', startup: 'Automatic', pid: 748 },
    { name: 'WinDefend', display: 'Windows Defender', status: 'Running', startup: 'Automatic', pid: 1800 },
    { name: 'Wuauserv', display: 'Windows Update', status: 'Running', startup: 'Automatic', pid: 2200 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f0f0' }}>
      {/* Menu */}
      <div style={{ background: '#f0f0f0', borderBottom: '1px solid #ccc', display: 'flex', gap: 0, fontSize: 12 }}>
        {['File', 'Options', 'View', 'Help'].map(m => (
          <div key={m} style={{ padding: '3px 10px', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#e0e0e0'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            {m}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        {(['apps', 'processes', 'performance', 'services', 'networking'] as const).map(t => (
          <div key={t}
            style={{
              padding: '5px 14px', cursor: 'pointer', fontSize: 12,
              background: tab === t ? '#fff' : 'transparent',
              borderTop: tab === t ? '2px solid #4a90e2' : '2px solid transparent',
              borderRight: '1px solid #ccc', fontWeight: tab === t ? 600 : 400
            }}
            onClick={() => setTab(t)}>
            {t === 'apps' ? 'Applications' : t === 'processes' ? 'Processes' : t === 'performance' ? 'Performance' : t === 'services' ? 'Services' : 'Networking'}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
        {tab === 'apps' && (
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>برنامه‌های در حال اجرا:</p>
            {['File Explorer', 'Task Manager', 'Windows Media Player', 'Notepad', 'Calculator'].map(app => (
              <div key={app} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 3, marginBottom: 4, fontSize: 12 }}>
                <span>📌 {app}</span>
                <span style={{ color: '#27ae60', fontWeight: 600 }}>Running</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button style={{ padding: '4px 16px', fontSize: 12, cursor: 'pointer', background: '#f0f0f0', border: '1px solid #aaa', borderRadius: 3 }}>End Task</button>
              <button style={{ padding: '4px 16px', fontSize: 12, cursor: 'pointer', background: '#f0f0f0', border: '1px solid #aaa', borderRadius: 3 }}>New Task...</button>
            </div>
          </div>
        )}

        {tab === 'processes' && (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#e8f0ff', position: 'sticky', top: 0 }}>
                  {['نام پروسه', 'PID', 'CPU%', 'حافظه (K)', 'کاربر', 'اولویت'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '5px 8px', borderBottom: '1px solid #ccc', cursor: 'pointer', fontWeight: 600, color: '#1a4f9f' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processList.sort((a, b) => b.cpu - a.cpu).map((p, i) => (
                  <tr key={p.pid} style={{ background: i % 2 === 0 ? '#fff' : '#f8f8f8', cursor: 'default' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(50,120,220,0.1)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#fff' : '#f8f8f8'}>
                    <td style={{ padding: '4px 8px' }}>{p.name}</td>
                    <td style={{ padding: '4px 8px', color: '#888' }}>{p.pid}</td>
                    <td style={{ padding: '4px 8px', color: p.cpu > 5 ? '#e74c3c' : p.cpu > 2 ? '#e67e22' : '#27ae60', fontWeight: 600 }}>{p.cpu.toFixed(1)}</td>
                    <td style={{ padding: '4px 8px', color: '#555' }}>{(p.mem / 1024).toFixed(0)} MB</td>
                    <td style={{ padding: '4px 8px', color: p.user === 'SYSTEM' ? '#e67e22' : '#333' }}>{p.user}</td>
                    <td style={{ padding: '4px 8px', color: '#888' }}>{p.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'performance' && (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {renderChart(cpuHistory, '#00cc00', '🔧 CPU Usage', cpuUsage)}
              {renderChart(memHistory, '#00aaff', '💾 Memory Usage', memUsage)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'CPU', value: `${cpuUsage.toFixed(1)}%`, sub: 'Intel Core i9-13900K' },
                { label: 'حافظه', value: `${(16384 * memUsage / 100 / 1024).toFixed(1)} GB / 16 GB`, sub: `${memUsage.toFixed(1)}% استفاده شده` },
                { label: 'Handles', value: '28,432', sub: 'System Handles' },
                { label: 'Threads', value: '892', sub: 'Active Threads' },
                { label: 'Processes', value: '68', sub: 'Running Processes' },
                { label: 'Up Time', value: '2:14:38', sub: 'System Uptime' },
              ].map(item => (
                <div key={item.label} style={{ background: '#f0f4ff', border: '1px solid #c0d0f0', borderRadius: 4, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a4f9f', margin: '2px 0' }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: '#aaa' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'services' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#e8f0ff' }}>
                {['نام', 'عنوان', 'وضعیت', 'نوع راه‌اندازی', 'PID'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '5px 8px', borderBottom: '1px solid #ccc', color: '#1a4f9f', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={s.name} style={{ background: i % 2 === 0 ? '#fff' : '#f8f8f8' }}>
                  <td style={{ padding: '4px 8px', fontFamily: 'Courier New', fontSize: 11 }}>{s.name}</td>
                  <td style={{ padding: '4px 8px' }}>{s.display}</td>
                  <td style={{ padding: '4px 8px' }}>
                    <span style={{ color: s.status === 'Running' ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>● {s.status}</span>
                  </td>
                  <td style={{ padding: '4px 8px', color: s.startup === 'Disabled' ? '#999' : '#555' }}>{s.startup}</td>
                  <td style={{ padding: '4px 8px', color: '#888' }}>{s.pid || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'networking' && (
          <div style={{ padding: 16 }}>
            <div style={{ background: '#000', border: '1px solid #006600', borderRadius: 4, padding: 12, marginBottom: 12 }}>
              <div style={{ color: '#00cc00', fontSize: 12, marginBottom: 8 }}>📡 Network Adapter: Local Area Connection</div>
              <svg width="100%" height="80">
                <rect width="100%" height="100%" fill="#001200" />
                {Array.from({ length: 50 }, (_, i) => {
                  const v = Math.random() * 60 + 5;
                  return <rect key={i} x={`${i * 2}%`} y={80 - v} width="1.8%" height={v} fill="#00cc00" opacity="0.7" />;
                })}
              </svg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'آداپتور', value: 'Intel PRO/1000 MT' },
                { label: 'وضعیت', value: 'Connected' },
                { label: 'سرعت', value: '100 Mbps' },
                { label: 'IP', value: '192.168.1.100' },
                { label: 'ارسال', value: '1.2 MB/s' },
                { label: 'دریافت', value: '3.4 MB/s' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f0f4ff', border: '1px solid #c0d0f0', borderRadius: 3, fontSize: 12 }}>
                  <span style={{ color: '#666' }}>{item.label}:</span>
                  <span style={{ fontWeight: 600, color: '#1a4f9f' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: '#f0f0f0', borderTop: '1px solid #ccc', padding: '3px 8px', fontSize: 11, color: '#555', display: 'flex', gap: 16 }}>
        <span>CPU: {cpuUsage.toFixed(1)}%</span>
        <span>RAM: {memUsage.toFixed(1)}%</span>
        <span>Processes: {processList.length}</span>
      </div>
    </div>
  );
};

export default TaskManager;
