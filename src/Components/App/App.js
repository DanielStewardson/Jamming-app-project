import React from 'react';
import './App.css';

import { Login } from '../Login/Login';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Playlists } from '../Playlists/Playlists';
import { Spotify } from '../../util/Spotify';
import { Hero } from '../Hero/Hero';

//Add user details
//Restore search term after redirect - unless log in added first or sommet
//Remove tracks from searchresults list once added to current playlist - replace if removed from playlist ====
//Add editing, deleting and saving existing playlists  ====
//Add reset playlist build button    ====
//Prompt user for playlist title before save. Currently Alert, make pop up?  ==
//Add counter for songs in current list?
//Track previews? Play button in track components?
//Hover tracks for more info? art etc.
//Playlist preview on hover? First 10/20 tracks in hover window?
//Add media player?
//Album art?
//Sort out the first search reload issue ==
//Make first use/log in experience better ==
//Add Search bar menu to search track names/artists/album combined with search input?
//Ensure playlist information doesn’t get cleared if a user has to refresh their access token



export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      profile: [],

      login: false,

      searchResults: [],

      playlistName: '',

      playlistTracks: [],

      userPlaylists: [],

      playlistID: '',

      topArtists: []
    }

    this.login = this.login.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.resetPlaylist = this.resetPlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.editPlaylist = this.editPlaylist.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.getUserTopItems = this.getUserTopItems.bind(this);
  }

  login() {
    // this.getUserPlaylists()
    //   this.setState({ login: true })
      new Promise((resolve) => { 
        resolve(this.getUserPlaylists())
      }).then(() => this.setState({ login: true })).then(() => this.getUserProfile()
      ).then(() => this.getUserTopItems());
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });

    const searchResults = this.state.searchResults;
    this.filterTrackList(searchResults, tracks);
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(savedTracks => savedTracks.id !== track.id);
    this.setState({ playlistTracks: tracks });

    let searchResults = this.state.searchResults;
    searchResults.unshift(track);
    this.setState({ searchResults: searchResults });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    if(!this.state.playlistName) {
      alert('Choose a playlist name before saving!');
      return;
    }
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs, this.state.playlistID).then(result => {
      if(result === false) {
        return;
      }        
      this.getUserPlaylists();
    }).then(() => this.resetPlaylist() );
  }

  resetPlaylist() {
    new Promise((resolve) => { 
      resolve(this.setState({ playlistName: '', playlistTracks: [], playlistID: '' }) );
    }).then(() => document.getElementById('PlaylistName').value = this.state.playlistName).then(() => this.search());
  }

  editPlaylist(playlistID, name) {
    Spotify.getPlaylistItems(playlistID).then(tracks => {
      this.setState({ playlistTracks: tracks, playlistName: name, playlistID: playlistID })
    }).then(() => {
      const searchResults = this.state.searchResults;
      const playlistTracks = this.state.playlistTracks;

      this.filterTrackList(searchResults, playlistTracks);
    })
  }

  confirmDelete(playlistID, name) {
    Spotify.unfollowPlaylist(playlistID).then(result => {
      this.getUserPlaylists();
    })
  }

  filterTrackList(arr1, arr2) {
    const filtered = arr1.filter(track => {
      if(arr2.find(savedTrack => savedTrack.id === track.id) ){
        return null;
      } 
        return track;
      })
      this.setState({ searchResults: filtered });
  }

  search(search) {
    if(search === '' || search === undefined) {
      this.setState({ searchResults: [] });
      return;
    }
    const tracks = this.state.playlistTracks;
    Spotify.search(search).then(results => {
      this.filterTrackList(results, tracks)
    })
  }

  getUserPlaylists() {
    Spotify.getUserPlaylists().then(listFetch => {
      this.setState({ userPlaylists: listFetch })
    });
  }

  getUserProfile() {
    Spotify.getUserProfile().then(profile => {
      this.setState({ profile: profile });
    });
  }

  getUserTopItems() {                                   //sort 403 error
    Spotify.getUserTopItems().then(topArtists => {
      this.setState({ topArtists: topArtists})
    }).then(() => console.log(this.state.topArtists))
  }

  render() {
    return (
      <div>
        <div>
          <Login onLogin={ this.login } login={ this.state.login } />
        </div>
        <h1>Dan<span className="highlight">_</span>Jam</h1>

        <Hero profile={ this.state.profile } getUserProfile={ this.getUserProfile } topArtists={ this.state.topArtists } />

        <div className="App">
          <div className="App-playlist">
            <SearchResults searchResults={ this.state.searchResults } onAdd={ this.addTrack } onSearch={ this.search } />
            <Playlist playlistName={ this.state.playlistName } playlistTracks={ this.state.playlistTracks } 
              onRemove={ this.removeTrack } onNameChange={ this.updatePlaylistName } onSave={ this.savePlaylist } onReset={ this.resetPlaylist } getTop={this.getUserTopItems}/>
            <Playlists playlists={ this.state.userPlaylists } getUserPlaylists={ this.getUserPlaylists } 
              onEdit={ this.editPlaylist } onDelete={ this.confirmDelete } /> 
          </div> 
        </div>
      </div>
    )
  }
}
