# 🛒 Smart Shopping List (Full Stack Project)

Aplikasi daftar belanja interaktif yang dibangun dengan arsitektur **Full Stack**. Proyek ini menghubungkan antarmuka modern (React) dengan server backend (PHP) dan penyimpanan data permanen (MySQL).

## 🚀 Fitur Utama
* **Real-time Synchronization**: Data di layar selalu sinkron dengan database MySQL tanpa perlu refresh manual.
* **Persistent Storage**: Menggunakan database untuk menyimpan data secara permanen.
* **Instant Search**: Fitur pencarian barang secara langsung (filter).
* **Responsive Design**: Tampilan bersih dan nyaman digunakan di berbagai perangkat.

## 🛠️ Teknologi yang Digunakan

### Frontend
* **React.js (Vite)**: Library utama untuk membangun antarmuka.
* **Hooks (`useState`, `useEffect`)**: Untuk manajemen state dan siklus hidup komponen.
* **Fetch API**: Digunakan untuk komunikasi data dengan server backend.
* **CSS Modules**: Untuk styling yang rapi dan terisolasi.

### Backend & Database
* **PHP**: Sebagai REST API Gateway untuk memproses permintaan dari React.
* **MySQL**: Sebagai sistem manajemen database relasional.
* **XAMPP**: Sebagai lingkungan server lokal (Apache & MySQL).

## 📂 Struktur Proyek
```text
/src
  ├── /components
  │     ├── FormTambah.jsx    # Komponen input barang
  │     └── ItemBarang.jsx    # Komponen baris item
  ├── App.jsx                 # Logika utama (Sinkronisasi API)
  └── App.css                 # Styling aplikasi
/api (XAMPP htdocs)
  ├── ambil_barang.php        # Endpoint GET data dari MySQL
  └── tambah_barang.php       # Endpoint POST data ke MySQL