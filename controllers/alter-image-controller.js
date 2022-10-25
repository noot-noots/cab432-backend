const sharp = require("sharp");

const alterImage = async (req, res, next) => {
  const { resize, rotate, flip, flop, sharpen, blur } = req.body;

  res.json({ message: "Image resized!" });
};

exports.alterImage = alterImage;
