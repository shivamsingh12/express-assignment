# Local Setup

run npm install

add the neccessary values in the .env file ( .env.local for local setup)

deploy redis on docker ( docker run -p 6379:6379 redis) or on the host machine

run npm run dev

# Docker Setup

add the necessary values in the .env file ( .env.docker for docker setup)

run docker-compose up

# DB

Uses mongo atlas db and mongoose as orm, set the mongo connection uri in the env file for custom mongo deployment
