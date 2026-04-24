const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Konfigurasi Database
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revist_inventory'
});

db.connect((err) => {
    if (err) {
        console.error('DATABASE ERROR:', err.message);
    } else {
        console.log('BERHASIL: Terhubung ke MySQL');
    }
});

// --- RUTE API ---

app.get('/', (req, res) => {
    res.send('Server REVIST-OS Berjalan!');
});

// 1. Ambil Semua Produk
app.get('/api/products', (req, res) => {
    const query = "SELECT * FROM products";
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

// 2. Update Stok & Catat Transaksi (Gabungan)
app.put('/api/products/:id/stock', (req, res) => {
    const { id } = req.params;
    const { new_stock, operator_name, action_type, diff } = req.body;

    const sqlUpdate = "UPDATE products SET current_stock = ? WHERE id = ?";
    db.query(sqlUpdate, [new_stock, id], (err) => {
        if (err) return res.status(500).json(err);

        // Jika ada data transaksi, masukkan ke log
        if (operator_name && action_type) {
            const sqlLog = "INSERT INTO transactions (product_id, operator_name, action_type, quantity) VALUES (?, ?, ?, ?)";
            db.query(sqlLog, [id, operator_name, action_type, diff], (errLog) => {
                if (errLog) console.error("Gagal simpan log:", errLog);
                return res.json({ message: "Stok & Log berhasil diupdate!" });
            });
        } else {
            res.json({ message: "Stok berhasil diperbarui!" });
        }
    });
});

// 3. Tambah Produk Baru
app.post('/api/products', (req, res) => {
    const { sku, name, category_id, current_stock, min_threshold } = req.body;
    const query = "INSERT INTO products (sku, name, category_id, current_stock, min_threshold) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [sku, name, category_id, current_stock, min_threshold], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Produk berhasil ditambah!", id: result.insertId });
    });
});

// 4. Update Profil User (Menyimpan Gambar sebagai Teks Base64)
app.put('/api/user/profile', (req, res) => {
    const { email, brand_name, logo_url } = req.body;
    const sql = "UPDATE users SET brand_name = ?, logo_url = ? WHERE email = ?";
    db.query(sql, [brand_name, logo_url, email], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Profil dan Logo berhasil disimpan langsung ke Database!" });
    });
});

// 5. Ambil Riwayat Transaksi
app.get('/api/transactions', (req, res) => {
    const sql = `
        SELECT t.*, p.name as product_name 
        FROM transactions t 
        JOIN products p ON t.product_id = p.id 
        ORDER BY t.created_at DESC LIMIT 10
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 6. Ambil Notes berdasarkan Operator (Email)
app.get('/api/notes/:email', (req, res) => {
    const { email } = req.params;
    const sql = "SELECT * FROM notes WHERE operator_name = ? ORDER BY created_at DESC";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 7. Simpan Note Baru
app.post('/api/notes', (req, res) => {
    const { operator_name, title, content, tag } = req.body;
    const sql = "INSERT INTO notes (operator_name, title, content, tag) VALUES (?, ?, ?, ?)";
    db.query(sql, [operator_name, title, content, tag], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Note saved!" });
    });
});

// 8. Register Pengguna Baru
app.post('/api/register', (req, res) => {
    const { email, password, brand_name } = req.body;
    const checkUser = "SELECT * FROM users WHERE email = ?";
    db.query(checkUser, [email], (err, result) => {
        if (result.length > 0) return res.status(400).json({ message: "Email sudah terdaftar!" });

        const sql = "INSERT INTO users (email, password, brand_name) VALUES (?, ?, ?)";
        db.query(sql, [email, password, brand_name || 'REVIST'], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Akun berhasil dibuat! Silakan Login." });
        });
    });
});

// 9. Login Pengguna
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT email, brand_name, logo_url FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.json({ success: false, message: "Login gagal! Periksa Email & Password." });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SERVER AKTIF: Buka http://localhost:${PORT}`);
});