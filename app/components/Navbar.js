import React from 'react'
import { Link } from 'react-router'
import connectToStores from 'alt-utils/lib/connectToStores'
import SearchStore from '../stores/SearchStore'
import SearchActions from '../actions/SearchActions'
import Autosuggest from 'react-autosuggest'

class Navbar extends React.Component {

  static getStores() {
    return [SearchStore]
  }

  static getPropsFromStores() {
    return SearchStore.getState()
  }

  componentDidMount() {
    $(document).ajaxStart(() => {
      SearchActions.updateAjaxAnimation('fadeIn')
    })

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        SearchActions.updateAjaxAnimation('fadeOut')
      }, 750)
    })
  }

  onSuggestionsUpdateRequested(object) {
    SearchActions.getSuburbs(object.value)
  }

  onChange(event, object) {
    SearchActions.updateSearchQueryValue(object.newValue)
  }

  onSuggestionSelected(event, object) {
    this.propertySearch(object.suggestionValue)
  }

  getSuggestionValue(suggestion) {
    return suggestion.value
  }

  propertySearch(searchQuery) {
    SearchActions.searchProperties({
      searchQuery: searchQuery,
      searchForm: this.refs.searchForm,
      history: this.props.history
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    const searchQuery = this.props.searchQuery.trim()

    if (searchQuery) {
      this.propertySearch(searchQuery)
    }
  }

  renderSuggestion(suggestion) {
    return (
      <span>{suggestion.label}</span>
    )
  }

  render() {
    const theme = {
      input: 'form-control',
      suggestionsContainer: 'search-results',
      suggestion: 'search-list-item'
    }

    const inputProps = {
      value: this.props.searchQuery,
      onChange: this.onChange,
      type: 'search',
      placeholder: 'Enter postcode or suburb'
    }

    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed"
                  data-toggle="collapse" data-target="#navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to="/" className="navbar-brand">
            <span ref="triangles" className={'triangles animated ' + this.props.ajaxAnimationClass}>
              <div className="tri invert"></div>
              <div className="tri invert"></div>
              <div className="tri"></div>
              <div className="tri invert"></div>
              <div className="tri invert"></div>
              <div className="tri"></div>
              <div className="tri invert"></div>
              <div className="tri"></div>
              <div className="tri invert"></div>
            </span>
            Fang
          </Link>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <form ref="searchForm" className="navbar-form navbar-left animated"
                onSubmit={this.handleSubmit.bind(this)}>
            <div className="input-group">

              <Autosuggest
                theme={theme}
                suggestions={this.props.suburbs}
                onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested.bind(this)}
                onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                getSuggestionValue={this.getSuggestionValue.bind(this)}
                renderSuggestion={this.renderSuggestion.bind(this)}
                inputProps={inputProps}
              />

              <span className="input-group-btn">
                <button className="btn btn-default" onClick={this.handleSubmit.bind(this)}>
                  <span className="glyphicon glyphicon-search"></span>
                </button>
              </span>
            </div>
          </form>
          <ul className="nav navbar-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/add">Add</Link></li>
          </ul>

        </div>
      </nav>
    )
  }
}

export default connectToStores(Navbar)
