import React from "react";
import './SearchBar.css';


export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: ''
        }

        this.handleTermChange = this.handleTermChange.bind(this);
        this.search = this.search.bind(this);
        this.enter = this.enter.bind(this);
    }

    handleTermChange(e) {
        this.setState({ term: e.target.value });
    }

    search() {
        if (this.state.term === '') {
            this.props.onSearch('');
            return;
        }
        this.props.onSearch(this.state.term);
    }

    enter(e) {
        if(e.keyCode === 13) {
            document.getElementById('searchButt').click();
        }
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter a Song, Album, or Artist" onChange={ this.handleTermChange } onKeyDown={ this.enter } type='text' autoComplete='off' />
                <button className="SearchButton" id='searchButt' onClick={ this.search } >SEARCH</button>
            </div>
        )
    }
}