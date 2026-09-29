import "./Display.css";

function Display({ expression, result, error, onExpressionChange, onKeyDown }) {
  return (
    <div className="display" aria-live="polite">
      <label className="display-label" htmlFor="expression">EXPRESSION</label>
      <input
        autoComplete="off"
        id="expression"
        inputMode="decimal"
        onChange={(event) => onExpressionChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="0"
        spellCheck="false"
        value={expression}
      />
      <div className={`result-line${error ? " has-error" : ""}`}>
        <span>{error || (result === null ? "Ready when you are" : "RESULT")}</span>
        {!error && result !== null && <output>{String(result)}</output>}
      </div>
    </div>
  );
}

export default Display;