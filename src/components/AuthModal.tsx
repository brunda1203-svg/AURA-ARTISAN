import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    verifyMfa,
    cancelMfa,
    mfaPending,
    mfaExpectedCode,
    mfaMethodUsed,
    register,
    demoLogin,
  } = useApp();

  // Login form state
  const [identifier, setIdentifier] = useState('brunda1203@gmail.com');
  const [password, setPassword] = useState('Handcrafted2026!');
  const [rememberDevice, setRememberDevice] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [enableMfaOnRegister, setEnableMfaOnRegister] = useState(true);

  // MFA verification state
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '9', '1', '0']);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = login(identifier, password);
    if (!result.success) {
      setErrorMessage(result.message || 'Invalid credentials. Please verify your username and password.');
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullCode = otpDigits.join('');
    const isValid = verifyMfa(fullCode);
    if (!isValid) {
      setErrorMessage(`Verification code invalid. Please use the test code ${mfaExpectedCode}`);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    register(regName, regUsername || regEmail.split('@')[0], regEmail, regPassword, regPhone);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => {
            cancelMfa();
            setIsAuthModalOpen(false);
          }}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#FAF8F5] p-6 border-b border-stone-100 text-center relative">
          <div className="w-12 h-12 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center mx-auto mb-3 shadow-md">
            {mfaPending ? <ShieldCheck className="w-6 h-6 text-amber-200" /> : <Lock className="w-6 h-6 text-amber-200" />}
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            {mfaPending
              ? 'Multi-Factor Verification'
              : authModalMode === 'login'
              ? 'Secure Account Sign In'
              : 'Create Patron Account'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {mfaPending
              ? `Enter the 6-digit one-time code sent to your registered ${mfaMethodUsed === 'sms' ? 'mobile phone' : 'Authenticator App'}`
              : authModalMode === 'login'
              ? 'Access your personalized dashboard, live shipments, and loyalty perks.'
              : 'Join Aura Rewards to unlock instant 15% discount and earn handcrafted gifts.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MFA 2FA Challenge View */}
          {mfaPending ? (
            <form onSubmit={handleMfaSubmit} className="space-y-5">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>2FA Security Active</span>
                </div>
                <span className="font-mono font-semibold bg-amber-100 px-2 py-0.5 rounded text-amber-800">
                  Demo Code: {mfaExpectedCode}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2 text-center">
                  Verification Code (6-Digits)
                </label>
                <div className="flex justify-center gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-mono font-bold bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900 transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => setResendCooldown(30)}
                  className="text-amber-800 font-semibold hover:underline"
                >
                  Resend OTP ({resendCooldown}s)
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] rounded-xl text-sm font-medium transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Verify & Access Dashboard</span>
              </button>

              <button
                type="button"
                onClick={cancelMfa}
                className="w-full text-xs text-stone-500 hover:text-stone-700 text-center"
              >
                Back to Password Sign In
              </button>
            </form>
          ) : authModalMode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Username or Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="brunda1203@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">Account Password</label>
                  <button
                    type="button"
                    onClick={() => alert('For testing, password is pre-filled. You can also use Demo 1-Click Login below.')}
                    className="text-[11px] text-amber-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-700"
                  />
                  <span>Trust this secure browser</span>
                </label>
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>2FA Enabled</span>
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Sign In Securely</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Fast Login */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={demoLogin}
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-900 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Instant 1-Click Demo Login (Brunda M.)</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-stone-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setAuthModalMode('register');
                    }}
                    className="text-amber-800 font-semibold hover:underline"
                  >
                    Join Aura Rewards Club
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Brunda M."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="brunda12"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone (for 2FA SMS)</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 555-0192"
                      className="w-full pl-8 pr-2 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="patron@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white text-stone-900"
                  />
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-500">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Must contain letters, numbers, and symbols</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableMfaOnRegister}
                    onChange={(e) => setEnableMfaOnRegister(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-amber-800 focus:ring-amber-700"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      Enable Multi-Factor Authentication (MFA)
                    </span>
                    <span className="text-[11px] text-stone-500 block leading-tight mt-0.5">
                      Protects your order history, delivery addresses, and payment profiles from unauthorized access.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Create Protected Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-stone-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setAuthModalMode('login');
                    }}
                    className="text-amber-800 font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
