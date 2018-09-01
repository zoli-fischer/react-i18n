import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Service from './Service';
import Repair from './Repair';
import Contact from './Contact';

class Main extends Component {
  render() {
    return (
        <main>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/about' component={About} />
                <Route path='/service' component={Service} />
                <Route path='/repair' component={Repair} />
                <Route path='/contact' component={Contact} />
            </Switch>
        </main>
    );
  }
}


export default Main;
