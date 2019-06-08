import React from "react";
import ReactDOM from "react-dom";

import "./potok.js"

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

ReactDOM.render(
  <Welcome name="testapp"/>,
  document.getElementById('root')
);

// import sayHello from "util.js";

class Foo {
  constructor(name) {
    this.name = name;
  }
}
