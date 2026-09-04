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
    activityBarContainerBorderVisible: cfg.get<boolean>("activityBarContainerBorderVisible") ?? cfg.get<boolean>("activityBarBorderVisible", false),
    editorContainerBackgroundOpacity: cfg.get<number>("editorContainerBackgroundOpacity", defaultOpacity),
    leftSidebarContainerBackgroundOpacity: cfg.get<number>("leftSidebarContainerBackgroundOpacity", 0.8),
    rightSidebarContainerBackgroundOpacity: cfg.get<number>("rightSidebarContainerBackgroundOpacity", 0.8),
    activityBarContainerBackgroundOpacity: cfg.get<number>("activityBarContainerBackgroundOpacity") ?? cfg.get<number>("activityBarBackgroundOpacity", 0),
    editorContainerBorderRadius: String(cfg.get<string | number>("editorContainerBorderRadius") ?? cfg.get<string | number>("editorContainerRound", "8px")),
    leftSidebarContainerBorderRadius: String(cfg.get<string | number>("leftSidebarContainerBorderRadius") ?? cfg.get<string | number>("leftSidebarContainerRound", "8px")),
    rightSidebarContainerBorderRadius: String(cfg.get<string | number>("rightSidebarContainerBorderRadius") ?? cfg.get<string | number>("rightSidebarContainerRound", "8px")),
    activityBarContainerBorderRadius: String(cfg.get<string | number>("activityBarContainerBorderRadius") ?? cfg.get<string | number>("activityBarContainerRound", "8px")),
    activityBarContainerMargin: String(cfg.get<string | number>("activityBarContainerMargin") ?? cfg.get<string | number>("activityBarMargin", "0px 2px 2px 2px")),
    activityBarContainerGap: String(cfg.get<string | number>("activityBarContainerGap") ?? cfg.get<string | number>("activityBarContainerGapBetweenWorkspace") ?? cfg.get<string | number>("activityBarGap", "0px")),
    applyToJupyterNotebook: cfg.get<boolean>("applyToJupyterNotebook", false),
  };
}
