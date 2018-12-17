// @flow
import * as React from "react";

import { parseUrl } from "./utils";

type Props = {
  url: string,
  onChangeUrl?: string => void,
};

export default class BrowserControls extends React.Component<Props> {
  urlInput: ?HTMLInputElement;

  handleUrlSubmit = (event: Event) => {
    event.preventDefault();
    const inputEl = this.urlInput;
    if (inputEl) {
      const typedUrl = inputEl.value;
      const parsedUrl = parseUrl(typedUrl);
      if (typedUrl !== parsedUrl) {
        inputEl.value = parsedUrl;
      }
      if (this.props.onChangeUrl) {
        this.props.onChangeUrl(parsedUrl);
      }
    }
  };

  componentDidUpdate(prevProps: Props) {
    const inputEl = this.urlInput;
    if (!inputEl) return;
    if (inputEl.value === prevProps.url && prevProps.url !== this.props.url) {
      inputEl.value = this.props.url;
    }
  }

  render() {
    return (
      <div className="field is-grouped is-marginless">
        <div className="control has-addons">
          <button className="button">Offline</button>
          <button className="button">Back</button>
          <button className="button">Forward</button>
          <button className="button">Refresh</button>
        </div>
        <div className="control is-expanded">
          <form onSubmit={this.handleUrlSubmit}>
            <input ref={e => (this.urlInput = e)} className="input" />
          </form>
        </div>
      </div>
    );
  }
}
