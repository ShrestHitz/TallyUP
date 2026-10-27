import { IncidentClassification, HazardSeverity } from '@/types';

export interface IncidentClassificationDetail {
  code: IncidentClassification;
  shortLabel: string;
  fullTitle: string;
  tagline: string;
  definition: string;
  example: string;
  guidance: string;
  color: string;
  borderColor: string;
  bgRgba: string;
  suggestedSeverity: HazardSeverity;
}

export const INCIDENT_CLASSIFICATIONS: Record<IncidentClassification, IncidentClassificationDetail> = {
  NEAR_MISS: {
    code: 'NEAR_MISS',
    shortLabel: 'NEAR MISS',
    fullTitle: 'Near Miss (No Injury)',
    tagline: 'Learn from it. Prevent the next one!',
    definition: 'Incident with high potential for injury, but no one was hurt.',
    example: 'Worker slipped on wet pier surface but caught handrail without falling.',
    guidance: 'Observe & log immediately. Proactive near-miss logs prevent major accidents.',
    color: '#2ed573',
    borderColor: '#2ed573',
    bgRgba: 'rgba(46, 213, 115, 0.15)',
    suggestedSeverity: 'P3_LOW',
  },
  FAC: {
    code: 'FAC',
    shortLabel: 'FAC',
    fullTitle: 'First Aid Case (FAC)',
    tagline: 'Treat early. Keep working safely.',
    definition: 'Minor injury requiring only on-site first aid treatment.',
    example: 'Small cut from rebar wire, disinfected and simple dressing applied.',
    guidance: 'Clean wound, apply sterile bandage, record in site first aid log.',
    color: '#1e90ff',
    borderColor: '#1e90ff',
    bgRgba: 'rgba(30, 144, 255, 0.15)',
    suggestedSeverity: 'P3_LOW',
  },
  MTC: {
    code: 'MTC',
    shortLabel: 'MTC',
    fullTitle: 'Medical Treatment Case (MTC)',
    tagline: 'Get proper treatment. Return stronger.',
    definition: 'Injury requires physician/clinic medical care, but no lost workday leave.',
    example: 'Laceration requiring 3 stitches or eye irritation requiring prescription drops.',
    guidance: 'Transport to clinic, ensure medical clearance before resuming shift.',
    color: '#9b59b6',
    borderColor: '#9b59b6',
    bgRgba: 'rgba(155, 89, 182, 0.15)',
    suggestedSeverity: 'P2_MODERATE',
  },
  RWC: {
    code: 'RWC',
    shortLabel: 'RWC',
    fullTitle: 'Restricted Work Case (RWC)',
    tagline: 'Stay active. Do safe work only.',
    definition: 'Worker cannot perform regular duties; assigned to limited or light tasks.',
    example: 'Wrist sprain preventing heavy lifting; transferred to store room inventory for 2 days.',
    guidance: 'Ergonomic assessment, modified duties sign-off by site medic.',
    color: '#e67e22',
    borderColor: '#e67e22',
    bgRgba: 'rgba(230, 126, 34, 0.15)',
    suggestedSeverity: 'P2_MODERATE',
  },
  LTI: {
    code: 'LTI',
    shortLabel: 'LTI',
    fullTitle: 'Lost Time Injury (LTI)',
    tagline: 'Time away from work. Incident investigation mandatory.',
    definition: 'Work-related injury resulting in worker missing next scheduled shift or workday.',
    example: 'Fall from ladder causing hairline fracture; 7 days medical rest prescribed.',
    guidance: 'Immediate root-cause analysis, statutory report to Labour Department & BOCW.',
    color: '#ff4757',
    borderColor: '#ff4757',
    bgRgba: 'rgba(255, 71, 87, 0.2)',
    suggestedSeverity: 'P1_CRITICAL',
  },
  FATALITY: {
    code: 'FATALITY',
    shortLabel: 'FATALITY',
    fullTitle: 'Critical / Fatality Case',
    tagline: 'Every life matters. Stop work immediately.',
    definition: 'Loss of life or catastrophic life-threatening failure on site.',
    example: 'High-voltage flashover, scaffolding structural collapse.',
    guidance: 'Freeze site, evacuate sector, notify emergency services & executive board.',
    color: '#ffffff',
    borderColor: '#ff3838',
    bgRgba: 'rgba(255, 56, 56, 0.35)',
    suggestedSeverity: 'P1_CRITICAL',
  },
};

export interface SafetyHazardCategory {
  id: string;
  name: string;
  iconSymbol: string; // Lucide icon reference name
  exampleTitle: string;
  exampleDetail: string;
  defaultClassification: IncidentClassification;
  defaultSeverity: HazardSeverity;
}

export const SAFETY_HAZARD_CATEGORIES: SafetyHazardCategory[] = [
  {
    id: 'electrical_shock',
    name: 'Electrical & Shock Hazard',
    iconSymbol: 'Zap',
    exampleTitle: 'Exposed high-voltage cable in water puddle near generator',
    exampleDetail: 'Submerged 415V distribution box without earth-leakage circuit breaker (ELCB).',
    defaultClassification: 'NEAR_MISS',
    defaultSeverity: 'P1_CRITICAL',
  },
  {
    id: 'scaffolding_height',
    name: 'Scaffold & Height Fall Risk',
    iconSymbol: 'Layers',
    exampleTitle: 'Pier 14 formwork platform missing guardrail & safety net',
    exampleDetail: 'Workers operating at 6.5m elevation without anchored double-lanyard harness.',
    defaultClassification: 'NEAR_MISS',
    defaultSeverity: 'P1_CRITICAL',
  },
  {
    id: 'slip_trip_wet',
    name: 'Slip, Trip & Wet Surface',
    iconSymbol: 'Droplets',
    exampleTitle: 'Hydraulic oil leak on steel staging walkway',
    exampleDetail: 'Grease slick across main pedestrian path without warning signage or absorbent sand.',
    defaultClassification: 'NEAR_MISS',
    defaultSeverity: 'P3_LOW',
  },
  {
    id: 'missing_ppe',
    name: 'Missing PPE / Safety Gear',
    iconSymbol: 'ShieldAlert',
    exampleTitle: 'Subcontractor crew cutting steel without safety goggles or leather gloves',
    exampleDetail: 'Grinding sparks flying toward face without eye shields or fire blanket.',
    defaultClassification: 'FAC',
    defaultSeverity: 'P2_MODERATE',
  },
  {
    id: 'crane_overhead',
    name: 'Crane & Suspended Load',
    iconSymbol: 'Anchor',
    exampleTitle: 'Rebar bundle hoisted directly over active worker staging zone',
    exampleDetail: 'Crane operator swinging 2-tonne steel cage without spotter or exclusion horn.',
    defaultClassification: 'NEAR_MISS',
    defaultSeverity: 'P1_CRITICAL',
  },
  {
    id: 'fire_hot_work',
    name: 'Fire & Hot Work Risk',
    iconSymbol: 'Flame',
    exampleTitle: 'Gas oxy-acetylene torch operated near diesel fuel storage',
    exampleDetail: 'No fire extinguisher on standby within 5 meters of active welding bay.',
    defaultClassification: 'NEAR_MISS',
    defaultSeverity: 'P1_CRITICAL',
  },
  {
    id: 'confined_gas',
    name: 'Confined Space & Toxic Gas',
    iconSymbol: 'Wind',
    exampleTitle: 'Underground utility trench entered without 4-gas atmosphere test',
    exampleDetail: 'Deep pit with suspected hydrogen sulfide accumulation without mechanical blower.',
    defaultClassification: 'NEAR_MISS',
    defaultSeverity: 'P1_CRITICAL',
  },
  {
    id: 'excavation_trench',
    name: 'Trench & Cave-in Danger',
    iconSymbol: 'Construction',
    exampleTitle: '3-meter deep foundation trench without benching or shoring shields',
    exampleDetail: 'Rainwater seepage causing vertical soil cracking along excavation boundary.',
    defaultClassification: 'NEAR_MISS',
    defaultSeverity: 'P1_CRITICAL',
  },
  {
    id: 'noise_vibration',
    name: 'Noise & Vibration Hazard',
    iconSymbol: 'Volume2',
    exampleTitle: 'Continuous 105dB concrete breaker operation without ear defenders',
    exampleDetail: 'Operator exposed for 6 straight hours without rotation or vibration dampers.',
    defaultClassification: 'FAC',
    defaultSeverity: 'P3_LOW',
  },
  {
    id: 'loto_machinery',
    name: 'Lockout / Tagout (LOTO)',
    iconSymbol: 'Lock',
    exampleTitle: 'Batching plant mixer maintenance without locking main circuit isolator',
    exampleDetail: 'Technician inside drum while control panel remains energized and unpadlocked.',
    defaultClassification: 'NEAR_MISS',
    defaultSeverity: 'P1_CRITICAL',
  },
];

export interface MonthlySafetyStats {
  monthName: string;
  year: number;
  incidentFreeDays: number;
  totalManHours: number;
  trir: number; // Total Recordable Incident Rate = (Recordable Incidents * 200,000) / Man Hours
  afr: number; // Accident Frequency Rate = (Lost Time Accidents * 1,000,000) / Man Hours
  triCount: number; // Total Recordable Incidents (FAC + MTC + RWC + LTI)
  ltiCount: number;
  nearMissCount: number;
  hazardVigilancePayoutsRupees: number;
  safetyScorePercentage: number;
}

export function computeMonthlySafetyStats(hazardsCount: number, ltiCount: number = 0): MonthlySafetyStats {
  const totalManHours = 248000; // Metro site monthly cumulative
  const triCount = 2; // minor incidents
  const trir = parseFloat(((triCount * 200000) / totalManHours).toFixed(2));
  const afr = parseFloat(((ltiCount * 1000000) / totalManHours).toFixed(2));

  return {
    monthName: 'October',
    year: 2026,
    incidentFreeDays: 184,
    totalManHours,
    trir,
    afr,
    triCount,
    ltiCount,
    nearMissCount: hazardsCount,
    hazardVigilancePayoutsRupees: hazardsCount * 250,
    safetyScorePercentage: 98.6,
  };
}
