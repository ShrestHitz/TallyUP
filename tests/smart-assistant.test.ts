import test from 'node:test';
import assert from 'node:assert/strict';
import { triageHazardReport, scrubFeedbackIdentity } from '../src/lib/gemini.ts';

test('triageHazardReport: classifies critical electrical risk as P1_CRITICAL with action protocol', async () => {
  const result = await triageHazardReport(
    'There is a live cut wire sparking in water near the generator',
    'Zone A - Depot',
    'METRO_RAIL'
  );

  assert.strictEqual(result.severity, 'P1_CRITICAL');
  assert.ok(result.category.toLowerCase().includes('electrical'));
  assert.match(result.recommendedAction, /breaker|switch|electrician/i);
});

test('triageHazardReport: classifies scaffolding height vibration as P1_CRITICAL', async () => {
  const result = await triageHazardReport(
    'Scaffolding clamp loose and shaking at height while working',
    'Pier 14',
    'METRO_RAIL'
  );

  assert.strictEqual(result.severity, 'P1_CRITICAL');
  assert.ok(result.category.toLowerCase().includes('scaffold'));
  assert.match(result.recommendedAction, /harness|halt|elevated/i);
});

test('triageHazardReport: classifies liquid slip hazards as P2_MODERATE', async () => {
  const result = await triageHazardReport(
    'Hydraulic oil and water spilled on the main concrete walkway floor',
    'Concourse Level',
    'METRO_RAIL'
  );

  assert.strictEqual(result.severity, 'P2_MODERATE');
  assert.ok(result.category.toLowerCase().includes('slip') || result.category.toLowerCase().includes('liquid'));
  assert.match(result.recommendedAction, /signage|housekeeping/i);
});

test('triageHazardReport: classifies PPE non-compliance as P3_LOW', async () => {
  const result = await triageHazardReport(
    'Worker missing helmet and gloves in material yard',
    'Yard 2',
    'CONSTRUCTION'
  );

  assert.strictEqual(result.severity, 'P3_LOW');
  assert.ok(result.category.toLowerCase().includes('ppe'));
  assert.match(result.recommendedAction, /tool crib|equipment/i);
});

test('scrubFeedbackIdentity: sanitizes identifying names, gates, and exact timestamps to prevent retaliation', async () => {
  const dangerousRawText =
    'Supervisor Ramesh threatened to cut my overtime at Gate 3 at 2:15 AM on Tuesday because I asked for safety harness.';

  const scrubbed = await scrubFeedbackIdentity(dangerousRawText);

  // Verifies identifying markers are stripped
  assert.strictEqual(scrubbed.includes('Ramesh'), false, 'Supervisor name must be scrubbed');
  assert.strictEqual(/gate\s*3/i.test(scrubbed), false, 'Specific gate number must be generalized');
  assert.strictEqual(/2:15\s*am/i.test(scrubbed), false, 'Exact shift time must be generalized');
  assert.strictEqual(/on\s*tuesday/i.test(scrubbed), false, 'Specific day must be generalized');

  // Verifies problem context is preserved
  assert.ok(scrubbed.toLowerCase().includes('overtime') || scrubbed.toLowerCase().includes('harness'));
});
