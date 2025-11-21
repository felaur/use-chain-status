export function createMockRpc() {
  return {
    url: 'http://mock-rpc',

    async call(method: string) {
      switch (method) {
        case 'eth_blockNumber':
          return '0x123';

        case 'eth_getBlockByNumber':
          return {
            baseFeePerGas: '0x10',
            gasUsed: '0x500000',
            gasLimit: '0x800000',
            timestamp: '0x65000000',
          };

        default:
          return null;
      }
    },
  };
}
