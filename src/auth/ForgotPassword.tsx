import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Tolko Nexus - Recuperar Contraseña";
  }, []);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 LE AVISAMOS A SUPABASE: Manda el correo y redirige al usuario a /update-password
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      const isDarkTheme = document.documentElement.classList.contains('dark');
      
      await Swal.fire({
        title: '¡CORREO ENVIADO!',
        text: 'Te mandamos un enlace a tu bandeja de entrada. Revisa también tu carpeta de Spam.',
        icon: 'success',
        background: isDarkTheme ? '#0F0F12' : '#fff',
        color: isDarkTheme ? '#fff' : '#1f2937',
        confirmButtonColor: 'var(--color-luxury-red)'
      });

      // Lo regresamos al login para que espere su correo ahí tranquilo
      navigate('/login');

    } catch (error: any) {
      const isDarkTheme = document.documentElement.classList.contains('dark');
      Swal.fire({
        title: 'Error de Solicitud',
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Luces de fondo premium */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 rounded-full blur-[120px]" />

      <div className="bg-luxury-card border border-zinc-800/80 w-full max-w-md p-8 rounded-3xl space-y-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">¿Olvidaste tu clave?</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">Ingresa tu correo de la plataforma para reestablecer tu cuenta.</p>
        </div>

        <form onSubmit={handleResetRequest} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
              <input 
                required 
                type="email" 
                placeholder="tu-correo@tolkogroup.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#070709] border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none focus:border-red-600 transition-colors font-medium shadow-inner"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-900/10 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={16}/> : <><Send size={14}/> SOLICITAR NUEVA CLAVE</>}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider group">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1"/> Regresar al login
          </Link>
        </div>

      </div>
    </div>
  );
}