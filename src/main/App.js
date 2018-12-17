// @flow
import { format as formatUrl } from "url";
import * as path from "path";
import EventEmitter from "events";
import { BrowserWindow, BrowserView, ipcMain } from "electron";

import {
  CHROME_MESSAGE,
  type ChromeMessageData,
  CHROME_READY,
  CHROME_RESIZE,
  TAB_UPDATE,
  TAB_FOCUS,
} from "../common/events";
import Tab from "./Tab";

const isDevelopment = process.env.NODE_ENV !== "production";

export default class App extends EventEmitter {
  id: string;
  chromeHeight: number;
  window: BrowserWindow;
  tabs: Array<Tab>;
  activeTab: ?Tab;

  constructor(id: string) {
    super();
    this.id = id;
    this.chromeHeight = 20;
    this.window = new BrowserWindow({
      show: false,
    });
    this.tabs = [];

    /*if (isDevelopment) {
      this.window.webContents.openDevTools();
    }*/

    if (isDevelopment) {
      const port = process.env.ELECTRON_WEBPACK_WDS_PORT || "9800";
      this.window.loadURL(`http://localhost:${port}`);
    } else {
      this.window.loadURL(
        formatUrl({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file",
          slashes: true,
        }),
      );
    }

    this.window.on("closed", () => {
      this.window = null;
      this.close();
      this.emit("closed");
    });

    this.window.webContents.on("devtools-opened", () => {
      this.window.focus();
      setImmediate(() => {
        this.window.focus();
      });
    });

    ipcMain.on(CHROME_MESSAGE, this.handleChromeMessage);
  }

  close() {
    if (this.window) {
      this.window.close();
    }
    ipcMain.removeListener(CHROME_MESSAGE, this.handleChromeMessage);
  }

  sendChromeMessage(type: string, payload?: any) {
    this.window.webContents.send(CHROME_MESSAGE, { type, payload });
  }

  newTab() {
    const tab = new Tab(this, Tab.nextTabId());
    this.tabs.push(tab);
    this.activeTab = tab;
    tab.on(TAB_UPDATE, this.handleTabUpdate);
    tab.loadURL("about:blank");
    this.updateActiveTab();
    this.sendChromeMessage(TAB_UPDATE, tab.toJSON());
  }

  handleChromeMessage = (event: any, data: ChromeMessageData) => {
    if (event.sender === this.window.webContents) {
      if (data.type === CHROME_READY) {
        this.handleChromeReady();
      } else if (data.type === CHROME_RESIZE) {
        this.handleChromeResize(data.payload);
      } else if (data.type === TAB_UPDATE) {
        this.handleRequestTabUpdate(data.payload);
      }
    }
  };

  handleChromeResize(size: any) {
    this.chromeHeight = size.top;
    this.window.setMinimumSize(400, this.chromeHeight + 100);
    this.updateActiveTab();
  }

  handleChromeReady() {
    if (this.tabs.length === 0) {
      this.window.show();
      this.newTab();
    } else {
      this.tabs.forEach(tab => {
        this.sendChromeMessage(TAB_UPDATE, tab.toJSON());
      });
      if (this.activeTab) {
        this.sendChromeMessage(TAB_FOCUS, { id: this.activeTab.id });
      }
    }
  }

  handleRequestTabUpdate(data: any) {
    const tab = this.tabs.find(t => t.id === data.id);
    if (!tab) return;
    tab.requestUpdate(data);
  }

  handleTabUpdate = (data: any) => {
    this.sendChromeMessage(TAB_UPDATE, data);
  };

  updateActiveTab() {
    const tab = this.activeTab;
    if (!tab) return;
    tab.attachView();
    this.sendChromeMessage(TAB_FOCUS, { id: tab.id });
  }

  getTabBounds() {
    const [contentWidth, contentHeight] = this.window.getContentSize();
    return {
      x: 0,
      y: this.chromeHeight,
      width: contentWidth,
      height: contentHeight - this.chromeHeight,
    };
  }
}
