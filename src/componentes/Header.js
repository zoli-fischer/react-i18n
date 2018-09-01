import React, { Component } from 'react';
import './Header.css';
import { Route, Link } from 'react-router-dom';

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
                                <NavItemLink to="/" activeOnlyWhenExact={true} label="Home" className="m1"></NavItemLink>
                                <NavItemLink to="/about" label="About" className="m2"></NavItemLink>
                                <NavItemLink to="/service" label="Services" className="m3"></NavItemLink>
                                <NavItemLink to="/repair" label="Repair" className="m4"></NavItemLink>
                                <NavItemLink to="/contact" label="Contact" className="m5"></NavItemLink>
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
            <Link to={to} className={className}>{label}</Link>
        </li>
    )} />
);

export default Header;
