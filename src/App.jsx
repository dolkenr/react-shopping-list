import { useState, useEffect } from 'react'
import './App.css' 
import ItemBarang from './components/ItemBarang'
import FormTambah from './components/FormTambah'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabaseClient' 

function App() {
  const [cari, setCari] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);

  // Cek sesi user saat aplikasi load
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // 1. AMBIL DATA (Hanya milik user yang login)
  const ambilDataSupabase = async () => {
    if (!user) return; // Jangan ambil data jika belum login
    setIsLoading(true);
    const { data, error } = await supabase
      .from('barang')
      .select('*')
      .eq('user_id', user.id) // Filter: Ambil data milik saya saja
      .order('id', { ascending: false });

    if (error) console.error("Error:", error.message);
    else setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) ambilDataSupabase();
    else setItems([]); // Kosongkan list jika logout
  }, [user]);

  // 2. TAMBAH DATA (Sertakan user_id)
  const tambahBarang = async (nama, harga) => {
    const { error } = await supabase
      .from('barang')
      .insert([{ 
        nama, 
        harga: parseInt(harga), 
        user_id: user.id // Tag data ini milik siapa
      }]);

    if (error) alert(error.message);
    else ambilDataSupabase();
  };

  const hapusBarang = async (id, nama) => {
    if (confirm(`Hapus ${nama}?`)) {
      const { error } = await supabase.from('barang').delete().eq('id', id);
      if (error) alert(error.message);
      else setItems(items.filter(i => i.id !== id));
    }
  };

  const loginGampang = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };
  
  const daftarGampang = async () => {
    const email = prompt("Daftar Email:");
    const password = prompt("Daftar Password:");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Cek email konfirmasi atau langsung login!");
  };

  const itemsFilter = items.filter(item => 
    item.nama.toLowerCase().includes(cari.toLowerCase())
  );

  const totalHarga = itemsFilter.reduce((total, item) => total + item.harga, 0);

  // TAMPILAN
  return (
    <div className={`container ${isDark ? 'dark-theme' : ''}`}>
      {!user ? (
        <div className="login-box" style={{ textAlign: 'center', padding: '50px' }}>
          <h1>🔐 Cloud List</h1>
          <p>Masuk untuk simpan belanjaanmu di cloud</p>
          <button onClick={loginGampang} className="btn-tambah">Login</button>
          <br />
          <button onClick={daftarGampang} className="btn-theme" style={{ position: 'static', marginTop: '10px' }}>Daftar</button>
        </div>
      ) : (
        <>
          <div className="user-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <small>📧 {user.email}</small>
            <button onClick={() => supabase.auth.signOut()} className="btn-hapus" style={{ padding: '5px 10px' }}>Logout</button>
          </div>

          <button onClick={() => setIsDark(!isDark)} className="btn-theme">
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>

          <h1>🛒 My Shopping List</h1>
          
          <FormTambah onTambah={tambahBarang} />

          <input 
            type="text" placeholder="Cari barang..." className="search-bar"
            value={cari} onChange={(e) => setCari(e.target.value)} 
          />

          <ul className="item-list">
            {isLoading ? <p>Memuat data...</p> : (
              <AnimatePresence>
                {itemsFilter.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <ItemBarang item={item} onHapus={() => hapusBarang(item.id, item.nama)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </ul>

          <div className="total-box">
            Total Belanja: <span>Rp{totalHarga.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default App