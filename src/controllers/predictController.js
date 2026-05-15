const pool = require('../config/db');

exports.predictImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File tidak ditemukan!" });

    // Simulasi hasil AI untuk demo malam ini
    const label = Math.random() > 0.5 ? 'Deepfake' : 'Asli';
    const confidence = (0.85 + Math.random() * 0.1).toFixed(4);

    // Simpan data ke database agar ada bukti log
    const query = 'INSERT INTO detections (filename, prediction_result, confidence_score) VALUES ($1, $2, $3) RETURNING *';
    const values = [req.file.filename, label, confidence];
    const dbRes = await pool.query(query, values);

    res.status(200).json({
      message: "Analisis dummy berhasil",
      data: dbRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};