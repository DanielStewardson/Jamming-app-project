import React from 'react';
import './SearchResults.css';

import { SearchBar } from '../SearchBar/SearchBar';
import { TrackList } from '../TrackList/TrackList.js';

export class SearchResults extends React.Component {

    render() {
        return (
            <div className="SearchResults">
                <h2>Find your sound</h2>
                <SearchBar onSearch={ this.props.onSearch } />
                <div className='Scroll'>
                    <TrackList tracks={ this.props.searchResults } onAdd={ this.props.onAdd } isRemoval={ false } />
                </div>
            </div>
        )
    }
}