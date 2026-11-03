import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { technologies } from "../constants";
import {
  GRAPH_W,
  GRAPH_H,
  layers,
  nodes,
  edges,
  sampleRun,
  builders,
} from "../constants/stack";
import { textVariant, fadeIn } from "../utils/motion";
import Magnetic from "./fx/Magnetic";
import usePrefersReducedMotion from "./fx/usePrefersReducedMotion";

const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));
const layerX = Object.fromEntries(layers.map((l) => [l.id, l.x]));
const pos = (n) => ({ x: n.x ?? layerX[n.layer], y: n.y });

const edgePath = (a, b) => {
  const p = pos(nodeById[a]);
  const q = pos(nodeById[b]);
  if (Math.abs(p.x - q.x) < 140) {
    // mostly vertical (trace edges): curve downwards
    const dy = (q.y - p.y) / 2;
    return `M${p.x},${p.y} C${p.x},${p.y + dy} ${q.x},${q.y - dy} ${q.x},${q.y}`;
  }
  const dx = (q.x - p.x) / 2;
  return `M${p.x},${p.y} C${p.x + dx},${p.y} ${q.x - dx},${q.y} ${q.x},${q.y}`;
};

const edgeKey = (a, b) => `${a}->${b}`;

// Random end-to-end route for ambient "data packets".
const flowEdges = edges.filter((e) => e[2] === "flow");
const nextFrom = (id) => flowEdges.filter((e) => e[0] === id);
const randomRoute = () => {
  const starts = nodes.filter((n) => n.layer === "trigger");
  let cur = starts[Math.floor(Math.random() * starts.length)].id;
  const route = [];
  for (;;) {
    const opts = nextFrom(cur);
    if (!opts.length) break;
    const e = opts[Math.floor(Math.random() * opts.length)];
    route.push(edgeKey(e[0], e[1]));
    cur = e[1];
  }
  return route;
};

/* ---------------------------------------------------------------- graph */

const Graph = ({ active, setActive, pinned, setPinned, run }) => {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef(null);
  const pathRefs = useRef({});
  const packetLayer = useRef(null);

  // 3D tilt following the pointer
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const onMove = (e) => {
    if (reduced || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  // Which nodes / edges are lit
  const focus = pinned || active;
  const lit = useMemo(() => {
    const n = new Set();
    const e = new Set();
    if (run.step >= 0) {
      const visited = sampleRun.slice(0, run.step + 1).map((s) => s.node);
      visited.forEach((id) => n.add(id));
      for (let i = 1; i < visited.length; i++) {
        const cur = visited[i];
        visited.slice(0, i).forEach((prev) => {
          if (edges.some(([a, b]) => a === prev && b === cur)) e.add(edgeKey(prev, cur));
        });
      }
    } else if (focus) {
      n.add(focus);
      edges.forEach(([a, b]) => {
        if (a === focus || b === focus) {
          e.add(edgeKey(a, b));
          n.add(a);
          n.add(b);
        }
      });
    }
    return { n, e, any: n.size > 0 };
  }, [focus, run.step]);

  // Ambient packets, drawn imperatively for performance
  useEffect(() => {
    if (reduced) return undefined;
    const svgNS = "http://www.w3.org/2000/svg";
    const packets = [];
    let raf;
    let last = performance.now();
    let spawnIn = 0;
    let visible = true;

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
    });
    if (wrapRef.current) io.observe(wrapRef.current);

    const spawn = () => {
      const el = document.createElementNS(svgNS, "circle");
      el.setAttribute("r", "3.2");
      el.setAttribute("class", "packet");
      packetLayer.current?.appendChild(el);
      packets.push({ el, route: randomRoute(), seg: 0, t: 0, speed: 0.9 + Math.random() * 0.6 });
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        spawnIn -= dt;
        if (spawnIn <= 0 && packets.length < 14) {
          spawn();
          spawnIn = 0.35 + Math.random() * 0.5;
        }
        for (let i = packets.length - 1; i >= 0; i--) {
          const p = packets[i];
          const path = pathRefs.current[p.route[p.seg]];
          if (!path) {
            p.el.remove();
            packets.splice(i, 1);
            continue;
          }
          p.t += dt * p.speed;
          if (p.t >= 1) {
            p.t = 0;
            p.seg += 1;
            if (p.seg >= p.route.length) {
              p.el.remove();
              packets.splice(i, 1);
              continue;
            }
          }
          const cur = pathRefs.current[p.route[p.seg]];
          const pt = cur.getPointAtLength(p.t * cur.getTotalLength());
          p.el.setAttribute("cx", pt.x);
          p.el.setAttribute("cy", pt.y);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      packets.forEach((p) => p.el.remove());
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className='relative w-full'
      style={{ perspective: 1400 }}
    >
      <motion.div
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          aspectRatio: `${GRAPH_W} / ${GRAPH_H}`,
        }}
        className='relative w-full rounded-3xl border border-white/[0.06] bg-[radial-gradient(ellipse_at_center,rgba(145,94,255,0.10),transparent_70%)]'
      >
        {/* layer labels */}
        {layers.map((l) => (
          <div
            key={l.id}
            className='absolute -top-1 -translate-x-1/2 text-[11px] uppercase tracking-[0.18em] text-secondary/70 whitespace-nowrap font-mono'
            style={{ left: `${(l.x / GRAPH_W) * 100}%` }}
          >
            {l.label}
          </div>
        ))}

        <svg
          viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
          className='absolute inset-0 w-full h-full overflow-visible'
          aria-hidden='true'
        >
          <defs>
            <linearGradient id='edge-lit' x1='0' x2='1'>
              <stop offset='0%' stopColor='#00cea8' />
              <stop offset='100%' stopColor='#bf61ff' />
            </linearGradient>
            <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
              <feGaussianBlur stdDeviation='3' result='b' />
              <feMerge>
                <feMergeNode in='b' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          </defs>

          {edges.map(([a, b, kind]) => {
            const k = edgeKey(a, b);
            const on = lit.e.has(k);
            return (
              <path
                key={k}
                ref={(el) => {
                  if (el) pathRefs.current[k] = el;
                }}
                d={edgePath(a, b)}
                fill='none'
                stroke={on ? "url(#edge-lit)" : "#ffffff"}
                strokeOpacity={on ? 0.95 : lit.any ? 0.03 : kind === "trace" ? 0.12 : 0.07}
                strokeWidth={on ? 2.2 : 1}
                strokeDasharray={kind === "trace" ? "4 6" : undefined}
                filter={on ? "url(#glow)" : undefined}
                className='transition-[stroke-opacity,stroke-width] duration-300'
              />
            );
          })}

          <g ref={packetLayer} filter='url(#glow)' />

          {run.step >= 0 && (
            <circle r='6' className='run-packet' filter='url(#glow)'>
              <animateMotion
                key={run.step}
                dur='0.7s'
                fill='freeze'
                path={(() => {
                  const cur = sampleRun[run.step]?.node;
                  const prev = sampleRun.slice(0, run.step).map((s) => s.node).reverse()
                    .find((p) => edges.some(([a, b]) => a === p && b === cur));
                  return prev ? edgePath(prev, cur) : `M${pos(nodeById[cur]).x},${pos(nodeById[cur]).y}`;
                })()}
              />
            </circle>
          )}
        </svg>

        {nodes.map((n) => {
          const p = pos(n);
          const on = lit.n.has(n.id);
          const dim = lit.any && !on;
          const isRunHead = run.step >= 0 && sampleRun[run.step]?.node === n.id;
          return (
            <button
              key={n.id}
              type='button'
              data-cursor='Inspect'
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              onClick={() => setPinned((cur) => (cur === n.id ? null : n.id))}
              aria-pressed={pinned === n.id}
              aria-label={`${n.name}: ${n.role}`}
              className={`node-pill absolute flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-[13px] lg:text-[14px] font-medium whitespace-nowrap border transition-all duration-300 ${
                on ? "text-white border-white/30 bg-[#1a1440]/95" : "text-white/80 border-white/10 bg-[#0d0a24]/90"
              } ${dim ? "opacity-30" : "opacity-100"}`}
              style={{
                left: `${(p.x / GRAPH_W) * 100}%`,
                top: `${(p.y / GRAPH_H) * 100}%`,
                transform: `translate(-50%, -50%) translateZ(${on ? 60 : 30}px) scale(${isRunHead ? 1.12 : 1})`,
                boxShadow: on ? `0 0 28px -4px ${n.color}` : "none",
              }}
            >
              <span
                className='grid place-items-center w-7 h-7 rounded-full text-[12px] font-bold text-white shrink-0'
                style={{ background: `${n.color}33`, boxShadow: `inset 0 0 0 1px ${n.color}aa`, color: n.color }}
              >
                {n.glyph}
              </span>
              {n.name}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

/* -------------------------------------------------------- mobile layout */

const MobileStack = ({ active, setPinned }) => (
  <div className='flex flex-col gap-6'>
    {[...layers, { id: "observe", label: "Observability" }].map((l) => (
      <div key={l.id}>
        <p className='text-[11px] uppercase tracking-[0.18em] text-secondary/70 font-mono mb-2'>{l.label}</p>
        <div className='flex flex-wrap gap-2'>
          {nodes
            .filter((n) => n.layer === l.id)
            .map((n) => (
              <button
                key={n.id}
                type='button'
                onClick={() => setPinned((cur) => (cur === n.id ? null : n.id))}
                aria-pressed={active === n.id}
                className={`flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-[13px] border ${
                  active === n.id ? "border-white/40 bg-[#1a1440] text-white" : "border-white/10 bg-[#0d0a24] text-white/80"
                }`}
              >
                <span
                  className='grid place-items-center w-6 h-6 rounded-full text-[11px] font-bold'
                  style={{ background: `${n.color}33`, color: n.color }}
                >
                  {n.glyph}
                </span>
                {n.name}
              </button>
            ))}
        </div>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------ section */

const InfoPanel = ({ id }) => {
  const n = id ? nodeById[id] : null;
  return (
    <div className='glass-card rounded-2xl p-5 min-h-[150px]'>
      <AnimatePresence mode='wait'>
        {n ? (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className='flex items-center gap-3'>
              <span
                className='grid place-items-center w-10 h-10 rounded-xl text-[16px] font-bold'
                style={{ background: `${n.color}26`, color: n.color, boxShadow: `inset 0 0 0 1px ${n.color}88` }}
              >
                {n.glyph}
              </span>
              <div>
                <h3 className='text-white font-bold text-[18px] leading-tight'>{n.name}</h3>
                <p className='text-secondary text-[12px] font-mono uppercase tracking-wider'>{n.role}</p>
              </div>
            </div>
            <p className='mt-3 text-white/80 text-[14px] leading-relaxed'>{n.desc}</p>
            {n.usedIn && (
              <p className='mt-3 text-[13px] text-secondary'>
                Used in{" "}
                {n.usedIn.map((p, i) => (
                  <span key={p} className='text-white'>
                    {p}
                    {i < n.usedIn.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div key='empty' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className='text-white font-semibold'>Hover or tap any node</p>
            <p className='mt-2 text-secondary text-[14px] leading-relaxed'>
              Each one is a piece of the stack I use to take an AI idea from a prompt to a real outcome.
              Press <span className='text-white'>Run</span> to send a sample request through it.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Terminal = ({ run, onRun }) => (
  <div className='glass-card rounded-2xl overflow-hidden'>
    <div className='flex items-center justify-between px-4 py-2 border-b border-white/[0.06]'>
      <div className='flex gap-1.5'>
        <span className='w-2.5 h-2.5 rounded-full bg-[#ff5f57]' />
        <span className='w-2.5 h-2.5 rounded-full bg-[#febc2e]' />
        <span className='w-2.5 h-2.5 rounded-full bg-[#28c840]' />
      </div>
      <span className='font-mono text-[11px] text-secondary'>agent.run(): sample</span>
      <Magnetic>
        <button
          type='button'
          onClick={onRun}
          disabled={run.running}
          data-cursor='Run'
          className='run-btn font-mono text-[12px] px-3 py-1 rounded-full text-white disabled:opacity-50'
        >
          {run.running ? "running…" : run.step >= 0 ? "↻ Run again" : "▶ Run"}
        </button>
      </Magnetic>
    </div>
    <div className='p-4 font-mono text-[12px] leading-6 min-h-[178px]' aria-live='polite'>
      {run.step < 0 && <p className='text-secondary'>$ waiting for a request…</p>}
      {sampleRun.slice(0, run.step + 1).map((s, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className={s.log.startsWith("✓") ? "text-[#38ef7d]" : "text-white/85"}
        >
          {s.log}
        </motion.p>
      ))}
      {run.running && <span className='inline-block w-2 h-4 bg-white/70 align-middle animate-pulse' />}
    </div>
  </div>
);

const Tech = () => {
  const [active, setActive] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [run, setRun] = useState({ step: -1, running: false, live: false });
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const startRun = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPinned(null);
    setRun({ step: 0, running: true, live: true });
    sampleRun.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(
        setTimeout(() => setRun({ step: i, running: i < sampleRun.length - 1, live: true }), i * 900)
      );
    });
    // fade the highlight out a while after finishing
    timers.current.push(
      setTimeout(() => setRun((r) => ({ ...r, live: false })), sampleRun.length * 900 + 4500)
    );
  }, []);

  const shown = pinned || active || (run.live ? sampleRun[run.step].node : null);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>How I build</p>
        <h2 className={styles.sectionHeadText}>Agent Stack.</h2>
      </motion.div>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        From a single prompt to a real-world action: models for reasoning, frameworks for
        agents, automation for reach, and observability so every step is traceable.
      </motion.p>

      <div className='mt-14 hidden md:block'>
        <Graph
          active={active}
          setActive={setActive}
          pinned={pinned}
          setPinned={setPinned}
          run={run.live ? run : { step: -1 }}
        />
      </div>
      <div className='mt-10 md:hidden'>
        <MobileStack active={pinned} setPinned={setPinned} />
      </div>

      <div className='mt-8 grid md:grid-cols-2 gap-5'>
        <InfoPanel id={shown} />
        <Terminal run={run} onRun={startRun} />
      </div>

      <div className='mt-14'>
        <p className='text-[11px] uppercase tracking-[0.18em] text-secondary/70 font-mono mb-4'>
          Building with
        </p>
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {builders.map((b, i) => (
            <motion.div
              key={b.name}
              variants={fadeIn("up", "spring", i * 0.12, 0.6)}
              className='glass-card spotlight-card rounded-2xl p-4'
            >
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full' style={{ background: b.color, boxShadow: `0 0 12px ${b.color}` }} />
                <p className='text-white font-semibold'>{b.name}</p>
              </div>
              <p className='mt-1 text-secondary text-[13px]'>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className='mt-12'>
        <p className='text-[11px] uppercase tracking-[0.18em] text-secondary/70 font-mono mb-4'>
          Foundations
        </p>
        <div className='flex flex-wrap gap-3'>
          {technologies.map((t) => (
            <div
              key={t.name}
              className='flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] pl-1.5 pr-3 py-1.5 text-[13px] text-white/80 hover:text-white hover:border-white/25 transition-colors'
            >
              <img src={t.icon} alt='' className={`w-5 h-5 object-contain ${t.invert ? "invert" : ""}`} loading='lazy' />
              {t.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "stack");
