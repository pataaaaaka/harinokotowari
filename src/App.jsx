import React from 'react';
import KeirakuBomberFull from './KeirakuBomberFull';
import ResponsiveWrapper from './ResponsiveWrapper';
import './App.css';

function App() {
  return (
    <ResponsiveWrapper>
      <div className="App">
        <KeirakuBomberFull />
      </div>
    </ResponsiveWrapper>
  );
}

export default App;
