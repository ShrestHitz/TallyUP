import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INCIDENT_CLASSIFICATIONS,
  SAFETY_HAZARD_CATEGORIES,
  computeMonthlySafetyStats,
} from '../src/lib/safety-taxonomy.ts';

test('INCIDENT_CLASSIFICATIONS: all standard OSHA/ISO incident tiers are defined', () => {
  const codes = ['NEAR_MISS', 'FAC', 'MTC', 'RWC', 'LTI', 'FATALITY'] as const;

  for (const code of codes) {
    const item = INCIDENT_CLASSIFICATIONS[code];
    assert.ok(item, `Classification ${code} must exist`);
    assert.strictEqual(item.code, code);
    assert.ok(item.shortLabel.length > 0);
    assert.ok(item.fullTitle.length > 0);
    assert.ok(item.color.startsWith('#'), 'Color must be valid hex');
    assert.ok(item.suggestedSeverity);
  }

  // Verify severe tiers default to P1_CRITICAL
  assert.strictEqual(INCIDENT_CLASSIFICATIONS.LTI.suggestedSeverity, 'P1_CRITICAL');
  assert.strictEqual(INCIDENT_CLASSIFICATIONS.FATALITY.suggestedSeverity, 'P1_CRITICAL');
  assert.strictEqual(INCIDENT_CLASSIFICATIONS.NEAR_MISS.suggestedSeverity, 'P3_LOW');
});

test('SAFETY_HAZARD_CATEGORIES: covers critical frontline risk vectors with icons and examples', () => {
  assert.ok(Array.isArray(SAFETY_HAZARD_CATEGORIES));
  assert.ok(SAFETY_HAZARD_CATEGORIES.length >= 8, 'Must cover at least 8 hazard categories');

  for (const cat of SAFETY_HAZARD_CATEGORIES) {
    assert.ok(cat.id, 'Hazard category must have an id');
    assert.ok(cat.name, 'Hazard category must have a name');
    assert.ok(cat.iconSymbol, 'Hazard category must have an icon symbol');
    assert.ok(cat.exampleTitle, 'Hazard category must have an example title');
    assert.ok(cat.defaultClassification, 'Hazard category must have a default classification');
    assert.ok(cat.defaultSeverity, 'Hazard category must have a default severity');
  }

  // Check electrical and scaffold are P1_CRITICAL
  const electrical = SAFETY_HAZARD_CATEGORIES.find((c) => c.id === 'electrical_shock');
  assert.ok(electrical);
  assert.strictEqual(electrical?.defaultSeverity, 'P1_CRITICAL');

  const scaffolding = SAFETY_HAZARD_CATEGORIES.find((c) => c.id === 'scaffolding_height');
  assert.ok(scaffolding);
  assert.strictEqual(scaffolding?.defaultSeverity, 'P1_CRITICAL');
});

test('computeMonthlySafetyStats: calculates TRIR, AFR, and ₹250 vigilance reward totals correctly', () => {
  const stats0 = computeMonthlySafetyStats(0, 0);
  assert.strictEqual(stats0.nearMissCount, 0);
  assert.strictEqual(stats0.hazardVigilancePayoutsRupees, 0);
  assert.strictEqual(stats0.incidentFreeDays, 184);
  assert.strictEqual(stats0.ltiCount, 0);
  assert.strictEqual(stats0.afr, 0.0);

  // 10 verified hazards reported by workers
  const stats10 = computeMonthlySafetyStats(10, 0);
  assert.strictEqual(stats10.nearMissCount, 10);
  assert.strictEqual(stats10.hazardVigilancePayoutsRupees, 2500); // 10 * ₹250 = ₹2,500
  assert.strictEqual(stats10.trir, 1.61); // (2 * 200,000) / 248,000 = 1.61
});
