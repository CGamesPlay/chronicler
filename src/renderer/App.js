// @flow
import * as React from "react";
import classnames from "classnames";

import TabBar from "./common/TabBar";
import Tab from "./Tab";
import BrowserControls from "./BrowserControls";

import "./App.css";

type State = {
  activeTabId: string,
};

export default class App extends React.Component<{}, State> {
  tabs: Array<Tab>;

  constructor(props: {}) {
    super(props);

    const tab = new Tab("1");
    this.tabs = [tab];
    this.state = { activeTabId: tab.id };
  }

  render() {
    const { activeTabId } = this.state;
    return (
      <>
        <div className="App__controls">
          <BrowserControls />
          <TabBar>
            {this.mapTabs(tab => (
              <TabBar.Tab key={tab.id} active={tab.id === activeTabId}>
                Tab {tab.id}
              </TabBar.Tab>
            ))}
            <TabBar.Tab className="App__newTabButton">+</TabBar.Tab>
          </TabBar>
        </div>
        <div className="App__tabViews">
          {this.mapTabs(tab => (
            <webview
              key={tab.id}
              ref={w => tab.setWebview(w)}
              className="App__tabView"
              style={{ display: activeTabId === tab.id ? "block" : "none" }}
            />
          ))}
        </div>
      </>
    );
  }

  mapTabs<T>(func: (Tab, string) => T): Array<T> {
    return this.tabs.map(tab => func(tab, tab.id));
  }
}
