import * as React from "react";
import ReactDOM from "react-dom";

const App = () => <span>Hello, world!</span>;

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
