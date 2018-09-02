import React, { Component } from 'react';
import './I18NMainToolbar.css';

class I18NMainToolbar extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            editing: window.i18n.isEditing()
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleEditingChange = this.handleEditingChange.bind(this);

        window.i18n.on('editing-change', this.handleEditingChange);
    }

    handleEditingChange(event,value) {
        this.setState({ editing: value });
    }

    handleClick(event) {
        event.stopPropagation();
        event.preventDefault();
        window.i18n.setEditing(!window.i18n.isEditing());
    }

    render() {
        return (
            <div className={'I18NMainToolbar' + (this.state.editing ? ' editing' : '' )}>
                <a href="" onClick={this.handleClick}>{!this.state.editing ? "Enable i18n editing" : "Disable i18n editing"}</a>
            </div>
        );
    }
}

export default I18NMainToolbar;
