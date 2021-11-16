import React from "react";

import './TopArtists.css';


export class TopArtists extends React.Component {
    render() {
        return (
            <div className='ArtistsPics'>
                <img className='ArtistImage' src={ this.props.artist.image } alt='Artist' />
                <div>
                    <h4>{ this.props.artist.name }</h4>
                </div>
            </div>
        )
    }
}