import logo from './logo.svg';
import './App.css';

import Papa from 'papaparse';
import { useState } from 'react';

function App() {
  const [csvData, setCsvData] = useState([Daily_Crime_Log.csv]);

  const handleData = (results) => {
    setCsvData(results.data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <input
          type="file"
          onChange={(e) => {
            Papa.parse(e.target.files[0], {
              complete: handleData,
              header: true,
            });
          }}
        />
        <ul>
          {csvData.map((row, i) => (
            <li key={i}>{JSON.stringify(row)}</li>
          ))}
        </ul>
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
