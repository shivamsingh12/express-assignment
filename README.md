# Setup/Deployment

## Local Setup

run npm install

add the neccessary values in the .env file ( .env.local for local setup)

deploy redis on docker ( docker run -p 6379:6379 redis) or on the host machine

run npm run dev

## Docker Setup

add the necessary values in the .env file ( .env.docker for docker setup)

run docker-compose up

## DB

Uses mongo atlas db and mongoose as orm, set the mongo connection uri in the env file for custom mongo deployment

# Redis Caching logic

Our redis middleware sits in the /task router's GET /tasks route before the any task controllers are executed

## Caching Logic:

When we hit the GET /tasks (without any query params) and the request fulfills with a 200 status code,
the GET /tasks controller adds the result in the redis cache with the key of "/tasks" and expiry of 60 seconds

## Cache Invalidation Logic:

When we hit the PUT /tasks/:id or DELETE /tasks/id or POST /tasks, after the response is sent we delete the redis cache for the "/tasks" key

## Fetching Logic:

When we hit the GET /tasks (with or without query params), our redis middleware first checks the redis cache for "/tasks" value, if null next() is called else tasks are returned from the cached values (with filters applied from query params if applicable)

![Architecture Diagram](https://github.com/shivamsingh12/express-assignment/blob/main/image.png)
