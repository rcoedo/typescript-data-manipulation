import { Module } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [PostsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
