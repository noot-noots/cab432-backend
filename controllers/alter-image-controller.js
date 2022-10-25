const { imageProcess } = require("../utils/image-process");

const alterImage = async (req, res, next) => {
  const { resize, rotate, flip, flop, sharpen, blur } = req.query;

  console.log('file', req.file)
  console.log('body', req.body)

  const fileName = await imageProcess(req);

  res.json({ 
    message: "Image resized!",
    image: `http://localhost:3000/images/${fileName}`
   });
};

exports.alterImage = alterImage;
