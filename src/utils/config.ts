import * as vscode from "vscode";

export type EffectType = "mica" | "acrylic" | "tabbed" | "auto" | "none";

export interface TranslucentConfig {
  effect: EffectType;
  opacity: number;
}

export function getConfig(): TranslucentConfig {
  const cfg = vscode.workspace.getConfiguration("vscode-translucent");
  return {
    effect: cfg.get<EffectType>("effect", "mica"),
    opacity: cfg.get<number>("opacity", 0.75),
  };
}
