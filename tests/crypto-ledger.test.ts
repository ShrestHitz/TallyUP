import test from 'node:test';
import assert from 'node:assert/strict';
import { computeBlockHash, generateReceiptCode, verifyLedgerChain } from '../src/lib/crypto-ledger.ts';
import { AttendanceBlock } from '../src/types/index.ts';

test('computeBlockHash: generates a consistent 64-character SHA-256 hex string', async () => {
  const hash1 = await computeBlockHash(
    'WRK-001',
    '2026-10-27',
    '08:00',
    '17:00',
    9.0,
    8.0,
    1.0,
    'Pier 14 Scaffolding Zone',
    '0000000000000000000000000000000000000000000000000000000000000000'
  );

  assert.strictEqual(typeof hash1, 'string');
  assert.strictEqual(hash1.length, 64);
  assert.match(hash1, /^[0-9a-f]{64}$/);

  // Determinism check: same inputs yield same hash
  const hash2 = await computeBlockHash(
    'WRK-001',
    '2026-10-27',
    '08:00',
    '17:00',
    9.0,
    8.0,
    1.0,
    'Pier 14 Scaffolding Zone',
    '0000000000000000000000000000000000000000000000000000000000000000'
  );
  assert.strictEqual(hash1, hash2);
});

test('generateReceiptCode: creates formatted Pocket Witness code', () => {
  const mockHash = 'a3e635f89102482048120481209481204812048120481204812048120481204f';
  const code = generateReceiptCode(mockHash);
  assert.strictEqual(code, 'PW-A3E6-204F');
  assert.match(code, /^PW-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
});

test('verifyLedgerChain: validates a clean sequential blockchain of attendance records', async () => {
  const genesisPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const hash0 = await computeBlockHash(
    'WRK-101', '2026-10-25', '08:00', '16:30', 8.5, 8.0, 0.5, 'Zone A', genesisPrevHash
  );

  const block0: AttendanceBlock = {
    id: 'blk-0',
    workerId: 'WRK-101',
    workerName: 'Ramesh Kumar',
    date: '2026-10-25',
    checkInTime: '08:00',
    checkOutTime: '16:30',
    totalHours: 8.5,
    regularHours: 8.0,
    overtimeHours: 0.5,
    siteZone: 'Zone A',
    hash: hash0,
    prevHash: genesisPrevHash,
    status: 'VERIFIED',
    receiptCode: generateReceiptCode(hash0),
    isOvertimeFlagged: false,
  };

  const hash1 = await computeBlockHash(
    'WRK-101', '2026-10-26', '08:00', '18:00', 10.0, 8.0, 2.0, 'Zone A', hash0
  );

  const block1: AttendanceBlock = {
    id: 'blk-1',
    workerId: 'WRK-101',
    workerName: 'Ramesh Kumar',
    date: '2026-10-26',
    checkInTime: '08:00',
    checkOutTime: '18:00',
    totalHours: 10.0,
    regularHours: 8.0,
    overtimeHours: 2.0,
    siteZone: 'Zone A',
    hash: hash1,
    prevHash: hash0,
    status: 'VERIFIED',
    receiptCode: generateReceiptCode(hash1),
    isOvertimeFlagged: true,
  };

  const result = await verifyLedgerChain([block0, block1]);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.brokenIndex, undefined);
});

test('verifyLedgerChain: detects retroactive tampering of overtime hours', async () => {
  const genesisPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const hash0 = await computeBlockHash(
    'WRK-101', '2026-10-25', '08:00', '16:30', 8.5, 8.0, 0.5, 'Zone A', genesisPrevHash
  );

  const block0: AttendanceBlock = {
    id: 'blk-0',
    workerId: 'WRK-101',
    workerName: 'Ramesh Kumar',
    date: '2026-10-25',
    checkInTime: '08:00',
    checkOutTime: '16:30',
    totalHours: 8.5,
    regularHours: 8.0,
    overtimeHours: 0.5,
    siteZone: 'Zone A',
    hash: hash0,
    prevHash: genesisPrevHash,
    status: 'VERIFIED',
    receiptCode: generateReceiptCode(hash0),
    isOvertimeFlagged: false,
  };

  // Bad actor tampers block0 overtime from 0.5 to 0.0 to steal overtime pay
  const tamperedBlock0 = { ...block0, overtimeHours: 0.0, totalHours: 8.0 };

  const result = await verifyLedgerChain([tamperedBlock0]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.brokenIndex, 0);
  assert.match(result.reason || '', /Cryptographic mismatch/i);
});
