const pool = require('../config/db');
const axios = require('axios');
const FormData = require('form-data');

exports.predictImage = async (req, res) => {
  try {
    // 1. Validasi apakah file dikirim dari Front-End
    if (!req.file) {
      return res.status(400).json({ error: "File tidak ditemukan!" });
    }

    // 2. Siapkan FormData untuk meneruskan file gambar ke FastAPI Python
    const formData = new FormData();
    // req.file.buffer diambil karena kita menyimpan upload sementara di memori (RAM)
    formData.append('file', req.file.buffer, req.file.originalname);

    // 3. Tembak server FastAPI Python (DeepShield AI Engine) di port 8000
    // Pastikan server uvicorn kamu di terminal sebelah dalam kondisi tetap menyala
    const pythonResponse = await axios.post('http://127.0.0.1:8000/predict', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000 // Batas waktu tunggu 30 detik jika proses AI di laptop agak berat
    });

    // 4. Ambil data hasil prediksi asli dari model AI milik Crist
    const aiResult = pythonResponse.data; 
    // aiResult berisi: filename, prediction, confidence, probabilities, raw_score

    // 5. Sesuaikan nama file untuk disimpan ke PostgreSQL
    // Jika menggunakan memoryStorage, req.file.filename biasanya undefined, jadi kita pakai req.file.originalname
    const finalFilename = req.file.filename || req.file.originalname;

    // 6. Simpan data asli dari AI ke database PostgreSQL kamu
    const query = `
      INSERT INTO detections (filename, prediction_result, confidence_score) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    
    // Konversi confidence ke format desimal (misal dari 98.5% menjadi 0.9850) agar cocok dengan tipe data database kamu sebelumnya
    const formattedConfidence = (aiResult.confidence / 100).toFixed(4);

    const values = [finalFilename, aiResult.prediction, formattedConfidence];
    const dbRes = await pool.query(query, values);

    // 7. Kembalikan respons sukses ke Front-End dengan data asli database + detail probabilitas AI
    res.status(200).json({
      success: true,
      message: "Analisis DeepShield AI berhasil disinkronisasi ke Database!",
      data: {
        id: dbRes.rows[0].id,
        filename: dbRes.rows[0].filename,
        prediction_result: dbRes.rows[0].prediction_result, // Berisi "Fake" atau "Real" dari model
        confidence_score: dbRes.rows[0].confidence_score,
        created_at: dbRes.rows[0].created_at,
        // Kita lampirkan detail probabilitas tambahan untuk kebutuhan visual grafik di Front-End
        probabilities: aiResult.probabilities 
      }
    });

  } catch (err) {
    console.error("Error pada DeepShield Controller Bridge:", err.message);
    
    // Jika eror disebabkan karena server Python mati atau timeout
    if (err.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        error: "Gagal terhubung ke AI Engine. Pastikan server FastAPI Python di port 8000 sudah dinyalakan!" 
      });
    }

    res.status(500).json({ error: err.message });
  }
};