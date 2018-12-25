// @flow
import * as React from "react";
import classnames from "classnames";

import UrlBar from "./UrlBar";

type NetworkMode = "record" | "replay" | "passthrough";

type Props = {
  className?: string,
  homeUrl?: string,
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
  handleClickHome = () => {
    if (!this.props.onChangeUrl) return;
    if (!this.props.homeUrl) return;
    this.props.onChangeUrl(this.props.homeUrl);
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

  render() {
    return (
      <div
        className={classnames(this.props.className, "columns is-variable is-1")}
      >
        <div className="column is-narrow">
          <div className="field has-addons">
            {this.props.homeUrl && (
              <p className="control">
                <button className="button" onClick={this.handleClickHome}>
                  Home
                </button>
              </p>
            )}
            <p className="control">
              <button
                className="button"
                disabled={!this.props.canNavigateBack}
                onClick={this.props.onNavigateBack}
              >
                Back
              </button>
            </p>
            <p className="control">
              <button
                className="button"
                disabled={!this.props.canNavigateForward}
                onClick={this.props.onNavigateForward}
              >
                Forward
              </button>
            </p>
            <p className="control">
              <button
                className="button"
                onClick={
                  this.props.loading ? this.props.onStop : this.props.onReload
                }
              >
                {this.props.loading ? "Stop" : "Reload"}
              </button>
            </p>
          </div>
        </div>
        <div className="column">
          <UrlBar
            className="control is-expanded"
            url={this.props.url}
            onChangeUrl={this.props.onChangeUrl}
          />
        </div>
        <div className="column is-narrow">
          <div className="field has-addons">
            <p className="control">
              <button className="button" onClick={this.handleToggleNetworkMode}>
                {this.props.networkMode === "record"
                  ? "Recording"
                  : this.props.networkMode === "replay"
                    ? "Offline"
                    : "Not Recording"}
              </button>
            </p>
            <p className="control">
              <button className="button" onClick={this.props.onRequestScrape}>
                Scrape
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
