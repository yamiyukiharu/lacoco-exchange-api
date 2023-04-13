import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Token } from '../../constants';
import { ITokenPriceProvider } from '../providers/ITokenPrice.provider';
import { GetTokenPricesResponse, TokenInfoType } from '../types';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  private readonly PRICE_CACHE_KEY = 'tokenPrices';
  private readonly LAST_PRICE_KEY = 'lastTokenPrices';
  private readonly PRICE_CACHE_TTL = 10000;

  TOKENS: TokenInfoType = {
    [Token.BTC]: {
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
    },
    [Token.ETH]: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    },
    [Token.DFI]: {
      symbol: 'DFI',
      name: 'DeFiChain',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/11757/small/symbol-defi-blockchain_200.png?1597306538',
    },
    [Token.USDT]: {
      symbol: 'USDT',
      name: 'Tether',
      decimals: 2,
      icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663',
    },
    [Token.DOGE]: {
      symbol: 'DOGE',
      name: 'Dogecoin',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png?1547792256',
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

    let tokenPrices: GetTokenPricesResponse;

    try {
      tokenPrices = await this.tokenPriceProvider.getPrices(
        Object.keys(this.TOKENS) as Token[],
      );
    } catch (e) {
      this.logger.error(e);
      // TODO: send critical alert
      return this.cacheManager.get(this.LAST_PRICE_KEY);
    }

    await this.cacheManager.set(
      this.PRICE_CACHE_KEY,
      tokenPrices,
      this.PRICE_CACHE_TTL,
    );

    await this.cacheManager.set(this.LAST_PRICE_KEY, tokenPrices, 0);

    return tokenPrices;
  }
}
