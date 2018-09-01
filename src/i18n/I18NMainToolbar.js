import React, { Component } from 'react';
import './I18NMainToolbar.css';
// eslint-disable-next-line
import * as i18n from './../utils/i18n.js';

class I18NMainToolbar extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            editing: window.i18n.isEditing()
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {

    }

    handleClick() {
        window.i18n.setEditing(!window.i18n.isEditing());
        this.setState({ editing: window.i18n.isEditing() });
    }

    render() {
        return (
            <div className="I18NMainToolbar">
                <a href="javascript:{}" onClick={this.handleClick}>{this.state.editing ? "Enable i18n editing" : "Disable i18n editing"}</a>
            </div>
        );
    }
}

export default I18NMainToolbar;
