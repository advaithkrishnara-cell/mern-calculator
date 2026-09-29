import { useEffect, useState } from "react";
import { requestCalculation, requestHistory } from "../../services/calculatorApi.js";
import Display from "../Display/Display.jsx";
import History from "../History/History.jsx";
import Keypad from "../Keypad/Keypad.jsx";
import "./Calculator.css";

function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStatus, setHistoryStatus] = useState("");

  async function refreshHistory() {
    try {
      const items = await requestHistory();
      setHistory(items);
      setHistoryStatus("");
    } catch (requestError) {
      setHistoryStatus(requestError.message);
    }
  }

  useEffect(() => {
    refreshHistory();
  }, []);

  async function calculate() {
    const submittedExpression = expression.trim();
    if (!submittedExpression || isCalculating) return;

    setError("");
    setIsCalculating(true);
    try {
      const calculation = await requestCalculation(submittedExpression);
      setResult(calculation.result);
      setExpression(calculation.expression);
      await refreshHistory();
    } catch (requestError) {
      setError(requestError.message === "Failed to fetch" ? "Cannot reach the calculator server." : requestError.message);
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  }

  function handleKey(value) {
    setError("");
    if (value === "clear") {
      setExpression("");
      setResult(null);
      return;
    }
    if (value === "delete") {
      setExpression((current) => current.slice(0, -1));
      setResult(null);
      return;
    }
    if (value === "=") {
      calculate();
      return;
    }

    setExpression((current) => {
      if (result !== null && /[0-9.(]/.test(value)) return value;
      if (result !== null && /[+*/^%-]/.test(value)) return `${result}${value}`;
      return current + value;
    });
    setResult(null);
  }

  function handleExpressionChange(value) {
    setExpression(value);
    setResult(null);
    setError("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculate();
    } else if (event.key === "Escape") {
      setExpression("");
      setResult(null);
      setError("");
    }
  }

  return (
    <div className="calculator-layout">
      <section className="calculator-panel" aria-label="Calculator">
        <Display
          error={error}
          expression={expression}
          onExpressionChange={handleExpressionChange}
          onKeyDown={handleKeyDown}
          result={result}
        />
        <Keypad disabled={isCalculating} onKey={handleKey} />
        <p className="keyboard-hint">Type an expression, press Enter to calculate, or Esc to clear.</p>
        {isCalculating && <p className="calculating" role="status">Calculating...</p>}
      </section>
      <History
        items={history}
        onSelect={(value) => {
          setExpression(value);
          setResult(null);
          setError("");
        }}
        status={historyStatus}
      />
    </div>
  );
}

export default Calculator;