const isDevelopment = process.env.NODE_ENV !== "production";
const port = process.env.ELECTRON_WEBPACK_WDS_PORT || "9800";
const appHost = `localhost:${port}`;

if (
  window.location.protocol === "app:" ||
  window.location.protocol === "chrome-error:" ||
  (isDevelopment && window.location.host === appHost)
) {
  window.require = m => {
    // Provide shims for the modules that are referenced by the electron-webpack
    // HTML template.
    if (m === "module") {
      return { globalPaths: [] };
    } else if (m === "source-map-support/source-map-support.js") {
      return { install() {} };
    } else {
      return require(m);
    }
  };
  window.module = {};
} else {
  // Due to a bug in electron's BrowserView module, _blank links result in an
  // invisible, non-interactable, non-closable window when clicked. So we kill
  // all _blank links to avoid the issue.
  window.addEventListener("click", e => {
    if (e.target.getAttribute("target") === "_blank") {
      e.target.removeAttribute("target");
    }
  });
}
