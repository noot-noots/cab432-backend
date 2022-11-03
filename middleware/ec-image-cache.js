require("dotenv");
const redis = require("redis");
const { createKey } = require("../utils/create-key");

const redisClient = redis.createClient({
  url: process.env.REDIS_ENDPOINT,
});

let redisOnline = true;

redisClient.connect().catch((err) => {
  console.log(err);
  redisOnline = false;
});

const getCacheImage = (req, res, next) => {
    const redisKey = createKey(req);

  if (!redisOnline) {
    // Check s3 if redis is not online
    console.log('Redis server is not online')
    console.log(`Checking s3`);
    req.query.key = redisKey;
    next();
  } else {
    redisClient.get(redisKey).then((result) => {
      if (result) {
        console.log(`Served from redis`);

        const resultJSON = JSON.parse(result);
        res.json(resultJSON);
      } else {
        // Check s3
        console.log(`Checking s3`);
        req.query.key = redisKey;
        next();
      }
    });
  }
};

exports.getCacheImage = getCacheImage;
exports.redisClient = redisClient;
