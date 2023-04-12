import { Token } from 'src/constants';

export type CoinGeckoPriceResponse = {
  [key: string]: {
    usd: number;
  };
};

export type GetTokenPricesResponse = {
  [key in Token]?: number;
};

export type TokenInfoType = {
  [key in Token]?: {
    symbol: string;
    name: string;
    decimals: number;
    icon: string;
  };
};
