import { SectorConfig, SectorType } from '@/types';

export const SECTORS: Record<SectorType, SectorConfig> = {
  construction: {
    id: 'construction',
    name: 'Kochi Metro Rail — Pier Section 14 (Marine Drive)',
    tagline: 'High-Elevation Civil Transit Infrastructure & Viaduct Construction',
    workerType: 'Riggers, Welders, Bar Benders, Masons, Crane Helpers',
    currency: '₹ (INR)',
    shiftRules: {
      regularHoursPerDay: 8,
      weeklyHoursCap: 48,
      overtimeMultiplier: 2.0, // Statutory 2x overtime under BOCW Act 1996
      mandatoryRestHours: 10,
    },
    zones: [
      'Zone A — Pier 14 Deep Foundation Viaduct (Kochi)',
      'Zone B — Elevated Girder Scaffolding Section 4',
      'Zone C — Marine Drive Batching Plant & Mixer',
      'Zone D — Steel Rebar Fabrication Yard Gate 2',
    ],
    hazardCategories: [
      'Unsecured Scaffolding & Fall Protection Breach',
      'Exposed 440V Submerged Cable / Electrocution Risk',
      'Missing Mandatory Full-Body Harness / Safety Shoes',
      'Trench Wall Collapse & Shoring Instability',
      'Heavy Crane Blind-Spot Swing Radius Breach',
    ],
    themeColor: '#a3e635',
    siteGeoLocation: {
      latitude: 9.9816,
      longitude: 76.2999,
      radiusMeters: 300,
    },
  },
  campus: {
    id: 'campus',
    name: 'Apex Central University — Operations & Facilities',
    tagline: 'Higher Education Institutional Campus Facilities & Operations',
    workerType: 'Sanitation Specialists, Security Shift Wardens, Mess Helpers',
    currency: '₹ (INR)',
    shiftRules: {
      regularHoursPerDay: 8,
      weeklyHoursCap: 48,
      overtimeMultiplier: 1.5,
      mandatoryRestHours: 8,
    },
    zones: [
      'Block A — Chemical & Biotechnology Research Wing',
      'Block B — Central Dining Hall & Student Food Court',
      'Block C — Hostels & Resident Quarters',
      'Block D — Main Auditorium & Indoor Sports Arena',
    ],
    hazardCategories: [
      'Chemical & Acid Drain Line Leakage',
      'Wet Floor Slip Vulnerability & Blocked Fire Exit',
      'Faulty High-Voltage Panel & HVAC Short Circuit',
      'Sanitation Bio-Waste Overflow in Main Duct',
      'Damaged Glass Facade & Overhead Tile Dislodgement',
    ],
    themeColor: '#00d2d3',
    siteGeoLocation: {
      latitude: 12.823,
      longitude: 80.045,
      radiusMeters: 400,
    },
  },
};
