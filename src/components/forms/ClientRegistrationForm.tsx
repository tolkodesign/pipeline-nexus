import { useState } from 'react';
import { Building2, UserCircle, Upload, Send, Info } from 'lucide-react';

export default function ClientRegistrationForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de guardado en Supabase
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-luxury-card border border-luxury-border rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Banner de Sección */}
        <div className="bg-gradient-to-r from-luxury-red to-luxury-red-dark p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Registro de Nueva Cuenta VIP</h2>
              <p className="text-white/60 text-xs uppercase tracking-widest mt-1">Onboarding Enterprise 2026</p>
            </div>
            <Building2 className="opacity-20" size={48} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12">
          
          {/* SECCIÓN 1: DATOS DE LA EMPRESA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-luxury-red">
                  <Building2 size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Información de Empresa</h3>
              </div>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block group-focus-within:text-luxury-red transition-colors">Nombre Legal *</label>
                  <input required type="text" className="w-full bg-luxury-dark border border-luxury-border rounded-xl p-3 text-sm focus:border-luxury-red outline-none transition-all" placeholder="Ej: Global Dynamics S.A." />
                </div>
                
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block group-focus-within:text-luxury-red transition-colors">Industria / Sector</label>
                  <select className="w-full bg-luxury-dark border border-luxury-border rounded-xl p-3 text-sm focus:border-luxury-red outline-none transition-all appearance-none">
                    <option>Real Estate</option>
                    <option>Fintech</option>
                    <option>Tech & SaaS</option>
                    <option>Retail Luxury</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-luxury-red">
                  <Upload size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Branding Corporativo</h3>
              </div>
              
              <div className="border-2 border-dashed border-luxury-border rounded-2xl p-8 text-center hover:border-luxury-red/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={20} className="text-gray-500 group-hover:text-luxury-red" />
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase">Logotipo de Empresa</p>
                <p className="text-[10px] text-gray-600 mt-1">SVG, PNG o JPG (Max 2MB)</p>
              </div>
            </div>
          </div>

          {/* DIVIDER LUXURY */}
          <div className="relative h-px bg-luxury-border">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-luxury-card px-4">
              <div className="w-2 h-2 rounded-full bg-luxury-red animate-pulse"></div>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS DEL ENCARGADO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-luxury-red">
                  <UserCircle size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Información del Encargado</h3>
              </div>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block group-focus-within:text-luxury-red transition-colors">Nombre Completo *</label>
                  <input required type="text" className="w-full bg-luxury-dark border border-luxury-border rounded-xl p-3 text-sm focus:border-luxury-red outline-none transition-all" placeholder="Nombre del directivo" />
                </div>
                
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block group-focus-within:text-luxury-red transition-colors">Rol / Cargo Estratégico</label>
                  <input type="text" className="w-full bg-luxury-dark border border-luxury-border rounded-xl p-3 text-sm focus:border-luxury-red outline-none transition-all" placeholder="Ej: CEO, Marketing Director..." />
                </div>
              </div>
            </div>

            <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block group-focus-within:text-luxury-red transition-colors">Email Corporativo</label>
                  <input required type="email" className="w-full bg-luxury-dark border border-luxury-border rounded-xl p-3 text-sm focus:border-luxury-red outline-none transition-all" placeholder="nombre@empresa.com" />
                </div>
                
                <div className="border border-luxury-border rounded-xl p-4 bg-white/[0.02] flex items-start gap-3">
                  <Info size={16} className="text-luxury-gold shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    Este contacto será el encargado principal para las notificaciones de entrega y revisión de materiales.
                  </p>
                </div>
            </div>
          </div>

          {/* ACCIÓN FINAL */}
          <div className="pt-6">
            <button 
              disabled={loading}
              className="w-full bg-luxury-red hover:bg-red-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(211,0,45,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={18} />
                  DAR DE ALTA CUENTA VIP
                </>
              )}
            </button>
            <p className="text-center text-[9px] text-gray-600 uppercase tracking-[0.3em] mt-6">AETERNA Enterprise Security Protocol Verified</p>
          </div>

        </form>
      </div>
    </div>
  );
}