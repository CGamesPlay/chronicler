// @flow
import * as React from "react";
import classnames from "classnames";
import { ipcRenderer } from "electron";
import { Helmet } from "react-helmet";

import {
  CHROME_MESSAGE,
  type ChromeMessageData,
  CHROME_READY,
  CHROME_RESIZE,
  NETWORK_MODE,
  SCRAPE_START,
  SCRAPE_STATUS,
  TAB_UPDATE,
  TAB_FOCUS,
  TAB_NAVIGATE,
  type ScrapeConfig,
  type ScrapeStatus,
} from "common/events";
import { ModalToolbar, Resizable, TabBar } from "./common";
import Tab from "./Tab";
import BrowserControls from "./BrowserControls";
import ScrapeToolbar from "./ScrapeToolbar";

import "./Chrome.css";

type State = {
  networkMode: "record" | "replay" | "passthrough",
  showScrapeToolbar: boolean,
  scrapeStatus: ?ScrapeStatus,
};

export default class Chrome extends React.Component<{}, State> {
  state = {
    networkMode: "replay",
    showScrapeToolbar: false,
    scrapeStatus: null,
  };
  chromeHeight: number = 0;
  tabs: Array<Tab> = [];
  activeTab: ?Tab;

  componentDidMount() {
    ipcRenderer.on(CHROME_MESSAGE, this.handleChromeMessage);
    this.chromeHeight = (document.body: any).scrollHeight;
    this.sendChromeMessage(CHROME_RESIZE, { top: this.chromeHeight });
    this.sendChromeMessage(CHROME_READY);
  }

  componentDidUpdate() {
    this.handleChromeResize();
  }

  componentWillUnmont() {
    ipcRenderer.removeListener(CHROME_MESSAGE, this.handleChromeMessage);
  }

  render() {
    const activeTab = this.activeTab || new Tab("null");
    return (
      <Resizable onResize={this.handleChromeResize}>
        <div className="Chrome__controls">
          <Helmet>
            <body className="has-background-light" />
          </Helmet>
          <BrowserControls
            url={activeTab.url}
            loading={activeTab.loadFraction < 1}
            canNavigateBack={activeTab.canNavigateBack}
            canNavigateForward={activeTab.canNavigateForward}
            networkMode={this.state.networkMode}
            onChangeUrl={this.handleChangeUrl}
            onNavigateBack={this.handleBack}
            onNavigateForward={this.handleForward}
            onReload={this.handleReload}
            onStop={this.handleStop}
            onChangeNetworkMode={this.handleRequestNetworkMode}
            onRequestScrape={() => this.setState({ showScrapeToolbar: true })}
          />
          <TabBar className="is-marginless">
            {this.tabs.map(tab => (
              <TabBar.Tab key={tab.id} active={tab === this.activeTab}>
                {tab.title || "Loading..."}
              </TabBar.Tab>
            ))}
            <TabBar.Tab className="Chrome__newTabButton">+</TabBar.Tab>
          </TabBar>
          {this.state.showScrapeToolbar && (
            <ScrapeToolbar
              scrapeStatus={this.state.scrapeStatus}
              onScrape={config => this.sendChromeMessage(SCRAPE_START, config)}
              onHide={() => this.setState({ showScrapeToolbar: false })}
            />
          )}
        </div>
      </Resizable>
    );
  }

  sendChromeMessage(type: string, payload?: any) {
    ipcRenderer.send(CHROME_MESSAGE, { type, payload });
  }

  handleChromeResize = () => {
    const newHeight = (document.body: any).scrollHeight;
    if (this.chromeHeight !== newHeight) {
      this.chromeHeight = newHeight;
      this.sendChromeMessage(CHROME_RESIZE, { top: this.chromeHeight });
    }
  };

  handleChangeUrl = (url: string) => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_UPDATE, { id: this.activeTab.id, url });
  };

  handleBack = () => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_NAVIGATE, { id: this.activeTab.id, offset: -1 });
  };

  handleForward = () => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_NAVIGATE, { id: this.activeTab.id, offset: 1 });
  };

  handleReload = () => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_NAVIGATE, { id: this.activeTab.id, offset: 0 });
  };

  handleStop = () => {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_NAVIGATE, { id: this.activeTab.id, stop: true });
  };

  handleRequestNetworkMode = (mode: "record" | "replay" | "passthrough") => {
    this.sendChromeMessage(NETWORK_MODE, { mode });
  };

  handleChromeMessage = (event: string, data: ChromeMessageData) => {
    if (data.type === TAB_UPDATE) {
      this.handleTabUpdate(data.payload);
    } else if (data.type === TAB_FOCUS) {
      this.handleTabFocus(data.payload);
    } else if (data.type === NETWORK_MODE) {
      this.handleNetworkMode(data.payload);
    } else if (data.type === SCRAPE_STATUS) {
      this.setState({ scrapeStatus: data.payload });
    }
  };

  handleTabUpdate(data: any) {
    let tab = this.tabs.find(t => t.id === data.id);
    if (!tab) {
      tab = new Tab(data.id);
      this.tabs.push(tab);
    }
    tab.update(data);
    this.forceUpdate();
  }

  handleTabFocus(data: any) {
    this.activeTab = this.tabs.find(t => data.id === t.id);
    this.forceUpdate();
  }

  handleNetworkMode({ mode }: any) {
    this.setState({ networkMode: mode });
  }
}
