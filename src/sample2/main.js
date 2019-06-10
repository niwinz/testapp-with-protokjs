import React from "react";
import ReactDOM from "react-dom";

import ld from "lodash";
import * as qs from "querystring";
import * as rx from "rxjs"
import * as rxop from "rxjs/operators";

import { ajax } from 'rxjs/ajax';

import * as http from "../http.js";
import * as util from "../util.js";
import * as potok from "../potok.js";
import * as store from "../store.js";

// ---------------------------------
// --- Events
// ---------------------------------

class UpdateSearchResult extends potok.Event {
  update(state) {
    const results = this.params.filter((item) => {
      return item.title.includes(state.searchTerm);
    });

    return util.merge(state, {
      searching: false,
      results: results
    });
  }
}

class Search extends potok.Event {
  update(state) {
    return util.merge(state, {
      searchTerm: this.params,
      searching: true,
      results: [],
    });
  }

  watch(state, stream) {
    const query = qs.stringify({
      action: "query",
      list: "search",
      format: "json",
      srsearch: this.params
    });

    const url = `https://jsonplaceholder.typicode.com/posts`;

    const stoper = stream.pipe(
      rxop.filter(o => util.isInstanceOf(o, Search)),
      rxop.take(1)
    );

    return ajax(url).pipe(
      rxop.takeUntil(stoper),
      rxop.map((result) => new UpdateSearchResult(result.response))
    );
  }
}

// ---------------------------------
// --- Components
// ---------------------------------

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    store.emit(new Search(event.target.value));
  }

  render() {
    const searchTerm = this.props.state.searchTerm;
    const searching = this.props.state.searching;
    const results = this.props.state.results.slice(0, 4);

    const renderResult = (result) => {
      return <li key={result.id}>{ld.truncate(result.title, {length:20})}</li>;
    };

    const searchingComp = (<span>Searching...</span>);
    let resultsComp = null;

    if (results.length > 0) {
      resultsComp = <ul>{results.map(renderResult)}</ul>;
    } else {
      resultsComp = <span>No results found...</span>;
    }

    return (
      <section>
        <form>
          <div>
            <input type="text" placeholder="Type your query"
                   onChange={this.handleChange}
                   value={searchTerm}
             />
          </div>
        </form>
        <section className="results">
         { searching? searchingComp : resultsComp }
        </section>
      </section>
    );
  }
}

function mount(state) {
  const component = <MainComponent state={state}/>;
  ReactDOM.render(component, document.getElementById('sample2'));
}

// ---------------------------------
// --- Store
// ---------------------------------

const initialState = {
  searchTerm: "",
  results: [],
};

store.init(initialState).subscribe((_state) => {
  console.log("STATE:", _state);
  mount(_state);
});


