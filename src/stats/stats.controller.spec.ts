import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

describe('StatsController', () => {
  let statsService: StatsService;
  let statsController: StatsController;

  class StatsServiceMock {
    getStats() {
      return {};
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsController, { provide: StatsService, useClass: StatsServiceMock }],
    }).compile();

    statsService = module.get<StatsService>(StatsService);
    statsController = module.get<StatsController>(StatsController);
  });

  describe('getStats', () => {
    it('should return the stats', async () => {
      const stats = {
        avgCharLengthPerMonth: { '02/2022': 8 },
        avgNumberOfPostsPerUserPerMonth: { '02/2022': 8, '01/2022': 8 },
        longestPostByCharLengthPerMonth: {
          '02/2022': {
            id: 'id',
            from_name: 'name',
            from_id: 'user_id',
            message: 'message',
            type: 'status',
            created_time: new Date(Date.parse('2022-01')),
          },
        },
        totalPostsByWeekNumber: {
          '10': 5,
          '11': 8,
        },
      };

      jest.spyOn(statsService, 'getStats').mockImplementation(() => Promise.resolve(stats));

      const result = await statsController.getStats();

      expect(result).toEqual(stats);
    });
  });
});
