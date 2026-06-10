import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState('');
  const [op, setOp] = useState('');
  const [clearNext, setClearNext] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = (expr: string) => {
    setHistory(h => [expr, ...h.slice(0, 9)]);
  };

  const pressNum = (n: string) => {
    if (clearNext) { setDisplay(n); setClearNext(false); return; }
    setDisplay(d => d === '0' && n !== '.' ? n : (d.includes('.') && n === '.' ? d : d + n));
  };

  const pressOp = (o: string) => {
    if (prev && op && !clearNext) {
      const r = calculate(parseFloat(prev), parseFloat(display), op);
      setDisplay(String(r));
      setPrev(String(r));
      addToHistory(`${prev} ${op} ${display} = ${r}`);
    } else {
      setPrev(display);
    }
    setOp(o);
    setClearNext(true);
  };

  const calculate = (a: number, b: number, o: string): number => {
    switch(o) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : NaN;
      case '%': return a % b;
      default: return b;
    }
  };

  const pressEquals = () => {
    if (!prev || !op) return;
    const r = calculate(parseFloat(prev), parseFloat(display), op);
    const expr = `${prev} ${op} ${display} = ${isNaN(r) ? 'خطا' : r}`;
    addToHistory(expr);
    setDisplay(isNaN(r) ? 'Error' : String(parseFloat(r.toFixed(10))));
    setPrev('');
    setOp('');
    setClearNext(true);
  };

  const clear = () => { setDisplay('0'); setPrev(''); setOp(''); setClearNext(false); };
  const toggleSign = () => setDisplay(d => d.startsWith('-') ? d.slice(1) : '-' + d);
  const backspace = () => setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0');
  const sqrt = () => {
    const r = Math.sqrt(parseFloat(display));
    addToHistory(`√${display} = ${r}`);
    setDisplay(String(parseFloat(r.toFixed(10))));
    setClearNext(true);
  };

  const btn = (label: string, onClick: () => void, cls = '') => (
    <button key={label} className={`calc-btn ${cls}`} onClick={onClick}>{label}</button>
  );

  return (
    <div style={{ padding: 10, background: '#f0f0f0', height: '100%', display: 'flex', gap: 8 }}>
      <div style={{ flex: 1 }}>
        <div className="calc-display" style={{ fontSize: display.length > 14 ? 14 : 22 }}>
          {display}
        </div>
        {prev && op && <div style={{ textAlign: 'right', fontSize: 11, color: '#888', marginBottom: 4, padding: '0 4px' }}>{prev} {op}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 3 }}>
          {btn('MC', () => {}, 'operator')}
          {btn('MR', () => {}, 'operator')}
          {btn('MS', () => {}, 'operator')}
          {btn('M+', () => {}, 'operator')}
          {btn('←', backspace)}
          {btn('CE', () => setDisplay('0'))}
          {btn('C', clear)}
          {btn('±', toggleSign)}
          {btn('√', sqrt, 'operator')}
          {btn('7', () => pressNum('7'))}
          {btn('8', () => pressNum('8'))}
          {btn('9', () => pressNum('9'))}
          {btn('÷', () => pressOp('/'), 'operator')}
          {btn('4', () => pressNum('4'))}
          {btn('5', () => pressNum('5'))}
          {btn('6', () => pressNum('6'))}
          {btn('×', () => pressOp('*'), 'operator')}
          {btn('1', () => pressNum('1'))}
          {btn('2', () => pressNum('2'))}
          {btn('3', () => pressNum('3'))}
          {btn('−', () => pressOp('-'), 'operator')}
          {btn('0', () => pressNum('0'))}
          {btn('+/-', toggleSign)}
          {btn('.', () => pressNum('.'))}
          {btn('+', () => pressOp('+'), 'operator')}
          <div style={{ gridColumn: 'span 4' }}>
            {btn('=', pressEquals, 'equals')}
          </div>
        </div>
      </div>
      {history.length > 0 && (
        <div style={{ width: 160, background: '#fff', border: '1px solid #ddd', borderRadius: 3, padding: 6, overflow: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 4 }}>تاریخچه</div>
          {history.map((h, i) => <div key={i} style={{ fontSize: 10, color: '#555', padding: '2px 0', borderBottom: '1px solid #f0f0f0' }}>{h}</div>)}
        </div>
      )}
    </div>
  );
};

export default Calculator;
