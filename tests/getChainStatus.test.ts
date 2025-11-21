import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getChainStatus } from '../src/core/getChainStatus';

let callIndex = 0;

// Mock `fetch`
beforeEach(() => {
  callIndex = 0;

  globalThis.fetch = vi.fn(async () => {
    // First RPC call → eth_blockNumber
    if (callIndex === 0) {
      callIndex++;
      return {
        json: async () => ({
          result: '0x123',
        }),
      } as any;
    }

    // Second RPC call → eth_getBlockByNumber
    if (callIndex === 1) {
      callIndex++;
      return {
        json: async () => ({
          result: {
            baseFeePerGas: '0x10',
            gasUsed: '0x500000',
            gasLimit: '0x800000',
            timestamp: '0x65000000',
          },
        }),
      } as any;
    }

    // Any other fallback
    return { json: async () => ({ result: null }) } as any;
  });
});

describe('getChainStatus', () => {
  it('returns correct status format', async () => {
    const status = await getChainStatus(1, 'http://mock-rpc');

    expect(status.chainId).toBe(1);
    expect(status.blockNumber).toBe(BigInt('0x123'));
    expect(status.baseFee).toBe(BigInt(0x10));
    expect(status.congestion).toBeTypeOf('string');
    expect(status.health).toBeTypeOf('string');
    expect(status.updatedAt).toBeTypeOf('number');
  });
});
