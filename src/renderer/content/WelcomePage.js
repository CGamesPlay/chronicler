// @flow
import * as React from "react";

import { Layout } from "../components";

const WelcomePage = () => (
  <Layout title="Welcome to Chronicler">
    <div className="content">
      <p>
        Chronicler is an offline-first web browser. Chronicler allows you to
        record a web browsing session so that later on you can visit the pages
        exactly as you saw them, even without internet access.
      </p>
      <p>
        <strong>To start recording pages using Chronicler:</strong>
      </p>
      <ul>
        <li>Open a new tab by using the + icon in the top right corner.</li>
        <li>
          Paste a URL that you would like to be able to access offline into the
          address bar at the top and press enter.
        </li>
        <li>
          Click on "Offline" in the top right corner to start recording pages.
        </li>
        <li>Browse around the site.</li>
        <li>
          Click on "Recording" in the top right corner to stop recording and go
          offline.
        </li>
      </ul>
    </div>
  </Layout>
);

export default WelcomePage;
