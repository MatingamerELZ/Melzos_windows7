import React, { useState, useRef, useEffect } from 'react';

interface CMDLine { type: 'output' | 'input' | 'error'; text: string; }

const CMD: React.FC<{ username: string }> = ({ username }) => {
  const [lines, setLines] = useState<CMDLine[]>([
    { type: 'output', text: 'Microsoft Windows [Version 6.1.7601]' },
    { type: 'output', text: '(c) 2009 Microsoft Corporation. All rights reserved.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [currentDir, setCurrentDir] = useState(`C:\\Users\\${username}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const addLine = (text: string, type: CMDLine['type'] = 'output') => {
    setLines(l => [...l, { type, text }]);
  };

  const fileSystem: Record<string, string[]> = {
    'C:': ['Boot', 'Documents and Settings', 'Program Files', 'Program Files (x86)', 'ProgramData', 'System Volume Information', 'Users', 'Windows', 'hiberfil.sys', 'pagefile.sys', 'autoexec.bat'],
    'C:\\Users': [username, 'Default', 'Public', 'All Users'],
    [`C:\\Users\\${username}`]: ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos', 'AppData', 'Contacts', 'Favorites', 'Links', 'Saved Games', 'Searches'],
    'C:\\Windows': ['assembly', 'Boot', 'Fonts', 'Installer', 'Logs', 'Panther', 'PolicyDefinitions', 'Registration', 'SoftwareDistribution', 'System', 'System32', 'SysWOW64', 'Temp', 'Web', 'WinSxS'],
    'C:\\Windows\\System32': ['cmd.exe', 'ntoskrnl.exe', 'hal.dll', 'explorer.exe', 'taskmgr.exe', 'calc.exe', 'notepad.exe', 'mspaint.exe', 'kernel32.dll', 'user32.dll', 'ntdll.dll', 'drivers', 'config', 'wbem'],
    'C:\\Program Files': ['Internet Explorer', 'Windows Media Player', 'Windows NT', 'Java', 'Python', 'VLC Media Player', 'AIMP', 'Notepad++', 'Visual Studio Code', 'MinGW-W64'],
  };

  const resolveDir = (path: string): string => {
    if (path === '\\' || path === 'C:' || path === 'C:\\') return 'C:';
    return path;
  };

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    addLine(`${currentDir}>${trimmed}`, 'input');
    if (!trimmed) { return; }

    setHistory(h => [trimmed, ...h]);
    setHistIdx(-1);

    const parts = trimmed.split(' ');
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (base) {
      case 'cls':
        setLines([]);
        break;
      case 'help':
        addLine('Available commands:');
        ['cls', 'dir', 'cd', 'echo', 'ipconfig', 'systeminfo', 'date', 'time', 'ver', 'whoami',
         'ping', 'set', 'tasklist', 'type', 'md', 'mkdir', 'rd', 'color', 'exit', 'netstat', 'tree'].forEach(c => {
          addLine(`  ${c}`);
        });
        break;
      case 'dir':
        addLine(`\n Volume in drive C is Windows 7`);
        addLine(` Volume Serial Number is M3LZ-7777\n`);
        addLine(` Directory of ${currentDir}\n`);
        const items = fileSystem[currentDir] || fileSystem[resolveDir(currentDir)] || ['[Empty Directory]'];
        items.forEach(item => {
          const isDir = !item.includes('.');
          addLine(isDir
            ? `01/01/2024  12:00 AM    <DIR>          ${item}`
            : `01/01/2024  12:00 AM         ${Math.floor(Math.random()*99999+1000)} ${item}`
          );
        });
        addLine(`\n        ${items.filter(i => !i.includes('.')).length} Dir(s)  ${items.filter(i => i.includes('.')).length} File(s)`);
        break;
      case 'cd':
        if (!args[0]) { addLine(currentDir); break; }
        if (args[0] === '..') {
          const parts2 = currentDir.split('\\');
          if (parts2.length > 1) setCurrentDir(parts2.slice(0, -1).join('\\') || 'C:');
          else setCurrentDir('C:');
        } else if (args[0] === '\\') {
          setCurrentDir('C:');
        } else {
          const newDir = currentDir === 'C:' ? `C:\\${args[0]}` : `${currentDir}\\${args[0]}`;
          setCurrentDir(newDir);
        }
        break;
      case 'echo':
        if (args[0]?.toLowerCase() === 'on' || args[0]?.toLowerCase() === 'off') { addLine(`ECHO is ${args[0].toUpperCase()}`); break; }
        addLine(args.join(' ') || '');
        break;
      case 'ipconfig':
        addLine('Windows IP Configuration\n');
        addLine('Ethernet adapter Local Area Connection:');
        addLine('   Connection-specific DNS Suffix  . : localdomain');
        addLine('   IPv4 Address. . . . . . . . . . . : 192.168.1.100');
        addLine('   Subnet Mask . . . . . . . . . . . : 255.255.255.0');
        addLine('   Default Gateway . . . . . . . . . : 192.168.1.1');
        addLine('');
        addLine('Tunnel adapter isatap:');
        addLine('   Media State . . . . . . . . . . . : Media disconnected');
        break;
      case 'systeminfo':
        addLine('Host Name:                 MELZ-PC');
        addLine(`OS Name:                   Microsoft Windows 7 Ultimate`);
        addLine('OS Version:                6.1.7601 Service Pack 1 Build 7601');
        addLine('OS Manufacturer:           Microsoft Corporation');
        addLine('OS Configuration:          Standalone Workstation');
        addLine('OS Build Type:             Multiprocessor Free');
        addLine(`Registered Owner:          M ELZ`);
        addLine('Registered Organization:   M ELZ Corp');
        addLine('Product ID:                MELZ-7777-PRO-00001');
        addLine('Original Install Date:     1/1/2024, 12:00:00 AM');
        addLine('System Boot Time:          1/1/2024, 12:01:00 AM');
        addLine('System Manufacturer:       M ELZ Industries');
        addLine('System Model:              ELZ-X7');
        addLine('System Type:               x64-based PC');
        addLine('Processor(s):              Intel(R) Core(TM) i9-13900K, 3000 MHz');
        addLine('Total Physical Memory:     16,384 MB');
        addLine('Available Physical Memory: 12,288 MB');
        addLine('Virtual Memory: Max Size:  32,768 MB');
        break;
      case 'ver':
        addLine('\nMicrosoft Windows [Version 6.1.7601 — M ELZ Edition]\n');
        break;
      case 'whoami':
        addLine(`MELZ-PC\\${username}`);
        break;
      case 'date':
        addLine(`The current date is: ${new Date().toLocaleDateString('en-US')}`);
        break;
      case 'time':
        addLine(`The current time is: ${new Date().toLocaleTimeString()}`);
        break;
      case 'ping':
        const host = args[0] || 'google.com';
        addLine(`\nPinging ${host} with 32 bytes of data:`);
        for (let i = 0; i < 4; i++) {
          const ms = Math.floor(Math.random()*50)+5;
          addLine(`Reply from 142.250.185.14: bytes=32 time=${ms}ms TTL=118`);
        }
        addLine('\nPing statistics for 142.250.185.14:');
        addLine('    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)');
        addLine('Approximate round trip times:');
        addLine(`    Minimum = 5ms, Maximum = 55ms, Average = ${Math.floor(Math.random()*20)+10}ms`);
        break;
      case 'tasklist':
        addLine('Image Name                     PID Session Name        Session#    Mem Usage');
        addLine('========================= ======== ================ =========== ============');
        [['System Idle Process',0,4,'K'],['System',4,1,'8,720 K'],['smss.exe',308,1,'1,316 K'],
         ['csrss.exe',476,1,'5,504 K'],['wininit.exe',524,1,'4,820 K'],
         ['explorer.exe',2428,1,'64,328 K'],['notepad.exe',3100,1,'8,240 K'],
         ['cmd.exe',4188,1,'3,012 K']].forEach(([name,pid,sess,mem]) => {
          addLine(`${String(name).padEnd(26)} ${String(pid).padStart(8)} Services         ${String(sess).padStart(3)} ${mem || Math.floor(Math.random()*50000)+'K'}`);
        });
        break;
      case 'set':
        ['APPDATA=C:\\Users\\'+username+'\\AppData\\Roaming',
         'COMPUTERNAME=MELZ-PC','HOMEDRIVE=C:','HOMEPATH=\\Users\\'+username,
         'NUMBER_OF_PROCESSORS=8','OS=Windows_NT','PATH=C:\\Windows\\System32;C:\\Windows;C:\\Program Files\\Python;C:\\Program Files\\MinGW-W64\\bin',
         'PATHEXT=.COM;.EXE;.BAT;.CMD;.VBS;.JS',
         'PROCESSOR_ARCHITECTURE=AMD64','SYSTEMDRIVE=C:','SYSTEMROOT=C:\\Windows',
         'TEMP=C:\\Windows\\Temp','USERNAME='+username,'WINDIR=C:\\Windows'].forEach(v => addLine(v));
        break;
      case 'md':
      case 'mkdir':
        addLine(args[0] ? '' : 'The syntax of the command is incorrect.', args[0] ? 'output' : 'error');
        if (args[0]) addLine(`Directory created: ${currentDir}\\${args[0]}`);
        break;
      case 'color':
        addLine('Color changed. (Visual change not supported in this terminal)');
        break;
      case 'netstat':
        addLine('Active Connections\n');
        addLine('  Proto  Local Address          Foreign Address        State');
        addLine('  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING');
        addLine('  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING');
        addLine('  TCP    127.0.0.1:5354         0.0.0.0:0              LISTENING');
        addLine('  TCP    192.168.1.100:52340     142.250.185.14:443     ESTABLISHED');
        break;
      case 'tree':
        addLine(`Folder PATH listing for volume Windows 7`);
        addLine(`Volume serial number is M3LZ-7777`);
        addLine(`${currentDir}`);
        addLine('├─── Desktop');
        addLine('├─── Documents');
        addLine('├─── Downloads');
        addLine('├─── Music');
        addLine('├─── Pictures');
        addLine('└─── Videos');
        break;
      case 'exit':
        addLine('Closing Command Prompt...');
        break;
      case 'type':
        addLine(`Content of ${args[0] || 'file'}: [File content simulation]`);
        break;
      default:
        addLine(`'${trimmed}' is not recognized as an internal or external command,\noperable program or batch file.`, 'error');
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { runCommand(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      const idx = histIdx + 1;
      if (idx < history.length) { setInput(history[idx]); setHistIdx(idx); }
    } else if (e.key === 'ArrowDown') {
      const idx = histIdx - 1;
      if (idx >= 0) { setInput(history[idx]); setHistIdx(idx); }
      else { setInput(''); setHistIdx(-1); }
    }
  };

  return (
    <div className="cmd-window" onClick={() => inputRef.current?.focus()}>
      {lines.map((line, i) => (
        <div key={i} className="cmd-line">
          <span style={{ color: line.type === 'error' ? '#ff6060' : line.type === 'input' ? '#ffff60' : '#c0c0c0', whiteSpace: 'pre' }}>
            {line.text}
          </span>
        </div>
      ))}
      <div className="cmd-line">
        <span className="cmd-prompt" style={{ color: '#ffff60' }}>{currentDir}&gt;</span>
        <input
          ref={inputRef}
          className="cmd-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default CMD;
