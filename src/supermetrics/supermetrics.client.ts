import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Env } from '../config/env';
import { catchError, firstValueFrom, from, map, mergeMap, Observable, tap } from 'rxjs';
import { SupermetricsPostsResponse, SupermetricsRegisterResponse } from './supermetrics.types';

@Injectable()
export class SupermetricsClient {
  private readonly logger = new Logger(SupermetricsClient.name);
  private readonly apiEndpoint: string;
  private readonly apiClientId: string;
  private readonly apiEmail: string;
  private readonly apiName: string;
  private readonly apiTokenTtl: number;

  constructor(
    private readonly configService: ConfigService<Env>,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.apiEndpoint = configService.get('API_ENDPOINT', { infer: true });
    this.apiClientId = configService.get('API_CLIENT_ID', { infer: true });
    this.apiEmail = configService.get('API_EMAIL', { infer: true });
    this.apiName = configService.get('API_NAME', { infer: true });
    this.apiTokenTtl = configService.get('API_TOKEN_TTL', { infer: true });
  }

  // Refreshes the token cache with a fresh token.
  private async refreshToken() {
    this.logger.log('refreshing token...');
    const {
      data: { sl_token: token },
    } = await firstValueFrom(this.register());

    await this.cacheManager.set('token', token, { ttl: this.apiTokenTtl });

    this.logger.log('token refreshed');

    return token;
  }

  // Gets the token from the cache, if it's expired refreshes it.
  private async getToken() {
    const token = await this.cacheManager.get<string>('token');
    if (!token) {
      return this.refreshToken();
    }
    return token;
  }

  // Get a new token from Supermetric's API
  private register(): Observable<SupermetricsRegisterResponse> {
    return this.httpService
      .post<SupermetricsRegisterResponse>(`${this.apiEndpoint}/register`, {
        client_id: this.apiClientId,
        email: this.apiEmail,
        name: this.apiName,
      })
      .pipe(map((response) => response.data));
  }

  // Get a stream of Supermetric's Posts, starting on page `page`
  getPosts(page = 1): Observable<SupermetricsPostsResponse> {
    return from(this.getToken()).pipe(
      tap((token) => this.logger.log(`fetching posts [page=${page}, token=${token}]`)),
      // If the token request fails, we throw an UNAUTHORIZED error
      catchError((error) => {
        throw new HttpException(`Could not fetch token: ${error.message}`, HttpStatus.UNAUTHORIZED);
      }),
      // Map the token to a /posts request
      mergeMap((token) =>
        this.httpService
          .get<SupermetricsPostsResponse>(`${this.apiEndpoint}/posts`, {
            params: { sl_token: token, page },
          })
          .pipe(
            map((response) => response.data),
            // If the request fails and its because the token is invalid, we refresh it and retry
            catchError((e, caught) => {
              if (e.response.status === 500 && e.response.data.error.message === 'Invalid SL Token') {
                this.logger.log('token ${token} expired');
                return from(this.refreshToken()).pipe(mergeMap(() => caught));
              }
              // Otherwise we raise an HTTP exception
              throw new HttpException('error fetching the posts', e.response.status);
            }),
          ),
      ),
    );
  }
}
