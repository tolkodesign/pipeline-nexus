export interface ReportSettings {
  // === SLIDE 1: PORTADA ===
  showCover: boolean;
  showCoverTotalRequests: boolean;
  showCoverCompleted: boolean;
  showCoverDeliverables: boolean;

  // === SLIDES 2: ESPECIALIDADES (SLIDES COMPLETAS) ===
  showAudiovisual: boolean;
  showDesign: boolean;
  showDev: boolean;
  showContent: boolean;
  showProduction: boolean;
  showStaff: boolean;
  showPR: boolean;

  // === MÉTRICAS INTERNAS POR ÁREA ===
  // Audiovisual
  showAvDeliverables: boolean;
  showAvEditingHours: boolean;
  showAvRecordingHours: boolean;
  showAvDuration: boolean;

  // Diseño
  showDesignPpts: boolean;
  showDesignSlides: boolean;
  showDesignArts: boolean;

  // Programación
  showDevProjects: boolean;

  // Contenido
  showCopyPieces: boolean;
  showCopyStrategies: boolean;
  showCopyExact: boolean;

  // Producción
  showProdCalls: boolean;
  showProdHours: boolean;

  // Staff
  showStaffEvents: boolean;

  // RP
  showPrImpacts: boolean;
  showPrGestiones: boolean;

  // === SLIDE 3: PRIORIDADES ===
  showPriorities: boolean;
  showPriorityHigh: boolean;
  showPriorityMedium: boolean;
  showPriorityLow: boolean;

  // === SLIDE 4: TOP PROYECTOS ===
  showTopProjects: boolean;

  // === OTROS / EXTRAS ===
  showBrands: boolean;
  showMailchimp: boolean;
  showConclusions: boolean;
  showNextSteps: boolean;
}

export const DEFAULT_REPORT_SETTINGS: ReportSettings = {
  // Slide 1: Portada
  showCover: true,
  showCoverTotalRequests: true,
  showCoverCompleted: true,
  showCoverDeliverables: true,

  // Slides 2: Especialidades completas
  showAudiovisual: true,
  showDesign: true,
  showDev: true,
  showContent: true,
  showProduction: true,
  showStaff: true,
  showPR: true,

  // Métricas Audiovisual
  showAvDeliverables: true,
  showAvEditingHours: true,
  showAvRecordingHours: true,
  showAvDuration: true,

  // Métricas Diseño
  showDesignPpts: true,
  showDesignSlides: true,
  showDesignArts: true,

  // Métricas Programación
  showDevProjects: true,

  // Métricas Contenido
  showCopyPieces: true,
  showCopyStrategies: true,
  showCopyExact: true,

  // Métricas Producción
  showProdCalls: true,
  showProdHours: true,

  // Métricas Staff
  showStaffEvents: true,

  // Métricas RP
  showPrImpacts: true,
  showPrGestiones: true,

  // Slide 3: Prioridades
  showPriorities: true,
  showPriorityHigh: true,
  showPriorityMedium: true,
  showPriorityLow: true,

  // Slide 4: Top Proyectos
  showTopProjects: true,

  // Otros
  showBrands: true,
  showMailchimp: true,
  showConclusions: true,
  showNextSteps: true,
};
