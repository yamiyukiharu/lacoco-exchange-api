import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { ITokenPriceProvider } from '../providers/ITokenPrice.provider';
import { TokenService } from './Token.service';

describe('TokenService', () => {
  let service: TokenService;
  const mockTokenPriceProvider = {
    getPrices: jest.fn(),
  };
  const mockCacheManager = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: ITokenPriceProvider, useValue: mockTokenPriceProvider },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('can get tokens', () => {
    const tokens = service.getTokens();
    expect(tokens).toStrictEqual(service.TOKENS);
  });

  it('can get token prices', async () => {
    const res = Object.keys(service.TOKENS).reduce((acc, key) => {
      acc[key] = 1;
      return acc;
    }, {});

    mockTokenPriceProvider.getPrices.mockResolvedValue(res);

    const prices = await service.getPrices();

    expect(prices).toStrictEqual(res);
  });

  it('can set and get token prices with cache', async () => {
    const res = Object.keys(service.TOKENS).reduce((acc, key) => {
      acc[key] = 1;
      return acc;
    }, {});

    mockTokenPriceProvider.getPrices.mockResolvedValue(res);

    let prices = await service.getPrices();

    expect(mockCacheManager.get).toBeCalledTimes(1);
    expect(mockCacheManager.set).toBeCalledTimes(1);
    expect(prices).toStrictEqual(res);

    mockCacheManager.get.mockResolvedValue(res);

    prices = await service.getPrices();

    expect(mockCacheManager.get).toBeCalledTimes(2);
    expect(mockCacheManager.set).toBeCalledTimes(1);
    expect(prices).toStrictEqual(res);
  });
});
