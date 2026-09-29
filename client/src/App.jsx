import Calculator from "./components/Calculator/Calculator.jsx";
import "./App.css";

function App() {
  return (
    <main className="page-shell">
      <header className="masthead">
        <a className="brand" href="/" aria-label="Little Sums home">
          <span className="brand-mark" aria-hidden="true">÷</span>
          <span>little<span className="brand-light"> sums</span></span>
        </a>
        <span className="header-note">A SMALL SPACE TO WORK IT OUT</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <div>
          <p className="eyebrow"><span className="eyebrow-mark" /> THE ANSWER IS IN THE WORK</p>
          <h1 id="page-title">Make sense<br />of <span>the numbers.</span></h1>
        </div>
        <p className="intro-aside">A clear expression.<br />A little less mental clutter.</p>
        <span className="intro-orbit" aria-hidden="true"><i>+</i><i>×</i><i>−</i></span>
      </section>

      <Calculator />

      <footer className="page-footer">
        <span>BUILT FOR THINKING</span>
        <span>REACT <b>•</b> EXPRESS <b>•</b> MONGODB</span>
      </footer>
    </main>
  );
}

export default App;
