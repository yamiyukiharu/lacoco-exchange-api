import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Token } from '../../constants';
import { ITokenPriceProvider } from '../providers/ITokenPrice.provider';
import { GetTokenPricesResponse, TokenInfoType } from '../types';

@Injectable()
export class TokenService {
  private readonly PRICE_CACHE_KEY = 'tokenPrices';
  private readonly PRICE_CACHE_TTL = 10000;

  TOKENS: TokenInfoType = {
    [Token.BTC]: {
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    },
    [Token.ETH]: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    },
    [Token.DFI]: {
      symbol: 'DFI',
      name: 'DeFiChain',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/14349/large/defichain.png?1615897939',
    },
    [Token.USDT]: {
      symbol: 'USDT',
      name: 'Tether',
      decimals: 2,
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707',
    },
    [Token.DOGE]: {
      symbol: 'DOGE',
      name: 'Dogecoin',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256',
    },
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private tokenPriceProvider: ITokenPriceProvider,
  ) {}

  getTokens(): TokenInfoType {
    return this.TOKENS;
  }

  async getPrices(): Promise<GetTokenPricesResponse> {
    const val = await this.cacheManager.get('tokenPrices');

    if (val) {
      return val;
    }

    const tokenPrices = await this.tokenPriceProvider.getPrices(
      Object.keys(this.TOKENS) as Token[],
    );

    await this.cacheManager.set(
      this.PRICE_CACHE_KEY,
      tokenPrices,
      this.PRICE_CACHE_TTL,
    );

    return tokenPrices;
  }
}
