export interface ReportFilters {
  reportClientId: string;
  startMonth: string;
  endMonth: string;
  statusFilter: string;
  sortOrder: 'asc' | 'desc';
  isAdmin: boolean;
}

export interface ClientData {
  id?: string;
  name: string;
  banner_url: string | null;
  logo_url: string | null;
  primary_color: string;
  has_mailchimp: boolean;
}

export interface PriorityCounts {
  alta: number;
  media: number;
  baja: number;
}

export interface NameCountPair {
  name: string;
  count: number;
}

export interface ReportMetrics {
  clientData: any[]; // The requests after applying filters and sorting
  selectedClient: ClientData;
  clientColor: string; // resolved primary color (handles special rules like Novo)
  isBioPappel: boolean; // special rule
  
  totalRequests: number;
  completed: number;
  totalDeliverablesCount: number;
  completedDeliverablesCount: number;
  
  clientAdjustments: number;
  agencyAdjustments: number;
  
  specialtyParticipations: Record<string, number>;
  
  totalEditingHours: number;
  totalRecordingHours: number;
  totalVideoDurationFormatted: string;
  totalVideoDurationSeconds: number; // useful for raw value
  
  totalSlides: number;
  totalVideos: number;
  totalGifs: number;
  totalPpts: number;
  
  priorityCounts: PriorityCounts;
  topRecurrentProjects: NameCountPair[];
  topBrands: NameCountPair[];
  
  strategyCount: number;
  totalTotems: number;
  totalGestiones: number;
  totalEnvios: number;
  totalPR: number;
  totalCopysExcatos: number;
}
