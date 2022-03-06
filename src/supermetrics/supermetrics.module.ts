import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SupermetricsClient } from './supermetrics.client';

@Module({
  imports: [ConfigModule, HttpModule, CacheModule.register()],
  providers: [SupermetricsClient],
  exports: [SupermetricsClient],
})
export class SupermetricsModule {}
