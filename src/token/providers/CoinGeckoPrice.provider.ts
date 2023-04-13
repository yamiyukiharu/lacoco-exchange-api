import { Injectable, Logger } from '@nestjs/common';
import { Token } from '../../constants';
import { ITokenPriceProvider } from './ITokenPrice.provider';
import { CoinGeckoPriceResponse, GetTokenPricesResponse } from '../types';
import { HttpService } from '@nestjs/axios';
import { retryOnFail } from '../../utils/retry';

@Injectable()
export class CoinGeckoPriceProvider extends ITokenPriceProvider {
  private readonly logger = new Logger(CoinGeckoPriceProvider.name);

  BASE_URL = 'https://api.coingecko.com/api/v3/';
  PRICE_ENDPOINT = 'simple/price';

  PRICE_UNIT = 'usd';

  TOKEN_MAPPING = {
    [Token.BTC]: 'bitcoin',
    [Token.ETH]: 'ethereum',
    [Token.DFI]: 'defichain',
    [Token.USDT]: 'tether',
    [Token.DOGE]: 'dogecoin',
  };

  constructor(private readonly httpService: HttpService) {
    super();
  }

  async getPrices(tokens: Token[]): Promise<GetTokenPricesResponse> {
    const invalidTokens = tokens.filter((token) => !this.TOKEN_MAPPING[token]);

    if (invalidTokens.length > 0) {
      throw new Error(`Invalid tokens: ${invalidTokens.join(',')}`);
    }

    const params = {
      ids: tokens.map((token) => this.TOKEN_MAPPING[token]).join(','),
      vs_currencies: this.PRICE_UNIT,
    };

    const fullUrl = this.BASE_URL + this.PRICE_ENDPOINT;

    try {
      const request = () =>
        this.httpService.axiosRef.get<CoinGeckoPriceResponse>(fullUrl, {
          params,
        });

      const { data: prices } = await retryOnFail(request, 3);

      return tokens.reduce((acc, token) => {
        const tokenPrice = prices[this.TOKEN_MAPPING[token]];
        acc[token] = tokenPrice[this.PRICE_UNIT];
        return acc;
      }, {});
    } catch (e) {
      this.logger.error(e);
      throw new Error('Failed to get token prices from CoinGecko');
    }
  }
}
