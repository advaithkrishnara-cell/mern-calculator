import Button from "../Button/Button.jsx";
import "./Keypad.css";

const keys = [
  { label: "Clear", value: "clear", kind: "utility" },
  { label: "Delete", value: "delete", kind: "utility" },
  { value: "(", kind: "operator" },
  { value: ")", kind: "operator" },
  { value: "7" }, { value: "8" }, { value: "9" }, { value: "/", label: "÷", kind: "operator" },
  { value: "4" }, { value: "5" }, { value: "6" }, { value: "*", label: "×", kind: "operator" },
  { value: "1" }, { value: "2" }, { value: "3" }, { value: "-", label: "−", kind: "operator" },
  { value: "0" }, { value: "." }, { value: "%", kind: "operator" }, { value: "+", kind: "operator" },
  { value: "^", label: "xʸ", kind: "operator" }, { value: "=", kind: "equals" }
];

function Keypad({ onKey, disabled }) {
  return (
    <div className="keypad" aria-label="Calculator keypad">
      {keys.map((key) => (
        <Button key={key.value} {...key} disabled={disabled} onClick={onKey} />
      ))}
    </div>
  );
}

export default Keypad;