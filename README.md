# Transaction API

A very simple api to retrieve the list of merchants the user has spent money at during that time period and, for each of the merchants, the percentile ranking against all other users over that same time period.

## Install

To setup the project:

- clone it from github, using `git clone git@github.com:gventuri/transactions-api.git`;
- create a `.env` file (you can copy the sample info from `.env.example`);
- run `cd transactions-api` to go to the project folder;
- run `docker compose up`: this will setup the docker container for the api and for mysql;
- run `yarn migrate` to run the migrations (you can also revert them one by one with `yarn rollback`);

## Start

To start the project, run `docker compose up`. Your project will be available on http://127.0.0.1:3000/.
