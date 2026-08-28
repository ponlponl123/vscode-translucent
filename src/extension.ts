import * as vscode from "vscode";
import * as fs from "fs";
import {
  enableTranslucent,
  disableTranslucent,
  handleError,
} from "./commands/translucent";
import { getInstallPaths } from "./utils/paths";
import { getConfig } from "./utils/config";
import * as workbenchHtml from "./patchers/workbench-html";
import * as mainJs from "./patchers/main-js";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-translucent.enable",
      enableTranslucent,
    ),
    vscode.commands.registerCommand(
      "vscode-translucent.disable",
      disableTranslucent,
    ),
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (!e.affectsConfiguration("vscode-translucent")) {
        return;
      }

      const paths = getInstallPaths();
      const config = getConfig();

      if (e.affectsConfiguration("vscode-translucent.effect")) {
        try {
          if (fs.existsSync(paths.mainJs)) {
            const content = fs.readFileSync(paths.mainJs, "utf-8");
            if (mainJs.isPatched(content)) {
              mainJs.patch(paths.mainJs, config.effect);
              vscode.window.showInformationMessage(
                "Translucent effect updated. A full restart is required.",
              );
            }
          }
        } catch (err: unknown) {
          handleError("update effect", err);
        }
        return;
      }

      try {
        if (fs.existsSync(paths.workbenchHtml)) {
          const content = fs.readFileSync(paths.workbenchHtml, "utf-8");
          if (workbenchHtml.isPatched(content)) {
            workbenchHtml.patch(paths.workbenchHtml, config);
            const selection = await vscode.window.showInformationMessage(
              "Translucent appearance updated. Reload window to apply changes.",
              "Reload Window",
            );
            if (selection === "Reload Window") {
              vscode.commands.executeCommand("workbench.action.reloadWindow");
            }
          }
        }
      } catch (err: unknown) {
        handleError("update appearance", err);
      }
    }),
  );
}

export function deactivate() {}
