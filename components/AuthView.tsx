
import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';
import { UserStats } from '../types';

interface AuthViewProps {
  onBack: () => void;
  onSuccess: (stats: UserStats) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onBack, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const stats = isLogin
        ? await loginUser(username, password)
        : await registerUser(username, email, password);
      onSuccess(stats);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Chiqish tugmasi (Back to Landing) */}
      <button 
        onClick={onBack}
        className="absolute top-10 left-10 text-white/50 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 z-50 group"
      >
        <span className="text-xl group-hover:-translate-x-2 transition-transform">←</span> 
        <span>Exit Terminal</span>
      </button>

      {/* Aylanuvchi "Square" konteyneri */}
      <div className="square">
        {/* Uchta rangli qatlamlar: Qizil, Yashil, Sariq */}
        <i></i>
        <i></i>
        <i></i>

        {/* Forma qismi */}
        <div className="login-inner animate-in fade-in zoom-in duration-500">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Connecting...</p>
            </div>
          ) : (
            <>
              <h2 className="mb-2">{isLogin ? 'Login' : 'Register'}</h2>
              
              <form onSubmit={handleSubmit} className="w-full space-y-3">
                <div className="inputBx">
                  <input 
                    type="text" 
                    placeholder={isLogin ? "Username or Email" : "Username"} 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>

                {!isLogin && (
                  <div className="inputBx animate-in fade-in slide-in-from-top-2 duration-300">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                )}

                <div className="inputBx relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="!pr-14"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-xl"
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </button>
                </div>

                <div className="inputBx">
                  <input 
                    type="submit" 
                    value={isLogin ? 'Sign in' : 'Register'} 
                  />
                </div>
              </form>
              <div className="links">
                <a href="#" onClick={(e) => e.preventDefault()}>Forget Password</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setShowPassword(false); setErrorMsg(null); }}>
                  {isLogin ? "Register" : "Login"}
                </a>
              </div>
              {errorMsg && (
                <div className="text-red-300 text-[10px] font-black uppercase tracking-[0.3em] text-center pt-2">
                  {errorMsg}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Versiya ma'lumoti */}
      <div className="absolute bottom-10 w-full text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20">
          Secure Core Protocol // v5.0.3
        </p>
      </div>
    </div>
  );
};

export default AuthView;
