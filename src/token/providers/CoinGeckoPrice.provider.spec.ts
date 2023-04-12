import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CoinGeckoPriceProvider } from './CoinGeckoPrice.provider';
import { Token } from '../../constants';

describe('CoinGeckPriceProvider', () => {
  let provider: CoinGeckoPriceProvider;
  const httpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useValue: httpService },
        CoinGeckoPriceProvider,
      ],
    }).compile();

    provider = module.get<CoinGeckoPriceProvider>(CoinGeckoPriceProvider);
  });

  it('can get token prices', async () => {
    const res = {
      bitcoin: { usd: 60000 },
      ethereum: { usd: 3000 },
    };
    const fn = httpService.axiosRef.get;
    fn.mockResolvedValue({ data: res });

    const prices = await provider.getPrices([Token.BTC, Token.ETH]);

    expect(prices[Token.BTC]).toStrictEqual(res.bitcoin.usd);
    expect(prices[Token.ETH]).toStrictEqual(res.ethereum.usd);
    expect(fn).toBeCalledWith('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum',
        vs_currencies: 'usd',
      },
    });
  });

  it('throws error if token is not found', async () => {
    const res = {
      bitcoin: { usd: 60000 },
      ethereum: { usd: 3000 },
    };
    const fn = httpService.axiosRef.get;
    fn.mockResolvedValue({ data: res });

    await expect(
      provider.getPrices([Token.BTC, Token.ETH, Token.BNB]),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
