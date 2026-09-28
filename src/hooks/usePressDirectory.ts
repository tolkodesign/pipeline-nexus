import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PressMedia, PressSource, PressMediaType, Reporter, PressCampaign } from '../types/press';

export function usePressMedia() {
  const [data, setData] = useState<PressMedia[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const { data: result, error } = await supabase
      .from('press_media')
      .select('*')
      .order('name');
    if (!error && result) setData(result as PressMedia[]);
    setLoading(false);
  }, []);

  return { data, loading, refetch: fetchMedia };
}

export function usePressSources() {
  const [data, setData] = useState<PressSource[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSources = useCallback(async () => {
    setLoading(true);
    const { data: result, error } = await supabase
      .from('press_sources')
      .select('*')
      .order('name');
    if (!error && result) setData(result as PressSource[]);
    setLoading(false);
  }, []);

  return { data, loading, refetch: fetchSources };
}

export function usePressMediaTypes() {
  const [data, setData] = useState<PressMediaType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMediaTypes = useCallback(async () => {
    setLoading(true);
    const { data: result, error } = await supabase
      .from('press_media_types')
      .select('*')
      .order('name');
    if (!error && result) setData(result as PressMediaType[]);
    setLoading(false);
  }, []);

  return { data, loading, refetch: fetchMediaTypes };
}

export function useReporters() {
  const [data, setData] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReporters = useCallback(async () => {
    setLoading(true);
    const { data: result, error } = await supabase
      .from('reporters')
      .select(`
        *,
        press_media ( id, name, is_active ),
        press_sources ( id, name, is_active ),
        press_media_types ( id, name, is_active ),
        reporter_campaigns ( press_campaigns ( id, name, is_active ) ),
        reporter_evidence ( id, url, created_at )
      `)
      .order('created_at', { ascending: false });
      
    if (!error && result) {
      // Map the nested campaigns
      const mapped = result.map((row: any) => ({
        ...row,
        press_campaigns: row.reporter_campaigns
          ?.map((rc: any) => rc.press_campaigns)
          .filter(Boolean) || [],
      }));
      setData(mapped as Reporter[]);
    }
    setLoading(false);
  }, []);

  return { data, loading, refetch: fetchReporters };
}

export function usePressCampaigns() {
  const [data, setData] = useState<PressCampaign[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const { data: result, error } = await supabase
      .from('press_campaigns')
      .select('*')
      .order('name');
    if (!error && result) setData(result as PressCampaign[]);
    setLoading(false);
  }, []);

  return { data, loading, refetch: fetchCampaigns };
}
