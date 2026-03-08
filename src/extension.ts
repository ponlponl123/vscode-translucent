import * as vscode from "vscode";
import { enableTranslucent, disableTranslucent } from "./commands/translucent";

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
  );
}

export function deactivate() {}
