import { Observable, reduce } from 'rxjs';
import * as moment from 'moment';
import { Post } from '../../posts/posts.types';
import { LongestPostByCharLengthPerMonth } from '../stats.types';

export const longestPostByCharLengthPerMonth = (posts$: Observable<Post>): Observable<LongestPostByCharLengthPerMonth> => {
  return posts$.pipe(
    reduce((results, post) => {
      const month = moment(post.created_time).format('MM/YYYY');

      if (!results[month]) {
        results[month] = post;
      } else {
        results[month] = post.message.length > results[month].message.length ? post : results[month];
      }

      return results;
    }, {} as Record<string, Post>),
  );
};
