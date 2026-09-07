import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'; 
import Swal from 'sweetalert2';

const logoUrl = "https://mcusercontent.com/f8003344e5055720b1568282f/images/e84ab177-5143-b5b7-4514-9298f1f3fa99.png";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Swal.fire({ 
        title: 'Error de Autenticación', 
        text: error.message, 
        icon: 'error', 
        confirmButtonColor: 'var(--color-luxury-red)' 
      });
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin, role_id, internal_role')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      setLoading(false);
      window.location.href = '/login';
      return;
    }

    const roleText = (profile.internal_role || '').toLowerCase().trim();
    const roleIdNum = Number(profile.role_id); 

    // 🔥 AHORA SÍ: SEPARACIÓN EXACTA DE REINOS
    const isAdminUser = profile.is_admin === true || roleIdNum === 3 || ['admin'].includes(roleText);
    const isJefatura = [2, 4, 5].includes(roleIdNum) || ['lider', 'líder', 'coordinador', 'ejecutivo', 'ejecutivo de comunicación'].includes(roleText);
    const isColaborador = roleIdNum === 1 || ['colaborador', 'reviewer'].includes(roleText);

    // 🔥 RUTEO PERFECTO DESDE EL LOGIN
    if (isAdminUser) {
      window.location.href = '/admin';
    } else if (isJefatura) {
      window.location.href = '/coordinator';
    } else if (isColaborador) {
      window.location.href = '/colaborador';
    } else {
      window.location.href = '/client';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] bg-luxury-red/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-15%] w-[60%] h-[60%] bg-red-200/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="bg-white border border-gray-200/80 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden p-1 shadow-sm">
            <img src={logoUrl} className="w-full h-full object-contain" alt="Logo Tolko" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
              Pipeline <span className="text-luxury-red">Tolko</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black mt-1">
              Plataforma de Production Creativa
            </p>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Email Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                required 
                type="email" 
                placeholder="usuario@tolkogroup.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none focus:border-luxury-red transition-all font-medium placeholder-gray-400 shadow-sm" 
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none focus:border-luxury-red transition-all font-medium placeholder-gray-400 shadow-sm" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <div className="flex justify-end pt-1 px-1">
              <Link 
                to="/forgot-password" 
                className="text-[10px] font-bold text-gray-400 hover:text-luxury-red uppercase tracking-wider transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div> 
          
          <button 
            disabled={loading} 
            className="w-full bg-luxury-red hover:bg-red-700 text-white font-black text-xs tracking-[0.2em] py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-xl shadow-luxury-red/10 active:scale-[0.98] disabled:opacity-50 cursor-pointer uppercase mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <LogIn size={14} strokeWidth={3} />
            )} 
            {loading ? 'AUTENTICANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>
        
        <div className="text-center mt-8 pt-4 border-t border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Tolko Group © 2026
          </p>
        </div>

      </div>
    </div>
  );
}