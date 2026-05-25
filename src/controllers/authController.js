const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const pool = require('../config/db'); // Sesuaikan dengan path database kamu

const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  // 1. Validasi awal: Pastikan token dikirim oleh Front-End
  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'ID Token Google diperlukan.'
    });
  }

  try {
    let ticket;
    
    try {
      // 2. Verifikasi token ke Google SDK
      ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      // 💡 JALUR AMAN: Menangkap error jika token bukan JWT (spt token dummy kita) atau expired
      console.log('Google Auth Verification Error:', verifyError.message);
      return res.status(401).json({
        success: false,
        message: 'Token Google tidak valid atau salah format.'
      });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // 3. Logika Database PostgreSQL (Cari atau Buat User Baru)
    let userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    
    if (userResult.rows.length === 0) {
      const insertQuery = 'INSERT INTO users (google_id, email, name, picture) VALUES ($1, $2, $3, $4) RETURNING *';
      userResult = await pool.query(insertQuery, [googleId, email, name, picture]);
    }

    const user = userResult.rows[0];

    // 4. Kirim respons sukses ke React (Mona)
    return res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });

  } catch (error) {
    console.error('Google Login Internal Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses login pada server.'
    });
  }
};

module.exports = { googleLogin };