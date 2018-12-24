// @flow

import * as errors from "common/errors";
import { contentRoot, allPagesUrl } from "common/urls";

// $FlowFixMe - doesn't handle webpack directives
import bulma from "raw-loader!bulma/css/bulma.css";

const combinedCss = bulma + "\n\nbody { background: white; }";

type ErrorPage = {
  css: string,
  title: string,
  html: string,
};

const resolveLink = (action: string, text: string) =>
  `<a onClick="window.resolveError('${action}')">${text}</a>`;

const link = (href: string, text: string) => `<a href="${href}">${text}</a>`;

const errorPage = (code: number, error: string, url: string): ErrorPage => {
  let description;
  const actions: Array<string> = [];
  if (code == errors.ERR_NETWORK_IO_SUSPENDED) {
    description =
      "This page is not saved and you are currently in offline mode.";
    actions.push(resolveLink("start-recording", "Go online"));
    actions.push(link(contentRoot + allPagesUrl, "View all saved pages"));
  } else {
    description = "An error occurred while trying to load this page.";
    actions.push(resolveLink("reload", "Reload the page"));
  }
  const actionStr = actions.map(html => `<li>${html}</li>`).join("");
  return {
    css: bulma,
    title: url,
    html: `
      <section class="section">
        <div class="container">
          <div class="notification content">
            <p>${description}</p>
            <ul>${actionStr}</ul>
            <p class="has-text-grey">Error code: ${code} ${error}</p>
          </div>
        </div>
      </section>
    `,
  };
};

export default errorPage;
