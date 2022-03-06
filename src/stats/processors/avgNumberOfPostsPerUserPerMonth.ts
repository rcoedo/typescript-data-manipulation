import { map, Observable, reduce } from 'rxjs';
import * as moment from 'moment';
import { Post } from '../../posts/posts.types';
import { AvgNumberOfPostsPerUserPerMonth } from '../stats.types';

const avgNumberOfPostsPerUser = (postsPerUser: Record<string, number>, numberOfUsers: number): number =>
  Object.values(postsPerUser).reduce((x, y) => x + y) / numberOfUsers;

export const avgNumberOfPostsPerUserPerMonth = (posts$: Observable<Post>): Observable<AvgNumberOfPostsPerUserPerMonth> => {
  return posts$.pipe(
    reduce(
      (results, post) => {
        const { userIds, stats } = results;
        const userId = post.from_id;
        const month = moment(post.created_time).format('MM/YYYY');

        if (!stats[month]) {
          stats[month] = { [userId]: 1 };
        } else {
          stats[month][userId] = (stats[month][userId] || 0) + 1;
        }

        userIds.add(userId);

        return results;
      },
      { userIds: new Set(), stats: {} as Record<string, Record<string, number>> },
    ),
    map(({ userIds, stats }) => {
      const numberOfUsers = userIds.size;

      return Object.entries(stats).reduce(
        (results, [month, postsPerUser]) => ({
          ...results,
          [month]: avgNumberOfPostsPerUser(postsPerUser, numberOfUsers as number),
        }),
        {},
      );
    }),
  );
};
