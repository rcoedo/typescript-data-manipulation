import { Post } from 'src/posts/posts.types';

export type AvgCharLengthPerMonth = Record<string, number>;

export type LongestPostByCharLengthPerMonth = Record<string, Post>;

export type TotalPostsByWeekNumber = Record<string, number>;

export type AvgNumberOfPostsPerUserPerMonth = Record<string, number>;

export interface StatsResponse {
  avgCharLengthPerMonth: AvgCharLengthPerMonth;
  longestPostByCharLengthPerMonth: LongestPostByCharLengthPerMonth;
  totalPostsByWeekNumber: TotalPostsByWeekNumber;
  avgNumberOfPostsPerUserPerMonth: AvgNumberOfPostsPerUserPerMonth;
}
