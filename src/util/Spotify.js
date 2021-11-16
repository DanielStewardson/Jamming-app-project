const client_ID = '--------------';
const redirect_URI = 'https://localhost:3000';  //DONT forget to change to live address here and Spotify dev.

let accessToken;
let userID;
let userProfile;
let userTopItems;

export const Spotify = {

    getAccessToken() {
        if(accessToken) {
            return accessToken;
         }

         const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
         const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

         if (accessTokenMatch && expiresInMatch) {
             accessToken = accessTokenMatch[1];
             const expiresIn = Number(expiresInMatch[1]); 

             window.setTimeout(() => {
                 accessToken = '';
                }, expiresIn * 1000);
             window.history.pushState('Access Token', null, '/');
             return accessToken;
         } else {
             window.location = (`https://accounts.spotify.com/authorize?client_id=${client_ID}&response_type=token&scope=playlist-modify-public user-top-read&redirect_uri=${redirect_URI}`);
             Spotify.getAccessToken();
         }
    },

    accessToken() {
        return accessToken;
    },

    async getUserId() {
        if(userID) {
            return userID;
        }
        const token = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${token}`};

        return fetch(`https://api.spotify.com/v1/me`, { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userID = jsonResponse.id
            return userID;
        })
    },

    async getUserProfile() {
        if(userProfile) {
            return userProfile;
        }
        const token = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${token}`};

        return fetch(`https://api.spotify.com/v1/me`, { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
           return {
               id: jsonResponse.id,
               name: jsonResponse.display_name,
               followers: jsonResponse.followers.total,
               image: jsonResponse.images[0].url
           }
        })
    },

    async getUserTopItems() {                           //Sorting the 403 rreply from spoitfy!------------------------------------------------------------
        if(userTopItems) {
            return userTopItems;
        }
        const token = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${token}`};


        return fetch(`https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5`, 
            { 
                headers: headers
            } 
            ).then(response => response.json()                              
            ).then(jsonResponse => {
                console.log(jsonResponse)
                return jsonResponse.items.map(item =>({
                    name: item.name,
                    followers: item.followers.total,
                    image: item.images[2].url
                }))
            })
    },

    async search(term) {
        const token = await Spotify.getAccessToken();

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${token}` } 
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    async savePlaylist(name, URIs, playlistID) {
        if (!name || !URIs.length) {
            return false;
        }
        const token = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${token}`};

        //If editing an existing playlist, use playlist ID to add/remove tracks
        if (playlistID) {
           await fetch (`https://api.spotify.com/v1/playlists/${playlistID}`,
            {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({ name: name })
            })

            return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
            { 
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({ uris: URIs })
             })
        }

        //Saving a new playlist - Set new playlist with name, then add tracks to new playlist with ID.
        return Spotify.getUserId().then(userID => {
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
                { headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: URIs })
                })
            })
        });
    },

    async getUserPlaylists() {
        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};

        return Spotify.getUserId().then(userID => {
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
            {  headers: headers }
            ).then(response => {
                return response.json()
            }).then(jsonResponse => {
                if(!jsonResponse.items) {
                    return [];
                }
                return jsonResponse.items.map(item => ({
                    name: item.name,
                    id: item.id
                }))
            })
        })
    },

    async getPlaylistItems(playlistID) {
        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};

        return fetch (`https://api.spotify.com/v1/playlists/${playlistID}`,
            { headers: headers }
            ).then(response => {
                return response.json()
            }).then(jsonResponse => {
                if(!jsonResponse.tracks.items) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.track.id,
                    name: track.track.name,
                    artist: track.track.artists[0].name,
                    album: track.track.album.name,
                    uri: track.track.uri
                }))
            })
    },

    async unfollowPlaylist(playlistID) {
        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};

        return fetch (`https://api.spotify.com/v1/playlists/${playlistID}/followers`,
        {
            headers: headers,
            method: 'DELETE'
        })
    }


};
