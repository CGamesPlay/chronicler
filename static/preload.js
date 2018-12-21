if (window.location.protocol === "app:") {
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
}
