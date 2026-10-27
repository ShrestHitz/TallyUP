import test from 'node:test';
import assert from 'node:assert/strict';
import { SECTORS } from '../src/lib/sectors.ts';
import { SectorType } from '../src/types/index.ts';

test('SECTORS: all required industry verticals exist with valid compliance configurations', () => {
  const expectedSectorKeys: SectorType[] = ['construction', 'campus'];

  for (const key of expectedSectorKeys) {
    const sec = SECTORS[key];
    assert.ok(sec, `Sector ${key} must exist`);
    assert.strictEqual(sec.id, key);
    assert.ok(sec.name, `Sector ${key} must have a name`);
    assert.ok(sec.shiftRules.overtimeMultiplier >= 1.5, `Sector ${key} overtime multiplier must be >= 1.5x`);
    assert.ok(sec.zones.length > 0, `Sector ${key} must have configured site zones`);
    assert.ok(sec.hazardCategories.length > 0, `Sector ${key} must have defined hazard categories`);
    assert.ok(sec.siteGeoLocation.latitude, `Sector ${key} must have GPS latitude`);
    assert.ok(sec.siteGeoLocation.longitude, `Sector ${key} must have GPS longitude`);
  }
});

test('SECTORS.construction: enforces statutory BOCW 2.0x overtime multiplier', () => {
  const construction = SECTORS.construction;
  assert.strictEqual(construction.shiftRules.overtimeMultiplier, 2.0);
  assert.strictEqual(construction.shiftRules.regularHoursPerDay, 8);
  assert.strictEqual(construction.shiftRules.weeklyHoursCap, 48);
  assert.ok(construction.name.includes('Metro Rail'));
});

test('SECTORS.campus: enforces standard 1.5x overtime multiplier with facility zones', () => {
  const campus = SECTORS.campus;
  assert.strictEqual(campus.shiftRules.overtimeMultiplier, 1.5);
  assert.strictEqual(campus.shiftRules.regularHoursPerDay, 8);
  assert.ok(campus.zones.some((z) => z.includes('Research Wing')));
});
