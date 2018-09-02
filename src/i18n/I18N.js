import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './I18N.css';

class I18N extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translation: this.props.html ? '&nbsp;' : ' ',
            editingMode: false,
            editing: false,
            toolbar: {
                visible: false
            }
        };
        this.leaveTimeout = null;

        console.log('i18n request: ' + this.props.index);
        this.callback = this.callback.bind(this);
        window.i18n._(this.props.index).then(this.callback);

        this.handleEditingChange = this.handleEditingChange.bind(this);
        window.i18n.on('editing-change', this.handleEditingChange);

        this.onContextMenu = this.onContextMenu.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onEditToolClick = this.onEditToolClick.bind(this);
        this.onCancelToolClick = this.onCancelToolClick.bind(this);
        this.onSaveToolClick = this.onSaveToolClick.bind(this);
    }

    handleEditingChange(event, value) {
        this.cancelEditing(true);
        if (value) {
            this.setState({ editingMode: value });
        } else {
            this.setState({ editingMode: value });
        }
    }

    callback(data) {
        console.log('i18n tranlated: ' + this.props.index + ' - ' + data.translation);
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
        }
    }

    onMouseEnter(event) {
        clearTimeout(this.leaveTimeout);
        this.setState({ toolbar: { visible: true } });
    }

    onMouseLeave(event) {
        this.leaveTimeout = setTimeout(() => {
            this.setState({ toolbar: { visible: false } });
        }, 300);
    }

    onEditToolClick(event) {
        if ( this.state.editingMode )
            this.setState({ editing: true });
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        event.preventDefault();
    }

    onCancelToolClick(event) {
        this.cancelEditing(true);
    }

    onSaveToolClick(event) {
        if ( this.props.html ) {
            window.i18n.updateIndex(this.props.index, this.getInnterHTML());
            this.cancelEditing(false);
        }
    }

    getInnterHTML(){
        return ReactDOM.findDOMNode(this.refs.htmlcontent).innerHTML;
    }

    cancelEditing(restoreInnterHTML){
        this.setState({ editing: false });
        if ( restoreInnterHTML && this.props.html && this.getInnterHTML() !== this.state.translation )
            ReactDOM.findDOMNode(this.refs.htmlcontent).innerHTML = this.state.translation;
    }

    render() {
        let props = {};
        for (let i in this.props) {
            if (i !== 'html')
                props[i] = this.props[i];
        }
        props.onClick = this.onClick;
        props.onContextMenu = this.onContextMenu;
        props.className = props.className + ' ' + (this.state.editingMode ? 'I18N editingMode ' + (this.state.editing ? 'editing' : '') : 'I18N');
        props.onMouseEnter = this.onMouseEnter;
        props.onMouseLeave = this.onMouseLeave;

        let toolbar;
        if ( this.state.editingMode ) {
            let toolbarClass = 'I18NToolbar ' + ( this.state.toolbar.visible || ( this.props.html && this.state.editing ) ? 'visible' : '' );
            if ( this.state.editing && this.props.html ) {
                toolbar = <div className={toolbarClass}>
                    <span className="cancel" onClick={this.onCancelToolClick}>Cancel</span>
                    <span className="submit" onClick={this.onSaveToolClick}>Save</span>
                </div>;
            } else {
                toolbar = <div className={toolbarClass}>
                    <span onClick={this.onEditToolClick}>Edit</span>
                </div>;
            }
        }

        if ( this.props.html === true ) {
            return <div {...props}>
                    {toolbar}
                    <div ref="htmlcontent" contentEditable={this.isEditing()} dangerouslySetInnerHTML={{ __html: this.state.translation }}></div>
                </div>
        } else {
            return <div {...props}>
                    {toolbar}
                    <div>{this.state.translation}</div>
                </div>
        }
    }
}

export default I18N;
