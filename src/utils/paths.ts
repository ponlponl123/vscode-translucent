import * as path from "path";
import * as fs from "fs";

function getAppRoot(): string {
  try {
    const vscode = require("vscode");
    return vscode?.env?.appRoot ?? "";
  } catch {
    return "";
  }
}

export function getInstallPaths(customAppRoot?: string) {
  const appRoot = customAppRoot || getAppRoot();

  const mainCandidates = [
    path.join(appRoot, "out", "mainImpl.js"),
    path.join(appRoot, "out", "main.js"),
  ];
  const mainJs = mainCandidates.find((p) => fs.existsSync(p)) ?? mainCandidates[1];

  const workbenchDirCandidates = [
    path.join(appRoot, "out", "vs", "code", "electron-browser", "workbench"),
    path.join(appRoot, "out", "vs", "code", "electron-sandbox", "workbench"),
  ];
  const workbenchDir =
    workbenchDirCandidates.find((d) => fs.existsSync(path.join(d, "workbench.html"))) ??
    workbenchDirCandidates[0];

  return {
    mainJs,
    workbenchHtml: path.join(workbenchDir, "workbench.html"),
    workbenchJs: path.join(workbenchDir, "workbench.js"),
  };
}
