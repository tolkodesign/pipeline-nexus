import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ReportSettings } from '../components/admin/ui/reports/reportTypes';
import { DEFAULT_REPORT_SETTINGS } from '../components/admin/ui/reports/reportTypes';
import Swal from 'sweetalert2';

export function useReportSettings(clientId: string) {
  const [settings, setSettings] = useState<ReportSettings>(DEFAULT_REPORT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Cargar configuración cuando cambia el cliente
  useEffect(() => {
    const fetchSettings = async () => {
      setLoadingSettings(true);
      if (clientId === 'todos') {
        // Usar default si es global
        setSettings(DEFAULT_REPORT_SETTINGS);
        setLoadingSettings(false);
        return;
      }

      try {
        // 1. Intentar cargar desde Supabase (si la columna report_settings existe)
        const { data, error } = await supabase
          .from('organizations')
          .select('report_settings')
          .eq('id', clientId)
          .single();

        if (!error && data?.report_settings) {
          // Fusionar con defaults para evitar llaves faltantes en JSON antiguos
          setSettings({ ...DEFAULT_REPORT_SETTINGS, ...data.report_settings });
        } else {
          // 2. Fallback a localStorage si la columna no existe o está vacía
          const localData = localStorage.getItem(`report_settings_${clientId}`);
          if (localData) {
            setSettings({ ...DEFAULT_REPORT_SETTINGS, ...JSON.parse(localData) });
          } else {
            setSettings(DEFAULT_REPORT_SETTINGS);
          }
        }
      } catch (err) {
        console.error("Error al cargar settings:", err);
        // Fallback a localStorage
        const localData = localStorage.getItem(`report_settings_${clientId}`);
        if (localData) setSettings({ ...DEFAULT_REPORT_SETTINGS, ...JSON.parse(localData) });
        else setSettings(DEFAULT_REPORT_SETTINGS);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [clientId]);

  const updateSetting = (key: keyof ReportSettings, value: boolean) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const saveClientSettings = async () => {
    if (clientId === 'todos') {
      Swal.fire('Atención', 'No puedes guardar una plantilla específica para la vista Global.', 'info');
      return;
    }

    try {
      // 1. Intentar guardar en Supabase (si la columna existe)
      const { error } = await supabase
        .from('organizations')
        .update({ report_settings: settings })
        .eq('id', clientId);

      if (error) {
        // Si hay error (posiblemente la columna no existe), guardamos en localStorage
        localStorage.setItem(`report_settings_${clientId}`, JSON.stringify(settings));
        console.warn("Columna report_settings no encontrada en DB, guardado localmente.");
      } else {
        // Por si acaso, también guardamos local para caché
        localStorage.setItem(`report_settings_${clientId}`, JSON.stringify(settings));
      }
      
      Swal.fire({
        title: '¡Plantilla Guardada!',
        text: 'Las preferencias de reporte para este cliente se han guardado con éxito.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      localStorage.setItem(`report_settings_${clientId}`, JSON.stringify(settings));
      Swal.fire({
        title: 'Guardado Local',
        text: 'Tus preferencias se guardaron en este navegador.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const resetToGlobal = () => {
    setSettings(DEFAULT_REPORT_SETTINGS);
  };

  return {
    settings,
    updateSetting,
    saveClientSettings,
    resetToGlobal,
    loadingSettings
  };
}
