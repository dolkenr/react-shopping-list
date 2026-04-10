// Kita menerima data (item) dan fungsi (onHapus) lewat PROPS
function ItemBarang({ item, onHapus }) {
    return (
      <li className="item-row">
        <span>{item.nama} - <b>Rp{item.harga.toLocaleString()}</b></span>
        <button onClick={() => onHapus(item.nama)} className="btn-hapus">
          Hapus
        </button>
      </li>
    );
  }
  
  export default ItemBarang;