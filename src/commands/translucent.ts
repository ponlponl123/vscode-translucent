import * as vscode from "vscode";
import * as cp from "child_process";
import { getInstallPaths } from "../utils/paths";
import { getConfig } from "../utils/config";
import * as mainJs from "../patchers/main-js";
import * as workbenchHtml from "../patchers/workbench-html";
import * as workbenchJs from "../patchers/workbench-js";

export async function enableTranslucent() {
  const paths = getInstallPaths();
  const config = getConfig();
  try {
    mainJs.patch(paths.mainJs, config.effect);
    workbenchHtml.patch(paths.workbenchHtml, config.opacity);
    workbenchJs.patch(paths.workbenchJs);
    await promptRestart();
  } catch (err: unknown) {
    handleError("enable", err);
  }
}

export async function disableTranslucent() {
  const paths = getInstallPaths();
  try {
    const a = mainJs.unpatch(paths.mainJs);
    const b = workbenchHtml.unpatch(paths.workbenchHtml);
    const c = workbenchJs.unpatch(paths.workbenchJs);

    if (!a && !b && !c) {
      vscode.window.showInformationMessage(
        "Translucent effect is already disabled.",
      );
      return;
    }
    await promptRestart();
  } catch (err: unknown) {
    handleError("disable", err);
  }
}

async function promptRestart() {
  const action = await vscode.window.showInformationMessage(
    "Translucent effect applied. A full restart is required.",
    "Restart Now",
  );
  if (action === "Restart Now") {
    const codePath = process.execPath;
    cp.spawn(codePath, { detached: true, stdio: "ignore" }).unref();
    vscode.commands.executeCommand("workbench.action.quit");
  }
}

function handleError(action: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("EPERM") || msg.includes("EACCES")) {
    vscode.window.showErrorMessage(
      "Permission denied. Try running VS Code as Administrator.",
    );
  } else {
    vscode.window.showErrorMessage(`Failed to ${action} translucent: ${msg}`);
  }
}
