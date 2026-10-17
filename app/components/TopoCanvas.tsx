"use client";

import { useEffect, useRef } from "react";

const CELL = 11; // px per grid cell; shortcut: coarser = faster but blockier lines
const LEVELS = 16;

// marching-squares edge pairs; edges: 0 top, 1 right, 2 bottom, 3 left
const TABLE: number[][] = [
  [], [3, 2], [2, 1], [3, 1], [0, 1], [0, 3, 1, 2], [0, 2], [0, 3],
  [0, 3], [0, 2], [0, 1, 2, 3], [0, 1], [3, 1], [2, 1], [3, 2], [],
];

// smooth, slowly evolving scalar field in [0,1] built from warped sines
function field(x: number, y: number, t: number) {
  const wx = x + 0.55 * Math.sin(y * 1.3 + t * 0.35) + 0.3 * Math.sin(y * 2.7 - t * 0.2);
  const wy = y + 0.55 * Math.cos(x * 1.1 - t * 0.3) + 0.3 * Math.cos(x * 2.3 + t * 0.25);
  const v =
    Math.sin(wx * 1.1 + t * 0.22) +
    Math.sin(wy * 1.4 - t * 0.18) +
    0.7 * Math.sin((wx + wy) * 0.8 + t * 0.3) +
    0.45 * Math.sin(Math.hypot(wx - 2, wy + 1) * 1.7 - t * 0.4);
  return v / 6.3 + 0.5;
}

export default function TopoCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    // offscreen layer that fades slowly instead of clearing = motion blur trails
    const trail = document.createElement("canvas");
    const lc = trail.getContext("2d")!;
    // shortcut: ignores prefers-reduced-motion on purpose (motion is the point), add a toggle if needed
    let w = 0, h = 0, cols = 0, rows = 0, raf = 0;
    const target = { x: -9999, y: -9999 }, m = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => { target.x = e.clientX; target.y = e.clientY; };
    let grid = new Float32Array(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      trail.width = canvas.width;
      trail.height = canvas.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lc.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      grid = new Float32Array(cols * rows);
    };

    const draw = (time: number) => {
      const t = (time / 1000) * 2.4;
      const s = 0.0042 * CELL; // field units per grid step
      m.x += (target.x - m.x) * 0.12;
      m.y += (target.y - m.y) * 0.12;
      const mx = (m.x / CELL) * s, my = (m.y / CELL) * s;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const dx = i * s - mx, dy = j * s - my;
          // cursor pushes a soft bump into the field so contours bend around it
          grid[j * cols + i] = field(i * s, j * s, t) + 0.11 * Math.exp(-(dx * dx + dy * dy) / 0.6);
        }

      lc.globalCompositeOperation = "destination-out";
      lc.fillStyle = "rgba(0,0,0,0.2)";
      lc.fillRect(0, 0, w, h);
      lc.globalCompositeOperation = "source-over";
      lc.lineJoin = "round";

      for (let k = 1; k < LEVELS; k++) {
        const lv = k / LEVELS;
        const major = k % 4 === 0;
        lc.strokeStyle = `rgba(255,255,255,${major ? 0.85 : 0.38})`;
        lc.lineWidth = major ? 1.3 : 0.8;
        lc.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = grid[j * cols + i], b = grid[j * cols + i + 1];
            const c = grid[(j + 1) * cols + i + 1], d = grid[(j + 1) * cols + i];
            const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
            const segs = TABLE[idx];
            if (!segs.length) continue;
            const x0 = i * CELL, y0 = j * CELL;
            const pt = (e: number): [number, number] => {
              if (e === 0) return [x0 + CELL * ((lv - a) / (b - a)), y0];
              if (e === 1) return [x0 + CELL, y0 + CELL * ((lv - b) / (c - b))];
              if (e === 2) return [x0 + CELL * ((lv - d) / (c - d)), y0 + CELL];
              return [x0, y0 + CELL * ((lv - a) / (d - a))];
            };
            for (let n = 0; n < segs.length; n += 2) {
              const [px, py] = pt(segs[n]);
              const [qx, qy] = pt(segs[n + 1]);
              lc.moveTo(px, py);
              lc.lineTo(qx, qy);
            }
          }
        }
        lc.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(trail, 0, 0, w, h);

      // glow: cursor tint + three colored blobs roaming across the map
      ctx.globalCompositeOperation = "source-atop";
      const blob = (x: number, y: number, r: number, rgb: string, a: number) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      };
      const tt = time / 1000;
      const pos = (k: number, sp: number): [number, number] => [
        w * (0.5 + 0.55 * Math.sin(tt * sp + k * 2.1)),
        h * (0.5 + 0.55 * Math.cos(tt * sp * 0.8 + k * 1.7)),
      ];
      const R = Math.max(w, h) * 0.38;
      blob(...pos(0, 0.21), R, "255,46,99", 0.9);
      blob(...pos(1, 0.17), R, "140,90,255", 0.8);
      blob(...pos(2, 0.25), R * 0.8, "60,170,255", 0.7);
      blob(m.x, m.y, 280, "255,46,99", 1);

      // carve out the bottom-left corner for the name
      ctx.globalCompositeOperation = "destination-out";
      const r = Math.max(w * 0.5, 520);
      const g = ctx.createRadialGradient(0, h, r * 0.35, 0, h, r);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
