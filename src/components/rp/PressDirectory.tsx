import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { canManagePressDirectory } from '../../lib/pressDirectoryAuth';
import { usePressMedia, usePressSources, usePressMediaTypes, useReporters, usePressCampaigns } from '../../hooks/usePressDirectory';
import ReportersList from './ReportersList';
import CatalogsManager from './CatalogsManager';
import { Settings2, Users, ShieldCheck } from 'lucide-react';

interface Props {
  isEmbedded?: boolean;
}

export default function PressDirectory({ isEmbedded = false }: Props) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'directorio' | 'catalogos'>('directorio');
  
  const hasAccess = canManagePressDirectory(profile);

  const { data: media, loading: mediaLoading, refetch: refetchMedia } = usePressMedia();
  const { data: sources, loading: sourcesLoading, refetch: refetchSources } = usePressSources();
  const { data: mediaTypes, loading: mediaTypesLoading, refetch: refetchMediaTypes } = usePressMediaTypes();
  const { data: reporters, loading: reportersLoading, refetch: refetchReporters } = useReporters();
  const { data: campaigns, loading: campaignsLoading, refetch: refetchCampaigns } = usePressCampaigns();

  useEffect(() => {
    if (hasAccess) {
      refetchMedia();
      refetchSources();
      refetchMediaTypes();
      refetchReporters();
      refetchCampaigns();
    }
  }, [hasAccess, refetchMedia, refetchSources, refetchMediaTypes, refetchReporters, refetchCampaigns]);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="text-center p-8 bg-white dark:bg-luxury-card rounded-2xl shadow-sm border border-red-200 dark:border-red-900/30 max-w-md">
          <h2 className="text-xl font-black text-red-600 mb-2">Acceso Restringido</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            No tienes los permisos necesarios para acceder al Directorio de Prensa. Este módulo es exclusivo para Administradores y miembros de Relaciones Públicas.
          </p>
        </div>
      </div>
    );
  }

  const containerClasses = isEmbedded
    ? "space-y-6 animate-in fade-in duration-300 font-sans w-full max-w-full flex-1 transition-colors min-w-0 pb-12"
    : "space-y-6 animate-in fade-in duration-300 font-sans p-4 sm:p-6 md:p-10 max-w-[1500px] mx-auto w-full max-w-full flex-1 transition-colors min-w-0 pb-20";

  return (
    <div className={containerClasses}>
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-200 dark:border-luxury-border pb-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase truncate">
            Directorio <span className="text-luxury-red">Prensa</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-bold flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-luxury-red shrink-0" />
            Célula Operativa: <span className="text-luxury-red font-black">Relaciones Públicas</span>
          </p>
        </div>

        {/* TABS DE SELECCIÓN */}
        <div className="flex bg-gray-200/50 dark:bg-black/50 p-1.5 rounded-xl border border-gray-200/50 dark:border-white/5 shrink-0">
          <button 
            onClick={() => setActiveTab('directorio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'directorio' 
                ? 'bg-white dark:bg-luxury-card text-luxury-red shadow-sm' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users size={15} /> Reporteros
          </button>
          <button 
            onClick={() => setActiveTab('catalogos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'catalogos' 
                ? 'bg-white dark:bg-luxury-card text-luxury-red shadow-sm' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings2 size={15} /> Catálogos
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="w-full min-w-0">
        {activeTab === 'directorio' ? (
          <ReportersList 
            reporters={reporters}
            media={media}
            sources={sources}
            mediaTypes={mediaTypes}
            campaigns={campaigns}
            loading={reportersLoading}
            refetch={refetchReporters}
            profileId={profile?.id}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CatalogsManager 
              tableName="press_media"
              title="Medios"
              data={media}
              refetch={refetchMedia}
              loading={mediaLoading}
            />
            <CatalogsManager 
              tableName="press_sources"
              title="Fuentes"
              data={sources}
              refetch={refetchSources}
              loading={sourcesLoading}
            />
            <CatalogsManager 
              tableName="press_media_types"
              title="Tipos de Medio"
              data={mediaTypes}
              refetch={refetchMediaTypes}
              loading={mediaTypesLoading}
            />
            <CatalogsManager 
              tableName="press_campaigns"
              title="Campañas"
              data={campaigns}
              refetch={refetchCampaigns}
              loading={campaignsLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
