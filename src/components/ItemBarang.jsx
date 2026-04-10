// src/components/ItemBarang.jsx
function ItemBarang({ item, onHapus }) {
  return (
    <li className="item-row">
      <span>{item.nama} - <b>Rp{item.harga.toLocaleString()}</b></span>
      <button onClick={onHapus} className="btn-hapus">Hapus</button>
    </li>
  );
}
export default ItemBarang;