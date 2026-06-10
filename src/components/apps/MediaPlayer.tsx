import React, { useState, useRef, useEffect } from 'react';

const MediaPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [tab, setTab] = useState<'player' | 'library' | 'visualizer'>('player');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playlist = [
    { name: 'Beethoven - Moonlight Sonata', artist: 'Ludwig van Beethoven', duration: '5:34', genre: 'Classical', album: 'Piano Sonatas' },
    { name: 'Sweet Home Alabama', artist: 'Lynyrd Skynyrd', duration: '4:45', genre: 'Rock', album: 'Second Helping' },
    { name: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55', genre: 'Rock', album: 'A Night at the Opera' },
    { name: 'Hotel California', artist: 'Eagles', duration: '6:30', genre: 'Rock', album: 'Hotel California' },
    { name: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: '8:02', genre: 'Rock', album: 'Led Zeppelin IV' },
    { name: 'Imagine', artist: 'John Lennon', duration: '3:07', genre: 'Pop', album: 'Imagine' },
    { name: 'Billie Jean', artist: 'Michael Jackson', duration: '4:54', genre: 'Pop', album: 'Thriller' },
    { name: 'Purple Rain', artist: 'Prince', duration: '8:41', genre: 'R&B', album: 'Purple Rain' },
  ];

  const [bars, setBars] = useState(Array(32).fill(0).map(() => Math.random() * 60));

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => { if (p >= 100) { setPlaying(false); return 0; } return p + 0.3; });
        setBars(Array(32).fill(0).map(() => Math.random() * (playing ? 80 : 20) + 5));
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const track = playlist[currentTrack];
  const durationSecs = track.duration.split(':').reduce((a, b) => a * 60 + Number(b), 0);
  const currentSecs = Math.floor(durationSecs * progress / 100);
  const formatTime = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="media-player">
      {/* Top bar with tabs */}
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #2a3060', display: 'flex', alignItems: 'center', padding: '4px 8px', gap: 4 }}>
        <span style={{ color: '#4a90e2', fontWeight: 700, fontSize: 12, marginRight: 8 }}>🎵 Windows Media Player 12</span>
        {(['player', 'library', 'visualizer'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? 'rgba(74,144,226,0.3)' : 'transparent',
            border: '1px solid ' + (tab === t ? '#4a90e2' : 'transparent'),
            color: tab === t ? '#4a90e2' : 'rgba(255,255,255,0.6)',
            padding: '3px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit'
          }}>
            {t === 'player' ? '▶ پخش' : t === 'library' ? '📚 کتابخانه' : '📊 ویژوالایزر'}
          </button>
        ))}
      </div>

      {tab === 'player' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}>
          {/* Album art */}
          <div style={{
            width: 160, height: 160, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #1a3a6a, #2a5a9a, #1a3a6a)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 64, boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            border: playing ? '2px solid #4a90e2' : '2px solid #333',
            animation: playing ? 'pulse 2s infinite' : 'none'
          }}>
            🎵
          </div>

          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{track.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>{track.artist} — {track.album}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{track.genre}</div>
          </div>

          {/* Progress */}
          <div style={{ margin: '8px 0' }}>
            <input type="range" min={0} max={100} value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              <span>{formatTime(currentSecs)}</span><span>{track.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="media-controls">
            <button className="media-btn" title="Shuffle" onClick={() => setShuffle(!shuffle)}
              style={{ background: shuffle ? 'linear-gradient(to bottom, #2a6aaa, #1a5a9a)' : undefined }}>🔀</button>
            <button className="media-btn" onClick={() => setCurrentTrack(t => (t - 1 + playlist.length) % playlist.length)}>⏮</button>
            <button className="media-btn" style={{ width: 48, height: 48, fontSize: 20 }} onClick={() => setPlaying(!playing)}>
              {playing ? '⏸' : '▶'}
            </button>
            <button className="media-btn" onClick={() => setCurrentTrack(t => (t + 1) % playlist.length)}>⏭</button>
            <button className="media-btn" title="Repeat" onClick={() => setRepeat(!repeat)}
              style={{ background: repeat ? 'linear-gradient(to bottom, #2a6aaa, #1a5a9a)' : undefined }}>🔁</button>
          </div>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px' }}>
            <span style={{ fontSize: 14 }}>{volume === 0 ? '🔇' : volume < 40 ? '🔈' : volume < 70 ? '🔉' : '🔊'}</span>
            <input type="range" min={0} max={100} value={volume}
              onChange={e => setVolume(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, width: 28 }}>{volume}%</span>
          </div>
        </div>
      )}

      {tab === 'library' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['#', 'نام', 'هنرمند', 'آلبوم', 'ژانر', 'مدت'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#4a90e2', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playlist.map((t, i) => (
                <tr key={i}
                  style={{ background: currentTrack === i ? 'rgba(74,144,226,0.2)' : i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', cursor: 'pointer' }}
                  onClick={() => { setCurrentTrack(i); setProgress(0); setPlaying(true); }}>
                  <td style={{ padding: '5px 8px', color: 'rgba(255,255,255,0.5)' }}>{currentTrack === i && playing ? '▶' : i + 1}</td>
                  <td style={{ padding: '5px 8px', color: currentTrack === i ? '#4a90e2' : '#fff' }}>{t.name}</td>
                  <td style={{ padding: '5px 8px', color: 'rgba(255,255,255,0.7)' }}>{t.artist}</td>
                  <td style={{ padding: '5px 8px', color: 'rgba(255,255,255,0.5)' }}>{t.album}</td>
                  <td style={{ padding: '5px 8px', color: 'rgba(255,255,255,0.4)' }}>{t.genre}</td>
                  <td style={{ padding: '5px 8px', color: 'rgba(255,255,255,0.5)' }}>{t.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'visualizer' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: '100%', height: 120, display: 'flex', alignItems: 'flex-end', gap: 2, background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: 8, border: '1px solid rgba(74,144,226,0.3)' }}>
            {bars.map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h}%`, minHeight: 4,
                background: `linear-gradient(to top, #4a90e2, #00d4ff)`,
                borderRadius: '2px 2px 0 0',
                transition: 'height 0.1s ease',
                opacity: playing ? 1 : 0.3
              }} />
            ))}
          </div>
          <div style={{ marginTop: 16, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            {playing ? `▶ در حال پخش: ${track.name}` : `⏸ متوقف`}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="media-btn" onClick={() => setPlaying(!playing)}>{playing ? '⏸' : '▶'}</button>
            <button className="media-btn" onClick={() => { setCurrentTrack(t => (t + 1) % playlist.length); setProgress(0); }}>⏭</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPlayer;
