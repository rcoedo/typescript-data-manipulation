import { Injectable, Logger } from '@nestjs/common';
import { SupermetricsClient } from '../supermetrics/supermetrics.client';
import { concatWith, defer, mergeMap, Observable, from, EMPTY } from 'rxjs';
import { Post } from './posts.types';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly supermetricsClient: SupermetricsClient) {}

  getPosts(startPage = 1, maxPage = 10): Observable<Post> {
    return defer(() => this.supermetricsClient.getPosts(startPage)).pipe(
      mergeMap((response) => {
        if (response.data.posts.length === 0) {
          return EMPTY;
        }

        const posts$ = from(
          response.data.posts.map((supermetricsPost) => ({
            id: supermetricsPost.id,
            from_name: supermetricsPost.from_name,
            from_id: supermetricsPost.from_id,
            message: supermetricsPost.message,
            type: supermetricsPost.type,
            created_time: new Date(supermetricsPost.created_time),
          })),
        );

        return response.data.page <= maxPage ? posts$.pipe(concatWith(this.getPosts(response.data.page + 1))) : posts$;
      }),
    );
  }
}
