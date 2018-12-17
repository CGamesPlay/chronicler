// @flow
import { BrowserView } from "electron";
import EventEmitter from "events";

import { TAB_UPDATE } from "../common/events";
import type App from "./App";

export default class Tab extends EventEmitter {
  static _nextTabId = 0;
  static nextTabId(): string {
    this._nextTabId += 1;
    return `tab_${this._nextTabId}`;
  }

  app: App;
  id: string;
  view: BrowserView;

  constructor(app: App, id: string) {
    super();
    this.app = app;
    this.id = id;

    this.view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        sandbox: true,
        partition: this.app.id,
        affinity: this.app.id,
        scrollBounce: true,
        backgroundThrottling: true,
      },
    });
    this.view.setAutoResize({ width: true, height: true });

    this.view.webContents.on("did-start-loading", this.handleStartLoading);
    this.view.webContents.on("did-stop-loading", this.handleStopLoading);
    this.view.webContents.on("dom-ready", this.handleDomReady);
  }

  attachView() {
    this.app.window.setBrowserView(this.view);
    this.view.setBounds(this.app.getTabBounds());
  }

  requestUpdate(data: any) {
    if (data.url) {
      this.view.webContents.loadURL(data.url);
    }
  }

  loadURL(url: string) {
    this.view.webContents.loadURL(url);
  }

  toJSON() {
    return {
      id: this.id,
      url: this.view.webContents.getURL(),
      title: this.view.webContents.getTitle(),
    };
  }

  handleStartLoading = () => {
    this.emit(TAB_UPDATE, this.toJSON());
  };

  handleStopLoading = () => {
    this.emit(TAB_UPDATE, this.toJSON());
  };

  handleDomReady = () => {
    this.emit(TAB_UPDATE, this.toJSON());
  };
}
