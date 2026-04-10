import { useState, useEffect } from 'react'
import './App.css' 
import ItemBarang from './components/ItemBarang'
import FormTambah from './components/FormTambah'

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

  const hapusBarang = (nama) => {
    if (confirm(`Hapus ${nama}?`)) {
      setItems(items.filter(i => i.nama !== nama));
      // Tips: Di dunia nyata, di sini kamu juga harus panggil fetch ke hapus_barang.php
    }
  };

  const itemsFilter = items.filter(item => 
    item.nama.toLowerCase().includes(cari.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🛒 Smart Shopping List</h1>
      
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
        {itemsFilter.map((item, index) => (
          <ItemBarang key={index} item={item} onHapus={hapusBarang} />
        ))}
      </ul>
      
      {itemsFilter.length === 0 && !isLoading && (
        <p style={{textAlign:'center', color:'#999'}}>Tidak ada data di database.</p>
      )}
    </div>
  )
}

export default App