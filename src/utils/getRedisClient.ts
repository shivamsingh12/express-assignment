import { createClient } from "redis";

const HOST = process.env.REDIS_HOST;
const PORT = process.env.REDIS_PORT;

const client = createClient({
  socket: {
    reconnectStrategy: () => {
      return new Error("Unable to connect, reconnection disabled");
    },
  },
  url: `redis://${HOST}:${PORT}`,
}).on("error", (err) => {
  console.log("ERROR : ", err);
});

let redisClient: null | RedisClientType = null;

try {
  redisClient = (await client.connect()) as RedisClientType;
} catch (err) {
  console.log("REDIS ERROR : ", err);
}

export default redisClient;

interface RedisClientType {
  del: Function;
  get: Function;
  set: Function;
}
