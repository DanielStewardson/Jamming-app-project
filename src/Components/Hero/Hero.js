import React from "react";
import { TopArtists } from '../TopArtists/TopArtists';

import './Hero.css';


export class Hero extends React.Component {

    // componentDidMount() {
    //     this.props.getUserProfile()
    // }

    render() {
        return (
            <div className='Hero-wrapper'>
                <div className='Hero'>
                    <img className='ProfileImage' src={ this.props.profile.image } alt='Profile' />
                    <div className='UserDetails'>
                        <h1>{ this.props.profile.name }</h1>
                        {/* <p>Followers: { this.props.profile.followers }</p> */}
                        <div className='RecentArtists'>
                            <h3>Your recent vibe</h3>
                            <div className='Artists'>
                                {
                                    this.props.topArtists.map(artist => {
                                        return <TopArtists artist={ artist } />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}