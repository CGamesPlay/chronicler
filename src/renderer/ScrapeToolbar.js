// @flow
import * as React from "react";
import classnames from "classnames";

import type { ScrapeConfig, ScrapeStatus } from "common/events";
import { ModalToolbar } from "./components";

const exampleConfig: ScrapeConfig = {
  rootUrls: ["https://bulma.io/documentation/"],
  linkXpath: '//nav[@id="categories"]//a',
};

type Props = {
  status?: ?ScrapeStatus,
  onScrape?: ScrapeConfig => void,
  onHide?: () => void,
};

const ScrapeToolbar = ({ status, onScrape, onHide }: Props) => {
  let content;
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
          {status.state === "finished"
            ? `${status.pagesVisited} pages saved`
            : `${status.pagesVisited} / ${status.pagesVisited +
                status.pagesRemaining}`}
        </div>
        <div className="column">
          <progress
            className={classnames("progress", {
              "is-link":
                status.state !== "finished" && status.state !== "canceled",
            })}
            value={status.pagesVisited}
            max={status.pagesVisited + status.pagesRemaining}
          />
        </div>
      </>
    );
  }
  return <ModalToolbar onHide={onHide}>{content}</ModalToolbar>;
};

export default ScrapeToolbar;
