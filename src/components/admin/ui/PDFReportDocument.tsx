import { Document, Page, Text, View, StyleSheet, Svg, Rect, Line, Circle, G } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: '#0F0F12', // Dark Luxury Theme
    fontFamily: 'Helvetica',
    color: '#F8FAFC',
  },
  
  // HERO HEADER
  header: {
    backgroundColor: '#18181B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#D3002D',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#D3002D',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandTag: {
    backgroundColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // SECTION LABELS
  sectionLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#A1A1AA',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // CARDS GRID
  grid4: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#27272A',
    borderLeftWidth: 3,
  },
  cardTitle: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#71717A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardUnit: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#71717A',
    marginLeft: 3,
  },

  // TWO COLUMN BLOCK
  twoColumns: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  colBlock: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },

  // PROGRESS BARS (PRIORIDAD)
  prioRow: {
    marginBottom: 8,
  },
  prioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  prioLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
  },
  prioValue: {
    fontSize: 7.5,
    color: '#A1A1AA',
    fontWeight: 'bold',
  },

  // RECURRENT PROJECTS
  projItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  projRank: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#27272A',
    color: '#38BDF8',
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 2,
    marginRight: 6,
  },
  projName: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#E2E8F0',
    textTransform: 'uppercase',
  },
  projBadge: {
    backgroundColor: '#27272A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#38BDF8',
  },

  // TABLE STYLES
  tableContainer: {
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272A',
    backgroundColor: '#18181B',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#27272A',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableTh: {
    color: '#A1A1AA',
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableTd: {
    fontSize: 7.5,
    color: '#CBD5E1',
  },
  ticketCode: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },

  // BADGES
  badgeCompleted: {
    backgroundColor: '#064E3B',
    color: '#34D399',
    fontSize: 6.5,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  badgePending: {
    backgroundColor: '#78350F',
    color: '#FBBF24',
    fontSize: 6.5,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // FOOTER
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
    textAlign: 'center',
    color: '#52525B',
    fontSize: 7,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    paddingTop: 6,
  },
});

interface Props {
  data: any[];
  metrics: any;
  clientName: string;
  period: string;
}

export default function PDFReportDocument({ data, metrics, clientName, period }: Props) {
  const total = metrics?.totalRequests || 1;
  const altaPct = Math.min(100, Math.round(((metrics?.priorityCounts?.alta || 0) / total) * 100));
  const mediaPct = Math.min(100, Math.round(((metrics?.priorityCounts?.media || 0) / total) * 100));
  const bajaPct = Math.min(100, Math.round(((metrics?.priorityCounts?.baja || 0) / total) * 100));

  // Datos para la gráfica vectorial de volumen de entregables
  const deliverablesList = (metrics?.cDeliverables || []).slice(0, 4);
  const maxDeliverable = Math.max(...deliverablesList.map((d: any) => d.total || 1), 1);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        
        {/* HERO HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{(clientName || 'CLIENTE').toUpperCase()}</Text>
            <Text style={styles.subtitle}>REPORTE DE OPERACIÓN & PERFORMANCE • PERIODO: {(period || 'HISTORICO').toUpperCase()}</Text>
          </View>
          <Text style={styles.brandTag}>TOLKO SYSTEM</Text>
        </View>

        {/* METRICAS GENERALES */}
        <Text style={styles.sectionLabel}>Métricas Consolidadas de Operación</Text>
        <View style={styles.grid4}>
          <View style={[styles.card, { borderLeftColor: '#38BDF8' }]}>
            <Text style={styles.cardTitle}>Masa de Proyectos</Text>
            <Text style={styles.cardValue}>{metrics?.totalRequests || 0}</Text>
          </View>
          <View style={[styles.card, { borderLeftColor: '#34D399' }]}>
            <Text style={styles.cardTitle}>Completados</Text>
            <Text style={[styles.cardValue, { color: '#34D399' }]}>{metrics?.completed || 0}</Text>
          </View>
          <View style={[styles.card, { borderLeftColor: '#FBBF24' }]}>
            <Text style={styles.cardTitle}>Iteraciones Totales</Text>
            <Text style={[styles.cardValue, { color: '#FBBF24' }]}>{metrics?.totalRevisions || 0}</Text>
          </View>
          <View style={[styles.card, { borderLeftColor: '#D3002D' }]}>
            <Text style={styles.cardTitle}>Ajustes Aplicados</Text>
            <Text style={[styles.cardValue, { color: '#EF4444' }]}>{metrics?.totalAdjustments || 0}</Text>
          </View>
        </View>

        {/* METRICAS DE PRODUCCION */}
        <View style={styles.grid4}>
          <View style={[styles.card, { borderLeftColor: '#818CF8' }]}>
            <Text style={styles.cardTitle}>Videos Entregados</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.cardValue}>{metrics?.totalVideos || 0}</Text>
              <Text style={styles.cardUnit}>MP4</Text>
            </View>
          </View>
          <View style={[styles.card, { borderLeftColor: '#22D3EE' }]}>
            <Text style={styles.cardTitle}>Horas de Edición</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.cardValue}>{metrics?.totalEditingHours || 0}</Text>
              <Text style={styles.cardUnit}>HRS</Text>
            </View>
          </View>
          <View style={[styles.card, { borderLeftColor: '#FB923C' }]}>
            <Text style={styles.cardTitle}>Presentaciones</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.cardValue}>{metrics?.totalPpts || 0}</Text>
              <Text style={styles.cardUnit}>PPT</Text>
            </View>
          </View>
          <View style={[styles.card, { borderLeftColor: '#34D399' }]}>
            <Text style={styles.cardTitle}>Slides Diseñados</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.cardValue}>{metrics?.totalSlides || 0}</Text>
              <Text style={styles.cardUnit}>PÁGS</Text>
            </View>
          </View>
        </View>

        {/* BLOQUE DE GRÁFICAS VECTORIALES (NATIVAS EN PDF) */}
        <View style={styles.twoColumns}>
          
          {/* DEMANDA POR PRIORIDAD (BARRAS SVG VECTORIALES) */}
          <View style={styles.colBlock}>
            <Text style={styles.sectionLabel}>Demanda por Prioridad</Text>
            
            <View style={styles.prioRow}>
              <View style={styles.prioHeader}>
                <Text style={[styles.prioLabel, { color: '#EF4444' }]}>ALTA</Text>
                <Text style={styles.prioValue}>{metrics?.priorityCounts?.alta || 0} REQ. ({altaPct}%)</Text>
              </View>
              <Svg height="6" width="100%">
                <Rect x="0" y="0" width="100%" height="6" fill="#27272A" rx="3" />
                <Rect x="0" y="0" width={`${altaPct}%`} height="6" fill="#EF4444" rx="3" />
              </Svg>
            </View>

            <View style={styles.prioRow}>
              <View style={styles.prioHeader}>
                <Text style={[styles.prioLabel, { color: '#FBBF24' }]}>MEDIA</Text>
                <Text style={styles.prioValue}>{metrics?.priorityCounts?.media || 0} REQ. ({mediaPct}%)</Text>
              </View>
              <Svg height="6" width="100%">
                <Rect x="0" y="0" width="100%" height="6" fill="#27272A" rx="3" />
                <Rect x="0" y="0" width={`${mediaPct}%`} height="6" fill="#FBBF24" rx="3" />
              </Svg>
            </View>

            <View style={styles.prioRow}>
              <View style={styles.prioHeader}>
                <Text style={[styles.prioLabel, { color: '#34D399' }]}>BAJA</Text>
                <Text style={styles.prioValue}>{metrics?.priorityCounts?.baja || 0} REQ. ({bajaPct}%)</Text>
              </View>
              <Svg height="6" width="100%">
                <Rect x="0" y="0" width="100%" height="6" fill="#27272A" rx="3" />
                <Rect x="0" y="0" width={`${bajaPct}%`} height="6" fill="#34D399" rx="3" />
              </Svg>
            </View>
          </View>

          {/* GRÁFICA VECTORIAL DE BARRAS: ENTREGABLES TOP */}
          <View style={styles.colBlock}>
            <Text style={styles.sectionLabel}>Volumen por Tipo de Entregable</Text>
            <View style={{ marginTop: 4 }}>
              {deliverablesList.map((item: any, idx: number) => {
                const pct = Math.round((item.total / maxDeliverable) * 100);
                return (
                  <View key={idx} style={{ marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#E2E8F0' }}>{item.name}</Text>
                      <Text style={{ fontSize: 7, color: '#38BDF8', fontWeight: 'bold' }}>{item.total} UNIDS</Text>
                    </View>
                    <Svg height="5" width="100%">
                      <Rect x="0" y="0" width="100%" height="5" fill="#27272A" rx="2" />
                      <Rect x="0" y="0" width={`${pct}%`} height="5" fill="#38BDF8" rx="2" />
                    </Svg>
                  </View>
                );
              })}
            </View>
          </View>

        </View>

        {/* AUDITORÍA DETALLADA (TABLA DARK LUXURY) */}
        <Text style={styles.sectionLabel}>Auditoría Detallada de Requerimientos</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableTh, { width: '15%' }]}>TICKET</Text>
            <Text style={[styles.tableTh, { width: '38%' }]}>PROYECTO / SOLICITUD</Text>
            <Text style={[styles.tableTh, { width: '18%' }]}>ÁREA</Text>
            <Text style={[styles.tableTh, { width: '14%' }]}>DEADLINE</Text>
            <Text style={[styles.tableTh, { width: '15%', textAlign: 'center' }]}>ESTATUS</Text>
          </View>

          {(data || []).slice(0, 8).map((req, idx) => {
            const isCompleted = ['completado', 'aprobado'].includes(String(req.status).toLowerCase());
            return (
              <View key={req.id || idx} style={[styles.tableRow, { backgroundColor: idx % 2 === 0 ? '#18181B' : '#1E1E24' }]}>
                <Text style={[styles.tableTd, styles.ticketCode, { width: '15%' }]}>
                  #{req.id ? req.id.slice(-6).toUpperCase() : 'N/A'}
                </Text>
                <Text style={[styles.tableTd, { width: '38%', fontWeight: 'bold', color: '#FFFFFF' }]}>
                  {req.title || 'Sin Título'}
                </Text>
                <Text style={[styles.tableTd, { width: '18%' }]}>
                  {req.department || 'General'}
                </Text>
                <Text style={[styles.tableTd, { width: '14%' }]}>
                  {req.due_date || 'S/F'}
                </Text>
                <View style={{ width: '15%', alignItems: 'center' }}>
                  <Text style={isCompleted ? styles.badgeCompleted : styles.badgePending}>
                    {req.status || 'PENDIENTE'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* FOOTER */}
        <Text 
          style={styles.footer} 
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages} • Generado por Tolko System`} 
          fixed 
        />

      </Page>
    </Document>
  );
}