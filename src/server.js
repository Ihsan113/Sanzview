const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const app = express();
app.use(express.json());
app.use(cookieParser()); // Menggunakan cookie-parser

// Koneksi ke database MySQL
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'namadatabase', // Sesuaikan dengan nama basis data yang telah Anda buat
});

app.use(cors({ origin: 'https://sanzview-github-io.vercel.app', credentials: true }));

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint signup
app.post('/signup', (req, res) => {
  const { name, username, password } = req.body;

  // Validasi apakah semua data yang diperlukan ada
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Harap lengkapi semua kolom.' });
  }

  // Hash password menggunakan bcrypt sebelum disimpan ke database
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Simpan pengguna ke database
  const insertQuery = 'INSERT INTO users (name, username, password) VALUES (?, ?, ?)';
  dbConnection.query(insertQuery, [name, username, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error saving user to database: ' + err.stack);
      return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }

    return res.status(201).json({ success: true, message: 'Akun berhasil dibuat.' });
  });


// Endpoint login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query database untuk verifikasi pengguna
  const selectQuery = 'SELECT * FROM users WHERE username = ?';
  dbConnection.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error fetching user from database: ' + err.stack);
      return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }

    if (results.length > 0) {
      const user = results[0];
      if (bcrypt.compareSync(password, user.password)) {
        // Set cookie saat pengguna berhasil login
        res.cookie('username', username, { maxAge: 900000, httpOnly: true }); // Cookie akan berakhir dalam 15 menit (900000 milidetik)
        return res.status(200).json({ success: true, user: user, message: 'Login berhasil.' });
      }
    }

    return res.status(401).json({ success: false, message: 'Username atau password salah.' });
  });
});
});
// Endpoint untuk mendapatkan data pengguna dari cookie
app.get('/profile', (req, res) => {
  const username = req.cookies.username; // Mendapatkan nilai cookie

  // Gunakan nilai cookie (username) untuk mendapatkan data pengguna dari database
  // Query database dengan menggunakan nilai cookie (username) untuk mendapatkan data pengguna

  // Kirim data pengguna ke klien
});

app.listen(4000, () => {
  console.log('Server berjalan di port 4000');
});

try {
  // Kode server Anda di sini
} catch (error) {
  console.error('Terjadi kesalahan:', error);
}
