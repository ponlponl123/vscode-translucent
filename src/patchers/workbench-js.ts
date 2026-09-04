import * as fs from "fs";

const MARKER = "vscode-translucent-patched";
const MARKER_RE = /vscode-translucent-patched/;

const DETECTOR_START = "/*vscode-translucent-detector-start*/";
const DETECTOR_END = "/*vscode-translucent-detector-end*/";
const DETECTOR_CODE = `(function(){let s="";function d(){const b=document.querySelector(".part.activitybar");if(!b)return!1;const r=b.classList.contains("right")||(!b.classList.contains("left")&&b.getBoundingClientRect().left>window.innerWidth/2)?"right":"left";if(r!==s){s=r;document.documentElement.setAttribute("data-actionbar-side",r);document.documentElement.setAttribute("data-activitybar-side",r);}return!0;}let p=!1;function q(){if(!p){p=!0;requestAnimationFrame(()=>{p=!1;d();});}}function bind(b){const o=new MutationObserver(q);o.observe(b,{attributes:!0,attributeFilter:["class"]});if(b.parentElement)o.observe(b.parentElement,{childList:!0});window.addEventListener("resize",q,{passive:!0});}if(!d()){const io=new MutationObserver(()=>{const b=document.querySelector(".part.activitybar");if(b){io.disconnect();d();bind(b);}});io.observe(document.documentElement,{childList:!0,subtree:!0});}else{const b=document.querySelector(".part.activitybar");if(b)bind(b);}})();`;

const FIND =
  /background-color:\s*\$\{([\w$]+)\};\s*color:\s*\$\{([\w$]+)\};\s*margin:\s*0;\s*padding:\s*0;\s*\}/;

export function isPatched(content: string): boolean {
  return MARKER_RE.test(content);
}

export function patch(filePath: string): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  if (isPatched(content)) {
    content = doUnpatch(content);
  }
  const match = FIND.exec(content);
  if (!match) {
    throw new Error(
      "Could not find initialShellColors template in workbench.js",
    );
  }
  const [, bgVar, fgVar] = match;
  const replacement =
    `background-color:transparent;color:\${${fgVar}};margin:0;padding:0;}` +
    "#monaco-parts-splash,#monaco-parts-splash *{background-color:transparent!important}" +
    `/*${MARKER}:${match[0]}*/`;

  content = content.replace(FIND, replacement);
  content = `${content}\n${DETECTOR_START}\n${DETECTOR_CODE}\n${DETECTOR_END}\n`;
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

export function doUnpatch(content: string): string {
  content = content.replace(
    /\n?\/\*vscode-translucent-detector-start\*\/[\s\S]*?\/\*vscode-translucent-detector-end\*\/\n?/g,
    ""
  );
  return content.replace(
    /background-color:\s*transparent\s*;\s*color:\s*\$\{[\w$]+\};\s*margin:\s*0;\s*padding:\s*0;\s*\}\s*#monaco-parts-splash\s*,\s*#monaco-parts-splash\s*\*\s*\{\s*background-color:\s*transparent\s*!important\s*\}\s*\/\*vscode-translucent-patched(?::(.*?))?\*\//g,
    (_match, orig) => orig || "background-color: ${l}; color: ${d}; margin: 0; padding: 0; }",
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

