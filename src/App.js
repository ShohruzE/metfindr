import React from 'react';
import './App.css';

import Navbar from './components/Navbar.js';
import ArtGenerator from './components/artGenerator.js';
import Art from './components/art.js';
import Footer from './components/footer.js';

function App() {
  return (
    <div className="App">
      <Navbar />

      <div className='main'>
        <Art />
        <ArtGenerator />
      </div>
      <Footer />
    </div>
  );
}

export default App;
