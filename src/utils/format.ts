export const clamp = (v: number, min = 0, max = 1): number =>
  Math.max(min, Math.min(max, v));

export function formatSize(val?: string | number, def = "0px"): string {
  if (!val) {
    return def;
  }
  const s = String(val).trim();
  return /^-?\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
}

export function parseBoxValues(
  val?: string | number,
  def: [string, string, string, string] = ["0px", "2px", "2px", "2px"]
): [string, string, string, string] {
  if (!val) {
    return def;
  }
  if (typeof val === "number") {
    return [`${val}px`, `${val}px`, `${val}px`, `${val}px`];
  }
  const p = String(val).trim().split(/\s+/).map((v) => (/^-?\d+(\.\d+)?$/.test(v) ? `${v}px` : v));
  const [t = "0px", r = t, b = t, l = r] = p;
  return [t, r, p.length > 2 ? b : t, p.length > 3 ? p[3] : r];
}

export const calcMargin = (m: string, g: string): string =>
  g === "0px" ? m : m === "0px" ? g : `calc(${m} + ${g})`;
