import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGE_OPTIONS, TRANSLATIONS, Language } from '../src/lib/i18n.ts';

test('LANGUAGE_OPTIONS: supports 7 diverse Indian languages covering all major labor corridors', () => {
  const expectedCodes: Language[] = ['en', 'hi', 'ta', 'ml', 'bn', 'te', 'kn'];

  assert.strictEqual(LANGUAGE_OPTIONS.length, 7);

  for (const expectedCode of expectedCodes) {
    const opt = LANGUAGE_OPTIONS.find((o) => o.code === expectedCode);
    assert.ok(opt, `Language option for ${expectedCode} must exist`);
    assert.ok(opt.label, `Language ${expectedCode} must have English label`);
    assert.ok(opt.nativeName, `Language ${expectedCode} must have native script name`);
    assert.ok(opt.region, `Language ${expectedCode} must specify geographical region`);
  }
});

test('TRANSLATIONS: critical UI keys exist and are populated across all 7 languages', () => {
  const criticalKeys = [
    'punchlineTitle',
    'punchlineSub',
    'appName',
    'geotagCheckIn',
    'onDuty',
    'offDuty',
    'listenToPayslip',
    'discrepancyAlert',
    'regularHours',
    'overtimeHours',
    'submitHazard',
    'anonymousNotice',
    'withdrawBtn',
    'observeReportPrevent',
  ];

  const langs: Language[] = ['en', 'hi', 'ta', 'ml', 'bn', 'te', 'kn'];

  for (const lang of langs) {
    const dict = TRANSLATIONS[lang];
    assert.ok(dict, `Translation dictionary for ${lang} must exist`);

    for (const key of criticalKeys) {
      assert.ok(
        dict[key],
        `Key '${key}' is missing or empty in language '${lang}'`
      );
      assert.strictEqual(
        typeof dict[key],
        'string',
        `Key '${key}' in '${lang}' must be a string`
      );
      assert.ok(
        dict[key].trim().length > 0,
        `Key '${key}' in '${lang}' must not be whitespace only`
      );
    }
  }
});

test('TRANSLATIONS: Hindi and regional scripts contain authentic vernacular text', () => {
  // Hindi contains Devanagari script
  assert.ok(/[\u0900-\u097F]/.test(TRANSLATIONS.hi.appName));
  assert.ok(TRANSLATIONS.hi.listenToPayslip.length > 5);

  // Tamil contains Tamil script
  assert.ok(/[\u0B80-\u0BFF]/.test(TRANSLATIONS.ta.punchlineTitle));

  // Malayalam contains Malayalam script
  assert.ok(/[\u0D00-\u0D7F]/.test(TRANSLATIONS.ml.punchlineTitle));

  // Bengali contains Bengali script
  assert.ok(/[\u0980-\u09FF]/.test(TRANSLATIONS.bn.punchlineTitle));

  // Telugu contains Telugu script
  assert.ok(/[\u0C00-\u0C7F]/.test(TRANSLATIONS.te.punchlineTitle));

  // Kannada contains Kannada script
  assert.ok(/[\u0C80-\u0CFF]/.test(TRANSLATIONS.kn.punchlineTitle));
});
