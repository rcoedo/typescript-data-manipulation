import faker from '@faker-js/faker';
import { firstValueFrom, of } from 'rxjs';
import { Post } from '../../posts/posts.types';
import { longestPostByCharLengthPerMonth } from './longestPostByCharLengthPerMonth';

const postMock = (post: Partial<Post> = {}) => ({
  id: post.id || faker.datatype.uuid(),
  from_name: post.from_name || `${faker.name.firstName()} ${faker.name.lastName()}`,
  from_id: post.from_id || faker.name.firstName().toLowerCase(),
  message: post.message || faker.lorem.paragraph(),
  type: post.type || 'status',
  created_time: post.created_time || faker.date.past(),
});

const date = (str: string) => new Date(Date.parse(str));

describe('longestPostByCharLengthPerMonth', () => {
  it('should return the longest post by char length per month', async () => {
    const [longest1, longest2, longest3] = [
      postMock({ message: 'aaaaaaaaaaaa', created_time: date('2022-01') }),
      postMock({ message: 'aaaaaaaaaaaaaaaaaaaa', created_time: date('2022-02') }),
      postMock({ message: 'aaaaaaaaaaaaaaaa', created_time: date('2022-03') }),
    ];

    const posts$ = of(
      // Month 1
      postMock({ message: 'aaa', created_time: date('2022-01') }),
      postMock({ message: 'aaaaaa', created_time: date('2022-01') }),
      longest1,
      postMock({ message: 'aaa', created_time: date('2022-01') }),
      postMock({ message: 'aaaaaa', created_time: date('2022-01') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-01') }),

      // Month 2
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-02') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-02') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-02') }),
      longest2,
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-02') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-02') }),

      // Month 3
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-03') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-03') }),
      longest3,
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-03') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-03') }),
      postMock({ message: 'aaaaaaaaa', created_time: date('2022-03') }),
    );

    const result = await firstValueFrom(longestPostByCharLengthPerMonth(posts$));

    expect(result).toEqual({
      '01/2022': longest1,
      '02/2022': longest2,
      '03/2022': longest3,
    });
  });
});
