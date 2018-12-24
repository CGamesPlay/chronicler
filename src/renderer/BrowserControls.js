// @flow
import * as React from "react";
import classnames from "classnames";

import UrlBar from "./UrlBar";

type NetworkMode = "record" | "replay" | "passthrough";

type Props = {
  className?: string,
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
  onRequestScrape?: () => void,
};

export default class BrowserControls extends React.Component<Props> {
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

  render() {
    return (
      <div className={classnames(this.props.className, "field is-grouped")}>
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
        <UrlBar
          className="control is-expanded"
          url={this.props.url}
          onChangeUrl={this.props.onChangeUrl}
        />
        <div className="control has-addons">
          <button className="button" onClick={this.handleToggleNetworkMode}>
            {this.props.networkMode === "record"
              ? "Recording"
              : this.props.networkMode === "replay"
                ? "Offline"
                : "Not Recording"}
          </button>
          <button className="button" onClick={this.props.onRequestScrape}>
            Scrape
          </button>
        </div>
      </div>
    );
  }
}
