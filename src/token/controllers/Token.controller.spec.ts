import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../services/Token.service';
import { TokenController } from './Token.controller';
import { Token } from '../../constants';

describe('TokenController', () => {
  let app: INestApplication;
  const mockTokenService = {
    getTokens: jest.fn(),
    getPrices: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [{ provide: TokenService, useValue: mockTokenService }],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/GET tokens', async () => {
    const res = {
      [Token.BTC]: {
        symbol: 'BTC',
        name: 'Bitcoin',
        decimals: 6,
        icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
      },
    };
    mockTokenService.getTokens.mockReturnValue(res);

    return request(app.getHttpServer()).get('/tokens').expect(200).expect(res);
  });

  it('/GET prices', async () => {
    const res = {
      [Token.BTC]: 1,
    };
    mockTokenService.getPrices.mockResolvedValue(res);

    return request(app.getHttpServer())
      .get('/tokens/prices')
      .expect(200)
      .expect(res);
  });
});
