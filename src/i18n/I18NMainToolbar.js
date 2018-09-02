import React, { Component } from 'react';
import './I18NMainToolbar.css';

let test1 = 'abc';
function I18NMainToolbarShowEditDialog() {
    console.log(test1);
}

class I18NMainToolbar extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            editing: window.i18n.isEditing(),
            editDialog: {
                visible: true
            }
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

    closeEditDialog() {
        this.setState({ editDialog: { visible: false } });
    }

    render() {
        let editDialogClass = "I18NEditDialog " + ( this.state.editDialog.visible ? ' visible ' : '' );
        return (
            <div className={'I18NMainToolbar' + (this.state.editing ? ' editing' : '' )}>
                <div className="I18NToolbar">
                    <a href="" onClick={this.handleClick}>{!this.state.editing ? "Enable i18n editing" : "Disable i18n editing"}</a>
                </div>
                <div className={editDialogClass}>
                    <div>
                        <label> </label>
                        <input type="text"></input>
                        <div>
                            <button onClick={() => { this.closeEditDialog() }} className="cancel">Cancel</button>
                            <button className="submit">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default I18NMainToolbar;
