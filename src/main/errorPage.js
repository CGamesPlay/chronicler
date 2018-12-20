// @flow

// $FlowFixMe - doesn't handle webpack directives
import bulma from "raw-loader!bulma/css/bulma.css";

type ErrorPage = {
  css: string,
  title: string,
  html: string,
};

const errorPage = (code: number, error: string, url: string): ErrorPage => {
  return {
    css: bulma,
    title: url,
    html: `<div class="container">
  <div class="notification">
    <p>The page failed to load.</p>
    <p><a onClick="window.resolveError('reload')">Refresh page</a></p>
    <p>Error code: ${code} ${error}</p>
  </div>
</div>`,
  };
};

export default errorPage;
