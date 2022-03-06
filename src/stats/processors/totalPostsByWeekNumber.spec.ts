import faker from '@faker-js/faker';
import { firstValueFrom, of } from 'rxjs';
import { Post } from '../../posts/posts.types';
import { totalPostsByWeekNumber } from './totalPostsByWeekNumber';

const postMock = (post: Partial<Post> = {}) => ({
  id: post.id || faker.datatype.uuid(),
  from_name: post.from_name || `${faker.name.firstName()} ${faker.name.lastName()}`,
  from_id: post.from_id || faker.name.firstName().toLowerCase(),
  message: post.message || faker.lorem.paragraph(),
  type: post.type || 'status',
  created_time: post.created_time || faker.date.past(),
});

const date = (str: string) => new Date(Date.parse(str));

describe('totalPostsByWeekNumber', () => {
  it('should return the total posts by week number', async () => {
    const posts$ = of(
      // Month 1
      postMock({ created_time: date('2022-01-01') }),
      postMock({ created_time: date('2022-01-08') }),
      postMock({ created_time: date('2022-01-12') }),
      postMock({ created_time: date('2022-01-15') }),
      postMock({ created_time: date('2022-01-17') }),
      postMock({ created_time: date('2022-01-21') }),
      postMock({ created_time: date('2022-01-23') }),
      postMock({ created_time: date('2022-01-25') }),
      postMock({ created_time: date('2022-01-28') }),

      // Month 2
      postMock({ created_time: date('2022-02-01') }),
      postMock({ created_time: date('2022-02-06') }),
      postMock({ created_time: date('2022-02-11') }),
      postMock({ created_time: date('2022-02-13') }),
      postMock({ created_time: date('2022-02-22') }),
    );

    const result = await firstValueFrom(totalPostsByWeekNumber(posts$));

    expect(result).toEqual({
      '2021-W52': 1,
      '2022-W01': 1,
      '2022-W02': 2,
      '2022-W03': 3,
      '2022-W04': 2,
      '2022-W05': 2,
      '2022-W06': 2,
      '2022-W08': 1,
    });
  });
});
