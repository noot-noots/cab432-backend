const fs = require("fs");
const sharp = require("sharp");

const imageProcess = async (req) => {
  const { resize, rotate, flip, flop, sharpen, blur } = req.query;

  fs.access("./images", (err) => {
    if (err) {
      fs.mkdirSync("./images");
    }
  });

  const formattedName = req.file.originalname.split(" ").join("-");
  const fileName = "altered-" + formattedName;
  const image = req.file.buffer;

  // await sharp(image)
  //   .resize(700)
  //   .toFile(`./images/${fileName}`, (err, info) => {
  //     console.log(err, info);
  //   });

  const alteredImage = await sharp(image)

  if (resize) {
    try {
    alteredImage.resize(+resize)
    } catch {
      const dimensions = resize.split('x')

      alteredImage.resize({
        width: +dimensions[0], 
        height: +dimensions[1],
        fit: sharp.fit.fill
      })
    }
  }

  if (rotate) alteredImage.rotate(+rotate);
  if (flip) alteredImage.flip();
  if (flop) alteredImage.flop();
  if (sharpen) alteredImage.sharpen();
  if (blur) alteredImage.blur();

  alteredImage.toFile(`./images/${fileName}`, (err, info) => {
    console.log(err, info);
  });

  return fileName;
};

exports.imageProcess = imageProcess;
