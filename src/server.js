const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Untuk hashing kata sandi
const app = express();

app.use(express.json()); // Middleware untuk meng-handle JSON data

// Database sementara (simulasi)
const users = [];

// Pengaturan CORS untuk mengizinkan permintaan dari domain GitHub Pages
const corsOptions = {
  origin: 'https://sanzview-github-io.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.post('/signup', (req, res) => {
  const { username, password, name } = req.body;

  // Validasi input
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Harap lengkapi semua field.' });
  }

  // Cek apakah username sudah ada
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username sudah digunakan.' });
  }

  // Hash kata sandi sebelum disimpan
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { username, password: hashedPassword, name, coins: 0 };
  users.push(newUser);

  return res.status(201).json({ message: 'Akun berhasil dibuat.' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    return res.status(200).json({ success: true, user, message: 'Login berhasil.' });
  } else {
    return res.status(401).json({ success: false, message: 'Username atau password salah.' });
  }
});



try {
  // Kode server Anda di sini
} catch (error) {
  console.error('Terjadi kesalahan:', error);
}
