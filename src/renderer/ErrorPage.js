// @flow
import * as React from "react";
import { Helmet } from "react-helmet";

import * as errors from "common/errors";
import { contentUrl, allPagesUrl } from "common/urls";

type Props = {
  url: string,
  code: number,
  error: string,
  onResolve: ({ command: string, payload?: any }) => void,
};

const ErrorPage = ({ url, code, error, onResolve }: Props) => {
  let description;
  const actions: Array<React.Node> = [];
  if (code == errors.ERR_NETWORK_IO_SUSPENDED) {
    description =
      "This page is not saved and you are currently in offline mode.";
    actions.push(
      <a onClick={() => onResolve({ command: "start-recording" })}>
        Go online
      </a>,
    );
    actions.push(
      <a onClick={() => onResolve({ command: "open-external", payload: url })}>
        Open in default browser
      </a>,
    );
    actions.push(
      <a
        onClick={() =>
          onResolve({ command: "open-url", payload: contentUrl(allPagesUrl) })
        }
      >
        View all saved pages
      </a>,
    );
  } else {
    description = "An error occurred while trying to load this page.";
    actions.push(
      <a onClick={() => onResolve({ command: "reload" })}>Reload the page</a>,
    );
  }
  const actionItems = actions.map((action, i) => <li key={i}>{action}</li>);
  return (
    <section className="section">
      <Helmet>
        <title>{url}</title>
        <body className="has-background-white" />
      </Helmet>
      <div className="container">
        <div className="notification content">
          <p>{description}</p>
          <ul>{actionItems}</ul>
          <p className="has-text-grey">
            Error code: {code} {error}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
