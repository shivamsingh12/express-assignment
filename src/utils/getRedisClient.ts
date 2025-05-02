import { createClient } from "redis";

const client = createClient({
  socket: {
    reconnectStrategy: () => {
      return new Error("Unable to connect, reconnection disabled");
    },
  },
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
