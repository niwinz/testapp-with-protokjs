import React from "react";
import ReactDOM from "react-dom";

import * as rx from "rxjs"
import * as rxop from "rxjs/operators";
import * as util from "../util.js";
import * as potok from "../potok.js";
import * as store from "../store.js";

// ---------------------------------
// --- Events
// ---------------------------------

class Incr extends potok.Event {
  update(state) {
    return util.merge(state, {counter: state.counter + 1});
  }
}

class IncrWithDelay extends potok.Event {
  watch(state, stream) {
    return (
      rx.of((state) => util.merge(state, {counter: state.counter + 1}))
        .pipe(rxop.delay(1000))
    );
  }
}

// ---------------------------------
// --- Components
// ---------------------------------

class MainComponent extends React.Component {
  render() {
    return (
      <section>
        <div>Counter {this.props.state.counter}</div>
        <div className="buttons">
          <button onClick={() => store.emit(new Incr())}>Inc</button>
          <button onClick={() => store.emit(new IncrWithDelay())}>Inc With Delay</button>
        </div>
      </section>
    );
  }
}

function mount(state) {
  const component = <MainComponent state={state}/>;
  ReactDOM.render(component, document.getElementById('sample1'));
}

// ---------------------------------
// --- Store
// ---------------------------------

const initialState = {
  counter: 0
};

store.init(initialState).subscribe((_state) => {
  console.log("STATE:", _state);
  mount(_state);
});

// store.emit(new Incr());
// store.emit(new IncrWithDelay());



