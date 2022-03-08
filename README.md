## Code Challenge

To solve the proposed challenge I built a backend using [NestJS](https://nestjs.com/) with an endpoint that returns the required stats.

### Running the application :rocket:

1. First of all you need to provide the environment file. There's a sample in `config/local.env.sample`. Create a new file `config/local.env` using this one as template, so the application can fetch the right data.

   An example of a `config/local.env` file:

```bash
API_ENDPOINT=https://api.supermetrics.com/assignment
API_CLIENT_ID=your_client_id
API_EMAIL=your_email
API_NAME=your_name
API_TOKEN_TTL=3600
```

2. After that, you can run the application using yarn:

```bash
$ yarn # To install dependencies
$ yarn start # To start the server
```

Alternatively, you can run the application using docker:

```bash
$ docker compose up
```

This will start the NestJS server in http://localhost:3000.

3. Once the server is up and running, you can query the endpoint for the stats in the url http://localhost:3000/stats

### The stack :woman_technologist:

I've chosen [NestJS](https://nestjs.com/) because I think it's one of the best Node frameworks available at the moment. It has great support for TypeScript out of the box, and it is really easy to set up a new project with all the necessary tooling, like jest, supertest for e2e tests, prettier, eslint etc.

I also used [RxJS](https://rxjs.dev/) to manipulate the data, since it makes it easy to pipe through it and split it in different streams to be processed by different stats processors.

To manipulate Dates, I used [momentjs](https://momentjs.com/), and to generate data for testing purposes I used [faker](https://github.com/faker-js/faker).

### The architecture :building_construction:

![architecture diagram](https://github.com/rcoedo/typescript-data-manipulation/blob/main/graph.png?raw=true)

* **Client**: The client fetches data from the *API* and handles authentication + token caching.
* **PostsService**: Its purpose is to fetch posts using the client, and to encapsulate pagination behavior. Pagination is transparent and from the outside the user only sees a stream of posts.
* **StatsService**: Its main purpose is, given a stream of *Posts*, to calculate a set of statistics. The stream is split in many, and each of those passed to a *processor*. A *processor* is a pure function that receives a stream of *Posts* and returns the corresponding statistic result.
* **StatsController**: Has a single endpoint that returns the stats for the first 1000 posts.



### Testing

There are unit tests for the different parts of the application. There's also an  *e2e* test under `test/app.e2e-spec.ts` that hits the API and checks the result using *Snapshot Testing*.

To run the unit tests:

```bash
$ yarn test
```

To run the e2e test:

```bash
$ yarn test:e2e
```

Keep in mind that, since these tests are hitting the provided API, and the data is not static, they will fail. I still decided to include it because it is a good way to test the application. To update the snapshots:

```bash
$ yarn test:e2e -u
```

 

### That's it! :confetti_ball:

Thanks for challenging me to build this application and I hope you like it :slightly_smiling_face: