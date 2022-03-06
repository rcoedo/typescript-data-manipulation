import { HttpService } from '@nestjs/axios';
import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { firstValueFrom, of } from 'rxjs';
import { SupermetricsClient } from './supermetrics.client';

class HttpServiceMock {
  get(): any {
    return of();
  }
  post(): any {
    return of();
  }
}

class ConfigServiceMock {
  get(key: string): unknown {
    switch (key) {
      case 'API_TOKEN_TTL':
        return 1000;
      default:
        return key;
    }
  }
}

const axiosResponseMock = ({ data = {}, status = 200, statusText = 'OK', headers = {}, config = {} }) =>
  of({
    data,
    status,
    statusText,
    headers,
    config,
  });

const supermetricsResponseMock = (data) => ({
  meta: {},
  data,
});

describe('SupermetricsClient', () => {
  let supermetricsClient: SupermetricsClient;
  let httpService: HttpService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        SupermetricsClient,
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: ConfigService, useClass: ConfigServiceMock },
      ],
    }).compile();

    supermetricsClient = module.get<SupermetricsClient>(SupermetricsClient);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('getPosts', () => {
    it('properly caches the token', () => {
      jest.spyOn(cacheManager, 'set');

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(axiosResponseMock({ data: supermetricsResponseMock({ sl_token: 'token_value' }) }));

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        axiosResponseMock({
          data: supermetricsResponseMock({
            page: 1,
            posts: [],
          }),
        }),
      );

      supermetricsClient.getPosts().subscribe(() => {
        expect(cacheManager.set).toHaveBeenCalled();
        expect(cacheManager.set).toHaveBeenCalledWith('token', 'token_value', { ttl: 1000 });
      });
    });

    it('reads the cached token', async () => {
      jest.spyOn(cacheManager, 'get');

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(axiosResponseMock({ status: 500, statusText: 'KO' }))
        .mockReturnValueOnce(axiosResponseMock({ data: supermetricsResponseMock({ sl_token: 'token_value' }) }));

      jest.spyOn(httpService, 'get').mockReturnValue(
        axiosResponseMock({
          data: supermetricsResponseMock({
            page: 1,
            posts: [],
          }),
        }),
      );

      await firstValueFrom(supermetricsClient.getPosts());
      await firstValueFrom(supermetricsClient.getPosts());

      expect(httpService.post).toHaveBeenCalledTimes(1);
      expect(httpService.post).toHaveBeenCalledWith('API_ENDPOINT/register', {
        client_id: 'API_CLIENT_ID',
        email: 'API_EMAIL',
        name: 'API_NAME',
      });

      expect(cacheManager.get).toHaveBeenCalledTimes(2);
      expect(cacheManager.get).toHaveBeenCalledWith('token');
    });

    it('returns an obersvable list of posts', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(axiosResponseMock({ data: supermetricsResponseMock({ sl_token: 'token_value' }) }));

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(axiosResponseMock({ status: 500, statusText: 'KO' }))
        .mockReturnValueOnce(
          axiosResponseMock({
            data: supermetricsResponseMock({
              page: 1,
              posts: [
                {
                  id: 'id',
                  from_name: 'name',
                  from_id: 'user_id',
                  message: 'message',
                  type: 'status',
                  created_time: '2022-03-05T08:02:21+00:00',
                },
              ],
            }),
          }),
        );

      const response = await firstValueFrom(supermetricsClient.getPosts());

      expect(response).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "page": 1,
              "posts": Array [
                Object {
                  "created_time": "2022-03-05T08:02:21+00:00",
                  "from_id": "user_id",
                  "from_name": "name",
                  "id": "id",
                  "message": "message",
                  "type": "status",
                },
              ],
            },
            "meta": Object {},
          }
        `);
    });
  });
});
