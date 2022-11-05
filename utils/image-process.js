const fs = require("fs");
const sharp = require("sharp");

const imageProcess = async (req) => {
  const { resize, rotate, flip, flop, sharpen, blur } = req.query;

  fs.access("./images", (err) => {
    if (err) {
      fs.mkdirSync("./images");
    }
  });

  const image = req.file.buffer;
  const fileExtension = req.file.originalname.split(".")[1];
  let error = false;

  // Add date time to file name to avoid overwriting
  const fileName = `${Date.now()}.${fileExtension}`;


  // Process image
  const alteredImage = sharp(image);
  try {
    if (resize) {
      const dimensions = resize.split("x");

      alteredImage.resize(
        dimensions[0] === "null" ? null : +dimensions[0],
        dimensions[1] === "null" ? null : +dimensions[1],
        {
          fit: sharp.fit.fill,
        }
      );
    }

    if (rotate) alteredImage.rotate(+rotate);
    if (flip) alteredImage.flip();
    if (flop) alteredImage.flop();
    if (sharpen) alteredImage.sharpen({ sigma: +sharpen });
    if (blur) alteredImage.blur(+blur);


    alteredImage.toFile(`./images/${fileName}`, (err, info) => {
      if (err) {
        console.log(err, info);
      }
    });
    
  } catch (err) {
    console.log('wrong file format')
    console.log(err);
    error = true;
    throw {message: 'Could not alter image, please check if query and file is valid!', status: 403}
  }

  return {
    fileName,
    error : error
  };
};

exports.imageProcess = imageProcess;
