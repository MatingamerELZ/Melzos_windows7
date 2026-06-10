export interface FileSystemItem {
  name: string;
  type: 'folder' | 'file' | 'shortcut';
  icon: string;
  children?: FileSystemItem[];
  content?: string;
  size?: string;
  modified?: string;
  hidden?: boolean;
  system?: boolean;
  extension?: string;
}

export const buildFileSystem = (username: string): FileSystemItem => ({
  name: 'C:\\',
  type: 'folder',
  icon: '💾',
  children: [
    {
      name: 'Boot',
      type: 'folder',
      icon: '📁',
      system: true,
      children: [
        { name: 'BCD', type: 'file', icon: '📄', content: 'Windows Boot Configuration Data', size: '32 KB', modified: '2009-10-22', extension: '' },
        { name: 'boot.sdi', type: 'file', icon: '📄', content: 'System Deployment Image', size: '3 MB', modified: '2009-10-22', extension: 'sdi' },
        {
          name: 'en-US',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'bootmgr.exe.mui', type: 'file', icon: '📄', content: 'Boot Manager Resources', size: '22 KB', extension: 'mui' }
          ]
        }
      ]
    },
    {
      name: 'Documents and Settings',
      type: 'shortcut',
      icon: '🔗',
      hidden: true,
      content: 'Shortcut to C:\\Users'
    },
    {
      name: 'Program Files',
      type: 'folder',
      icon: '📁',
      children: [
        {
          name: 'Internet Explorer',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'iexplore.exe', type: 'file', icon: '🌐', content: 'Internet Explorer 8', size: '632 KB', extension: 'exe' },
            { name: 'iecompat.dll', type: 'file', icon: '📄', content: 'IE Compatibility Library', size: '128 KB', extension: 'dll' }
          ]
        },
        {
          name: 'Windows Media Player',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'wmplayer.exe', type: 'file', icon: '🎵', content: 'Windows Media Player 12', size: '1.2 MB', extension: 'exe' },
            { name: 'wmpcore.dll', type: 'file', icon: '📄', content: 'WMP Core Library', size: '512 KB', extension: 'dll' }
          ]
        },
        {
          name: 'Windows NT',
          type: 'folder',
          icon: '📁',
          children: [
            {
              name: 'Accessories',
              type: 'folder',
              icon: '📁',
              children: [
                { name: 'wordpad.exe', type: 'file', icon: '📝', content: 'WordPad Application', size: '384 KB', extension: 'exe' },
                { name: 'charmap.exe', type: 'file', icon: '📄', content: 'Character Map', size: '128 KB', extension: 'exe' }
              ]
            }
          ]
        },
        {
          name: 'Java',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'jre7', type: 'folder', icon: '📁', children: [
              { name: 'bin', type: 'folder', icon: '📁', children: [
                { name: 'java.exe', type: 'file', icon: '☕', content: 'Java Runtime Environment 7', size: '132 KB', extension: 'exe' },
                { name: 'javac.exe', type: 'file', icon: '☕', content: 'Java Compiler', size: '132 KB', extension: 'exe' }
              ]}
            ]}
          ]
        },
        {
          name: 'Python',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'python.exe', type: 'file', icon: '🐍', content: 'Python 3.11', size: '320 KB', extension: 'exe' },
            { name: 'pip.exe', type: 'file', icon: '📦', content: 'Python Package Manager', size: '128 KB', extension: 'exe' }
          ]
        },
        {
          name: 'VLC Media Player',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'vlc.exe', type: 'file', icon: '🎬', content: 'VLC Media Player 3.0', size: '24 MB', extension: 'exe' }
          ]
        },
        {
          name: 'AIMP',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'AIMP.exe', type: 'file', icon: '🎵', content: 'AIMP Audio Player 5.0', size: '8 MB', extension: 'exe' }
          ]
        },
        {
          name: 'Notepad++',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'notepad++.exe', type: 'file', icon: '📝', content: 'Notepad++ 8.5', size: '4 MB', extension: 'exe' }
          ]
        },
        {
          name: 'Visual Studio Code',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'Code.exe', type: 'file', icon: '💻', content: 'Visual Studio Code 1.85', size: '86 MB', extension: 'exe' }
          ]
        },
        {
          name: 'MinGW-W64',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'bin', type: 'folder', icon: '📁', children: [
              { name: 'gcc.exe', type: 'file', icon: '⚙️', content: 'GNU C Compiler', size: '2.4 MB', extension: 'exe' },
              { name: 'g++.exe', type: 'file', icon: '⚙️', content: 'GNU C++ Compiler', size: '2.5 MB', extension: 'exe' },
              { name: 'gdb.exe', type: 'file', icon: '🔍', content: 'GNU Debugger', size: '8 MB', extension: 'exe' }
            ]}
          ]
        }
      ]
    },
    {
      name: 'Program Files (x86)',
      type: 'folder',
      icon: '📁',
      children: [
        {
          name: 'Common Files',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'Microsoft Shared', type: 'folder', icon: '📁', children: [] }
          ]
        }
      ]
    },
    {
      name: 'ProgramData',
      type: 'folder',
      icon: '📁',
      hidden: true,
      children: [
        { name: 'Microsoft', type: 'folder', icon: '📁', children: [] },
        { name: 'Package Store', type: 'folder', icon: '📁', children: [] },
        { name: 'SoftwareDistribution', type: 'folder', icon: '📁', children: [] }
      ]
    },
    {
      name: 'System Volume Information',
      type: 'folder',
      icon: '📁',
      hidden: true,
      system: true,
      children: []
    },
    {
      name: 'Users',
      type: 'folder',
      icon: '📁',
      children: [
        {
          name: 'All Users',
          type: 'shortcut',
          icon: '🔗',
          content: 'Shortcut to ProgramData'
        },
        {
          name: 'Default',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'Desktop', type: 'folder', icon: '🖥️', children: [] },
            { name: 'Documents', type: 'folder', icon: '📄', children: [] },
            { name: 'AppData', type: 'folder', icon: '📁', hidden: true, children: [] }
          ]
        },
        {
          name: 'Public',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'Desktop', type: 'folder', icon: '🖥️', children: [] },
            { name: 'Documents', type: 'folder', icon: '📄', children: [] },
            { name: 'Downloads', type: 'folder', icon: '⬇️', children: [] },
            { name: 'Music', type: 'folder', icon: '🎵', children: [] },
            { name: 'Pictures', type: 'folder', icon: '🖼️', children: [] },
            { name: 'Videos', type: 'folder', icon: '🎬', children: [] }
          ]
        },
        {
          name: username,
          type: 'folder',
          icon: '👤',
          children: [
            {
              name: 'Desktop',
              type: 'folder',
              icon: '🖥️',
              children: [
                { name: 'README.txt', type: 'file', icon: '📄', content: 'Welcome to Windows 7 - M ELZ Edition\nCreator: M ELZ\n\nThis is your Desktop folder.', size: '1 KB', extension: 'txt', modified: '2024-01-01' }
              ]
            },
            { name: 'Documents', type: 'folder', icon: '📄', children: [
              { name: 'My Projects', type: 'folder', icon: '📁', children: [
                { name: 'project1.cpp', type: 'file', icon: '⚙️', content: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}', size: '2 KB', extension: 'cpp' },
                { name: 'index.html', type: 'file', icon: '🌐', content: '<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>', size: '1 KB', extension: 'html' }
              ]}
            ]},
            { name: 'Downloads', type: 'folder', icon: '⬇️', children: [] },
            { name: 'Music', type: 'folder', icon: '🎵', children: [] },
            { name: 'Pictures', type: 'folder', icon: '🖼️', children: [] },
            { name: 'Videos', type: 'folder', icon: '🎬', children: [] },
            {
              name: 'AppData',
              type: 'folder',
              icon: '📁',
              hidden: true,
              children: [
                { name: 'Local', type: 'folder', icon: '📁', children: [] },
                { name: 'LocalLow', type: 'folder', icon: '📁', children: [] },
                { name: 'Roaming', type: 'folder', icon: '📁', children: [] }
              ]
            },
            { name: 'Contacts', type: 'folder', icon: '👥', children: [] },
            { name: 'Favorites', type: 'folder', icon: '⭐', children: [] },
            { name: 'Links', type: 'folder', icon: '🔗', children: [] },
            { name: 'Saved Games', type: 'folder', icon: '🎮', children: [] },
            { name: 'Searches', type: 'folder', icon: '🔍', children: [] }
          ]
        }
      ]
    },
    {
      name: 'Windows',
      type: 'folder',
      icon: '📁',
      children: [
        { name: 'assembly', type: 'folder', icon: '📁', children: [] },
        { name: 'Boot', type: 'folder', icon: '📁', children: [] },
        {
          name: 'Fonts',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'tahoma.ttf', type: 'file', icon: '🔤', content: 'Tahoma Font', size: '518 KB', extension: 'ttf' },
            { name: 'arial.ttf', type: 'file', icon: '🔤', content: 'Arial Font', size: '523 KB', extension: 'ttf' },
            { name: 'segoeui.ttf', type: 'file', icon: '🔤', content: 'Segoe UI Font', size: '620 KB', extension: 'ttf' },
            { name: 'courbd.ttf', type: 'file', icon: '🔤', content: 'Courier New Bold', size: '412 KB', extension: 'ttf' }
          ]
        },
        { name: 'Installer', type: 'folder', icon: '📁', system: true, children: [] },
        {
          name: 'Logs',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'CBS', type: 'folder', icon: '📁', children: [
              { name: 'CBS.log', type: 'file', icon: '📄', content: 'Component Based Servicing Log\n[2024-01-01] System Check Complete\n[2024-01-01] All Components OK', size: '12 KB', extension: 'log' }
            ]},
            { name: 'WindowsUpdate', type: 'folder', icon: '📁', children: [
              { name: 'WindowsUpdate.log', type: 'file', icon: '📄', content: 'Windows Update Log\n[2024-01-01] Update Check Complete\n[2024-01-01] System Up to Date', size: '8 KB', extension: 'log' }
            ]}
          ]
        },
        { name: 'Panther', type: 'folder', icon: '📁', system: true, children: [] },
        { name: 'PolicyDefinitions', type: 'folder', icon: '📁', children: [] },
        { name: 'Registration', type: 'folder', icon: '📁', system: true, children: [] },
        { name: 'SoftwareDistribution', type: 'folder', icon: '📁', hidden: true, children: [] },
        {
          name: 'System',
          type: 'folder',
          icon: '📁',
          system: true,
          children: [
            { name: 'config', type: 'folder', icon: '📁', system: true, children: [
              { name: 'SAM', type: 'file', icon: '🔒', content: 'Security Account Manager', size: '64 KB', extension: '' },
              { name: 'SYSTEM', type: 'file', icon: '🔒', content: 'System Registry Hive', size: '4 MB', extension: '' },
              { name: 'SOFTWARE', type: 'file', icon: '🔒', content: 'Software Registry Hive', size: '8 MB', extension: '' }
            ]},
            { name: 'Restore', type: 'folder', icon: '📁', children: [] }
          ]
        },
        {
          name: 'System32',
          type: 'folder',
          icon: '📁',
          system: true,
          children: [
            { name: 'cmd.exe', type: 'file', icon: '⬛', content: 'Command Prompt', size: '302 KB', extension: 'exe' },
            { name: 'ntoskrnl.exe', type: 'file', icon: '🧠', content: 'Windows NT OS Kernel', size: '3.8 MB', extension: 'exe' },
            { name: 'hal.dll', type: 'file', icon: '⚙️', content: 'Hardware Abstraction Layer', size: '448 KB', extension: 'dll' },
            { name: 'explorer.exe', type: 'file', icon: '📁', content: 'Windows Shell', size: '2.4 MB', extension: 'exe' },
            { name: 'taskmgr.exe', type: 'file', icon: '📊', content: 'Task Manager', size: '226 KB', extension: 'exe' },
            { name: 'calc.exe', type: 'file', icon: '🔢', content: 'Calculator', size: '114 KB', extension: 'exe' },
            { name: 'notepad.exe', type: 'file', icon: '📝', content: 'Notepad Text Editor', size: '128 KB', extension: 'exe' },
            { name: 'mspaint.exe', type: 'file', icon: '🎨', content: 'Microsoft Paint', size: '648 KB', extension: 'exe' },
            { name: 'regedit.exe', type: 'file', icon: '🗂️', content: 'Registry Editor', size: '192 KB', extension: 'exe' },
            { name: 'mmc.exe', type: 'file', icon: '🖥️', content: 'Microsoft Management Console', size: '152 KB', extension: 'exe' },
            { name: 'powershell.exe', type: 'file', icon: '💙', content: 'Windows PowerShell', size: '424 KB', extension: 'exe' },
            { name: 'kernel32.dll', type: 'file', icon: '⚙️', content: 'Windows NT BASE API', size: '800 KB', extension: 'dll' },
            { name: 'user32.dll', type: 'file', icon: '⚙️', content: 'Windows USER API', size: '1.1 MB', extension: 'dll' },
            { name: 'gdi32.dll', type: 'file', icon: '⚙️', content: 'GDI Client Library', size: '350 KB', extension: 'dll' },
            { name: 'ntdll.dll', type: 'file', icon: '⚙️', content: 'NT Layer DLL', size: '1.4 MB', extension: 'dll' },
            {
              name: 'drivers',
              type: 'folder',
              icon: '📁',
              system: true,
              children: [
                { name: 'etc', type: 'folder', icon: '📁', children: [
                  { name: 'hosts', type: 'file', icon: '📄', content: '# Copyright (c) 1993-2009 Microsoft Corp.\n#\n# This is a sample HOSTS file used by Microsoft TCP/IP.\n\n127.0.0.1       localhost\n::1             localhost', size: '824 B', extension: '' }
                ]},
                { name: 'ACPI.sys', type: 'file', icon: '⚙️', content: 'ACPI Driver', size: '280 KB', extension: 'sys' },
                { name: 'NDIS.sys', type: 'file', icon: '⚙️', content: 'Network Driver Interface', size: '852 KB', extension: 'sys' }
              ]
            },
            { name: 'config', type: 'folder', icon: '📁', system: true, children: [] },
            { name: 'wbem', type: 'folder', icon: '📁', children: [] },
            { name: 'WindowsPowerShell', type: 'folder', icon: '📁', children: [] }
          ]
        },
        { name: 'SysWOW64', type: 'folder', icon: '📁', system: true, children: [] },
        { name: 'Temp', type: 'folder', icon: '📁', hidden: true, children: [] },
        {
          name: 'Web',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'Screen', type: 'folder', icon: '📁', children: [] },
            { name: 'Wallpaper', type: 'folder', icon: '📁', children: [
              { name: 'Aurora.jpg', type: 'file', icon: '🖼️', content: 'Windows 7 Default Wallpaper', size: '800 KB', extension: 'jpg' }
            ]}
          ]
        },
        { name: 'WinSxS', type: 'folder', icon: '📁', system: true, children: [] }
      ]
    },
    { name: 'hiberfil.sys', type: 'file', icon: '💾', content: 'Hibernation File - System Reserved', size: '1.5 GB', extension: 'sys', hidden: true, system: true },
    { name: 'pagefile.sys', type: 'file', icon: '💾', content: 'Page File - Virtual Memory', size: '2 GB', extension: 'sys', hidden: true, system: true },
    { name: 'autoexec.bat', type: 'file', icon: '📄', content: 'REM Windows 7 autoexec.bat\nREM Legacy compatibility file', size: '0 KB', extension: 'bat', hidden: true }
  ]
});
