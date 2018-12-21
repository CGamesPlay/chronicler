import * as React from "react";
import ReactDOM from "react-dom";

import "bulma/css/bulma.css";

import * as urls from "common/urls";

import Chrome from "./Chrome";

// We treat each of these as a completely separate application, so we don't
// bother with a dynamic router at this level.
if (window.location.href === urls.chromeUrl) {
  ReactDOM.render(<Chrome />, document.getElementById("app"));
} else {
  ReactDOM.render(<div>Hello, world 12!</div>, document.getElementById("app"));
}
