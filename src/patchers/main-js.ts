import * as fs from "fs";
import type { EffectType } from "../utils/config";

const MARKER = "vscode-translucent-patched";
const MARKER_RE = /vscode-translucent-patched/;

interface Patch {
  /** Regex matching the original code (must have exactly 1 match) */
  find: RegExp;
  /** Replacement string (can use $1 etc. for capture groups) */
  replace: string;
  /** Regex matching the patched code (for unpatching) */
  patched: RegExp;
  /** Original code to restore when unpatching */
  original: string;
}

function buildPatches(effect: EffectType): Patch[] {
  const patches: Patch[] = [
    // 1. Make BrowserWindow background transparent
    {
      find: /backgroundColor\s*:\s*n\.getBackgroundColor\(\)\s*,/,
      replace: `backgroundColor:"#00000000",/*${MARKER}*/`,
      patched:
        /backgroundColor\s*:\s*"#00000000"\s*,\s*\/\*vscode-translucent-patched\*\//,
      original: "backgroundColor:n.getBackgroundColor(),",
    },
    // 2. Prevent theme service from restoring opaque background
    //    Replace the call with a no-op (0) instead of commenting out
    {
      find: /n\.setBackgroundColor\(t\.colorInfo\.background\)\s*;/,
      replace: `0/*${MARKER}*/;`,
      patched: /0\s*\/\*vscode-translucent-patched\*\/\s*;/,
      original: "n.setBackgroundColor(t.colorInfo.background);",
    },
    // 3. Make BrowserView background transparent instead of white
    {
      find: /this\._view\.setBackgroundColor\("#FFFFFF"\)/,
      replace: `this._view.setBackgroundColor("#00000000")/*${MARKER}*/`,
      patched:
        /this\._view\.setBackgroundColor\("#00000000"\)\s*\/\*vscode-translucent-patched\*\//,
      original: 'this._view.setBackgroundColor("#FFFFFF")',
    },
  ];

  // 4. Set the window effect
  if (effect !== "none") {
    patches.push({
      find: /experimentalDarkMode\s*:\s*!0\s*}/,
      replace: `experimentalDarkMode:!0,backgroundMaterial:"${effect}"/*${MARKER}*/}`,
      patched:
        /experimentalDarkMode\s*:\s*!0\s*,\s*backgroundMaterial\s*:\s*"[^"]*"\s*\/\*vscode-translucent-patched\*\/\s*}/,
      original: "experimentalDarkMode:!0}",
    });
  } else {
    patches.push({
      find: /experimentalDarkMode\s*:\s*!0\s*}/,
      replace: `experimentalDarkMode:!0,transparent:!0/*${MARKER}*/}`,
      patched:
        /experimentalDarkMode\s*:\s*!0\s*,\s*transparent\s*:\s*!0\s*\/\*vscode-translucent-patched\*\/\s*}/,
      original: "experimentalDarkMode:!0}",
    });
  }

  return patches;
}

export function isPatched(content: string): boolean {
  return MARKER_RE.test(content);
}

export function patch(filePath: string, effect: EffectType): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  if (isPatched(content)) {
    content = doUnpatch(content);
  }
  const patches = buildPatches(effect);
  for (const p of patches) {
    if (!p.find.test(content)) {
      throw new Error(
        `Could not find expected code in main.js for patch: ${p.find.source.slice(0, 60)}`,
      );
    }
    content = content.replace(p.find, p.replace);
  }
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

function doUnpatch(content: string): string {
  const allEffects: EffectType[] = [
    "mica",
    "acrylic",
    "tabbed",
    "auto",
    "none",
  ];
  for (const eff of allEffects) {
    const patches = buildPatches(eff);
    for (const p of patches) {
      if (p.patched.test(content)) {
        content = content.replace(p.patched, p.original);
      }
    }
  }
  return content;
}

export function unpatch(filePath: string): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  if (!isPatched(content)) {
    return false;
  }
  content = doUnpatch(content);
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}
