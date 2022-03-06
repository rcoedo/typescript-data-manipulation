export interface SupermetricsPost {
  id: string;
  from_name: string;
  from_id: string;
  message: string;
  type: string;
  created_time: string;
}

export interface SupermetricsRegisterResponse {
  meta: { request_id: string };
  data: {
    sl_token: string;
    client_id: string;
    email: string;
  };
}

export interface SupermetricsPostsResponse {
  meta: { request_id: string };
  data: {
    page: number;
    posts: SupermetricsPost[];
  };
}
