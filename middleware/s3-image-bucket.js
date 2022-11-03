require("dotenv").config();
const fs = require("fs");
const AWS = require("aws-sdk");
const { imageProcess } = require("../utils/image-process");
const { redisClient } = require("./ec-image-cache");
const { createKey } = require("../utils/create-key");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// s3 setup
const bucketName = "golden-image-bucket432";

s3.createBucket({ Bucket: bucketName })
  .promise()
  .then(() => console.log(`Created bucket: ${bucketName}`))
  .catch((err) => {
    // We will ignore 409 errors which indicate that the bucket already exists
    if (err.statusCode !== 409) {
      console.log(`Error creating bucket: ${err}`);
    }
  });

const getS3Image = (req, res, next) => {
  const fileExtension = req.file.originalname.split(".")[1];
  const s3Key = req.query.key ? req.query.key : createKey(req);

  const params = { Bucket: bucketName, Key: s3Key };

  s3.getSignedUrl;

  // Find if image exists in s3, if not create and store the image
  s3.getObject(params)
    .promise()
    .then(() => {
      //Serve from s3
      res.json({
        message: `Served from s3`,
        image: `https://${bucketName}.s3.amazonaws.com/${s3Key}`,
      });

      // Store in redis
      redisClient
        .setEx(
          s3Key,
          3600, // Expire Key in 1 day
          JSON.stringify({
            message: `Served from redis`,
            image: `https://${bucketName}.s3.amazonaws.com/${s3Key}`,
          })
        )
        .catch((e) => console.log(e));
    })
    .catch(async (err) => {
      if (err.statusCode === 404) {
        // Generate Image

        const fileInfo = await imageProcess(req);
        const fileName = fileInfo.fileName;
        const error = fileInfo.error;
        const imagePath = `./images/${fileName}`;

        console.log("This is the file path" + imagePath);

        setTimeout(async () => {
          if (error) {
            res.json({
              message: "Image not generated, please check you query!",
            });
          } else {
            const body = fs.readFileSync(imagePath);
            const objectParams = {
              Bucket: bucketName,
              Key: s3Key,
              ContentType: `image/${fileExtension}`,
              Body: body,
            };

            await s3
              .upload(objectParams)
              .promise()
              .then((data) => {
                console.log(data);
                console.log(
                  `Successfully uploaded data to ${bucketName}/${s3Key}`
                );

                res.json({
                  message: `Image stored in s3`,
                  image: data.Location,
                });

                // Store in redis
                redisClient
                  .setEx(
                    s3Key,
                    3600, // Expire key in 1 day
                    JSON.stringify({
                      message: `Served from redis`,
                      image: `https://${bucketName}.s3.amazonaws.com/${s3Key}`,
                    })
                  )
                  .catch((e) => console.log(e));

                // Deletes the image locally
                fs.rmSync(imagePath);
              })
              .catch((err) => res.json(err));
          }
        }, 5000);
      } else {
        // something went wrong
        res.json(err);
      }
    });
};

exports.getS3Image = getS3Image;
