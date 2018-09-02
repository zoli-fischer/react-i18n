import React, { Component } from 'react';
import './I18NMainToolbar.css';
import ReactDOM from 'react-dom';

class I18NMainToolbar extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            editing: window.i18n.isEditing(),
            editDialog: {
                visible: false
            },
            cIndex: '',
            tranlation: '',
            afterSaveCallback: null,
            language: ''
        };

        this.handleClick = this.handleClick.bind(this);
        this.saveEditDialog = this.saveEditDialog.bind(this);
        this.closeEditDialog = this.closeEditDialog.bind(this);
        this.handleTranslationChange = this.handleTranslationChange.bind(this);
        

        this.handleEditingChange = this.handleEditingChange.bind(this);
        window.i18n.on('editing-change', this.handleEditingChange);

        this.handleShowEditDialog = this.handleShowEditDialog.bind(this);
        window.i18n.on('show-edit-dialog', this.handleShowEditDialog);

        this.handleLanguagesLoaded = this.handleLanguagesLoaded.bind(this);
        window.i18n.on('languages-loaded', this.handleLanguagesLoaded);
    }

    handleLanguagesLoaded(event, languages) {
        this.setState({ language: window.i18n.language.index });
    }

    handleEditingChange(event,value) {
        this.setState({ editing: value });
    }

    handleClick(event) {
        event.stopPropagation();
        event.preventDefault();
        window.i18n.setEditing(!window.i18n.isEditing());
    }

    handleShowEditDialog(event, cIndex, tranlation, callback) {
        this.setState({
            cIndex: cIndex,
            tranlation: tranlation,
            afterSaveCallback: callback,
            editDialog: {
                visible: true
            }
        });
        setTimeout(() => {
            ReactDOM.findDOMNode(this.refs.textarea).focus();
        }, 500)
    }

    closeEditDialog() {
        this.setState({ editDialog: { visible: false } });
    }

    saveEditDialog() {
        window.i18n.updateIndex(this.state.cIndex, this.state.tranlation);
        if ( typeof this.state.afterSaveCallback === 'function' )
            this.state.afterSaveCallback(this.state.tranlation);
        this.closeEditDialog();
    }

    handleTranslationChange(event) {
        this.setState({ tranlation: event.target.value });
    }

    render() {
        let editDialogClass = "I18NEditDialog " + ( this.state.editDialog.visible ? ' visible ' : '' );

        return (
            <div className={'I18NMainToolbar' + (this.state.editing ? ' editing' : '' )}>
                <div className="I18NToolbar">
                    <a href="" onClick={this.handleClick}>{(!this.state.editing ? "Enable i18n editing" : "Disable i18n editing") + " ( Language: "+this.state.language+")"}</a>
                </div>
                <div className={editDialogClass}>
                    <div>
                        <label>{this.state.cIndex}</label>
                        <textarea ref="textarea" value={this.state.tranlation} onChange={this.handleTranslationChange}></textarea>
                        <div>
                            <button onClick={this.closeEditDialog} className="cancel">Cancel</button>
                            <button onClick={this.saveEditDialog} className="submit">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default I18NMainToolbar;
