import React, { Component } from 'react';
import './Header.css';
import { Route, Link } from 'react-router-dom';
import I18N from './../i18n/I18N';

class Header extends Component {
  render() {
    return (
        <header className="Header">
            <div className="container">
                <div className="row">
                    <div className="col-sm-4">
                        <Link to="/"><img src={window.location.origin + '/assets/logo.png'} alt="" /></Link>
                    </div>
                    <div className="col-sm-4">
                        <nav className="Nav">
                            <ul>
                                <NavItemLink to="/" activeOnlyWhenExact={true} label="menu/Home" className="m1"></NavItemLink>
                                <NavItemLink to="/about" label="menu/About" className="m2"></NavItemLink>
                                <NavItemLink to="/service" label="menu/Services" className="m3"></NavItemLink>
                                <NavItemLink to="/repair" label="menu/Repair" className="m4"></NavItemLink>
                                <NavItemLink to="/contact" label="menu/Contact" className="m5"></NavItemLink>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
  }
}

const NavItemLink = ({ label, to, activeOnlyWhenExact, className }) => (
    <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
        <li className={match ? 'active' : ''}>
            <Link to={to} className={className}><I18N html i18nid={label}></I18N></Link>
        </li>
    )} />
);

export default Header;
