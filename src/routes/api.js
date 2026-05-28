const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Import controller yang sudah kamu buat sebelumnya
const { predictImage } = require('../controllers/predictController');
const { googleLogin } = require('../controllers/authController');
const { downloadReport } = require('../controllers/reportController');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// 1. Endpoint Deteksi (AI Engine Proxy)
// Ini adalah jembatan ke FastAPI (8000)
router.post('/scan-deepfake', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "File tidak ditemukan" });

    try {
        const form = new FormData();
        form.append('file', req.file.buffer, { filename: req.file.originalname });

        const response = await axios.post(`${process.env.AI_SERVER_URL}/predict`, form, {
            headers: { ...form.getHeaders() }
        });
        res.json(response.data);
    } catch (error) {
        console.error("AI Proxy Error:", error.message);
        res.status(500).json({ error: "Gagal terhubung ke AI Engine" });
    }
});

// 2. Endpoint Auth & Report (Controller Bawaanmu)
router.post('/auth/google', googleLogin);
router.get('/detections/:id/download', downloadReport);

module.exports = router;