import type { CSSOptions, NormalizedCSSOptions } from "../types";
import { clamp, formatSize, parseBoxValues, calcMargin } from "./format";

export function normalizeOptions(opts: CSSOptions = 0.4): NormalizedCSSOptions {
  const o = typeof opts === "number" ? { opacity: opts } : opts;
  const baseOpacity = clamp(o.opacity ?? 0.4);
  const editorOpacity = clamp(o.editorContainerBackgroundOpacity ?? baseOpacity);
  const leftSidebarOpacity = clamp(o.leftSidebarContainerBackgroundOpacity ?? 0.8);
  const rightSidebarOpacity = clamp(o.rightSidebarContainerBackgroundOpacity ?? 0.8);
  const activityBarOpacity = clamp(o.activityBarContainerBackgroundOpacity ?? o.activityBarBackgroundOpacity ?? 0);

  const rawMargin = o.activityBarContainerMargin ?? o.activityBarMargin ?? "0px 2px 2px 2px";
  const rawGap = o.activityBarContainerGap ?? o.activityBarContainerGapBetweenWorkspace ?? o.activityBarGap ?? "0px";
  const [top, right, bottom, left] = parseBoxValues(rawMargin);
  const gapSize = formatSize(rawGap, "0px");

  return {
    baseOpacity,
    editorOpacity,
    leftSidebarOpacity,
    rightSidebarOpacity,
    activityBarOpacity,
    basePct: Math.round(baseOpacity * 100),
    editorPct: Math.round(editorOpacity * 100),
    leftSidebarPct: Math.round(leftSidebarOpacity * 100),
    rightSidebarPct: Math.round(rightSidebarOpacity * 100),
    activityBarPct: Math.round(activityBarOpacity * 100),
    editorBorderVisible: o.editorContainerBorderVisible ?? true,
    leftSidebarBorderVisible: o.leftSidebarContainerBorderVisible ?? true,
    rightSidebarBorderVisible: o.rightSidebarContainerBorderVisible ?? true,
    activityBarBorderVisible: o.activityBarContainerBorderVisible ?? o.activityBarBorderVisible ?? false,
    editorBorderRadius: formatSize(o.editorContainerBorderRadius ?? o.editorContainerRound, "8px"),
    leftSidebarBorderRadius: formatSize(o.leftSidebarContainerBorderRadius ?? o.leftSidebarContainerRound, "8px"),
    rightSidebarBorderRadius: formatSize(o.rightSidebarContainerBorderRadius ?? o.rightSidebarContainerRound, "8px"),
    activityBarBorderRadius: formatSize(o.activityBarContainerBorderRadius ?? o.activityBarContainerRound, "8px"),
    activityBarMargin: `${top} ${right} ${bottom} ${left}`,
    activityBarMarginLeft: calcMargin(left, gapSize),
    activityBarMarginRight: calcMargin(right, gapSize),
    activityBarGap: gapSize,
    applyToJupyterNotebook: o.applyToJupyterNotebook ?? false,
    vscodeVersion: o.vscodeVersion,
  };
}
