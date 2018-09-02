import React, { Component } from 'react';
import './Footer.css';
import I18N from './../i18n/I18N';
import { Route, Link } from 'react-router-dom';

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
              <div className="col-md-6 copyright">
                <I18N index="global/Car Service © 2013"></I18N> | <NavItemLink to="/privacy-policy" label="global/Privacy Policy"></NavItemLink>
              </div>
              <div className="col-md-6 text-right languages">
                {this.state.languages.map(function (language, index) {
                  return <a href="" className={window.i18n.language.index === language.index ? 'active' : ''} key={language.index} onClick={() => {window.i18n.switchLanguage(language.index)}}><I18N index={("global/lang-name-" + language.index)}></I18N></a>;
                })}
              </div>
            </div>
          </div>
        </footer>
    );
  }
}

const NavItemLink = ({ label, to, activeOnlyWhenExact, className }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link to={to} className={(typeof className !== undefined ? className : '' ) + ( match ? ' active ' : '' )}><I18N index={label}></I18N></Link>
  )} />
);

export default Footer;
