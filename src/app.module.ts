import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FefModule } from './fef/fef.module';
import { TokensController } from './tokens/tokens.controller';
import { TokenPriceProvider } from './token-price-provider/token-price-provider';
import { CacheServiceService } from './cache-service/cache-service.service';

@Module({
  imports: [FefModule],
  controllers: [AppController, TokensController],
  providers: [AppService, TokenPriceProvider, CacheServiceService],
})
export class AppModule {}
