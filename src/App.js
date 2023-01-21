import React from 'react';
import './App.css';

import Navbar from './components/Navbar.js';
import Art from './components/art.js';
import Footer from './components/footer.js';

function App() {
  return (
    <div className="App">
      <Navbar />

      <div className='main'>
        <Art />
      </div>
      <Footer />
    </div>
  );
}

export default App;
