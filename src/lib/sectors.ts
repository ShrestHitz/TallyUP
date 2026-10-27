import { SectorConfig, SectorType } from '@/types';

export const SECTORS: Record<SectorType, SectorConfig> = {
  construction: {
    id: 'construction',
    name: 'SkyRise Metro Line — Pier Section 4',
    tagline: 'Active Civil & Infrastructure Engineering Site',
    workerType: 'Helpers, Riggers, Fitters, Masons, Bar Benders',
    currency: '₹ (INR)',
    shiftRules: {
      regularHoursPerDay: 8,
      weeklyHoursCap: 48,
      overtimeMultiplier: 2.0, // Statutory 2x overtime under BOCW Act
      mandatoryRestHours: 10,
    },
    zones: [
      'Zone A — Pier 14 Deep Foundation Pit',
      'Zone B — Elevated Girder Scaffolding',
      'Zone C — Batching Plant & Mixer Unit',
      'Zone D — Fabrication Yard & Steel Store',
    ],
    hazardCategories: [
      'Unsecured Scaffolding / Fall Hazard',
      'Exposed High-Voltage Cable / Water Contact',
      'Missing Mandatory PPE / Harness Failure',
      'Trench Collapse / Shoring Instability',
      'Heavy Crane Swing Radius Violation',
    ],
    themeColor: '#009999',
  },
  campus: {
    id: 'campus',
    name: 'Apex Central University — Operations & Facilities',
    tagline: 'Higher Education Institutional Campus Management',
    workerType: 'Sanitation Crew, Security Guards, Mess Staff, Electricians',
    currency: '₹ (INR)',
    shiftRules: {
      regularHoursPerDay: 8,
      weeklyHoursCap: 48,
      overtimeMultiplier: 1.5, // 1.5x institutional institutional multiplier
      mandatoryRestHours: 8,
    },
    zones: [
      'Block A — Science & Chemical Research Labs',
      'Block B — Central Student Canteen & Food Court',
      'Block C — Boys & Girls Residence Halls',
      'Block D — Sports Complex & Auditorium',
    ],
    hazardCategories: [
      'Chemical / Acid Spill in Drainage',
      'Slippery Floor / Blocked Emergency Fire Exit',
      'Faulty Main Switchboard / HVAC Spark',
      'Bio-Waste Bin Overflow & Sanitation Risk',
      'Damaged Ceiling Tile / Glass Fixture',
    ],
    themeColor: '#0284c7',
  },
};
