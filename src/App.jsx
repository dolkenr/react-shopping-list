import { useState, useEffect } from 'react'
import './App.css' 
import ItemBarang from './components/ItemBarang'
import FormTambah from './components/FormTambah'

function App() {
  const [cari, setCari] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State awal (LocalStorage)
  const [items, setItems] = useState(() => {
    const dataTersimpan = localStorage.getItem("DAFTAR_BELANJA");
    return dataTersimpan ? JSON.parse(dataTersimpan) : [
      { nama: "Kopi", harga: 5000 },
      { nama: "Roti", harga: 12000 }
    ];
  });

  // Pengawas LocalStorage
  useEffect(() => {
    localStorage.setItem("DAFTAR_BELANJA", JSON.stringify(items));
  }, [items]);

  // Logika Ambil API
  const ambilDataAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const data = await response.json();
      
      const dataBaru = data.map(item => ({
        nama: item.title.split(' ')[0], 
        harga: Math.floor(Math.random() * 100000) + 10000
      }));
  
      setItems([...items, ...dataBaru]);
    } catch (error) {
      alert("Gagal ambil data!");
    } finally {
      setIsLoading(false);
    }
  };

  const tambahBarang = (nama, harga) => {
    setItems([...items, { nama, harga: parseInt(harga) }]);
  };

  const hapusBarang = (nama) => {
    if (confirm(`Hapus ${nama}?`)) {
      setItems(items.filter(i => i.nama !== nama));
    }
  };

  const itemsFilter = items.filter(item => 
    item.nama.toLowerCase().includes(cari.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🛒 Smart Shopping List</h1>
      
      <FormTambah onTambah={tambahBarang} />

      {/* PINDAHKAN TOMBOLNYA KE SINI (DI DALAM RETURN) */}
      <button 
        onClick={ambilDataAPI} 
        className="btn-tambah" 
        style={{ background: '#2196F3', marginTop: '10px', width: '100%', marginBottom: '20px' }}
        disabled={isLoading}
      >
        {isLoading ? "⏳ Loading..." : "📥 Import Data dari Server"}
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
      
      {itemsFilter.length === 0 && <p style={{textAlign:'center', color:'#999'}}>Tidak ada data.</p>}
    </div>
  )
}

export default App