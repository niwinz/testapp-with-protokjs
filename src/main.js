import * as rx from "rxjs"
import * as rxop from "rxjs/operators";
// import React from "react";
// import ReactDOM from "react-dom";
import * as util from "./util.js";
import * as potok from "./potok.js";
import * as store from "./store.js";

// class Welcome extends React.Component {
//   render() {
//     return <h1>Hello, {this.props.name}!</h1>;
//   }
// }

// ReactDOM.render(
//   <Welcome name="testapp"/>,
//   document.getElementById('root')
// );

// import sayHello from "util.js";

class Incr extends potok.Event {
  update(state) {
    const counter = state.counter || 0;
    return util.merge(state, {counter: counter + 1});
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

// console.log(potok.isUpdate(new Incr()))
// console.log(potok.isWatch(new Incr()))
// console.log(potok.isUpdate(new IncrWithDelay()))
// console.log(potok.isWatch(new IncrWithDelay()))

store.emit(new Incr());
store.emit(new IncrWithDelay());



