const express = require('express');
const router = express.Router();
const axios = require('axios'); // Pastikan sudah install axios: npm install axios
const multer = require('multer'); // Untuk menangani upload file
const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan-deepfake', upload.single('file'), async (req, res) => {
    try {
        // Mengirim file ke server Python (FastAPI)
        const response = await axios.post(`${process.env.AI_SERVER_URL}/predict`, req.file.buffer, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                ...req.headers // Meneruskan header file
            }
        });

        // Mengirim balik hasil dari AI ke Front-end (Mona)
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Gagal terhubung ke AI Engine" });
    }
});

module.exports = router;