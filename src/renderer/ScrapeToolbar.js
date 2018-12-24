// @flow
import * as React from "react";

import type { ScrapeConfig, ScrapeStatus } from "common/events";
import { ModalToolbar } from "./common";

const exampleConfig: ScrapeConfig = {
  rootUrls: ["https://bulma.io/documentation/"],
  linkXpath: '//nav[@id="categories"]//a',
};

type Props = {
  scrapeStatus?: ?ScrapeStatus,
  onScrape?: ScrapeConfig => void,
  onHide?: () => void,
};

const ScrapeToolbar = ({ scrapeStatus, onScrape, onHide }: Props) => (
  <ModalToolbar onHide={onHide}>
    <button
      className="button"
      onClick={() => onScrape && onScrape(exampleConfig)}
    >
      Go
    </button>
    {scrapeStatus && JSON.stringify(scrapeStatus)}
  </ModalToolbar>
);

export default ScrapeToolbar;
