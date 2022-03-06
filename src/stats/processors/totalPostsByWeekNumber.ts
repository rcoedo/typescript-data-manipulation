import { Observable, reduce } from 'rxjs';
import * as moment from 'moment';
import { Post } from '../../posts/posts.types';
import { TotalPostsByWeekNumber } from '../stats.types';

export const totalPostsByWeekNumber = (posts$: Observable<Post>): Observable<TotalPostsByWeekNumber> => {
  return posts$.pipe(
    reduce((results, post) => {
      const week = moment(post.created_time).format('GGGG-[W]WW');

      results[week] = (results[week] || 0) + 1;

      return results;
    }, {} as Record<string, number>),
  );
};
