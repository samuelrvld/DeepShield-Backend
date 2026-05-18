const express = require('express');
const router = express.Router();
const multer = require('multer');
const { predictImage } = require('../controllers/predictController');

// Menggunakan memoryStorage agar file tidak menumpuk dan mengotori harddisk laptop kamu
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint ini yang nantinya akan ditembak dari React Front-End
// Parameter 'image' adalah nama field Form-Data yang wajib dikirim dari React
router.post('/scan-deepfake', upload.single('image'), predictImage);

module.exports = router;