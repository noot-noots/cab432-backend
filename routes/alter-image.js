const express = require('express');
const router = express.Router();

const { alterImage } = require('../controllers/alter-image-controller');
const upload = require('../middleware/upload-img');


router.post('/?', upload.single("image_form"), alterImage)

module.exports = router;