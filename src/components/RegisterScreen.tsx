import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface ProCode {
  code: string;
  type: string;
  description: string;
  features: string[];
  expires: string;
}

interface RegisterScreenProps {
  onRegister: (user: User) => void;
  onLogin?: () => void;
  existingUsers: User[];
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, existingUsers }) => {
  const [step, setStep] = useState<'main' | 'register' | 'login'>('main');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [proCode, setProCode] = useState('');
  const [useProCode, setUseProCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [proCodes, setProCodes] = useState<ProCode[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  useEffect(() => {
    fetch('/pro-codes.json')
      .then(r => r.json())
      .then(data => setProCodes(data.proCodes || []));
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const validateProCode = (code: string): ProCode | null => {
    return proCodes.find(c => c.code === code) || null;
  };

  const handleRegister = () => {
    setError('');
    if (!username.trim()) { setError('لطفاً نام کاربری وارد کنید'); return; }
    if (username.length < 3) { setError('نام کاربری باید حداقل 3 کاراکتر باشد'); return; }
    if (!password.trim()) { setError('لطفاً رمز عبور وارد کنید'); return; }
    if (password.length < 4) { setError('رمز عبور باید حداقل 4 کاراکتر باشد'); return; }
    if (password !== confirmPass) { setError('رمز عبور با تکرار آن مطابقت ندارد'); return; }
    if (existingUsers.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError('این نام کاربری قبلاً استفاده شده است'); return;
    }

    let accountType: User['accountType'] = 'standard';
    let validatedCode: ProCode | null = null;

    if (useProCode) {
      if (!proCode.trim()) { setError('لطفاً کد پرو را وارد کنید یا گزینه کد پرو را غیرفعال کنید'); return; }
      validatedCode = validateProCode(proCode.trim());
      if (!validatedCode) { setError('کد پرو نامعتبر است! لطفاً کد صحیح وارد کنید'); return; }
      accountType = validatedCode.type.toLowerCase() as User['accountType'];
      if (!['admin', 'standard', 'pro', 'elite', 'developer'].includes(accountType)) {
        accountType = 'pro';
      }
    }

    const newUser: User = {
      username,
      password,
      accountType,
      avatar: '👤',
      isAdmin: accountType === 'admin',
      proCode: validatedCode?.code,
      createdAt: new Date().toISOString()
    };

    setSuccess(`حساب کاربری "${username}" با موفقیت ساخته شد!${validatedCode ? ` (نوع: ${validatedCode.type})` : ''}`);
    setTimeout(() => {
      onRegister(newUser);
    }, 1500);
  };

  const handleLogin = () => {
    setError('');
    
    // Special admin account - m.elz
    if (loginUser === 'm.elz' && loginPass === 'matin1200') {
      const adminUser: User = {
        username: 'm.elz',
        password: 'matin1200',
        accountType: 'admin',
        avatar: '👑',
        isAdmin: true,
        createdAt: '2024-01-01T00:00:00.000Z'
      };
      onRegister(adminUser);
      return;
    }

    const found = existingUsers.find(u => u.username === loginUser && u.password === loginPass);
    if (found) {
      onRegister(found);
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  const avatarOptions = ['👤', '😊', '🧑', '👩', '🦸', '🧙', '🎮', '💻', '🎯', '🔥'];
  const [avatarIdx, setAvatarIdx] = useState(0);

  // Main selection screen (Win11 style)
  if (step === 'main') {
    return (
      <div className="register-screen" style={{
        backgroundImage: 'linear-gradient(135deg, #0067c0 0%, #005fa3 40%, #003d75 100%)',
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        {/* Win11 style top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🪟</span>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Windows 7 — M ELZ Edition</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            {currentTime.toLocaleTimeString('fa-IR')} — {currentTime.toLocaleDateString('fa-IR')}
          </div>
        </div>

        {/* Center content */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🪟</div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Windows 7</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>M ELZ Edition — نسخه اختصاصی</p>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* New Account */}
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 12,
              padding: '32px 40px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
              width: 200
            }}
            onClick={() => setStep('register')}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>➕</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>ساخت حساب جدید</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Create New Account</div>
          </div>

          {/* Login */}
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 12,
              padding: '32px 40px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
              width: 200
            }}
            onClick={() => setStep('login')}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>ورود به حساب</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Sign In</div>
          </div>
        </div>

        {existingUsers.length > 0 && (
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 12 }}>حساب‌های موجود:</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {existingUsers.map(u => (
                <div
                  key={u.username}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: '#fff', fontSize: 13
                  }}
                  onClick={() => { setLoginUser(u.username); setStep('login'); }}
                >
                  <span style={{ fontSize: 20 }}>{u.avatar}</span>
                  <span>{u.username}</span>
                  {u.accountType !== 'standard' && <span style={{ fontSize: 10, background: 'rgba(255,200,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>{u.accountType}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 20, color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
          © 2024 M ELZ — Windows 7 Simulator. All rights reserved.
        </div>
      </div>
    );
  }

  // Login screen
  if (step === 'login') {
    return (
      <div className="register-screen" style={{
        backgroundImage: 'linear-gradient(135deg, #0a3060 0%, #0067c0 50%, #003d75 100%)',
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{ position: 'absolute', top: 16, left: 24 }}>
          <button onClick={() => setStep('main')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            ← بازگشت
          </button>
        </div>

        <div className="register-card">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔑</div>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>ورود به Windows 7</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Sign in to your account</p>
          </div>

          <div className="win11-input-group">
            <label className="win11-label">نام کاربری</label>
            <input
              className="register-input"
              placeholder="Username"
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="win11-input-group">
            <label className="win11-label">رمز عبور</label>
            <input
              className="register-input"
              type="password"
              placeholder="Password"
              value={loginPass}
              onChange={e => setLoginPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}
          {success && <div className="success-msg">✅ {success}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="register-btn" style={{ flex: 1 }} onClick={handleLogin}>
              ورود →
            </button>
            <button className="register-btn-secondary" onClick={() => { setStep('register'); setError(''); }}>
              ساخت حساب
            </button>
          </div>

          <div style={{ marginTop: 16, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
            اکانت رییس: m.elz / matin1200
          </div>
        </div>
      </div>
    );
  }

  // Register screen
  return (
    <div className="register-screen" style={{
      backgroundImage: 'linear-gradient(135deg, #003d75 0%, #0067c0 50%, #00a4ef 100%)',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ position: 'absolute', top: 16, left: 24 }}>
        <button onClick={() => setStep('main')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← بازگشت
        </button>
      </div>

      <div className="register-card" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>➕</div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>ساخت حساب کاربری</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Create your Windows 7 account</p>
        </div>

        {/* Avatar selection */}
        <div className="win11-input-group">
          <label className="win11-label">انتخاب آواتار</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {avatarOptions.map((av, i) => (
              <div
                key={i}
                onClick={() => setAvatarIdx(i)}
                style={{
                  fontSize: 28, cursor: 'pointer', width: 44, height: 44,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: avatarIdx === i ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)',
                  borderRadius: 8,
                  background: avatarIdx === i ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                  transition: 'all 0.15s'
                }}
              >{av}</div>
            ))}
          </div>
        </div>

        <div className="win11-input-group">
          <label className="win11-label">نام کاربری *</label>
          <input
            className="register-input"
            placeholder="Username (min 3 chars)"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="win11-input-group">
          <label className="win11-label">رمز عبور *</label>
          <input
            className="register-input"
            type="password"
            placeholder="Password (min 4 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="win11-input-group">
          <label className="win11-label">تکرار رمز عبور *</label>
          <input
            className="register-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
          />
        </div>

        {/* Pro Code Section */}
        <div style={{
          background: 'rgba(255,215,0,0.1)',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: 8,
          padding: '12px 14px',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: useProCode ? 12 : 0 }}>
            <input
              type="checkbox"
              id="useProCode"
              checked={useProCode}
              onChange={e => { setUseProCode(e.target.checked); if (!e.target.checked) setProCode(''); }}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="useProCode" style={{ color: 'rgba(255,215,0,0.9)', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
              ⭐ دارم کد پرو (Pro Code)
            </label>
          </div>
          {useProCode && (
            <input
              className="register-input"
              placeholder="Enter Pro Code (e.g. MELZ-PRO-2024)"
              value={proCode}
              onChange={e => setProCode(e.target.value.toUpperCase())}
              style={{ marginTop: 0, borderColor: 'rgba(255,215,0,0.4)' }}
            />
          )}
          {!useProCode && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>
              بدون کد پرو = حساب استاندارد
            </p>
          )}
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}
        {success && <div className="success-msg">✅ {success}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="register-btn" style={{ flex: 1 }} onClick={handleRegister}>
            ساخت حساب ✓
          </button>
          <button className="register-btn-secondary" onClick={() => { setStep('login'); setError(''); }}>
            ورود
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
