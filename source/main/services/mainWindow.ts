import { app, BrowserWindow } from "electron";
import path from 'node:path';

import { getResourcesDir, getPreloadEntry } from "@main/utils/resources";

export default function createMainWindow () {
  const window = new BrowserWindow({
    height: 768,
    width: 1080,
    // If testing and not debuging mode run in headless mode, in background
    show: globals.ENVIRONMENT !== 'testing' || globals.DEBUG === true,
    hasShadow: true,
    webPreferences: {
      preload: getPreloadEntry(),
    },
  })

  window.loadFile(path.join(getResourcesDir(), 'index.html'))
  // Open the DevTools.
  if (['development'].some((item) => item === globals.ENVIRONMENT)) {
    window.webContents.openDevTools();
  }
  return window
}