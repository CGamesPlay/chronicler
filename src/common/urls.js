// @flow

const isDevelopment = process.env.NODE_ENV !== "production";
// Something in the setup of custom protocols, multiple sessions, and live
// reloading breaks Chrome's cache. It refuses to notice that the JS files have
// been modified once they have been loaded in the content views (but works fine
// with the renderer views). This obviously only affects development mode, but
// the workaround is to serve our content pages over http when in development.
// This is also reflected in the preload script.
export const contentRoot = isDevelopment
  ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT || "9800"}/html`
  : "app://main/html";
export const contentUrl = (path: string) => contentRoot + path;

export const allPagesUrl = "/all-pages";
export const searchUrl = (query?: string) =>
  query ? `/search?q=${encodeURIComponent(query)}` : "/search";

// Absolute URLs referenced by the main process
export const chromeUrl = "app://main/html/chrome.html";
export const newTabUrl = contentUrl(allPagesUrl);
