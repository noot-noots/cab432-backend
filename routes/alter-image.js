const express = require('express');
const router = express.Router();

const { alterImage } = require('../controllers/alter-image-controller');
const { getCacheImage } = require('../middleware/ec-image-cache');
const { getS3Image } = require('../middleware/s3-image-bucket');
const upload = require('../middleware/upload-img');


router.post('/?', upload.single("image_form"), getCacheImage, getS3Image, alterImage)

router.post('/store?', upload.single("image_form"), getS3Image)

module.exports = router;