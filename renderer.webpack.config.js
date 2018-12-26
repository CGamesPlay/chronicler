module.exports = {
  // This replaces the normal list of externals so that we can use our renderer
  // bundle in the electron sandbox.
  externals: /^(electron|child_process|fs|os|timers|url)\b/,
  target: "web",
  output: {
    // This fixes the problem of relative asset paths in the HTML
    publicPath: "app://main/",
  },
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /^\/html\/.*/, to: "/index.html" }],
    },
    publicPath: "/",
  },
};
