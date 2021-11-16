import React from "react";
import './PlaylistItem.css';
import './DeleteWarning.css';

export class PlaylistItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteWarning: false
        }

        this.editPlaylist = this.editPlaylist.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.deleteWarningState = this.deleteWarningState.bind(this);
        this.deleteWarning = this.deleteWarning.bind(this);
        this.closeDelete = this.closeDelete.bind(this);
    }

editPlaylist() {
    const name = this.props.playlist.name;
    this.props.onEdit(this.props.playlist.id, name);
}

deletePlaylist() {
    const name = this.props.playlist.name;
    this.props.onDelete(this.props.playlist.id, name);
}

deleteWarningState() {
    this.setState({ deleteWarning: true });
}

closeDelete() {
    this.setState({ deleteWarning: false });
}

deleteWarning() {
    if (!this.state.deleteWarning) {
        return null;
    }
    return (
        <div className='Delete'>
            <div className='DeleteModal'>
                <h1>Dan<span className="highlight">_</span>Jam</h1>
                <h3>Are you sure you want to DELETE this playlist?</h3>
                <h2> -&nbsp;&nbsp;{ this.props.playlist.name }&nbsp;&nbsp;- </h2>
                <div className='DeleteModalButtons'>
                    <button className='DeleteButton' onClick={ this.deletePlaylist }>DELETE</button>
                    <button className='DeleteButton' onClick={ this.closeDelete }>CANCEL</button>
                </div>
            </div>
        </div>
      )
}

    render() {
        return (
        <div>
            <div>
                { this.deleteWarning() }
            </div>
            <div className='PlaylistItem'>
                <div className='PlaylistTitle'>
                    <h3> { this.props.playlist.name } </h3>
                </div>
                <button className='PlaylistButton edit' onClick={ this.editPlaylist } >edit&nbsp;</button>
                
                <button className='PlaylistButton' onClick={ this.deleteWarningState } >&nbsp;delete</button>
            </div>
        </div>
        )
    }
}


//add onClick to edit to add playlist to create playlist section   ====
//add onclick to delete remove playlist from saved - Prompt Warning with cancel/accept button?  ====