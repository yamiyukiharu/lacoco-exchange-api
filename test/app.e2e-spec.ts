import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TokenService } from '../src/token/services/Token.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let tokenService: TokenService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    tokenService = moduleFixture.get<TokenService>(TokenService);

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/GET tokens', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/tokens')
      .expect(200);
    expect(res.body).toStrictEqual(tokenService.TOKENS);
  });

  it('/GET prices', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/tokens/prices')
      .expect(200);

    Object.keys(res.body).forEach((key) => {
      expect(Object.keys(tokenService.TOKENS).includes(key)).toBe(true);
    });
  });
});
