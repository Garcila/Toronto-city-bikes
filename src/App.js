import React, { Component } from 'react';
import logo from './bike.png';
import './App.css';

import Map from './Map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">City Bikes</h1>
        </header>
        <Map className='Map'/>
      </div>
    );
  }
}

export default App;
