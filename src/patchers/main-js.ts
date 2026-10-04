import * as fs from "fs";
import * as path from "path";
import type { EffectType } from "../utils/config";

const MARKER = "vscode-translucent-patched";
const MARKER_RE = /vscode-translucent-patched/;

export function isPatched(content: string): boolean {
  return MARKER_RE.test(content);
}

export function patch(filePath: string, effect: EffectType): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  if (isPatched(content)) {
    content = doUnpatch(content);
  }

  const fileName = path.basename(filePath);

  const bgOptRe = /\b(backgroundColor\s*:\s*)([\w$]+\.getBackgroundColor\(\))\s*,/;
  if (!bgOptRe.test(content)) {
    throw new Error(
      `Could not find expected code in ${fileName} for patch: backgroundColor: *.getBackgroundColor(),`
    );
  }
  content = content.replace(
    bgOptRe,
    `backgroundColor:"#00000000",/*${MARKER}:$1$2*/`
  );

  const setBgRe = /\b([\w$]+\.setBackgroundColor\([\w$]+\.colorInfo\.background\))\s*;/;
  if (!setBgRe.test(content)) {
    throw new Error(
      `Could not find expected code in ${fileName} for patch: *.setBackgroundColor(*.colorInfo.background);`
    );
  }
  content = content.replace(
    setBgRe,
    `0/*${MARKER}:$1*/;`
  );

  const viewBgRe = /\b((?:this|[\w$]+(?:\.[\w$]+)?)\.setBackgroundColor\()"#FFFFFF"\)/;
  if (viewBgRe.test(content)) {
    content = content.replace(
      viewBgRe,
      `$1"#00000000")/*${MARKER}*/`
    );
  }

  const expDarkRe = /\b(experimentalDarkMode\s*:\s*)(!0|true)/;
  if (!expDarkRe.test(content)) {
    throw new Error(
      `Could not find expected code in ${fileName} for patch: experimentalDarkMode: !0`
    );
  }
  if (effect !== "none") {
    content = content.replace(
      expDarkRe,
      `experimentalDarkMode:$2,backgroundMaterial:"${effect}"/*${MARKER}:$1$2*/`
    );
  } else {
    content = content.replace(
      expDarkRe,
      `experimentalDarkMode:$2,transparent:!0/*${MARKER}:$1$2*/`
    );
  }

  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

export function doUnpatch(content: string): string {
  return content.replace(
    /\bbackgroundColor\s*:\s*"#00000000"\s*,\s*\/\*vscode-translucent-patched(?::(.*?))?\*\//g,
    (_match, orig) => {
      if (!orig) {
        return "backgroundColor: n.getBackgroundColor(),";
      }
      return orig.startsWith("backgroundColor") ? `${orig},` : `backgroundColor: ${orig},`;
    }
  ).replace(
    /\b0\s*\/\*vscode-translucent-patched(?::(.*?))?\*\/\s*;/g,
    (_match, orig) => `${orig || "n.setBackgroundColor(t.colorInfo.background)"};`
  ).replace(
    /\b((?:this|[\w$]+(?:\.[\w$]+)?)\.setBackgroundColor\()"#00000000"\)\s*\/\*vscode-translucent-patched\*\//g,
    `$1"#FFFFFF")`
  ).replace(
    /\bexperimentalDarkMode\s*:\s*(?:!0|true)\s*,\s*(?:backgroundMaterial\s*:\s*"[^"]*"|transparent\s*:\s*!0|transparent\s*:\s*true)\s*\/\*vscode-translucent-patched(?::(.*?))?\*\//g,
    (_match, orig) => orig || "experimentalDarkMode: !0"
  );
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


