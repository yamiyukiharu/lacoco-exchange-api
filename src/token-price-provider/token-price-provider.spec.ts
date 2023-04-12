import { Test, TestingModule } from '@nestjs/testing';
import { TokenPriceProvider } from './token-price-provider';

describe('TokenPriceProvider', () => {
  let provider: TokenPriceProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenPriceProvider],
    }).compile();

    provider = module.get<TokenPriceProvider>(TokenPriceProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
