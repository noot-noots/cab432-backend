require("dotenv");
const redis = require("redis");
const { createKey } = require("../utils/create-key");

const redisClient = redis
  .createClient(
    {
    url: process.env.REDIS_ENDPOINT
    }
  );
redisClient.connect().catch((err) => {
  console.log(err);
});


const getCacheImage = (req, res, next) => {

  const redisKey = createKey(req);

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
};

exports.getCacheImage = getCacheImage;
exports.redisClient = redisClient;
