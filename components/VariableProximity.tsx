"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

export type VariableProximityProps = {
  label: string;
  className?: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
};

function parseVariationSettings(input: string): Record<string, number> {
  const out: Record<string, number> = {};
  const re = /'([^']+)'\s+([\d.]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    out[m[1]] = parseFloat(m[2]);
  }
  return out;
}

function serializeVariationSettings(values: Record<string, number>): string {
  return Object.entries(values)
    .map(([k, v]) => `'${k}' ${Math.round(v * 100) / 100}`)
    .join(", ");
}

function lerpVariation(
  from: Record<string, number>,
  to: Record<string, number>,
  t: number,
): Record<string, number> {
  const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
  const result: Record<string, number> = {};
  keys.forEach((k) => {
    const a = from[k] ?? to[k] ?? 0;
    const b = to[k] ?? from[k] ?? 0;
    result[k] = a + (b - a) * t;
  });
  return result;
}

function applyFalloff(
  raw: number,
  mode: NonNullable<VariableProximityProps["falloff"]>,
): number {
  const x = Math.min(1, Math.max(0, raw));
  switch (mode) {
    case "exponential":
      return x * x;
    case "gaussian":
      return Math.exp(-Math.pow(1 - x, 2) * 3);
    case "linear":
    default:
      return x;
  }
}

export default function VariableProximity({
  label,
  className = "",
  fromFontVariationSettings,
  toFontVariationSettings,
  containerRef,
  radius = 100,
  falloff = "linear",
}: VariableProximityProps) {
  const from = useMemo(
    () => parseVariationSettings(fromFontVariationSettings),
    [fromFontVariationSettings],
  );
  const to = useMemo(
    () => parseVariationSettings(toFontVariationSettings),
    [toFontVariationSettings],
  );
  const defaultSettings = useMemo(
    () => serializeVariationSettings(from),
    [from],
  );

  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const chars = useMemo(() => [...label], [label]);

  useLayoutEffect(() => {
    spanRefs.current = spanRefs.current.slice(0, chars.length);
  }, [chars.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const fn = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const applyStatic = useCallback(() => {
    spanRefs.current.forEach((el) => {
      if (!el) return;
      el.style.fontVariationSettings = defaultSettings;
    });
  }, [defaultSettings]);

  const onMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container || prefersReducedMotion) return;

      const cRect = container.getBoundingClientRect();
      const mx = e.clientX - cRect.left;
      const my = e.clientY - cRect.top;

      spanRefs.current.forEach((el) => {
        if (!el) return;
        const sRect = el.getBoundingClientRect();
        const cx = sRect.left - cRect.left + sRect.width / 2;
        const cy = sRect.top - cRect.top + sRect.height / 2;
        const d = Math.hypot(mx - cx, my - cy);
        const linearT = radius <= 0 ? 0 : Math.max(0, 1 - d / radius);
        const t = applyFalloff(linearT, falloff);
        const merged = lerpVariation(from, to, t);
        el.style.fontVariationSettings = serializeVariationSettings(merged);
      });
    },
    [containerRef, from, to, radius, falloff, prefersReducedMotion],
  );

  const onLeave = useCallback(() => {
    applyStatic();
  }, [applyStatic]);

  useEffect(() => {
    const container = containerRef.current;
    applyStatic();
    if (!container || prefersReducedMotion) return;

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [
    containerRef,
    onMove,
    onLeave,
    applyStatic,
    label,
    prefersReducedMotion,
  ]);

  return (
    <span className={`proximity-text inline ${className}`.trim()}>
      {chars.map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            spanRefs.current[i] = el;
          }}
          style={{
            display: ch === " " ? "inline" : "inline-block",
            fontVariationSettings: defaultSettings,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
