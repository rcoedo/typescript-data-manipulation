import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { SupermetricsModule } from '../supermetrics/supermetrics.module';

@Module({
  imports: [SupermetricsModule],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
