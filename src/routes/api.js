const express = require('express');
const router = express.Router();
const multer = require('multer');
const predictController = require('../controllers/predictController');

const upload = multer({ dest: 'uploads/' });

router.post('/predict', upload.single('image'), predictController.predictImage);

module.exports = router;