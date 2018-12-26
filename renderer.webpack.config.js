// For some reason NODE_ENV isn't set in the real environment.
const isDevelopment =
  typeof process.env.ELECTRON_WEBPACK_WDS_PORT !== "undefined";

module.exports = {
  // This replaces the normal list of externals so that we can use our renderer
  // bundle in the electron sandbox.
  externals: /^(electron|child_process|fs|os|timers|url)\b/,
  target: "web",
  output: {
    // This is necessary for chrome-error URLs to be able to access the bundle
    publicPath: isDevelopment
      ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/`
      : "app://main/",
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: {
      rewrites: [{ from: /^\/html\/.*/, to: "/index.html" }],
    },
    publicPath: "/",
  },
};
