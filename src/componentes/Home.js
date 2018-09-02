import React, { Component } from 'react';
import I18N from './../i18n/I18N';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 mt-5 mb-5">
            <I18N html i18nid="home/top-text"></I18N>
          </div>
        </div>
        <div className="row">
          <HomeBoxItem to="/service" i18nid="home/Car repair" src={window.location.origin + '/assets/home-box1.jpg'}></HomeBoxItem>
          <HomeBoxItem to="/service" i18nid="home/Car wash" src={window.location.origin + '/assets/home-box2.jpg'}></HomeBoxItem>
          <HomeBoxItem to="/service" i18nid="home/Auto diagnostics" src={window.location.origin + '/assets/home-box3.jpg'}></HomeBoxItem>
        </div>
      </div>
    );
  }
}

const HomeBoxItem = ({ i18nid, to, src }) => {
  return (
    <div className="col-md-4">
      <a href={to}>
        <img src={src} alt="" />
        <strong><I18N i18nid={i18nid}></I18N></strong>
      </a>
    </div>
  )
};



export default Home;
