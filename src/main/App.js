// @flow
import { format as formatUrl } from "url";
import * as path from "path";
import EventEmitter from "events";
import { BrowserWindow, BrowserView, ipcMain, session } from "electron";

import {
  CHROME_MESSAGE,
  type ChromeMessageData,
  CHROME_READY,
  CHROME_RESIZE,
  NETWORK_MODE,
  SCRAPE_START,
  SCRAPE_STOP,
  SCRAPE_STATUS,
  TAB_UPDATE,
  TAB_FOCUS,
  TAB_NAVIGATE,
  type ScrapeConfig,
  type ScrapeStatus,
} from "common/events";
import { chromeUrl, newTabUrl } from "common/urls";
import { appName } from "common/config";
import Tab from "./Tab";
import ElectronRequestConnector from "./ElectronRequestConnector";
import {
  NetworkAdapter,
  HttpProtocolHandler,
  HttpsProtocolHandler,
  ArchivePersister,
} from "./network";
import { Archive } from "./archive";
import ScrapeRunner from "./ScrapeRunner";

const protocols = {
  http: HttpProtocolHandler,
  https: HttpsProtocolHandler,
};

const isDevelopment = process.env.NODE_ENV !== "production";
const dbFilename = isDevelopment ? "test.db" : ":memory:";

export default class App extends EventEmitter {
  id: string;
  chromeHeight: number;
  session: any;
  archive: Archive;
  networkAdapter: NetworkAdapter;
  recordingSession: ArchivePersister.RecordingSession;
  requestConnector: ElectronRequestConnector;
  tabs: Array<Tab>;
  activeTab: ?Tab;
  isChangingNetworkMode: boolean;
  window: BrowserWindow;
  currentScrape: ?ScrapeRunner;

  constructor(id: string) {
    super();
    this.id = id;
    this.chromeHeight = 0;
    this.tabs = [];
    this.session = session.fromPartition(this.id);
    this.isChangingNetworkMode = false;

    Archive.create(dbFilename).then(archive => {
      this.archive = archive;
      const handlers = {};
      Object.keys(protocols).forEach(scheme => {
        handlers[scheme] = new protocols[scheme]();
      });
      const persister = new ArchivePersister(archive);
      this.networkAdapter = new NetworkAdapter(handlers, persister);
      this.requestConnector = new ElectronRequestConnector(
        this.session,
        this.networkAdapter,
      );

      this.window = new BrowserWindow({
        title: appName,
        show: false,
        width: 1200,
        height: 900,
      });
      this.window.webContents.toggleDevTools = function() {
        if (this.isDevToolsOpened()) {
          this.closeDevTools();
        } else {
          this.openDevTools({ mode: "detach" });
        }
      };

      this.window.on("closed", () => {
        this.window = null;
        this.close();
        this.emit("closed");
      });

      ipcMain.on(CHROME_MESSAGE, this.handleChromeMessage);

      this.window.loadURL(chromeUrl);
    });
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
    tab.loadURL(newTabUrl);
    tab.setIpcHandler(this.handleContentIpc);
    this.updateActiveTab();
    this.sendChromeMessage(TAB_UPDATE, tab.toJSON());
  }

  handleChromeMessage = (event: any, data: ChromeMessageData) => {
    if (event.sender === this.window.webContents) {
      switch (data.type) {
        case CHROME_READY:
          return this.handleChromeReady();
        case CHROME_RESIZE:
          return this.handleChromeResize(data.payload);
        case NETWORK_MODE:
          return this.handleRequestNetworkMode(data.payload);
        case SCRAPE_START:
          return this.handleStartScrape((data.payload: any));
        case SCRAPE_STOP:
          return this.handleStopScrape();
        case TAB_UPDATE:
          return this.handleRequestTabUpdate(data.payload);
        case TAB_NAVIGATE:
          return this.handleRequestTabNavigate(data.payload);
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
    this.sendChromeMessage(NETWORK_MODE, {
      mode: this.networkAdapter.isRecording()
        ? "record"
        : this.networkAdapter.isReplaying() ? "replay" : "passthrough",
    });
  }

  handleRequestNetworkMode({ mode }: any) {
    if (this.isChangingNetworkMode) return;
    this.isChangingNetworkMode = true;
    return Promise.resolve(undefined)
      .then(() => {
        if (mode !== "record" && this.networkAdapter.isRecording()) {
          return this.networkAdapter.finishRecordingSession();
        }
      })
      .then(() => {
        switch (mode) {
          case "record":
            if (this.networkAdapter.isRecording()) return;
            // Refresh the current page to kick off the recording
            return this.networkAdapter.startRecordingSession().then(session => {
              this.recordingSession = (session: any);
              if (this.activeTab) this.activeTab.reload();
            });
          case "replay":
            return this.networkAdapter.setReplayMode();
          case "passthrough":
            return this.networkAdapter.setPassthroughMode();
        }
      })
      .then(() => {
        this.isChangingNetworkMode = false;
        this.sendChromeMessage(NETWORK_MODE, { mode });
      });
  }

  handleStartScrape(config: ScrapeConfig) {
    if (this.currentScrape && this.currentScrape.isRunning()) return;
    this.currentScrape = new ScrapeRunner(
      this,
      this.handleScrapeStatus,
      config,
    );
    this.currentScrape.start();
  }

  handleStopScrape() {
    if (!this.currentScrape || !this.currentScrape.isRunning()) return;
    this.currentScrape.stop();
  }

  handleScrapeStatus = (runner: ScrapeRunner, status: ScrapeStatus) => {
    if (runner !== this.currentScrape) return;
    this.sendChromeMessage(SCRAPE_STATUS, status);
  };

  handleRequestTabUpdate(data: any) {
    const tab = this.tabs.find(t => t.id === data.id);
    if (!tab) return;
    tab.requestUpdate(data);
  }

  handleRequestTabNavigate(data: any) {
    const tab = this.tabs.find(t => t.id === data.id);
    if (!tab) return;
    if (data.stop) {
      tab.stop();
    } else if (data.offset !== 0) {
      tab.goToOffset(data.offset);
    } else if (data.offset === 0) {
      tab.reload();
    }
  }

  handleTabUpdate = (data: any) => {
    this.sendChromeMessage(TAB_UPDATE, data);
  };

  handleContentIpc = (message: any): Promise<any> => {
    if (message.query === "getPages") {
      return this.archive.getPages();
    } else if (message.query === "fullTextSearch") {
      return this.archive.fullTextSearch(message.variables);
    } else {
      return Promise.reject("unknown query " + message.query);
    }
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
