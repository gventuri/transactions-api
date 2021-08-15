# Transaction API

A very simple api to retrieve the list of merchants the user has spent money at during a given time frame and, for each of the merchants, the percentile ranking of the use compare to all other users over that same time period.

## Installing

To setup the project:

- clone it from github, using `git clone git@github.com:gventuri/transactions-api.git`;
- create a `.env` file (you can copy the sample info from `.env.example`);
- run `cd transactions-api` to go to the project folder;
- run `docker compose up`: this will setup the docker container for the api and for mysql;
- run `yarn migrate` to run the migrations (you can also revert them one by one with `yarn rollback`);
- run `yarn seed` to automatically create 1000 random users, 500 random merchants and 1.000.000 random transactions

## Running

To start the project, run `docker compose up`. Your project will be available on http://127.0.0.1:3000/.

## Optimization

### On the application level

To optimize the results, one thing could be caching the result using Redis. This solution is usually ideal for high-read/high-write, but in this case it might be very imprecise, as we also need to write very frequently. This would be particularly imprecise in the tails (assuming a Gaussian distribution). However, this could be a nice addon if we can tolerate some delay in the results. Unfortuantely, though, this would only cache each endpoint separately based on the user_id and the timeframe provided, so I will not implement this solution for now.

![Gaussian distribution sample](https://upload.wikimedia.org/wikipedia/commons/5/5c/PR_and_NCE.gif)

### On the DB level

The implementation is split into 2 different queries.

The first one is responsible to retrieve all the merchants where a user ha done a transaction in the given time frame. This query is blazing fast, thanks to the index, and will scale very well, as the complexity is less than `O(T)`, where `T` is equal `Transactions.count`. In fact, the query plan doesn't even need to do a FULL TABLE SCAN. I opted in for a seperate query rather than using `WHERE IN (SELECT ...)`, becuase it is more performant. In fact, also taking advantages of the cache, the subquery would be called about `T` times.

The second query, again, can take advantage of indices to speed up the performances very much. The goal with that query was to significantly reduce the amount of transactions the db goes through, filtering by a time range and by the merchants identified in the first query.
The query finds all the amounts spent from the given user for each merchant within the provided timeframe, then for each occurrency, identifies the percentile compared to all the amounts spent from each of the other users at the same merchant during the same timeframe.
We use Sliding Window approach, using `PERCENT_RANK` with `OVER`, partitioning by `merchant_id`, which is the most performant way to calculate the percentile.
Then it joins with the merchants table to get the name of each of the merchants where the user have done at least a transaction within the given timeframe. The db will perform at worst a HASH JOIN, adding a `O(M)` complexity. As there are indices, though, mySQL will probably opt in for a nested loop with indexed lookup.

Using to the proper indices, the second query takes longer as `M` grows, where `M` is the amount of merchant ids retrieved from the previous query. With the current seed (1.000.000 transactions, 1.000 users, 500 merchants), it takes on average 0.02 seconds, and it should scale very well.
The main bottleneck with the current approach is, as we increase the time frame, the query slows down, so I put a limit of 31 days for the time interval provided.

Another optimization might be adding a pagination, but it wouldn't significantly speed up the query, so I decided not to add it as of this implementation.

## Testing

To test the api, run `yarn test`. This will run some unit tests and some integration tests against the models and the controllers, using `jest`. To run the tests, is mandatory to have the server up & running, as it requires a connected db.
The info about the db can be changed on `.env.test`.
Each test requiring an interaction with the db will create a new db, which will be dropped at the end of each.
Only the features who were strictly related to the implementation were tested.

## Notes

- I decided NOT to use any ORMs (`sequelize`, `typeORM`, etc...) for this project, as we need to write very complex and custom queries. However, we will use `db-migrate` to handle migrations.
