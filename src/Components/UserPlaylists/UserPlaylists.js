import React from "react";
import './UserPlaylists.css';
import { PlaylistItem } from "../PlaylistItem/PlaylistItem";

export class UserPlaylists extends React.Component {
    render() {
        return (
            <div className='UserPlaylists'>
                {
                    this.props.playlists.map(playlist => {
                        return <PlaylistItem playlist={ playlist } key={ playlist.id } onEdit={ this.props.onEdit }  onDelete={ this.props.onDelete } />
                    })
                }
            </div>
        )
    }
}