import * as vscode from "vscode";
import * as path from "path";

export function getInstallPaths() {
  const appRoot = vscode.env.appRoot;
  const workbenchDir = path.join(
    appRoot,
    "out",
    "vs",
    "code",
    "electron-browser",
    "workbench",
  );
  return {
    mainJs: path.join(appRoot, "out", "main.js"),
    workbenchHtml: path.join(workbenchDir, "workbench.html"),
    workbenchJs: path.join(workbenchDir, "workbench.js"),
  };
}
