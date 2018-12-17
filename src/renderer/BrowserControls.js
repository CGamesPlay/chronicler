// @flow
import * as React from "react";

type Props = {};

const BrowserControls = (props: Props) => (
  <div className="field is-grouped is-marginless">
    <div className="control has-addons">
      <button className="button">Offline</button>
      <button className="button">Back</button>
      <button className="button">Forward</button>
      <button className="button">Refresh</button>
    </div>
    <div className="control is-expanded">
      <input className="input" />
    </div>
  </div>
);

export default BrowserControls;
