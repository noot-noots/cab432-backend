require("dotenv").config();
const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// s3 setup
const bucketName = "image-bucket";

s3.createBucket({ Bucket: bucketName })
  .promise()
  .then(() => console.log(`Created bucket: ${bucketName}`))
  .catch((err) => {
    // We will ignore 409 errors which indicate that the bucket already exists
    if (err.statusCode !== 409) console.log(`Error creating bucket: ${err}`);
  });


const getS3Image = (req, res, next) => {
    const dummy_key = 'resize20'
}