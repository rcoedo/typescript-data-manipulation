import { Test, TestingModule } from '@nestjs/testing';
import faker from '@faker-js/faker';
import { count, firstValueFrom, of, take } from 'rxjs';
import { SupermetricsClient } from '../supermetrics/supermetrics.client';
import { SupermetricsPost } from '../supermetrics/supermetrics.types';
import { PostsService } from './posts.service';

const supermetricsPostMock = (post: Partial<SupermetricsPost> = {}) => ({
  id: post.id || faker.datatype.uuid(),
  from_name: post.from_name || `${faker.name.firstName()} ${faker.name.lastName()}`,
  from_id: post.from_id || faker.name.firstName().toLowerCase(),
  message: post.message || faker.lorem.paragraph(),
  type: post.type || 'status',
  created_time: post.created_time || faker.date.past().toDateString(),
});

const supermetricsPostsMock = (numberOfPosts: number) =>
  Array.from({ length: numberOfPosts }).map(() => supermetricsPostMock());

const postsPage = (data) =>
  of({
    meta: { request_id: '' },
    data,
  });

class SupermetricsClientMock {
  getPosts() {
    return of();
  }
}

describe('PostsService', () => {
  let supermetricsClient: SupermetricsClient;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, { provide: SupermetricsClient, useClass: SupermetricsClientMock }],
    }).compile();

    supermetricsClient = module.get<SupermetricsClient>(SupermetricsClient);
    postsService = module.get<PostsService>(PostsService);
  });

  describe('getPosts', () => {
    it('should return an infinite observable of Posts', async () => {
      const posts = supermetricsPostsMock(100);

      jest
        .spyOn(supermetricsClient, 'getPosts')
        .mockImplementation((page) => postsPage({ page, posts: [] }))
        .mockImplementationOnce(() => postsPage({ page: 1, posts }))
        .mockImplementationOnce(() => postsPage({ page: 2, posts }))
        .mockImplementationOnce(() => postsPage({ page: 3, posts }));

      const numberOfPosts = await firstValueFrom(postsService.getPosts(1).pipe(take(250), count()));

      expect(numberOfPosts).toEqual(250);
      expect(supermetricsClient.getPosts).toHaveBeenCalledTimes(3);
    });

    it('should stop if api returns empty array', async () => {
      const posts = supermetricsPostsMock(100);

      jest
        .spyOn(supermetricsClient, 'getPosts')
        .mockImplementation((page) => postsPage({ page, posts: [] }))
        .mockImplementationOnce(() => postsPage({ page: 1, posts }))
        .mockImplementationOnce(() => postsPage({ page: 2, posts }));

      const numberOfPosts = await firstValueFrom(postsService.getPosts(1).pipe(take(250), count()));

      expect(numberOfPosts).toEqual(200);
      expect(supermetricsClient.getPosts).toHaveBeenCalledTimes(3);
    });
  });
});
