import * as vscode from "vscode";
import * as fs from "fs";
import { enableTranslucent, disableTranslucent } from "./commands/translucent";
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
      if (e.affectsConfiguration("vscode-translucent.opacity")) {
        const paths = getInstallPaths();
        try {
          if (fs.existsSync(paths.workbenchHtml)) {
            const content = fs.readFileSync(paths.workbenchHtml, "utf-8");
            if (workbenchHtml.isPatched(content)) {
              const config = getConfig();
              workbenchHtml.patch(paths.workbenchHtml, config.opacity);
              const selection = await vscode.window.showInformationMessage(
                "Translucent opacity updated. Reload window to apply changes.",
                "Reload Window",
              );
              if (selection === "Reload Window") {
                vscode.commands.executeCommand("workbench.action.reloadWindow");
              }
            }
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          vscode.window.showErrorMessage(`Failed to update opacity: ${msg}`);
        }
      }

      if (e.affectsConfiguration("vscode-translucent.effect")) {
        const paths = getInstallPaths();
        try {
          if (fs.existsSync(paths.mainJs)) {
            const content = fs.readFileSync(paths.mainJs, "utf-8");
            if (mainJs.isPatched(content)) {
              const config = getConfig();
              mainJs.patch(paths.mainJs, config.effect);
              vscode.window.showInformationMessage(
                "Translucent effect updated. A full restart is required.",
              );
            }
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          vscode.window.showErrorMessage(`Failed to update effect: ${msg}`);
        }
      }
    }),
  );
}

export function deactivate() {}
