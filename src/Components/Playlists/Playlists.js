import React from 'react';
import './Playlists.css';
import { UserPlaylists } from '../UserPlaylists/UserPlaylists';

export class Playlists extends React.Component {

// componentDidMount() {
//     this.props.getUserPlaylists();
// }

    render() {
        return (
            <div className="Playlists">
                <h2>Playlists</h2>
                <div className='Scroll'>
                    <UserPlaylists playlists={ this.props.playlists } onEdit={ this.props.onEdit }  onDelete={ this.props.onDelete } />
                </div>
            </div>
        )
    }
}