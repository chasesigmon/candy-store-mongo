## Description

Candy Store API (https://github.com/chasesigmon/candy-store)

[Nest] A NestJS project.\
[Typescript] A Typescript project.\
[PNPM] A pnpm project.\
[Docker] Uses Docker.\
[MariaDB] Uses dockerized MariaDB.\
[Auth] Bearer token auth.

The Candy Store API allows for customer, inventory, store, and order records to be created, updated, and retrieved.

## Setup

```bash
# if pnpm is not installed then:
$ npm i pnpm -g

# if it is:
$ pnpm run install
```

## Running the app

```bash
$ pnpm run start

# to stop the app:
$ pnpm run stop
```

Steps that occur on start:

- A MariaDB container is created
- DB is automatically created
- NestJS app runs in a docker container
- DB is seeded with customer, inventory, store, and order records

Make requests at `localhost:3000`.

<img width="1065" alt="Screen Shot 2024-06-27 at 7 48 42 PM" src="https://github.com/chasesigmon/candy-store/assets/7799494/5c2ce671-c328-4e3c-a8bc-426196cfb4ef">

The swagger documentation is located at `localhost:3000/api`.

<img width="1450" alt="Screen Shot 2024-06-27 at 7 54 15 PM" src="https://github.com/chasesigmon/candy-store/assets/7799494/352f7445-dc64-426d-8c25-f1361a13aeac">

An access token is necessary to make requests to customers, inventories, stores, orders, and report endpoints. A token can be generated at `localhost:3000/auth`. Once generated it should be used as the Bearer Token.

GraphQL is also setup for the `Inventory` as an example. Make requests at `localhost:3000/candy-store` with an appropriate query.

## Testing

The tests use an in memory sqlite database.

```bash
# unit tests
$ pnpm run test

# run a specific test or tests in a specific directory
$ pnpm run test src/routes/healthcheck

# e2e tests
$ pnpm run test:e2e

# run a specific test or tests in a specific directory
$ pnpm run test:e2e test/healthcheck

# load test - first start the app (pnpm run start)
$ pnpm run loadtest
```

## Architecture Design

The design can be found in the `/assets/candy-store.yaml` file. A developer would be able to fully implement the Candy Store API by following the API design.
