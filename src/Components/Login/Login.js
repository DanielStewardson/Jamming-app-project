import React from "react";
import './Login.css';
import { Spotify } from "../../util/Spotify";

import SpotifyLogo from './spotify_logo.png';

export class Login extends React.Component {
    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
    }

     login() {
        const accessToken = Spotify.accessToken();
        if(accessToken || this.props.login) {
            return null;
        } else {
          return (
            <div className='Login'>
                <div className='LoginModal'>
                    <h1>Dan<span className="highlight">_</span>Jam</h1>
                    <h3>Welcome to DanJam!</h3>
                    <h3>To use our features, log in to your Spotify account.</h3>
                    <button className='LoginButton' onClick={ this.props.onLogin }>Log In</button>
                    <img src={ SpotifyLogo } alt='Spotify Logo' className='LoginLogo' />
                </div>
            </div>
          )
        }
      }

    render() {
        return this.login();
    }
}