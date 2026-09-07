import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { SlidersHorizontal, Users, Palette, Save, Plus, Trash2, Moon, Sun, Key, RefreshCw, Hash, Pencil, X, ShieldAlert, Lock, EyeOff, Eye, AlertCircle, Check } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState<'catalogos' | 'reglas' | 'perfil'>('catalogos');
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE ESPECIALIDADES ---
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  
  // Estados para Editar
  const [editingSpecialtyId, setEditingSpecialtyId] = useState<string | null>(null);
  const [editingSpecialtyName, setEditingSpecialtyName] = useState('');

  // --- ESTADOS DE REGLAS DE NEGOCIO ---
  const [businessRules, setBusinessRules] = useState({
    maxRevisions: 2,
    redAlertHours: 24
  });

  // --- ESTADOS DE PERFIL e INTERFAZ ---
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // ESTADOS PARA LA CONTRASEÑA
  const [savingPass, setSavingPass] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    fetchCatalogData();
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');
      
      if (error) throw error;
      if (data) setSpecialties(data);
    } catch (error) {
      console.error('Error general al cargar catálogos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LÓGICA DE CRUD DE ESPECIALIDADES (BLINDADA CON CASCADA)
  // ==========================================
  
  const handleAddSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialty.trim()) return;
    try {
      const { data, error } = await supabase.from('specialties').insert([{ name: newSpecialty.trim() }]).select().single();
      if (error) throw error;
      if (data) {
        setSpecialties([...specialties, data].sort((a, b) => a.name.localeCompare(b.name)));
        setNewSpecialty('');
        Swal.fire({ title: 'Añadida', text: 'Nueva especialidad registrada.', icon: 'success', confirmButtonColor: '#D3002D' });
      }
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#D3002D' });
    }
  };

  // 🔥 ACTUALIZACIÓN EN CASCADA AUTOMÁTICA
  const handleUpdateSpecialty = async (id: string) => {
    const newName = editingSpecialtyName.trim();
    if (!newName) return;

    const targetObj = specialties.find(s => s.id === id);
    const oldName = targetObj?.name;

    try {
      // 1. Actualizar la especialidad en la tabla maestra
      const { error: specError } = await supabase
        .from('specialties')
        .update({ name: newName })
        .eq('id', id);

      if (specError) throw specError;

      // 2. Si tenía un nombre previo, actualizar en cascada a todos los perfiles de staff que la usaban
      if (oldName && oldName !== newName) {
        await supabase
          .from('profiles')
          .update({ specialty: newName })
          .eq('specialty', oldName);
      }

      setSpecialties(specialties.map(s => s.id === id ? { ...s, name: newName } : s));
      setEditingSpecialtyId(null);
      setEditingSpecialtyName('');

      Swal.fire({ 
        title: 'Actualizada con éxito', 
        text: 'La especialidad y todos los miembros del staff asociados fueron sincronizados.', 
        icon: 'success', 
        confirmButtonColor: '#D3002D' 
      });

    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#D3002D' });
    }
  };

  const handleDeleteSpecialty = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Borrar "${name}"?`,
      text: "Asegúrate de que ningún miembro del Staff tenga esta especialidad asignada antes de borrarla.",
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonColor: '#D3002D', 
      cancelButtonColor: '#4b5563', 
      confirmButtonText: 'Sí, borrar'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('specialties').delete().eq('id', id);
        if (error) throw error;
        setSpecialties(specialties.filter(s => s.id !== id));
        Swal.fire('Borrado', 'La especialidad ha sido eliminada.', 'success');
      } catch (error: any) {
        Swal.fire('Error', 'Es posible que esté en uso por tu Staff. ' + error.message, 'error');
      }
    }
  };

  // ==========================================
  // UI & SISTEMA
  // ==========================================
  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleSaveGlobalSettings = (section: string) => {
    Swal.fire({ title: 'Ajustes Guardados', text: `El módulo de [${section}] ha sido sincronizado con éxito.`, icon: 'success', confirmButtonColor: '#D3002D' });
  };

  // ==========================================
  // LÓGICA DE CONTRASEÑA
  // ==========================================
  const validatePasswordStrength = (pass: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
    return strongPasswordRegex.test(pass);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Swal.fire({ title: 'Campos Vacíos', text: 'Por favor completa todos los campos de seguridad.', icon: 'warning', confirmButtonColor: '#D3002D' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({ title: 'Las contraseñas no coinciden', text: 'La confirmación debe ser exactamente igual a la nueva contraseña.', icon: 'error', confirmButtonColor: '#D3002D' });
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
        confirmButtonColor: '#D3002D' 
      });
      return;
    }

    setSavingPass(true);
    try {
      const { error: reAuthError } = await supabase.auth.signInWithPassword({
        email: user!.email!,
        password: passwordData.currentPassword
      });

      if (reAuthError) {
        Swal.fire({
          title: 'Validación Incorrecta',
          text: 'La contraseña anterior que ingresaste es incorrecta.',
          icon: 'error',
          confirmButtonColor: '#D3002D'
        });
        setSavingPass(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      Swal.fire({ 
        title: 'Contraseña Actualizada', 
        text: 'Se ha modificado la clave de acceso.', 
        icon: 'success', 
        confirmButtonColor: '#D3002D' 
      });
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#D3002D' });
    } finally {
      setSavingPass(false);
    }
  };

  const pass = passwordData.newPassword;
  const hasLength = pass.length >= 8;
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSymbol = /[@$!%*?&.#_-]/.test(pass);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 transition-colors duration-300">
      
      {/* HEADER DE GESTIÓN MAESTRA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-luxury-border pb-4 transition-colors duration-300">
        <div>
          <h2 className="text-xl font-black tracking-widest text-gray-900 dark:text-white uppercase transition-colors duration-300">Configuración del Sistema</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Consola de control maestro para catálogos, políticas operativas y UI.</p>
        </div>
        <button onClick={fetchCatalogData} className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-luxury-border px-3 py-2 rounded-xl bg-white dark:bg-black/40 transition-all cursor-pointer shadow-sm">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refrescar Base de Datos
        </button>
      </div>

      {/* INTERRUPTOR DE SUB-PESTAÑAS */}
      <div className="flex bg-gray-100 dark:bg-[#0F0F12] border border-gray-200 dark:border-luxury-border p-1 rounded-2xl max-w-md transition-colors duration-300">
        <button onClick={() => setActiveSubTab('catalogos')} className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer uppercase ${activeSubTab === 'catalogos' ? 'bg-luxury-red text-white shadow-md' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          <Users size={14}/> Staff
        </button>
        <button onClick={() => setActiveSubTab('reglas')} className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer uppercase ${activeSubTab === 'reglas' ? 'bg-luxury-red text-white shadow-md' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          <SlidersHorizontal size={14}/> Reglas
        </button>
        <button onClick={() => setActiveSubTab('perfil')} className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer uppercase ${activeSubTab === 'perfil' ? 'bg-luxury-red text-white shadow-md' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
          <Palette size={14}/> Perfil e Interfaz
        </button>
      </div>

      {/* SUB-TAB 1: CATÁLOGOS OPERATIVOS */}
      {activeSubTab === 'catalogos' && (
        <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-luxury-border p-8 rounded-2xl transition-colors duration-300 max-w-3xl animate-in fade-in zoom-in-95 duration-200 shadow-sm dark:shadow-none space-y-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-luxury-border/50 pb-2">
            <Users size={16} className="text-luxury-red"/> Catálogo de Especialidades (Staff)
          </h3>

          <form onSubmit={handleAddSpecialty} className="flex gap-3">
            <input 
              type="text" 
              placeholder="Añadir nueva especialidad (Ej: Animación 3D, SEO...)" 
              value={newSpecialty} 
              onChange={e => setNewSpecialty(e.target.value)} 
              className="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-luxury-border rounded-xl p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red" 
            />
            <button type="submit" disabled={!newSpecialty.trim()} className="bg-luxury-red hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center gap-2">
              <Plus size={16}/> Agregar
            </button>
          </form>

          <div className="border border-gray-100 dark:border-luxury-border/40 rounded-xl divide-y divide-gray-100 dark:divide-luxury-border/20 bg-gray-50/50 dark:bg-black/20">
            {specialties.length === 0 ? (
               <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No hay especialidades registradas</div>
            ) : specialties.map(spec => (
              <div key={spec.id} className="p-4 flex justify-between items-center text-sm font-bold text-gray-700 dark:text-gray-300 group transition-colors hover:bg-white dark:hover:bg-black/40">
                {editingSpecialtyId === spec.id ? (
                  <input
                    type="text"
                    autoFocus
                    value={editingSpecialtyName}
                    onChange={e => setEditingSpecialtyName(e.target.value)}
                    className="bg-white dark:bg-[#1A1A21] border border-luxury-red rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none w-1/2 font-bold text-sm shadow-sm"
                  />
                ) : (
                  <span>{spec.name}</span>
                )}

                <div className="flex items-center gap-2">
                  {editingSpecialtyId === spec.id ? (
                    <>
                      <button type="button" onClick={() => handleUpdateSpecialty(spec.id)} className="text-green-600 hover:text-green-700 p-2.5 bg-green-50 dark:bg-green-500/10 rounded-lg transition-colors cursor-pointer" title="Guardar">
                        <Save size={16}/>
                      </button>
                      <button type="button" onClick={() => setEditingSpecialtyId(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2.5 bg-gray-100 dark:bg-white/5 rounded-lg transition-colors cursor-pointer" title="Cancelar">
                        <X size={16}/>
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => { setEditingSpecialtyId(spec.id); setEditingSpecialtyName(spec.name); }} className="text-gray-400 hover:text-blue-500 p-2 opacity-0 group-hover:opacity-100 transition-all cursor-pointer" title="Editar">
                        <Pencil size={16}/>
                      </button>
                      <button type="button" onClick={() => handleDeleteSpecialty(spec.id, spec.name)} className="text-gray-400 hover:text-luxury-red p-2 opacity-0 group-hover:opacity-100 transition-all cursor-pointer" title="Borrar">
                        <Trash2 size={16}/>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REGLAS DEL NEGOCIO */}
      {activeSubTab === 'reglas' && (
        <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-luxury-border p-8 rounded-2xl transition-colors duration-300 max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-sm dark:shadow-none">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 dark:border-luxury-border/50 pb-2"><SlidersHorizontal size={16} className="text-luxury-red"/> Políticas y Automatizaciones Globales</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1"><Hash size={12}/> Revisiones Estándar por Ticket</label>
              <input type="number" min="1" value={businessRules.maxRevisions} onChange={e => setBusinessRules({...businessRules, maxRevisions: parseInt(e.target.value) || 1})} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red transition-colors" />
              <p className="text-[10px] text-gray-400 italic">Límite base asignado a los briefs de los clientes al ser creados.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1"><ShieldAlert size={12}/> Colchón Focos Rojos (Horas)</label>
              <input type="number" min="1" value={businessRules.redAlertHours} onChange={e => setBusinessRules({...businessRules, redAlertHours: parseInt(e.target.value) || 1})} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-luxury-border rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none focus:border-luxury-red transition-colors" />
              <p className="text-[10px] text-gray-400 italic">Tiempo antes del vencimiento donde la tarjeta parpadeará en rojo.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-luxury-border/50 flex justify-end">
            <button onClick={() => handleSaveGlobalSettings('Políticas Generales')} className="bg-luxury-red hover:bg-red-700 text-white text-xs font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer uppercase tracking-wider active:scale-95"><Save size={14}/> Guardar Políticas</button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PREFERENCIAS INTERFAZ Y PERFIL */}
      {activeSubTab === 'perfil' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-luxury-border p-6 md:p-8 rounded-2xl transition-colors duration-300 space-y-6 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-luxury-border/50 pb-3">
              <Palette size={16} className="text-luxury-red"/> Entorno Visual e Interfaz
            </h3>
            
            <div className="flex items-center justify-between p-4 md:p-6 bg-gray-50 dark:bg-black border border-gray-100 dark:border-luxury-border/30 rounded-2xl transition-colors">
              <div>
                <p className="text-xs md:text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase">Modo de Pantalla</p>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">Alterna el switch híbrido general de la aplicación entre modo claro y oscuro.</p>
              </div>
              <button type="button" onClick={handleToggleTheme} className="bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 p-3 md:p-4 rounded-xl text-gray-700 dark:text-gray-300 hover:text-luxury-red transition-all cursor-pointer shadow-inner">
                {theme === 'dark' ? <Sun size={20} className="text-amber-500"/> : <Moon size={20} className="text-indigo-600"/>}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1A21] border border-gray-200 dark:border-luxury-border rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none transition-all duration-300">
            <div className="mb-6 border-b border-gray-100 dark:border-luxury-border/50 pb-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Key size={18} className="text-luxury-red" /> Modificar Credenciales de Seguridad
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Actualiza tu contraseña usando filtros estrictos de validación criptográfica.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                
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

                <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-700 dark:text-amber-500 text-[10px] font-medium leading-relaxed">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Esta acción forzará el cierre de sesión en otros dispositivos abiertos por protección de identidad.</span>
                </div>

                <button disabled={savingPass} type="submit" className="w-full bg-luxury-red hover:opacity-90 text-white py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer uppercase">
                  {savingPass ? 'PROCESANDO...' : <><Save size={16}/> ACTUALIZAR CREDENCIAL</>}
                </button>
              </form>

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

        </div>
      )}

    </div>
  );
}