import faker from '@faker-js/faker';
import { firstValueFrom, of } from 'rxjs';
import { Post } from '../../posts/posts.types';
import { avgNumberOfPostsPerUserPerMonth } from './avgNumberOfPostsPerUserPerMonth';

const postMock = (post: Partial<Post> = {}) => ({
  id: post.id || faker.datatype.uuid(),
  from_name: post.from_name || `${faker.name.firstName()} ${faker.name.lastName()}`,
  from_id: post.from_id || faker.name.firstName().toLowerCase(),
  message: post.message || faker.lorem.paragraph(),
  type: post.type || 'status',
  created_time: post.created_time || faker.date.past(),
});

const date = (str: string) => new Date(Date.parse(str));

describe('avgNumberOfPostsPerUserPerMonth', () => {
  it('should return average number of posts per user per month', async () => {
    const posts$ = of(
      // User 1 Month 1
      postMock({ from_id: 'user_1', created_time: date('2022-01') }),
      postMock({ from_id: 'user_1', created_time: date('2022-01') }),

      // User 1 Month 2

      // User 1 Month 3
      postMock({ from_id: 'user_1', created_time: date('2022-03') }),
      postMock({ from_id: 'user_1', created_time: date('2022-03') }),
      postMock({ from_id: 'user_1', created_time: date('2022-03') }),

      // User 2 Month 1
      postMock({ from_id: 'user_2', created_time: date('2022-01') }),

      // User 2 Month 2
      postMock({ from_id: 'user_2', created_time: date('2022-02') }),

      // User 2 Month 3
      postMock({ from_id: 'user_3', created_time: date('2022-03') }),

      // User 3 Month 1
      postMock({ from_id: 'user_3', created_time: date('2022-01') }),
      postMock({ from_id: 'user_3', created_time: date('2022-01') }),
      postMock({ from_id: 'user_3', created_time: date('2022-01') }),

      // User 3 Month 2
      postMock({ from_id: 'user_3', created_time: date('2022-02') }),
      postMock({ from_id: 'user_3', created_time: date('2022-02') }),

      // User 3 Month 3
      postMock({ from_id: 'user_3', created_time: date('2022-03') }),
      postMock({ from_id: 'user_3', created_time: date('2022-03') }),
      postMock({ from_id: 'user_3', created_time: date('2022-03') }),
      postMock({ from_id: 'user_3', created_time: date('2022-03') }),
      postMock({ from_id: 'user_3', created_time: date('2022-03') }),
    );

    const result = await firstValueFrom(avgNumberOfPostsPerUserPerMonth(posts$));

    expect(result).toEqual({
      '01/2022': 2,
      '02/2022': 1,
      '03/2022': 3,
    });
  });
});
