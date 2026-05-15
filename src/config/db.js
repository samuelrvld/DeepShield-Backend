require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'deepshield_db',
  password: 'admin123', // Masukkan password Anda langsung di sini jika .env bermasalah
  port: 5432,
});

module.exports = pool;