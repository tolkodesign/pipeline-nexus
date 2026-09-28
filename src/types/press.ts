export interface PressCatalog {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PressMedia extends PressCatalog {}
export interface PressSource extends PressCatalog {}
export interface PressMediaType extends PressCatalog {}
export interface PressCampaign extends PressCatalog {}

export interface ReporterEvidence {
  id: string;
  reporter_id: string;
  url: string;
  created_at: string;
}

export interface Reporter {
  id: string;
  full_name: string;
  position: string | null;
  media_id: string | null;
  phone: string | null;
  email: string | null;
  birth_date: string | null;
  source_id: string | null;
  tier: 1 | 2 | 3;
  media_type_id: string | null;
  is_active: boolean;
  photo_url: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  press_media?: PressMedia | null;
  press_sources?: PressSource | null;
  press_media_types?: PressMediaType | null;
  press_campaigns?: PressCampaign[];
  reporter_evidence?: ReporterEvidence[];
}
