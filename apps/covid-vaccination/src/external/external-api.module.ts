import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiService } from './external-api.service';
import { ExternalApiController } from './external-api.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ExternalApiController],
  providers: [ExternalApiService],
  exports: [ExternalApiService],
})
export class ExternalApiModule {}
