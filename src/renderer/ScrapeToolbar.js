// @flow
import * as React from "react";
import classnames from "classnames";

import type { ScrapeConfig, ScrapeStatus } from "common/events";
import { ModalToolbar } from "./components";

const exampleConfig: ScrapeConfig = {
  rootUrls: ["https://bulma.io/documentation/"],
  linkXpath: '//nav[@id="categories"]//a',
  ppmLimit: 30,
};

type Props = {
  status?: ?ScrapeStatus,
  onScrape?: ScrapeConfig => void,
  onCancelScrape?: () => void,
  onHide?: () => void,
};

const ScrapeToolbar = ({ status, onScrape, onCancelScrape, onHide }: Props) => {
  let content;
  const isRunning =
    status && (status.state === "initialized" || status.state === "running");
  if (!status) {
    content = (
      <div className="column">
        <button
          className="button"
          onClick={() => onScrape && onScrape(exampleConfig)}
        >
          Go
        </button>
      </div>
    );
  } else {
    const runRate = status.ppm / status.ppmLimit;
    const ppmClassName =
      runRate < 0.1 ? "is-danger" : runRate < 0.7 ? "is-warning" : "is-success";
    content = (
      <>
        <div className="column is-narrow">
          {"Scrape: "}
          {status.state === "initialized"
            ? "Starting..."
            : status.state === "finished"
              ? "Finished"
              : status.state === "canceled" ? "Canceled" : "Running"}
        </div>
        <div className="column is-narrow">
          {!isRunning
            ? `${status.pagesVisited} pages saved`
            : `${status.pagesVisited} / ${status.pagesVisited +
                status.pagesRemaining} pages`}
        </div>
        <div className="column">
          <progress
            className={classnames("progress", { "is-link": isRunning })}
            value={status.pagesVisited}
            max={status.pagesVisited + status.pagesRemaining}
          />
        </div>
        {isRunning && (
          <div className="column is-narrow">
            {`${status.ppm.toFixed(1)} / ${status.ppmLimit} PPM`}
          </div>
        )}
        {isRunning && (
          <div className="column is-2">
            <progress
              className={classnames("progress", ppmClassName)}
              value={status.ppm}
              max={status.ppmLimit}
            />
          </div>
        )}
        {isRunning && (
          <div className="column is-narrow">
            <button className="button" onClick={onCancelScrape}>
              Cancel
            </button>
          </div>
        )}
      </>
    );
  }
  return (
    <ModalToolbar showCloseButton={!isRunning} onHide={onHide}>
      {content}
    </ModalToolbar>
  );
};

export default ScrapeToolbar;
