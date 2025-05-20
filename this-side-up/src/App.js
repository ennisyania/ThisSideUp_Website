
import './App.css';
import Navbar from './component/Navbar';
import './component/Navbar.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <p>
          Test <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
