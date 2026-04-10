import { useState } from 'react';

function FormTambah({ onTambah }) {
  const [namaInput, setNamaInput] = useState("");
  const [hargaInput, setHargaInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaInput || !hargaInput) return;
    
    // Kirim data ke "Ayah" (App.jsx)
    onTambah(namaInput, hargaInput);

    // Reset input
    setNamaInput("");
    setHargaInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="form-tambah">
      <input 
        type="text" placeholder="Nama..." 
        value={namaInput} onChange={(e) => setNamaInput(e.target.value)} 
      />
      <input 
        type="number" placeholder="Harga..." 
        value={hargaInput} onChange={(e) => setHargaInput(e.target.value)} 
      />
      <button type="submit" className="btn-tambah">Tambah</button>
    </form>
  );
}

export default FormTambah;