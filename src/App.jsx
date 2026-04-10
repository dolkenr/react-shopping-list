import { useState, useEffect } from 'react'
import './App.css' 
import ItemBarang from './components/ItemBarang'
import FormTambah from './components/FormTambah'
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [cari, setCari] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]); // Mulai dengan array kosong

  // 1. EFEK OTOMATIS: Ambil data dari MySQL setiap kali aplikasi dibuka
  useEffect(() => {
    ambilDataAPI();
  }, []); 

  // 2. FUNGSI AMBIL (GET): Mengambil data segar dan menimpa data lama
  const ambilDataAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/api/ambil_barang.php');
      if (!response.ok) throw new Error("Gagal konek server");

      const dataSegar = await response.json();
      
      // PERBAIKAN: Gunakan dataSegar langsung (timpa, jangan tumpuk)
      setItems(dataSegar); 
      
    } catch (error) {
      console.error("Error API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. FUNGSI TAMBAH (POST): Simpan ke MySQL lalu panggil fungsi ambil data lagi
  const tambahBarang = async (nama, harga) => {
    const baru = { nama, harga: parseInt(harga) };
    try {
      const resp = await fetch('http://localhost/api/tambah_barang.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baru),
      });
      
      const hasil = await resp.json();
      if (hasil.status === "success") {
        // SINKRONISASI REAL-TIME: Panggil ambilDataAPI agar layar update otomatis
        ambilDataAPI(); 
      }
    } catch (err) {
      alert("Gagal simpan ke database!");
    }
  };

  const hapusBarang = async (nama) => {
    if (confirm(`Hapus ${nama} secara permanen dari database?`)) {
      try {
        // 1. Kirim perintah hapus ke MySQL via PHP
        const resp = await fetch('http://localhost/api/hapus_barang.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama: nama }),
        });
  
        const hasil = await resp.json();
  
        if (hasil.status === "success") {
          // 2. Jika sukses di database, baru hapus dari layar
          setItems(items.filter(i => i.nama !== nama));
          console.log("Terhapus permanen!");
        } else {
          alert("Gagal menghapus di server");
        }
      } catch (err) {
        console.error("Koneksi error:", err);
        alert("Cek XAMPP kamu!");
      }
    }
  };

  const itemsFilter = items.filter(item => 
    item.nama.toLowerCase().includes(cari.toLowerCase())
  );

  const totalHarga = itemsFilter.reduce((total, item) => total + item.harga, 0);
  const [isDark, setIsDark] = useState(false);

  return (
    // Bungkus div utama dengan class dinamis
    <div className={`container ${isDark ? 'dark-theme' : ''}`}>
      <h1>🛒 Smart Shopping List</h1>
      
      <button onClick={() => setIsDark(!isDark)} className="btn-theme">
        {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <FormTambah onTambah={tambahBarang} />

      <button 
        onClick={ambilDataAPI} 
        className="btn-tambah" 
        style={{ background: '#2196F3', marginTop: '10px', width: '100%', marginBottom: '20px' }}
        disabled={isLoading}
      >
        {isLoading ? "⏳ Menghubungkan..." : "🔄 Sinkronkan Database"}
      </button>

      <input 
        type="text" placeholder="Cari barang..." className="search-bar"
        value={cari} onChange={(e) => setCari(e.target.value)} 
      />

      <ul className="item-list">
        <AnimatePresence>
          {itemsFilter.map((item, index) => (
            <motion.div
              key={item.id || index} // Pastikan key unik
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ItemBarang item={item} onHapus={hapusBarang} />
            </motion.div>
          ))}
        </AnimatePresence>
      </ul>

      <h3>Total Belanja: <span>Rp{totalHarga.toLocaleString()}</span></h3>
      
      {itemsFilter.length === 0 && !isLoading && (
        <p style={{textAlign:'center', color:'#999'}}>Tidak ada data di database.</p>
      )}
    </div>
  )
}

export default App