import "./History.css";

function History({ items, status, onSelect }) {
  return (
    <section className="history" aria-labelledby="history-title">
      <div className="history-heading">
        <div>
          <p className="eyebrow">RECENT WORK</p>
          <h2 id="history-title">History</h2>
        </div>
        <span className="history-count">{items.length}</span>
      </div>
      {status && <p className="history-note">{status}</p>}
      {!status && items.length === 0 && <p className="history-note">Your calculations will appear here.</p>}
      <ol className="history-list">
        {items.map((item, index) => (
          <li key={item._id || `${item.expression}-${item.createdAt || index}`}>
            <button className="history-entry" onClick={() => onSelect(item.expression)} type="button">
              <span>{item.expression}</span>
              <strong>{String(item.result)}</strong>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default History;