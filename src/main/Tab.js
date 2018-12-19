// @flow
import { BrowserView } from "electron";
import EventEmitter from "events";

import { TAB_UPDATE } from "../common/events";
import type App from "./App";
import { Archive } from "./archive";

// Keeps track of URL and title changes in the context of a single navigation.
class PageTracker {
  archive: Archive;
  // Tracks the initial full-page navigation Archive page ID.
  rootPageId: Promise<number>;
  // Tracks the URL of the full-page navigation.
  rootUrl: string;
  // Tracks the most recent in-page navigation Archive page ID.
  currentPageId: Promise<number>;

  constructor(archive: Archive, rootUrl: string, initialTitle: string) {
    this.archive = archive;
    this.rootUrl = rootUrl;
    this.currentPageId = this.rootPageId = this.archive.upsertPage({
      url: this.rootUrl,
      title: initialTitle,
    });
  }

  trackInPageNavigation(url: string, title: string) {
    this.rootPageId.then(id => {
      this.currentPageId = this.archive.upsertPage({
        url,
        title,
        originalUrl: url === this.rootUrl ? null : this.rootUrl,
      });
    });
  }

  trackTitleChange(title: string) {
    this.currentPageId.then(id => {
      this.archive.setPageTitle(id, title);
    });
  }
}

export default class Tab extends EventEmitter {
  static _nextTabId = 0;
  static nextTabId(): string {
    this._nextTabId += 1;
    return `tab_${this._nextTabId}`;
  }

  app: App;
  id: string;
  view: BrowserView;
  activePage: ?PageTracker;

  constructor(app: App, id: string) {
    super();
    this.app = app;
    this.id = id;

    this.view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        sandbox: true,
        session: this.app.session,
        affinity: this.app.id,
        scrollBounce: true,
        backgroundThrottling: true,
      },
    });
    this.view.setAutoResize({ width: true, height: true });

    this.view.webContents.on("did-start-loading", this.handleStartLoading);
    this.view.webContents.on("did-stop-loading", this.handleStopLoading);
    this.view.webContents.on("dom-ready", this.handleDomReady);
    this.view.webContents.on("page-title-updated", this.handleTitleUpdated);
    this.view.webContents.on("did-navigate", this.handleNavigation);
    this.view.webContents.on(
      "did-navigate-in-page",
      this.handleInPageNavigation,
    );
  }

  attachView() {
    this.app.window.setBrowserView(this.view);
    this.view.setBounds(this.app.getTabBounds());
  }

  openDevTools() {
    this.view.webContents.openDevTools();
  }

  requestUpdate(data: any) {
    if (data.url) {
      this.view.webContents.loadURL(data.url);
    }
  }

  loadURL(url: string) {
    this.view.webContents.loadURL(url);
  }

  goToOffset(offset: number) {
    this.view.webContents.goToOffset(offset);
  }

  reload() {
    this.view.webContents.reload();
  }

  stop() {
    this.view.webContents.stop();
  }

  toJSON() {
    const webContents = this.view.webContents;
    const loadFraction = !webContents.isLoadingMainFrame()
      ? 1
      : !webContents.isWaitingForResponse() ? 0.5 : 0.1;
    return {
      id: this.id,
      url: webContents.getURL(),
      title: webContents.getTitle(),
      loadFraction,
      canNavigateBack: webContents.canGoBack(),
      canNavigateForward: webContents.canGoForward(),
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

  handleTitleUpdated = (_event: string, title: string) => {
    this.emit(TAB_UPDATE, this.toJSON());
    if (this.app.networkAdapter.isRecording() && this.activePage) {
      this.activePage.trackTitleChange(title);
    }
  };

  handleNavigation = (_event: string, url: string, statusCode: number) => {
    if (this.app.networkAdapter.isRecording() && statusCode > 0) {
      this.activePage = new PageTracker(
        this.app.archive,
        url,
        this.view.webContents.getTitle(),
      );
    }
  };

  handleInPageNavigation = (
    _event: string,
    url: string,
    isMainFrame: boolean,
  ) => {
    if (
      this.app.networkAdapter.isRecording() &&
      isMainFrame &&
      this.activePage
    ) {
      this.activePage.trackInPageNavigation(
        url,
        this.view.webContents.getTitle(),
      );
    }
  };
}
