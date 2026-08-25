import * as vscode from "vscode";

export type EffectType = "mica" | "acrylic" | "tabbed" | "auto" | "none";

export interface TranslucentConfig {
  effect: EffectType;
  opacity: number;
  editorContainerBorderVisible: boolean;
  leftSidebarContainerBorderVisible: boolean;
  rightSidebarContainerBorderVisible: boolean;
  editorContainerBackgroundOpacity: number;
  leftSidebarContainerBackgroundOpacity: number;
  rightSidebarContainerBackgroundOpacity: number;
  applyToJupyterNotebook: boolean;
}

export function getConfig(): TranslucentConfig {
  const cfg = vscode.workspace.getConfiguration("vscode-translucent");
  const defaultOpacity = cfg.get<number>("opacity", 0.75);
  return {
    effect: cfg.get<EffectType>("effect", "mica"),
    opacity: defaultOpacity,
    editorContainerBorderVisible: cfg.get<boolean>("editorContainerBorderVisible", true),
    leftSidebarContainerBorderVisible: cfg.get<boolean>("leftSidebarContainerBorderVisible", true),
    rightSidebarContainerBorderVisible: cfg.get<boolean>("rightSidebarContainerBorderVisible", true),
    editorContainerBackgroundOpacity: cfg.get<number>("editorContainerBackgroundOpacity", defaultOpacity),
    leftSidebarContainerBackgroundOpacity: cfg.get<number>("leftSidebarContainerBackgroundOpacity", defaultOpacity),
    rightSidebarContainerBackgroundOpacity: cfg.get<number>("rightSidebarContainerBackgroundOpacity", defaultOpacity),
    applyToJupyterNotebook: cfg.get<boolean>("applyToJupyterNotebook", false),
  };
}
