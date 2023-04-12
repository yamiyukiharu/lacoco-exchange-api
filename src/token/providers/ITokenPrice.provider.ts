import { Injectable } from '@nestjs/common';
import { Token } from 'src/constants';
import { GetTokenPricesResponse } from '../types';

@Injectable()
export abstract class ITokenPriceProvider {
  abstract getPrices(tokens: Token[]): Promise<GetTokenPricesResponse>;
}
