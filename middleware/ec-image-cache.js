require("dotenv");
const redis = require("redis");
const { createKey } = require("../utils/create-key");

const redisClient = redis.createClient(
  {
  url: "redis://golden-image-cache-demo.km2jzi.0001.apse2.cache.amazonaws.com:6379",
}
);

let redisOnline = true;

redisClient.connect().catch((err) => {
  console.log('Redis connection failed');
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

    const redisClient = redis.createClient(
      {
      url: "redis://golden-image-cache-demo.km2jzi.0001.apse2.cache.amazonaws.com:6379",
    }
    );
    
    redisOnline = true;
    
    redisClient.connect().catch((err) => {
      console.log('Redis connection failed');
      redisOnline = false;
    });

    return;
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
