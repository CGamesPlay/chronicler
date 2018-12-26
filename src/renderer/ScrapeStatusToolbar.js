// @flow
import * as React from "react";
import classnames from "classnames";

import type { ScrapeConfig, ScrapeStatus } from "common/events";
import { ModalToolbar } from "./components";

type Props = {
  status?: ?ScrapeStatus,
  onScrape?: ScrapeConfig => void,
  onCancelScrape?: () => void,
  onHide?: () => void,
};

const ScrapeStatusToolbar = ({ status, onCancelScrape, onHide }: Props) => {
  const isRunning =
    status && (status.state === "initialized" || status.state === "running");
  if (!status) {
    status = {
      state: "initialized",
      pagesVisited: 0,
      pagesRemaining: 0,
      ppm: 0,
      ppmLimit: 1,
    };
  }
  const runRate = status.ppm / status.ppmLimit;
  const ppmClassName =
    runRate < 0.1 ? "is-danger" : runRate < 0.7 ? "is-warning" : "is-success";
  return (
    <ModalToolbar showCloseButton={!isRunning} onHide={onHide}>
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
    </ModalToolbar>
  );
};

export default ScrapeStatusToolbar;
