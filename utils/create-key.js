const allowedFileExts = ['jpeg', 'png', 'webp', 'gif', 'jp2', 'tiff', 'avif', 'heif', 'raw'];

const createKey = (req) => {
    console.log(`Creating key`)
    let key = ``;
    const { resize, rotate, flip, flop, sharpen, blur } = req.query;
    const fileExtension = req.file.originalname.split(".")[1];

    if (!allowedFileExts.includes(fileExtension)) {
        console.log(`Invalid file format`)
        throw {message: 'File must be an image format!', status: 403};
    }
  
    const image = req.file.buffer;
    const base64_image = image.toString("base64").substring(100, 116);

    key = `${resize}-${rotate}-${flip}-${flop}-${sharpen}-${blur}-${base64_image}.${fileExtension}`
  
    return encodeURI(key);
};

exports.createKey = createKey;