import "./Button.css";

function Button({ label, value, kind = "number", onClick, disabled = false }) {
  return (
    <button
      aria-label={label || value}
      className={`key key-${kind}`}
      disabled={disabled}
      onClick={() => onClick(value)}
      type="button"
    >
      {label || value}
    </button>
  );
}

export default Button;