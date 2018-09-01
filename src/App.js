import React, { Component } from 'react';
import './App.css';
import Main from './componentes/Main';
import Header from './componentes/Header';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
