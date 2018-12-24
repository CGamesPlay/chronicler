// @flow
import {
  type ScrapeConfig,
  type ScrapeState,
  type ScrapeStatus,
} from "common/events";
import { contentUrl, allPagesUrl } from "common/urls";
import type App from "./App";
import type Tab from "./Tab";

type StatusReporter = (runner: ScrapeRunner, status: ScrapeStatus) => void;

export default class ScrapeRunner {
  app: App;
  status: ScrapeStatus;
  reporter: StatusReporter;
  config: ScrapeConfig;
  allKnownPages: Set<string>;
  queue: Array<string>;
  stopping: boolean;
  notifyStopped: ?() => void;

  constructor(app: App, reporter: StatusReporter, config: ScrapeConfig) {
    this.app = app;
    this.status = { state: "initialized", pagesVisited: 0, pagesRemaining: 1 };
    this.reporter = reporter;
    this.config = config;
    this.allKnownPages = new Set();
    this.queue = [];
    this.stopping = false;
  }

  isRunning() {
    return (
      this.status.state === "initialized" || this.status.state === "running"
    );
  }

  start(): Promise<mixed> {
    const activeTab = this.app.activeTab;
    if (!activeTab) throw new Error("No active tab");
    this.status.state = "running";
    return Promise.resolve(undefined)
      .then(() => {
        if (this.app.networkAdapter.isRecording()) return;
        //return this.app.networkAdapter.startRecordingSession();
        return;
      })
      .then(() => this.advanceQueue(activeTab))
      .then(() => {
        if (this.stopping) return;
        //return this.app.networkAdapter.finishRecordingSession().then(() => {
        const activeTab = this.app.activeTab;
        if (!activeTab) return;
        activeTab.loadURL(contentUrl(allPagesUrl));
        //});
      });
  }

  // Stop the scrape process early. Prevents the scraper from requesting any new
  // pages.
  stop(): Promise<mixed> {
    this.stopping = true;
    return Promise.resolve(resolve => {
      this.notifyStopped = resolve;
    });
  }

  // Send a report immediately
  report() {
    this.reporter(this, this.status);
  }

  // Ensure that the current page finishes scraping, then collect new links and
  // start the next page.
  advanceQueue(tab: Tab): Promise<mixed> {
    if (this.stopping) {
      if (this.notifyStopped) this.notifyStopped();
      return Promise.reject(new Error("Graceful shutdown"));
    }
    return this.waitForPage(tab)
      .then(() => this.examinePage(tab))
      .then(() => this.loadNextPage(tab));
  }

  // Wait for the current page in the tab to finish loading.
  waitForPage(tab: Tab): Promise<mixed> {
    if (tab.view.webContents.isLoading()) {
      return new Promise(resolve => {
        tab.view.webContents.once("did-stop-loading", resolve);
      });
    } else {
      return Promise.resolve(undefined);
    }
  }

  // Look at the current page and enqueue any links that should be followed.
  examinePage(tab: Tab): Promise<mixed> {
    this.status.pagesVisited += 1;
    this.report();
    const url = tab.getURL();
    const knownRoot = this.config.rootUrls.find(root => url.startsWith(root));
    if (!knownRoot) return Promise.resolve(null);
    // Our current page might not be added to the known list if we were
    // redirected to get here.
    this.allKnownPages.add(url);
    // Presently only actual links are supported
    const xpath = `(${this.config.linkXpath})[@href]`;
    return tab
      .executeJavaScript(
        `(function() {
          const snap = document.evaluate(
            ${JSON.stringify(xpath)},
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          );
          const result = [];
          for (let i = 0; i < snap.snapshotLength; i++) {
            result.push(snap.snapshotItem(i).getAttribute("href"));
          }
          return result;
        }())`,
      )
      .then(allLinks => {
        const newLinks = allLinks
          .filter(link => this.config.rootUrls.find(r => link.startsWith(r)))
          .filter(link => !this.allKnownPages.has(link));
        newLinks.forEach(link => {
          this.allKnownPages.add(link);
          this.queue.push(link);
        });
      });
  }

  // If there are more links in the queue, load one and continue, otherwise
  // finish.
  loadNextPage(tab: Tab): Promise<mixed> {
    const nextUrl = this.queue.shift();
    this.status.pagesRemaining = this.queue.length;
    if (!nextUrl) {
      this.status.state = "finished";
      this.report();
      return Promise.resolve(null);
    }
    tab.loadURL(nextUrl);
    return this.advanceQueue(tab);
  }
}
