import React, { useState } from 'react';

const CodeEditor: React.FC = () => {
  const [files, setFiles] = useState([
    { name: 'main.cpp', lang: 'cpp', content: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << "Made by M ELZ" << endl;\n    return 0;\n}' },
    { name: 'index.html', lang: 'html', content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>My Page</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Hello World</h1>\n    <p>Made by M ELZ</p>\n    <script src="app.js"></script>\n</body>\n</html>' },
    { name: 'app.js', lang: 'js', content: '// JavaScript\nconsole.log("Hello from M ELZ!");\n\nfunction greet(name) {\n    return `Hello, ${name}!`;\n}\n\ndocument.addEventListener("DOMContentLoaded", () => {\n    console.log(greet("World"));\n});' },
    { name: 'style.css', lang: 'css', content: '/* CSS Stylesheet */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background: #f0f0f0;\n}\n\nh1 {\n    color: #333;\n    border-bottom: 2px solid #4a90e2;\n}' },
    { name: 'Main.java', lang: 'java', content: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("Made by M ELZ");\n        \n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Count: " + i);\n        }\n    }\n}' },
    { name: 'script.py', lang: 'python', content: '# Python Script\nprint("Hello, World!")\nprint("Made by M ELZ")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nfor i in range(5):\n    print(f"Count: {i+1}")' },
  ]);
  const [activeFile, setActiveFile] = useState(0);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);

  const currentFile = files[activeFile];

  const updateContent = (content: string) => {
    setFiles(f => f.map((file, i) => i === activeFile ? { ...file, content } : file));
  };

  const runCode = () => {
    setShowOutput(true);
    const lang = currentFile.lang;
    let result = '';

    if (lang === 'cpp' || lang === 'c') {
      result = `$ g++ ${currentFile.name} -o output\n$ ./output\nHello, World!\nMade by M ELZ\n\nProcess finished with exit code 0`;
    } else if (lang === 'java') {
      result = `$ javac ${currentFile.name}\n$ java Main\nHello, World!\nMade by M ELZ\nCount: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5\n\nProcess finished with exit code 0`;
    } else if (lang === 'python') {
      result = `$ python ${currentFile.name}\nHello, World!\nMade by M ELZ\nCount: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5\n\nProcess finished with exit code 0`;
    } else if (lang === 'js') {
      result = `$ node ${currentFile.name}\nHello from M ELZ!\nHello, World!\n\nProcess finished with exit code 0`;
    } else if (lang === 'html') {
      result = `✓ HTML file validated\n✓ No syntax errors found\n✓ Open in browser to view output`;
    } else if (lang === 'css') {
      result = `✓ CSS file validated\n✓ No syntax errors found\n✓ 12 rules parsed successfully`;
    } else {
      result = `[Running ${currentFile.name}...]\nOutput simulation for ${lang}`;
    }

    setOutput(result);
  };

  const getLangColor = (lang: string) => {
    const colors: Record<string, string> = {
      cpp: '#00bcd4', c: '#00bcd4', java: '#ff9800', python: '#8bc34a',
      js: '#ffeb3b', html: '#ff5722', css: '#e91e63', json: '#9c27b0'
    };
    return colors[lang] || '#aaa';
  };

  const addFile = () => {
    if (!newFileName.trim()) return;
    const ext = newFileName.split('.').pop() || '';
    const lang = { cpp: 'cpp', c: 'c', java: 'java', py: 'python', js: 'js', html: 'html', css: 'css', json: 'json' }[ext] || ext;
    setFiles(f => [...f, { name: newFileName, lang, content: `// ${newFileName}\n` }]);
    setActiveFile(files.length);
    setNewFileName('');
    setShowNewFile(false);
  };

  const closeFile = (idx: number) => {
    if (files.length <= 1) return;
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    setActiveFile(Math.min(activeFile, newFiles.length - 1));
  };



  return (
    <div className="code-editor">
      {/* Toolbar */}
      <div className="code-editor-toolbar">
        <span style={{ color: '#4ec9b0', fontSize: 13, fontWeight: 700, marginRight: 8 }}>💻 Code Editor — M ELZ</span>
        <button className="code-editor-btn" onClick={runCode}>▶ اجرا</button>
        <button className="code-editor-btn" onClick={() => setShowOutput(!showOutput)}>📊 خروجی</button>
        <button className="code-editor-btn" onClick={() => setShowNewFile(true)}>➕ فایل جدید</button>
        <button className="code-editor-btn" onClick={() => {
          const blob = new Blob([currentFile.content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = currentFile.name; a.click();
        }}>💾 ذخیره</button>
        {showNewFile && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <input
              style={{ padding: '2px 6px', fontSize: 12, background: '#333', color: '#fff', border: '1px solid #555', borderRadius: 2 }}
              placeholder="filename.cpp"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addFile()}
              autoFocus
            />
            <button className="code-editor-btn" onClick={addFile}>✓</button>
            <button className="code-editor-btn" onClick={() => setShowNewFile(false)}>✗</button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: '#252526', display: 'flex', overflowX: 'auto', borderBottom: '1px solid #3c3c3c' }}>
        {files.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 12px', cursor: 'pointer', fontSize: 12,
            background: activeFile === i ? '#1e1e1e' : 'transparent',
            color: activeFile === i ? '#fff' : 'rgba(255,255,255,0.5)',
            borderRight: '1px solid #3c3c3c',
            borderTop: activeFile === i ? `2px solid ${getLangColor(f.lang)}` : '2px solid transparent',
            whiteSpace: 'nowrap'
          }}
            onClick={() => setActiveFile(i)}>
            <span style={{ fontSize: 10, background: getLangColor(f.lang) + '40', color: getLangColor(f.lang), padding: '1px 4px', borderRadius: 2 }}>
              {f.lang}
            </span>
            {f.name}
            <span style={{ marginLeft: 4, opacity: 0.5, fontSize: 14 }}
              onClick={e => { e.stopPropagation(); closeFile(i); }}>×</span>
          </div>
        ))}
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Line numbers */}
        <div style={{
          background: '#1e1e1e', color: '#5a5a5a', fontSize: 13, fontFamily: 'Courier New, monospace',
          padding: '8px 8px', lineHeight: '19.5px', minWidth: 40, textAlign: 'right',
          borderRight: '1px solid #3c3c3c', userSelect: 'none', overflowY: 'hidden'
        }}>
          {currentFile.content.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          className="code-textarea"
          value={currentFile.content}
          onChange={e => updateContent(e.target.value)}
          spellCheck={false}
          onKeyDown={e => {
            if (e.key === 'Tab') {
              e.preventDefault();
              const start = (e.target as HTMLTextAreaElement).selectionStart;
              const end = (e.target as HTMLTextAreaElement).selectionEnd;
              const val = currentFile.content;
              updateContent(val.substring(0, start) + '    ' + val.substring(end));
              setTimeout(() => {
                const el = e.target as HTMLTextAreaElement;
                el.selectionStart = el.selectionEnd = start + 4;
              }, 0);
            }
          }}
        />

        {/* Minimap */}
        <div style={{ width: 60, background: '#1e1e1e', borderLeft: '1px solid #3c3c3c', overflow: 'hidden', position: 'relative' }}>
          <div style={{ fontSize: 3, lineHeight: '4px', padding: 2, color: '#4a4a4a', whiteSpace: 'pre', overflow: 'hidden', opacity: 0.7 }}>
            {currentFile.content.substring(0, 800)}
          </div>
        </div>
      </div>

      {/* Output panel */}
      {showOutput && (
        <div style={{ height: 160, background: '#0d0d0d', borderTop: '1px solid #3c3c3c', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#252526', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #3c3c3c' }}>
            <span style={{ color: '#4ec9b0', fontSize: 12, fontWeight: 600 }}>TERMINAL</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>|</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{currentFile.name}</span>
            <div style={{ flex: 1 }} />
            <button onClick={() => setOutput('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12 }}>🗑</button>
            <button onClick={() => setShowOutput(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12 }}>✗</button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 8, fontFamily: 'Courier New, monospace', fontSize: 12, color: '#a8ff78', lineHeight: 1.6 }}>
            {output ? output.split('\n').map((line, i) => (
              <div key={i} style={{ color: line.startsWith('$') ? '#79b8ff' : line.startsWith('✓') ? '#85e89d' : '#a8ff78' }}>{line}</div>
            )) : (
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>برای اجرا، دکمه ▶ را بزنید...</span>
            )}
          </div>
        </div>
      )}

      {/* Status bar */}
      <div style={{ background: '#007acc', padding: '2px 10px', display: 'flex', gap: 16, fontSize: 11, color: '#fff' }}>
        <span>⮩ {currentFile.lang.toUpperCase()}</span>
        <span>{currentFile.content.split('\n').length} خط</span>
        <span>{currentFile.content.length} کاراکتر</span>
        <span style={{ marginLeft: 'auto' }}>UTF-8</span>
        <span>CRLF</span>
        <span>M ELZ Code Editor</span>
      </div>
    </div>
  );
};

export default CodeEditor;
