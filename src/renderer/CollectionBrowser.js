// @flow
import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Helmet from "react-helmet";

import { appName } from "common/config";
import { allPagesUrl } from "common/urls";

import { PagesListPage } from "./content";

const CollectionBrowser = () => (
  <Router basename="/html/">
    <div>
      <Helmet defaultTitle={appName} />
      <Route exact path={allPagesUrl} component={PagesListPage} />
    </div>
  </Router>
);

export default CollectionBrowser;
