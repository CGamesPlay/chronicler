// @flow
import * as React from "react";

import { parseUrl } from "./utils";

type NetworkMode = "record" | "replay" | "passthrough";

type Props = {
  url: string,
  loading: boolean,
  canNavigateBack: boolean,
  canNavigateForward: boolean,
  networkMode: NetworkMode,
  onNavigateBack?: () => void,
  onNavigateForward?: () => void,
  onReload?: () => void,
  onStop?: () => void,
  onChangeUrl?: string => void,
  onChangeNetworkMode?: NetworkMode => void,
};

export default class BrowserControls extends React.Component<Props> {
  urlInput: ?HTMLInputElement;

  handleUrlSubmit = (event: Event) => {
    event.preventDefault();
    const inputEl = this.urlInput;
    if (inputEl) {
      const typedUrl = inputEl.value;
      const parsedUrl = parseUrl(typedUrl);
      inputEl.value = this.props.url;
      if (this.props.onChangeUrl) {
        this.props.onChangeUrl(parsedUrl);
      }
    }
  };

  handleToggleNetworkMode = () => {
    if (!this.props.onChangeNetworkMode) return;
    switch (this.props.networkMode) {
      case "record":
      case "passthrough":
        this.props.onChangeNetworkMode("replay");
        return;
      case "replay":
        this.props.onChangeNetworkMode("record");
        return;
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
          <button
            className="button"
            disabled={!this.props.canNavigateBack}
            onClick={this.props.onNavigateBack}
          >
            Back
          </button>
          <button
            className="button"
            disabled={!this.props.canNavigateForward}
            onClick={this.props.onNavigateForward}
          >
            Forward
          </button>
          <button
            className="button"
            onClick={
              this.props.loading ? this.props.onStop : this.props.onReload
            }
          >
            {this.props.loading ? "Stop" : "Reload"}
          </button>
        </div>
        <div className="control is-expanded">
          <form onSubmit={this.handleUrlSubmit}>
            <input ref={e => (this.urlInput = e)} className="input" />
          </form>
        </div>
        <div className="control has-addons">
          <button className="button" onClick={this.handleToggleNetworkMode}>
            {this.props.networkMode === "record"
              ? "Recording"
              : this.props.networkMode === "replay"
                ? "Offline"
                : "Not Recording"}
          </button>
        </div>
      </div>
    );
  }
}
