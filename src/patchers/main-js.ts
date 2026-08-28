import * as fs from "fs";
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

  const bgOptRe = /backgroundColor\s*:\s*([\w$]+\.getBackgroundColor\(\))\s*,/;
  if (!bgOptRe.test(content)) {
    throw new Error(
      `Could not find expected code in main.js for patch: backgroundColor: *.getBackgroundColor(),`
    );
  }
  content = content.replace(
    bgOptRe,
    `backgroundColor:"#00000000",/*${MARKER}:$1*/`
  );

  const setBgRe = /([\w$]+\.setBackgroundColor\([\w$]+\.colorInfo\.background\))\s*;/;
  if (!setBgRe.test(content)) {
    throw new Error(
      `Could not find expected code in main.js for patch: *.setBackgroundColor(*.colorInfo.background);`
    );
  }
  content = content.replace(
    setBgRe,
    `0/*${MARKER}:$1*/;`
  );

  const viewBgRe = /((?:this|[\w$]+)(?:\.[\w$]+)?\.setBackgroundColor\()"#FFFFFF"\)/;
  if (viewBgRe.test(content)) {
    content = content.replace(
      viewBgRe,
      `$1"#00000000")/*${MARKER}*/`
    );
  }

  const expDarkRe = /experimentalDarkMode\s*:\s*(!0|true)/;
  if (!expDarkRe.test(content)) {
    throw new Error(
      `Could not find expected code in main.js for patch: experimentalDarkMode: !0`
    );
  }
  if (effect !== "none") {
    content = content.replace(
      expDarkRe,
      `experimentalDarkMode:$1,backgroundMaterial:"${effect}"/*${MARKER}*/`
    );
  } else {
    content = content.replace(
      expDarkRe,
      `experimentalDarkMode:$1,transparent:!0/*${MARKER}*/`
    );
  }

  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

export function doUnpatch(content: string): string {
  return content.replace(
    /backgroundColor\s*:\s*"#00000000"\s*,\s*\/\*vscode-translucent-patched(?::(.*?))?\*\//g,
    (_match, orig) => `backgroundColor: ${orig || "n.getBackgroundColor()"},`
  ).replace(
    /0\s*\/\*vscode-translucent-patched(?::(.*?))?\*\/\s*;/g,
    (_match, orig) => `${orig || "n.setBackgroundColor(t.colorInfo.background)"};`
  ).replace(
    /((?:this|[\w$]+)(?:\.[\w$]+)?\.setBackgroundColor\()"#00000000"\)\s*\/\*vscode-translucent-patched\*\//g,
    `$1"#FFFFFF")`
  ).replace( 
    /experimentalDarkMode\s*:\s*(!0|true)\s*,\s*(?:backgroundMaterial\s*:\s*"[^"]*"|transparent\s*:\s*!0|transparent\s*:\s*true)\s*\/\*vscode-translucent-patched\*\//g,
    `experimentalDarkMode: $1`
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


