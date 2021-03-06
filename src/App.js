import React, { Component } from 'react';
import './App.css';
import i18n from './i18n/utils/i18n';
import I18NMainToolbar from './i18n/I18NMainToolbar';
import Main from './componentes/Main';
import Footer from './componentes/Footer';
import Header from './componentes/Header';


class App extends Component {
  constructor(props) {
    super(props);
    window.i18n = new i18n();
  }

  render() {
    return (
      <div>
        <I18NMainToolbar />
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;
