"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const LENS = 132;

function clampLensOffset(axis: number, lens: number, dim: number) {
  if (dim <= lens) return 0;
  return Math.min(Math.max(axis - lens / 2, 0), dim - lens);
}

export function BmwHoverReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [finePointer, setFinePointer] = useState(true);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setDims({ w: r.width, h: r.height });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const updatePos = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: clientX - r.left, y: clientY - r.top });
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    },
    [updatePos],
  );

  const onMouseEnter = useCallback(() => {
    measure();
    setHover(true);
  }, [measure]);

  const onMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!finePointer) return;
      measure();
      setHover(true);
      const t = e.touches[0];
      if (t) updatePos(t.clientX, t.clientY);
    },
    [finePointer, measure, updatePos],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!finePointer) return;
      const t = e.touches[0];
      if (t) updatePos(t.clientX, t.clientY);
    },
    [finePointer, updatePos],
  );

  const onTouchEnd = useCallback(() => {
    setHover(false);
  }, []);

  useEffect(() => {
    if (!finePointer) return;
    const ro = new ResizeObserver(measure);
    const el = containerRef.current;
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [finePointer, measure]);

  const left = clampLensOffset(pos.x, LENS, dims.w);
  const top = clampLensOffset(pos.y, LENS, dims.h);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[min(100%,400px)] cursor-crosshair touch-none select-none overflow-hidden border border-foreground/25 bg-card/30 sm:touch-auto"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {finePointer ? (
        <>
          <Image
            src="/bmw.png"
            alt="BMW — move the pointer to reveal detail"
            fill
            className="object-cover blur-[14px] brightness-[0.92] contrast-[0.95]"
            sizes="(max-width: 640px) 100vw, 400px"
            priority
          />
          {hover && dims.w > 0 && dims.h > 0 && (
            <div
              className="pointer-events-none absolute z-10 overflow-hidden rounded-sm border border-foreground/15 bg-background/20 shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
              style={{
                width: LENS,
                height: LENS,
                left,
                top,
              }}
            >
              <div
                className="relative"
                style={{
                  width: dims.w,
                  height: dims.h,
                  transform: `translate(${-left}px, ${-top}px)`,
                }}
              >
                <Image
                  src="/bmw.png"
                  alt=""
                  width={Math.round(dims.w)}
                  height={Math.round(dims.h)}
                  className="max-h-none max-w-none object-cover"
                  style={{ width: dims.w, height: dims.h }}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <Image
          src="/bmw.png"
          alt="BMW"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 400px"
          priority
        />
      )}
    </div>
  );
}
