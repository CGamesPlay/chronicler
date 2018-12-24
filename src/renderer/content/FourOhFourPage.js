// @flow
import * as React from "react";
import { Helmet } from "react-helmet";

const FourOhFourPage = () => (
  <section className="section">
    <Helmet>
      <title>Invalid URL</title>
    </Helmet>
    <div className="container">
      <div className="notification content">
        <p>
          You have been directed to an invalid content URL. This is due to a bug
          in the program.
        </p>
        <p className="has-text-grey">Error code: FourOhFourPage</p>
      </div>
    </div>
  </section>
);

export default FourOhFourPage;
