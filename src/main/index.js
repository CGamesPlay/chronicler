"use strict";

import { app, BrowserWindow } from "electron";

import App from "./app";
import registerProtocols from "./protocols";

// global reference to mainApp (necessary to prevent window from being
// garbage collected)
let mainApp;

const createMainApp = () => {
  mainApp = new App();
  mainApp.on("closed", () => {
    mainApp = null;
  });
};

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user
  // explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have
  // been closed
  if (mainApp === null) {
    createMainApp();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  registerProtocols();
  createMainApp();
});
