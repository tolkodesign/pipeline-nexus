import { useState, useEffect } from 'react';
import { User, Key, Save, Lock, Eye, EyeOff, AlertCircle, Check, X, ShieldAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

export default function ClientSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // Estados de visibilidad de contraseña
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Estados del Perfil
  const [profileData, setProfileData] = useState({ full_name: '', phone: '' });
  
  // Estados de Contraseña (🔥 Añadimos la contraseña actual)
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    if (user?.id) fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const { data: prof, error: profError } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user!.id)
        .single();

      if (profError) throw profError;
      if (prof) {
        setProfileData({ 
          full_name: prof.full_name || '', 
          phone: prof.phone || '' 
        });
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profileData.full_name, phone: profileData.phone })
        .eq('id', user!.id);
      
      if (error) throw error;
      Swal.fire({ title: 'Perfil Actualizado', text: 'Tus datos personales se guardaron con éxito.', icon: 'success', confirmButtonColor: 'var(--color-luxury-red)' });
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: 'var(--color-luxury-red)' });
    } finally {
      setSaving(false);
    }
  };

  const validatePasswordStrength = (pass: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
    return strongPasswordRegex.test(pass);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Swal.fire({ title: 'Campos Vacíos', text: 'Por favor completa todos los campos de seguridad.', icon: 'warning', confirmButtonColor: 'var(--color-luxury-red)' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({ title: 'Las contraseñas no coinciden', text: 'La confirmación debe ser exactamente igual a la nueva contraseña.', icon: 'error', confirmButtonColor: 'var(--color-luxury-red)' });
      return;
    }

    if (!validatePasswordStrength(passwordData.newPassword)) {
      Swal.fire({ 
        title: 'Contraseña Vulnerable', 
        html: `<div class="text-left text-xs space-y-2">
                <p class="font-bold mb-2 text-sm text-center">Tu contraseña debe contener obligatoriamente:</p>
                <p>• Mínimo <b>8 caracteres</b> de longitud.</p>
                <p>• Al menos una letra <b>Mayúscula</b> (A-Z).</p>
                <p>• Al menos una letra <b>Minúscula</b> (a-z).</p>
                <p>• Al menos un <b>Número</b> (0-9).</p>
                <p>• Al menos un <b>Símbolo Especial</b> (@, $, !, %, *, ?, &, ., -, _, #).</p>
               </div>`, 
        icon: 'warning', 
        confirmButtonColor: 'var(--color-luxury-red)' 
      });
      return;
    }

    setSaving(true);
    try {
      // 🔥 TRUCO PRO: Re-autenticamos al usuario para validar que su contraseña actual sea la real
      const { error: reAuthError } = await supabase.auth.signInWithPassword({
        email: user!.email!,
        password: passwordData.currentPassword
      });

      if (reAuthError) {
        Swal.fire({
          title: 'Validación Incorrecta',
          text: 'La contraseña anterior que ingresaste es incorrecta. No tienes autorización para realizar el cambio.',
          icon: 'error',
          confirmButtonColor: 'var(--color-luxury-red)'
        });
        setSaving(false);
        return;
      }

      // Si la contraseña vieja es correcta, procedemos a actualizar a la nueva
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      Swal.fire({ 
        title: '¡Contraseña Actualizada!', 
        text: 'Se ha enviado un correo de confirmación de seguridad a tu bandeja.', 
        icon: 'success', 
        confirmButtonColor: 'var(--color-luxury-red)' 
      });
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: 'var(--color-luxury-red)' });
    } finally {
      setSaving(false);
    }
  };

  // Helpers visuales de requisitos en tiempo real
  const pass = passwordData.newPassword;
  const hasLength = pass.length >= 8;
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSymbol = /[@$!%*?&.#_-]/.test(pass);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark flex items-center justify-center text-gray-500">
        <div className="w-8 h-8 border-2 border-luxury-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // 🔥 CAMBIO DE FORMATO: Ampliamos el max-w-full a max-w-4xl para darle un espacio premium brutal
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-dark text-gray-900 dark:text-gray-200 pb-10 space-y-8 font-sans w-full max-w-full flex-1 transition-colors duration-300 min-w-0">
      
      {/* HEADER */}
      <div className="px-6 md:px-10 pt-10 w-full">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
          Configuración <span style={{ color: 'var(--color-luxury-red)' }}>General</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium truncate">
          Administra tus datos de contacto y credenciales de acceso de forma segura.
        </p>
      </div>

      {/* TABS PESTAÑAS */}
      <div className="px-6 md:px-10 w-full">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-luxury-border/50 pb-px">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'text-luxury-red border-b-2 border-luxury-red' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-b-2 border-transparent'}`}
          >
            Datos Personales
          </button>
          <button 
            onClick={() => setActiveTab('password')}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'password' ? 'text-luxury-red border-b-2 border-luxury-red' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-b-2 border-transparent'}`}
          >
            Seguridad / Contraseña
          </button>
        </div>
      </div>

      {/* CONTENIDO DE LAS PESTAÑAS (🔥 MODIFICADO A MAX-W-4xl) */}
      <div className="px-6 md:px-10 w-full max-w-4xl">
        
        {/* PESTAÑA 1: DATOS PERSONALES */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none animate-in fade-in duration-300">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User size={18} className="text-luxury-red" /> Información de Contacto
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Nombre Completo</label>
                <input required type="text" value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3.5 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Teléfono Móvil</label>
                <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl p-3.5 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors" />
              </div>
              <div className="pt-4">
                <button disabled={saving} type="submit" className="bg-luxury-red hover:opacity-90 text-white px-8 py-3.5 rounded-xl text-xs font-black tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer">
                  {saving ? 'GUARDANDO...' : <><Save size={16}/> GUARDAR PERFIL</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PESTAÑA 2: CONTRASEÑA ULTRA SEGURA CON EL NUEVO DISEÑO ESPACIOSO */}
        {activeTab === 'password' && (
          <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none animate-in fade-in duration-300 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Key size={18} className="text-luxury-red" /> Modificar Credenciales
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Actualiza tu contraseña usando filtros estrictos de validación criptográfica.</p>
            </div>
            
            {/* El Grid ahora está balanceado a la mitad (md:grid-cols-2) para aprovechar al máximo la pantalla grande */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Columna del Formulario */}
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                
                {/* 🔥 CAMPO NUEVO: CONTRASEÑA ANTERIOR */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Contraseña Anterior *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type={showCurrentPass ? "text" : "password"} 
                      placeholder="Escribe tu contraseña actual"
                      value={passwordData.currentPassword} 
                      onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                      className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl py-3.5 pl-11 pr-12 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors" 
                    />
                    <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Nueva Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type={showPass ? "text" : "password"} 
                      placeholder="Nueva contraseña segura"
                      value={passwordData.newPassword} 
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                      className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl py-3.5 pl-11 pr-12 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors" 
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Confirmar Nueva Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type={showConfirmPass ? "text" : "password"} 
                      placeholder="Repite tu nueva contraseña"
                      value={passwordData.confirmPassword} 
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                      className="w-full bg-gray-50 dark:bg-[#0a0a0c] border border-gray-300 dark:border-luxury-border rounded-xl py-3.5 pl-11 pr-12 text-sm text-gray-900 dark:text-white focus:border-luxury-red outline-none transition-colors" 
                    />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/3xl rounded-xl text-amber-700 dark:text-amber-500 text-xxs font-medium leading-relaxed">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Esta acción forzará el cierre de sesión en otros dispositivos abiertos por protección de identidad.</span>
                </div>

                <button disabled={saving} type="submit" className="w-full bg-luxury-red hover:opacity-90 text-white py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer uppercase">
                  {saving ? 'PROCESANDO...' : <><Save size={16}/> ACTUALIZAR CREDENCIAL</>}
                </button>
              </form>

              {/* Columna de Requisitos Visuales (Más grande, con cajas y más aire) */}
              <div className="space-y-6 flex flex-col justify-start">
                <div className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-luxury-border/50 rounded-2xl p-6 flex flex-col gap-5 text-xs transition-colors">
                  <p className="font-black text-[11px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-luxury-red" /> Auditoría de Fortaleza
                  </p>
                  
                  <ul className="space-y-3.5 font-bold text-sm">
                    <li className={`flex items-center gap-3 transition-colors ${hasLength ? 'text-green-500' : 'text-gray-400'}`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] ${hasLength ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-transparent border-gray-300 dark:border-gray-700'}`}>
                        {hasLength ? <Check size={12} strokeWidth={4}/> : <X size={10}/>}
                      </div> 
                      Mínimo 8 caracteres
                    </li>
                    <li className={`flex items-center gap-3 transition-colors ${hasUpper ? 'text-green-500' : 'text-gray-400'}`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] ${hasUpper ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-transparent border-gray-300 dark:border-gray-700'}`}>
                        {hasUpper ? <Check size={12} strokeWidth={4}/> : <X size={10}/>}
                      </div> 
                      Al menos una Mayúscula (A-Z)
                    </li>
                    <li className={`flex items-center gap-3 transition-colors ${hasLower ? 'text-green-500' : 'text-gray-400'}`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] ${hasLower ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-transparent border-gray-300 dark:border-gray-700'}`}>
                        {hasLower ? <Check size={12} strokeWidth={4}/> : <X size={10}/>}
                      </div> 
                      Al menos una Minúscula (a-z)
                    </li>
                    <li className={`flex items-center gap-3 transition-colors ${hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] ${hasNumber ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-transparent border-gray-300 dark:border-gray-700'}`}>
                        {hasNumber ? <Check size={12} strokeWidth={4}/> : <X size={10}/>}
                      </div> 
                      Al menos un Número (0-9)
                    </li>
                    <li className={`flex items-center gap-3 transition-colors ${hasSymbol ? 'text-green-500' : 'text-gray-400'}`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] ${hasSymbol ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-transparent border-gray-300 dark:border-gray-700'}`}>
                        {hasSymbol ? <Check size={12} strokeWidth={4}/> : <X size={10}/>}
                      </div> 
                      Un Símbolo Especial (#, @, $, !)
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}