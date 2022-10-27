const { imageProcess } = require("../utils/image-process");

const alterImage = async (req, res, next) => {
  // console.log('file', req.file)
  // console.log('body', req.body)

  const fileName = await imageProcess(req);

  res.json({ 
    message: "Image successfully modified!",
    image: `${process.env.URL}/images/${fileName}`
   });
};

exports.alterImage = alterImage;
