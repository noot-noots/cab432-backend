const { imageProcess } = require("../utils/image-process");
const fs = require("fs");
const { create } = require("domain");

const alterImage = async (req, res, next) => {

  const fileInfo = await imageProcess(req);
  const fileName = fileInfo.fileName;
  const error = fileInfo.error
  const imagePath = `${process.env.URL}/images/${fileName}`;

  if (error) {
    res.json({
      message: "Image not generated, please check you query!"
    });
  }
  else{
    res.json({
    message: "Image successfully modified!",
    image: imagePath,
  });
  }
  
};

exports.alterImage = alterImage;
