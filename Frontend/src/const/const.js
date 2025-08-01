export const apiKey = import.meta.env.VITE_MORALIS_API_KEY_TWO;
export const backendUrl =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const oneInchUrl = 'https://api.1inch.dev/swap/v6.1';

export const baseUrl = 'https://deep-index.moralis.io/api/v2.2';

export const BlockChain = [
  {
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    nativeToken: 'ETH',
    hex: '0x1',
    chainId: 1,
    logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
    NativeTokenAddresses: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    name: 'Arbitrum One',
    symbol: 'ARB',
    nativeToken: 'ETH',
    hex: '0xa4b1',
    chainId: 42161,
    logo: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg?1688717258',
    NativeTokenAddresses: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    name: 'Polygon Mainnet',
    symbol: 'POL',
    nativeToken: 'POL',
    hex: '0x89',
    chainId: 137,
    logo: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png?1648242098',
    NativeTokenAddresses: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    nativeToken: 'BNB',
    hex: '0x38',
    chainId: 56,
    logo: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615',
    NativeTokenAddresses: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    name: 'Avalanche Mainnet',
    symbol: 'AVAX',
    nativeToken: 'AVAX',
    hex: '0xa86a',
    chainId: 43114,
    logo: 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818',
    NativeTokenAddresses: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    name: 'Base Mainnet',
    symbol: 'ETH',
    nativeToken: 'ETH',
    hex: '0x2105',
    chainId: 8453,
    logo: 'https://cdn.brandfetch.io/id6XsSOVVS/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1751195685935',
    NativeTokenAddresses: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    name: 'Optimism Mainnet',
    symbol: 'OP',
    nativeToken: 'ETH',
    hex: '0xa',
    chainId: 10,
    logo: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png?1660904599',
    NativeTokenAddresses: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    name: 'Linea Mainnet',
    symbol: 'ETH',
    nativeToken: 'ETH',
    hex: '0xe708',
    chainId: 59144,
    logo: 'https://imgs.search.brave.com/aOUkjGoBTWWH76bfeSOA9YYvimCA1UgcJJmdjfdye1g/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Yml0a2VlcC52aXAv/b3BlcmF0aW9uL3Vf/Yl9mYmUyMWQ5MC04/M2EwLTExZWUtYmVk/Ni0yYjhiYWZjMzcy/NmUucG5n',
    NativeTokenAddresses: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
];
