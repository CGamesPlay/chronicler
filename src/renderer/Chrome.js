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
  SCRAPE_STOP,
  SCRAPE_STATUS,
  TAB_OPEN,
  TAB_CLOSE,
  TAB_UPDATE,
  TAB_FOCUS,
  TAB_NAVIGATE,
  TAB_EXECUTE_JAVASCRIPT,
  type ScrapeConfig,
  type ScrapeStatus,
} from "common/events";
import { newTabUrl, scrapeConfigUrl } from "common/urls";
import { Icon, ModalToolbar, Resizable, TabBar } from "./components";
import Tab from "./Tab";
import BrowserControls from "./BrowserControls";
import ScrapeStatusToolbar from "./ScrapeStatusToolbar";

import "./Chrome.css";

type State = {
  networkMode: "record" | "replay" | "passthrough",
  showScrapeStatus: boolean,
  scrapeStatus: ?ScrapeStatus,
};

export default class Chrome extends React.Component<{}, State> {
  state = {
    networkMode: "replay",
    showScrapeStatus: false,
    scrapeStatus: null,
  };
  chromeHeight: number = 0;
  tabs: Array<Tab> = [];
  activeTab: ?Tab;
  scrapeConfigWindow: any;

  componentDidMount() {
    window.chrome = this;
    ipcRenderer.on(CHROME_MESSAGE, this.handleChromeMessage);
    this.chromeHeight = (document.body: any).scrollHeight;
    this.sendChromeMessage(CHROME_RESIZE, { top: this.chromeHeight });
    this.sendChromeMessage(CHROME_READY);
  }

  componentDidUpdate() {
    this.handleChromeResize();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(CHROME_MESSAGE, this.handleChromeMessage);
    if (this.scrapeConfigWindow) {
      this.scrapeConfigWindow.close();
    }
  }

  render() {
    const activeTab = this.activeTab || new Tab("null");
    return (
      <Resizable onResize={this.handleChromeResize}>
        <div className="Chrome">
          <Helmet>
            <body className="has-background-light" />
          </Helmet>
          <BrowserControls
            className="Chrome__controls"
            homeUrl={newTabUrl}
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
            onRequestScrape={this.handleShowScrapeConfig}
          />
          <TabBar className="Chrome__tabs">
            {this.tabs.map(tab => (
              <TabBar.Tab
                key={tab.id}
                active={tab === this.activeTab}
                onClose={() =>
                  this.sendChromeMessage(TAB_CLOSE, { id: tab.id })
                }
                onClick={() =>
                  this.sendChromeMessage(TAB_FOCUS, { id: tab.id })
                }
                showClose={this.tabs.length > 1}
              >
                {tab.title || "Loading..."}
              </TabBar.Tab>
            ))}
            <TabBar.Tab
              className="Chrome__newTabButton"
              onClick={() => this.sendChromeMessage(TAB_OPEN)}
              showClose={false}
            >
              <Icon icon="plus" />
            </TabBar.Tab>
          </TabBar>
          {this.state.showScrapeStatus && (
            <ScrapeStatusToolbar
              status={this.state.scrapeStatus}
              onScrape={config => this.sendChromeMessage(SCRAPE_START, config)}
              onCancelScrape={config => this.sendChromeMessage(SCRAPE_STOP)}
              onHide={() => this.setState({ showScrapeStatus: false })}
            />
          )}
        </div>
      </Resizable>
    );
  }

  sendChromeMessage(type: string, payload?: any) {
    ipcRenderer.send(CHROME_MESSAGE, { type, payload });
  }

  startScrape(config: any) {
    this.sendChromeMessage(SCRAPE_START, config);
    if (this.scrapeConfigWindow) {
      this.scrapeConfigWindow.close();
      this.scrapeConfigWindow = null;
    }
    this.setState({ showScrapeStatus: true, scrapeStatus: null });
  }

  executeJavaScriptInActiveTab(script: string) {
    if (!this.activeTab) return;
    this.sendChromeMessage(TAB_EXECUTE_JAVASCRIPT, {
      id: this.activeTab.id,
      script,
    });
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

  handleShowScrapeConfig = () => {
    if (this.scrapeConfigWindow && !this.scrapeConfigWindow.closed) {
      // XXX - doesn't work
      this.scrapeConfigWindow.focus();
      return;
    }
    this.scrapeConfigWindow = window.open(scrapeConfigUrl, {
      width: 800,
      height: 600,
    });
    this.scrapeConfigWindow.addEventListener("close", () => {
      this.scrapeConfigWindow = null;
    });
  };

  handleChromeMessage = (event: string, data: ChromeMessageData) => {
    if (data.type === TAB_CLOSE) {
      this.handleTabClose(data.payload);
    } else if (data.type === TAB_UPDATE) {
      this.handleTabUpdate(data.payload);
    } else if (data.type === TAB_FOCUS) {
      this.handleTabFocus(data.payload);
    } else if (data.type === NETWORK_MODE) {
      this.handleNetworkMode(data.payload);
    } else if (data.type === SCRAPE_STATUS) {
      this.setState({ scrapeStatus: data.payload, showScrapeStatus: true });
    }
  };

  handleTabClose(data: any) {
    let idx = this.tabs.findIndex(t => t.id === data.id);
    if (idx === -1) return;
    const tab = this.tabs[idx];
    this.tabs.splice(idx, 1);
    this.forceUpdate();
    if (tab === this.activeTab) {
      const nextTab = this.tabs[idx === this.tabs.length ? idx - 1 : idx];
      this.sendChromeMessage(TAB_FOCUS, { id: nextTab.id });
    }
  }

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
