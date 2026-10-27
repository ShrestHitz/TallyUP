import { AttendanceBlock } from '@/types';

/**
 * Computes a deterministic SHA-256 hash across both client (Web Crypto) and server (Node.js)
 */
export async function computeBlockHash(
  workerId: string,
  date: string,
  checkInTime: string,
  checkOutTime: string,
  totalHours: number,
  regularHours: number,
  overtimeHours: number,
  siteZone: string,
  prevHash: string
): Promise<string> {
  const payload = `${workerId}|${date}|${checkInTime}|${checkOutTime}|${totalHours.toFixed(2)}|${regularHours.toFixed(2)}|${overtimeHours.toFixed(2)}|${siteZone}|${prevHash}`;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js crypto fallback
    const { createHash } = await import('crypto');
    return createHash('sha256').update(payload).digest('hex');
  }
}

/**
 * Generates a human-readable verification receipt code for workers (e.g. "TLY-8492-B7C")
 */
export function generateReceiptCode(hash: string): string {
  const segment1 = hash.substring(0, 4).toUpperCase();
  const segment2 = hash.substring(hash.length - 4).toUpperCase();
  return `PW-${segment1}-${segment2}`;
}

/**
 * Verifies the integrity of a sequence of attendance blocks.
 * Returns { valid: boolean, tamperedBlockIndex?: number, error?: string }
 */
export async function verifyLedgerChain(
  blocks: AttendanceBlock[]
): Promise<{ valid: boolean; brokenIndex?: number; reason?: string }> {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // 1. Verify prevHash links correctly
    if (i > 0) {
      const prevBlock = blocks[i - 1];
      if (block.prevHash !== prevBlock.hash) {
        return {
          valid: false,
          brokenIndex: i,
          reason: `Chain broken at Block #${i + 1}: Previous hash '${block.prevHash.substring(0, 8)}...' does not match Block #${i}'s hash '${prevBlock.hash.substring(0, 8)}...'`,
        };
      }
    } else {
      if (block.prevHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          valid: false,
          brokenIndex: 0,
          reason: `Genesis block must link to 64-zero origin hash`,
        };
      }
    }

    // 2. Recompute hash from contents and compare
    const computed = await computeBlockHash(
      block.workerId,
      block.date,
      block.checkInTime,
      block.checkOutTime || '',
      block.totalHours,
      block.regularHours,
      block.overtimeHours,
      block.siteZone,
      block.prevHash
    );

    if (computed !== block.hash) {
      return {
        valid: false,
        brokenIndex: i,
        reason: `Cryptographic mismatch at Block #${i + 1} (${block.workerName}): Stored hash does not match block data. Record has been altered retroactively!`,
      };
    }
  }

  return { valid: true };
}
