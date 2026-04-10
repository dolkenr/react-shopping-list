import { useState, useEffect } from 'react'
import './App.css' 
import ItemBarang from './components/ItemBarang'
import FormTambah from './components/FormTambah'
import { motion, AnimatePresence } from 'framer-motion'
// Import koneksi supabase
import { supabase } from './supabaseClient' 

function App() {
  const [cari, setCari] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [isDark, setIsDark] = useState(false);

  // 1. AMBIL DATA (Sangat Simple!)
  const ambilDataSupabase = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('barang')
      .select('*')
      .order('id', { ascending: false }); // Urutkan dari yang terbaru

    if (error) {
      console.error("Gagal ambil data:", error.message);
    } else {
      setItems(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    ambilDataSupabase();
  }, []);

  // 2. TAMBAH DATA (Tanpa JSON.stringify!)
  const tambahBarang = async (nama, harga) => {
    const { error } = await supabase
      .from('barang')
      .insert([{ nama, harga: parseInt(harga) }]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      ambilDataSupabase(); // Langsung sinkronkan layar
    }
  };

  // 3. HAPUS DATA (Permanen di Cloud!)
  const hapusBarang = async (id, nama) => {
    if (confirm(`Hapus ${nama} secara permanen?`)) {
      const { error } = await supabase
        .from('barang')
        .delete()
        .eq('id', id); // Hapus berdasarkan ID unik

      if (error) {
        alert("Gagal hapus: " + error.message);
      } else {
        setItems(items.filter(i => i.id !== id));
      }
    }
  };

  const itemsFilter = items.filter(item => 
    item.nama.toLowerCase().includes(cari.toLowerCase())
  );

  const totalHarga = itemsFilter.reduce((total, item) => total + item.harga, 0);

  return (
    <div className={`container ${isDark ? 'dark-theme' : ''}`}>
      <button onClick={() => setIsDark(!isDark)} className="btn-theme">
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>

      <h1>🛒 Cloud Shopping List</h1>
      
      <FormTambah onTambah={tambahBarang} />

      <input 
        type="text" placeholder="Cari barang..." className="search-bar"
        value={cari} onChange={(e) => setCari(e.target.value)} 
      />

      <ul className="item-list">
        <AnimatePresence>
          {itemsFilter.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Kirim ID juga agar hapus berfungsi tepat */}
              <ItemBarang item={item} onHapus={() => hapusBarang(item.id, item.nama)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </ul>

      <div className="total-box">
        Total Belanja: <span>Rp{totalHarga.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default App