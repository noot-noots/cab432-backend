const express = require('express');
const { alterImage } = require('../controllers/alter-image-controller');
const router = express.Router();

router.post('/?', alterImage)

module.exports = router;