const fs = require('fs');
const sharp = require("sharp");

const imageProcess = async(req) => {
    fs.access('./images', (err) => {
        if(err){
          fs.mkdirSync('./images')
        }
      })
    
      const formattedName = req.file.originalname.split(' ').join('-');
      const fileName = 'resized-' + formattedName;
      const image = req.file.buffer
    
      await sharp(image)
        .resize(700)
        .toFile(`./images/${fileName}`, (err, info) => {
          console.log(err, info)
        })

    return fileName
}

exports.imageProcess = imageProcess;