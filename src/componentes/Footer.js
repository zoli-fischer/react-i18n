import React, { Component } from 'react';
import './Footer.css';
import I18N from './../i18n/I18N';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: []
    };

    this.handleLanguagesLoaded = this.handleLanguagesLoaded.bind(this);
    window.i18n.on('languages-loaded', this.handleLanguagesLoaded);
  }

  handleLanguagesLoaded(event, languages) {
    this.setState({languages: languages});
  }

  render() {
    return (
        <footer className="Footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <I18N index="global/Car Service © 2013"></I18N> | <a href=""><I18N index="global/Privacy Policy"></I18N></a>
              </div>
              <div className="col-md-6 text-right languages">
                {this.state.languages.map(function (language, index) {
                  return <a href="" key={language.index} onClick={() => {window.i18n.switchLanguage(language.index)}}><I18N index={("global/lang-name-" + language.index)}></I18N></a>;
                })}
              </div>
            </div>
          </div>
        </footer>
    );
  }
}

export default Footer;
