import React, { Component } from 'react';
// eslint-disable-next-line
import * as i18n from './../utils/i18n.js';

class I18N extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            translation: ''
        };
    }
    
    callback(data) {
        this.setState({ translation: data });
    }

    componentDidMount() {
        window.i18n.words(this.props.i18nid, this.callback, this);
    }

    render() {
        if ( this.props.html ) {
            return <span data-source="i18n" dangerouslySetInnerHTML={{ __html: this.state.translation }}></span>
        } else {
            return <span data-source="i18n">{this.state.translation}</span>
        }
    }
}

export default I18N;
