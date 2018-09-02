import React, { Component } from 'react';
import './I18N.css';

class I18N extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translation: '&nbsp;',
            editingMode: false,
            editing: false
        };

        this.callback = this.callback.bind(this);
        window.i18n._(this.props.i18nid).then(this.callback);

        this.handleEditingChange = this.handleEditingChange.bind(this);
        window.i18n.on('editing-change', this.handleEditingChange);

        this.onContextMenu = this.onContextMenu.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleEditingChange(event,value) {
        if ( value ) {
            this.setState({ editingMode: value });
        } else {
            this.setState({ editingMode: value, editing: false });
        }
    }

    callback(data) {
        this.setState({ translation: data.translation });
    }

    componentDidMount() {
        this.setState({ editingMode: window.i18n.isEditing() });
    }

    isEditing() {
        return this.state.editingMode && this.state.editing;
    }

    onContextMenu(event) {
        if (this.state.editingMode) {
            this.setState({ editing: true });
            event.preventDefault();
        }
    }

    onClick(event) {
        if (this.isEditing()) {
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
            event.preventDefault();
            return false;
        }
    }

    render() {
        if ( this.props.html ) {
            return <div data-source="i18n" contentEditable={this.isEditing()} onClick={this.onClick} onContextMenu={this.onContextMenu} className={this.state.editingMode ? 'I18N editingMode ' + (this.state.editing ? 'editing' : '') : 'I18N'} dangerouslySetInnerHTML={{ __html: this.state.translation }}></div>
        } else {
            return <div data-source="i18n" contentEditable={this.isEditing()} onClick={this.onClick} onContextMenu={this.onContextMenu} className={this.state.editingMode ? 'I18N editingMode' + (this.state.editing ? 'editing' : '') : 'I18N'}>{this.state.translation}</div>
        }
    }
}

export default I18N;
