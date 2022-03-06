import { Test, TestingModule } from '@nestjs/testing';
import faker from '@faker-js/faker';
import { of, repeat } from 'rxjs';
import { Post } from '../posts/posts.types';
import { PostsService } from '../posts/posts.service';
import { StatsService } from './stats.service';

jest.mock('./processors/avgCharLengthPerMonth', () => ({ avgCharLengthPerMonth: jest.fn(() => of({ '02/2022': 6 })) }));
jest.mock('./processors/totalPostsByWeekNumber', () => ({
  totalPostsByWeekNumber: jest.fn(() => of({ '10': 4, '11': 7 })),
}));
jest.mock('./processors/avgNumberOfPostsPerUserPerMonth', () => ({
  avgNumberOfPostsPerUserPerMonth: jest.fn(() =>
    of({
      user_1: { '02/2022': 6 },
      user_2: { '01/2022': 6 },
    }),
  ),
}));
jest.mock('./processors/longestPostByCharLengthPerMonth', () => ({
  longestPostByCharLengthPerMonth: jest.fn(() =>
    of({
      '02/2022': {
        id: 'id',
        from_name: 'name',
        from_id: 'user_id',
        message: 'message',
        type: 'status',
        created_time: new Date(Date.parse('2022-02')),
      },
    }),
  ),
}));

class PostsServiceMock {
  getPosts() {
    return of();
  }
}

const postMock = (post: Partial<Post> = {}) => ({
  id: post.id || faker.datatype.uuid(),
  from_name: post.from_name || `${faker.name.firstName()} ${faker.name.lastName()}`,
  from_id: post.from_id || faker.name.firstName().toLowerCase(),
  message: post.message || faker.lorem.paragraph(),
  type: post.type || 'status',
  created_time: post.created_time || faker.date.past(),
});

const date = (str) => new Date(Date.parse(str));

describe('StatsController', () => {
  let postsService: PostsService;
  let statsService: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PostsService, useClass: PostsServiceMock }],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    statsService = module.get<StatsService>(StatsService);
  });

  describe('getStats', () => {
    beforeEach(() => {
      const posts$ = of(
        postMock({ message: 'aaa', created_time: date('2021-01') }),
        postMock({ message: 'aaaaaa', created_time: date('2021-01') }),
        postMock({ message: 'aaaaaaaaa', created_time: date('2021-01') }),
        postMock({ message: 'aaaaaaaaa', created_time: date('2021-02') }),
        postMock({ message: 'aaaaaaaaa', created_time: date('2021-02') }),
        postMock({ message: 'aaaaaaaaa', created_time: date('2021-02') }),
      ).pipe(repeat(10));

      jest.spyOn(postsService, 'getPosts').mockImplementation(() => posts$);
    });

    it('should call postsService to get stats', () => {
      const posts$ = of(postMock(), postMock(), postMock());

      jest.spyOn(postsService, 'getPosts').mockImplementation(() => posts$);

      statsService.getStats(1);

      expect(postsService.getPosts).toHaveBeenCalledTimes(1);
    });

    it('should return avgCharLengthPerMonth as result', async () => {
      const stats = await statsService.getStats(6);

      expect(stats.avgCharLengthPerMonth).toEqual({ '02/2022': 6 });
    });

    it('should return avgNumberOfPostsPerUserPerMonth as result', async () => {
      const stats = await statsService.getStats(6);

      expect(stats.avgNumberOfPostsPerUserPerMonth).toEqual({
        user_1: { '02/2022': 6 },
        user_2: { '01/2022': 6 },
      });
    });

    it('should return longestPostByCharLengthPerMonth as result', async () => {
      const stats = await statsService.getStats(6);

      expect(stats.longestPostByCharLengthPerMonth).toEqual({
        '02/2022': {
          created_time: new Date(Date.parse('2022-02')),
          from_id: 'user_id',
          from_name: 'name',
          id: 'id',
          message: 'message',
          type: 'status',
        },
      });
    });

    it('should return totalPostsByWeekNumber as result', async () => {
      const stats = await statsService.getStats(6);

      expect(stats.totalPostsByWeekNumber).toEqual({ '10': 4, '11': 7 });
    });
  });
});
