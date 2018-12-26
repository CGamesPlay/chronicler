import * as React from "react";
import ReactDOM from "react-dom";

import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/solid.css";

import * as urls from "common/urls";

import Chrome from "./Chrome";
import ErrorPage from "./ErrorPage";
import ContentPages from "./ContentPages";
import ScrapeConfigPage from "./ScrapeConfigPage";

const render = () => {
  let root;

  // We treat each of these as a completely separate application, so we don't
  // bother with a dynamic router at this level.
  if (window.location.protocol === "chrome-error:") {
    root = (
      <ErrorPage
        url={window.chromeErrorUrl}
        code={window.chromeErrorCode}
        error={window.chromeErrorString}
        onResolve={window.chromeErrorResolve}
      />
    );
  } else if (window.location.href === urls.chromeUrl) {
    root = <Chrome />;
  } else if (window.location.href === urls.scrapeConfigUrl) {
    root = <ScrapeConfigPage />;
  } else {
    root = <ContentPages />;
  }
  ReactDOM.render(root, document.getElementById("app"));
};

render();
if (module.hot) {
  module.hot.accept(
    ["./Chrome", "./ErrorPage", "./ContentPages", "./ScrapeConfigPage"],
    render,
  );
}
