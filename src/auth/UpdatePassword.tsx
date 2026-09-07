import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'; 
import Swal from 'sweetalert2';

// 🔥 LINK RECUPERADO DE TU LOGOTIPO
const logoUrl = "https://mcusercontent.com/f8003344e5055720b1568282f/images/e84ab177-5143-b5b7-4514-9298f1f3fa99.png";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Tolko Nexus - Nueva Contraseña";
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 LA MAGIA DE SUPABASE: Como el usuario llegó desde el correo,
      // Supabase ya tiene interceptada la sesión temporal, solo le mandamos la nueva clave.
      const { error } = await supabase.auth.updateUser({ 
        password: password.trim() 
      });

      if (error) throw error;

      const isDarkTheme = document.documentElement.classList.contains('dark');
      
      await Swal.fire({
        title: '¡CLAVE ACTUALIZADA!',
        text: 'Tu nueva contraseña se guardó con éxito. Ya puedes iniciar sesión.',
        icon: 'success',
        background: isDarkTheme ? '#0F0F12' : '#fff',
        color: isDarkTheme ? '#fff' : '#1f2937',
        confirmButtonColor: 'var(--color-luxury-red)'
      });

      // 🚨 Limpiamos sesión por si las moscas y lo mandamos al login fresco
      await supabase.auth.signOut();
      navigate('/login');

    } catch (error: any) {
      const isDarkTheme = document.documentElement.classList.contains('dark');
      Swal.fire({
        title: 'Error al actualizar',
        text: error.message,
        icon: 'error',
        background: isDarkTheme ? '#0F0F12' : '#fff',
        color: isDarkTheme ? '#fff' : '#1f2937',
        confirmButtonColor: 'var(--color-luxury-red)'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🔥 ESTRUCTURA IGUAL AL LOGIN: Fondo claro y luces sutiles
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] bg-luxury-red/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-15%] w-[60%] h-[60%] bg-red-200/20 rounded-full blur-[140px] pointer-events-none" />

      {/* 🛡️ TARJETA BLANCA PREMIUM MATCH LOGIN */}
      <div className="bg-white border border-gray-200/80 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* CABECERA CON LOGOTIPO */}
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden p-1 shadow-sm">
            <img src={logoUrl} className="w-full h-full object-contain" alt="Logo Tolko" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
              Nueva <span className="text-luxury-red">Clave</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-black mt-1">
              Establece tu nueva contraseña de acceso
            </p>
          </div>
        </div>
        
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          {/* INPUT: CONTRASEÑA NUEVA */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Nueva Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                placeholder="Mínimo 6 caracteres"
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
          </div> 
          
          {/* BOTÓN DE ACCIÓN */}
          <button 
            disabled={loading} 
            className="w-full bg-luxury-red hover:bg-red-700 text-white font-black text-xs tracking-[0.2em] py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-xl shadow-luxury-red/10 active:scale-[0.98] disabled:opacity-50 cursor-pointer uppercase mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <CheckCircle size={14} strokeWidth={3} />
            )} 
            {loading ? 'GUARDANDO...' : 'REESTABLECER CUENTA'}
          </button>
        </form>
        
        {/* PIE DE PÁGINA */}
        <div className="text-center mt-8 pt-4 border-t border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Tolko Group © 2026
          </p>
        </div>

      </div>
    </div>
  );
}