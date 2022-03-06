import faker from '@faker-js/faker';
import { firstValueFrom, of } from 'rxjs';
import { Post } from '../../posts/posts.types';
import { avgCharLengthPerMonth } from './avgCharLengthPerMonth';

const postMock = (post: Partial<Post> = {}) => ({
  id: post.id || faker.datatype.uuid(),
  from_name: post.from_name || `${faker.name.firstName()} ${faker.name.lastName()}`,
  from_id: post.from_id || faker.name.firstName().toLowerCase(),
  message: post.message || faker.lorem.paragraph(),
  type: post.type || 'status',
  created_time: post.created_time || faker.date.past(),
});

const date = (str: string) => new Date(Date.parse(str));

describe('avgCharLengthPerMonth', () => {
  it('should return average character length of posts per month', async () => {
    const posts$ = of(
      // Month 1
      postMock({ message: 'aaa', created_time: date('2022-01') }),
      postMock({ message: 'aaaaaa', created_time: date('2022-01') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-01') }),

      // Month 2
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-02') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-02') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-02') }),
    );

    const result = await firstValueFrom(avgCharLengthPerMonth(posts$));

    expect(result).toEqual({
      '01/2022': 6,
      '02/2022': 9,
    });
  });
});
