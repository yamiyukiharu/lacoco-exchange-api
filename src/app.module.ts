import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TokenController } from './token/controllers/Token.controller';
import { CoinGeckoPriceProvider } from './token/providers/CoinGeckoPrice.provider';
import { ITokenPriceProvider } from './token/providers/ITokenPrice.provider';
import { TokenService } from './token/services/Token.service';

@Module({
  imports: [CacheModule.register(), HttpModule],
  controllers: [TokenController],
  providers: [
    TokenService,
    {
      provide: ITokenPriceProvider,
      useClass: CoinGeckoPriceProvider,
    },
  ],
})
export class AppModule {}
