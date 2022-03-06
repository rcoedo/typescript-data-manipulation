import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: 'config/local.env' }), StatsModule],
})
export class AppModule {}
