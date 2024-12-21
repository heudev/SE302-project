import { app as t, BrowserWindow as r, ipcMain as i, Menu as m } from "electron";
import { createRequire as d } from "node:module";
import { fileURLToPath as f } from "node:url";
import e from "node:path";
import a from "fs";
d(import.meta.url);
const l = e.dirname(f(import.meta.url));
process.env.APP_ROOT = e.join(l, "..");
const s = process.env.VITE_DEV_SERVER_URL, _ = e.join(process.env.APP_ROOT, "dist-electron"), c = e.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? e.join(process.env.APP_ROOT, "public") : c;
let o;
function p() {
  o = new r({
    icon: e.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: e.join(l, "preload.mjs")
    }
  }), m.setApplicationMenu(null), o.maximize(), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), s ? o.loadURL(s) : o.loadFile(e.join(c, "index.html"));
}
t.on("window-all-closed", () => {
  process.platform !== "darwin" && (t.quit(), o = null);
});
t.on("activate", () => {
  r.getAllWindows().length === 0 && p();
});
t.whenReady().then(p);
i.handle("read-courses-file", () => {
  try {
    const n = e.join(t.getAppPath(), "..", "..", "..", "..", "data", "Courses.csv");
    return a.readFileSync(n, "utf8");
  } catch {
    return console.log("No Courses.csv file found in the local file system. Attempting to fetch from public/data/Courses.csv..."), null;
  }
});
i.handle("read-classrooms-file", () => {
  try {
    const n = e.join(t.getAppPath(), "..", "..", "..", "..", "data", "ClassroomCapacity.csv");
    return a.readFileSync(n, "utf8");
  } catch {
    return console.log("No ClassroomCapacity.csv file found in the local file system. Attempting to fetch from public/data/ClassroomCapacity.csv..."), null;
  }
});
export {
  _ as MAIN_DIST,
  c as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};
