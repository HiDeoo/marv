"use strict";

const mainWindow = require("./window/mainWindow");
const { app } = require("electron");
const server = require("./server");
const store = require("../stores");
const tray = require("./tray");

app.requestSingleInstanceLock() || app.quit();

app.on("window-all-closed", (event) => {
  event.preventDefault();
});

app.whenReady().then(() => {
  server.start();
  mainWindow({ showOnLoad: store.app.get("openOnStartup") });
  tray();
});
