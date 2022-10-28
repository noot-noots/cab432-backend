require("dotenv").config();
const fs = require('fs');
const AWS = require("aws-sdk");
const { imageProcess } = require("../utils/image-process");
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
  const s3Key = createS3Key(req, fileExtension);

  // Find if image exists in s3
  const params = {Bucket: bucketName, Key: s3Key};

  s3.getSignedUrl

  s3.getObject(params)
    .promise()
    .then(() => {
      //Serve from s3
      res.json({
        message: `Served from s3`,
        image: `https://${bucketName}.s3.amazonaws.com/${s3Key}`
      });
    })
    .catch(async (err) => {

      console.log(err)
      
      if (err.statusCode === 404) {

        const fileInfo = await imageProcess(req);
        const fileName = fileInfo.fileName;
        const error = fileInfo.error
        const imagePath = `./images/${fileName}`;

        console.log('This is the file path' + imagePath)

        setTimeout(async () => {
          if (error) {
            res.json({
              message: "Image not generated, please check you query!"
            });
          }
          else{
            
            const body = fs.readFileSync(imagePath);
            const objectParams = {
              Bucket: bucketName, 
              Key: s3Key,
              ContentType: `image/${fileExtension}`,
              Body: body}

            await s3.upload(objectParams).promise()
            .then((data) => {
              console.log(data)
              console.log(
                `Successfully uploaded data to ${bucketName}/${s3Key}`
              )

              res.json({
              message: `Image stored in s3`,
              image: data.Location
            })
            
            // Deletes the image locally
            fs.rmSync(imagePath)
            })
            .catch((err) => res.json(err))


            
            
            // s3.putObject(objectParams)
            //   .promise()
            //   .then((result) => {
  
            //     console.log(
            //       `Successfully uploaded data to ${bucketName}/${s3Key}`
            //     )
            //     res.json({
            //       message: `Image did not exist in s3 and has now been stored`,
            //     })
  
            //     console.log(result)
            //   })
            //   .catch((err) => res.json(err))
          }
        }, 5000)

        
      } else {
        console.log(s3Key)

        // something went wrong
        res.json(err);
      }
    })
}

const createS3Key = (req, fileExtension) => {
  let s3Key = ``;
  const { resize, rotate, flip, flop, sharpen, blur } = req.query;

  const image = req.file.buffer;
  const base64_image = image.toString('base64').substring(100, 116);

  s3Key = resize + '-' + rotate + '-' + flip + '-' + flop + '-' + sharpen + '-' + blur + '-' + base64_image + '.' + fileExtension;

  return s3Key;
}

exports.getS3Image = getS3Image;