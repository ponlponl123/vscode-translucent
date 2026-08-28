import * as vscode from "vscode";
import type { EffectType, TranslucentConfig } from "../types";

export type { EffectType, TranslucentConfig };

export function getConfig(): TranslucentConfig {
  const cfg = vscode.workspace.getConfiguration("vscode-translucent");
  const defaultOpacity = cfg.get<number>("opacity", 0.4);
  return {
    effect: cfg.get<EffectType>("effect", "mica"),
    opacity: defaultOpacity,
    editorContainerBorderVisible: cfg.get<boolean>("editorContainerBorderVisible", true),
    leftSidebarContainerBorderVisible: cfg.get<boolean>("leftSidebarContainerBorderVisible", true),
    rightSidebarContainerBorderVisible: cfg.get<boolean>("rightSidebarContainerBorderVisible", true),
    editorContainerBackgroundOpacity: cfg.get<number>("editorContainerBackgroundOpacity", defaultOpacity),
    leftSidebarContainerBackgroundOpacity: cfg.get<number>("leftSidebarContainerBackgroundOpacity", 0.8),
    rightSidebarContainerBackgroundOpacity: cfg.get<number>("rightSidebarContainerBackgroundOpacity", 0.8),
    applyToJupyterNotebook: cfg.get<boolean>("applyToJupyterNotebook", false),
  };
}
