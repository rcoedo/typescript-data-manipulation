import { map, Observable, reduce } from 'rxjs';
import * as moment from 'moment';
import { Post } from '../../posts/posts.types';
import { AvgCharLengthPerMonth } from '../stats.types';

export const avgCharLengthPerMonth = (posts$: Observable<Post>): Observable<AvgCharLengthPerMonth> => {
  return posts$.pipe(
    reduce((results, post) => {
      const month = moment(post.created_time).format('MM/YYYY');
      const charLength = post.message.length;

      if (!results[month]) {
        results[month] = { sum: charLength, count: 1 };
      } else {
        const { sum, count } = results[month];
        results[month] = { sum: sum + charLength, count: count + 1 };
      }

      return results;
    }, {} as Record<string, { sum: number; count: number }>),
    map((stats) =>
      Object.entries(stats).reduce(
        (result, [month, avgParams]) => ({ ...result, [month]: avgParams.sum / avgParams.count }),
        {},
      ),
    ),
  );
};
