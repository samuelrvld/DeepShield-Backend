const express = require('express');
const router = express.Router();
const multer = require('multer');

// 1. Import controller bawaan untuk deteksi gambar yang sudah ada
const { predictImage } = require('../controllers/predictController');

// 2. Import 2 controller baru yang barusan kamu buat
const { googleLogin } = require('../controllers/authController');
const { downloadReport } = require('../controllers/reportController');

// Konfigurasi Multer Memory Storage (Saran Mentor: Hemat Space Harddisk Server)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Batasi maksimal file 5MB agar aman
});

// ========================================================
// REKAP DAFTAR ENDPOINT API DEEPSHIELD
// ========================================================

// 🛑 Endpoint Deteksi Gambar (Lama - Ditembak dari React)
// Parameter 'image' adalah nama field Form-Data yang dikirim Mona
router.post('/scan-deepfake', upload.single('image'), predictImage);

// 🔑 TUGAS 1: Endpoint Autentikasi Google Login (Baru)
// Mona mengirim { idToken } lewat body JSON
router.post('/auth/google', googleLogin);

// 📄 TUGAS 2: Endpoint Download Report Berdasarkan ID (Baru)
// Menarik data dari PostgreSQL dan langsung di-stream jadi file unduhan .txt
router.get('/detections/:id/download', downloadReport);

module.exports = router;