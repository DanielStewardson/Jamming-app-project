import React from 'react';
import './Playlist.css';
import { TrackList } from '../TrackList/TrackList';

export class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                <h2>Create Playlist</h2>
                
                <div className='PlaylistButtons'>
                    <button className="Playlist-save" onClick={ this.props.onSave } >SAVE</button>
                    <button className="Playlist-save" onClick={ this.props.onReset } >RESET</button>
                    {/* <button className="Playlist-save" onClick={ this.props.getTop } >Get</button>  USING EXTRA BUTTON TO TEST API CALLS ON CLICK */}
                </div>
                <input id='PlaylistName' value={this.props.playlistName} placeholder='Playlist title...' onChange={ this.handleNameChange } type='text' autoComplete='off' />
                    <div className='Scroll'>
                        <TrackList tracks={ this.props.playlistTracks } onRemove={ this.props.onRemove } isRemoval={ true } />
                    </div>
            </div>
        )
    }
}