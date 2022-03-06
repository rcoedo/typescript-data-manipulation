import { Injectable } from '@nestjs/common';
import { combineLatest, connect, firstValueFrom, take, tap } from 'rxjs';
import { PostsService } from '../posts/posts.service';
import { StatsResponse } from './stats.types';
import { avgCharLengthPerMonth } from './processors/avgCharLengthPerMonth';
import { longestPostByCharLengthPerMonth } from './processors/longestPostByCharLengthPerMonth';
import { totalPostsByWeekNumber } from './processors/totalPostsByWeekNumber';
import { avgNumberOfPostsPerUserPerMonth } from './processors/avgNumberOfPostsPerUserPerMonth';

@Injectable()
export class StatsService {
  constructor(private postsService: PostsService) {}

  async getStats(numberOfPosts = 1000): Promise<StatsResponse> {
    return firstValueFrom(
      this.postsService.getPosts().pipe(
        take(numberOfPosts),
        connect((shared$) =>
          combineLatest({
            avgCharLengthPerMonth: avgCharLengthPerMonth(shared$),
            longestPostByCharLengthPerMonth: longestPostByCharLengthPerMonth(shared$),
            totalPostsByWeekNumber: totalPostsByWeekNumber(shared$),
            avgNumberOfPostsPerUserPerMonth: avgNumberOfPostsPerUserPerMonth(shared$),
          }),
        ),
      ),
    );
  }
}
