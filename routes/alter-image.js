const express = require('express');
const router = express.Router();

const { alterImage } = require('../controllers/alter-image-controller');
const { getS3Image } = require('../middleware/s3-image-bucket');
const upload = require('../middleware/upload-img');


router.post('/?', upload.single("image_form"), getS3Image)

module.exports = router;