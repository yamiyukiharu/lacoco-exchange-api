import { Controller, Get } from '@nestjs/common';
import { TokenService } from '../services/Token.service';

@Controller('tokens')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get('/')
  getTokens() {
    return this.tokenService.getTokens();
  }

  @Get('/prices')
  getTokenPrices() {
    return this.tokenService.getPrices();
  }
}
