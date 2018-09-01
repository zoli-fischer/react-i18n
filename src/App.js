import React, { Component } from 'react';
import './App.css';
import I18NMainToolbar from './i18n/I18NMainToolbar';
import Main from './componentes/Main';
import Header from './componentes/Header';

class App extends Component {
  render() {
    return (
      <div>
        <I18NMainToolbar />
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
