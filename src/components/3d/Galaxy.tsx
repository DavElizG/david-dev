/**
 * Galaxy.tsx — Spiral galaxy particle system with scroll-driven rotation.
 *
 * ~4 000 particles arranged in:
 *  - Central bulge (600 bright particles, concentrated at center)
 *  - Two logarithmic spiral arms (3 000 particles, purple → cyan gradient)
 *  - Scattered fill (400 dim particles for disk volume)
 *  - Central glow sprites (purple / lilac / cyan halos)
 *
 * Camera is slightly overhead (~25°) so the spiral shape and rotation
 * are clearly visible. Scroll progress drives Y-axis rotation.
 *
 * Canvas uses alpha:true — composites over section's StarField background.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';

interface GalaxyProps {
  scrollProgressRef: MutableRefObject<number>;
}

const SILVER = 0xe0e0e0;
const GRAY   = 0x909090;
const MIST   = 0xcccccc;

/* ── Circular soft-dot texture (prevents square particles) ── */
function createCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0,   'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/* ── Core bulge ──────────────────────────────────────── */
function createCore(tex: THREE.Texture): THREE.Points {
  const COUNT = 600;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const r     = Math.pow(Math.random(), 0.6) * 1.2;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const i3    = i * 3;

    pos[i3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.25; // flattened
    pos[i3 + 2] = r * Math.cos(phi);

    const b = 0.6 + Math.random() * 0.4;
    col[i3]     = b;
    col[i3 + 1] = b;
    col[i3 + 2] = b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  return new THREE.Points(geo, new THREE.PointsMaterial({
    size:            0.09,
    map:             tex,
    alphaMap:        tex,
    vertexColors:    true,
    transparent:     true,
    opacity:         0.9,
    sizeAttenuation: true,
    blending:        THREE.AdditiveBlending,
    depthWrite:      false,
  }));
}

/* ── Spiral arms ─────────────────────────────────────── */
function createArms(tex: THREE.Texture): THREE.Points {
  const COUNT   = 3000;
  const ARMS    = 2;
  const WINDS   = 1.5;   // 1.5 full wraps
  const MAX_R   = 5;
  const pos     = new Float32Array(COUNT * 3);
  const col     = new Float32Array(COUNT * 3);

  // Light silver → mid gray gradient along arm length
  const PR = 0.88, PG = 0.88, PB = 0.88;   /* near-white (inner arm) */
  const CR = 0.45, CG = 0.45, CB = 0.45;   /* mid gray   (outer arm) */

  for (let i = 0; i < COUNT; i++) {
    const arm       = i % ARMS;
    const armOffset = (arm / ARMS) * Math.PI * 2;
    const t         = Math.random();                    // 0→1 along arm
    const r         = 0.8 + t * (MAX_R - 0.8);
    const spiral    = armOffset + t * WINDS * Math.PI * 2;
    const scatter   = 0.35 * (0.3 + t * 0.7);
    const angle     = spiral + (Math.random() - 0.5) * scatter * 2;
    const i3        = i * 3;

    pos[i3]     = r * Math.cos(angle);
    pos[i3 + 1] = (Math.random() - 0.5) * 0.15 * (1 + t * 0.5);
    pos[i3 + 2] = r * Math.sin(angle);

    const b = 0.5 + Math.random() * 0.5;
    col[i3]     = (PR * (1 - t) + CR * t) * b;
    col[i3 + 1] = (PG * (1 - t) + CG * t) * b;
    col[i3 + 2] = (PB * (1 - t) + CB * t) * b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  return new THREE.Points(geo, new THREE.PointsMaterial({
    size:            0.055,
    map:             tex,
    alphaMap:        tex,
    vertexColors:    true,
    transparent:     true,
    opacity:         0.8,
    sizeAttenuation: true,
    blending:        THREE.AdditiveBlending,
    depthWrite:      false,
  }));
}

/* ── Disk scatter ────────────────────────────────────── */
function createScatter(tex: THREE.Texture): THREE.Points {
  const COUNT = 400;
  const pos   = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const r     = Math.random() * 5.5;
    const angle = Math.random() * Math.PI * 2;
    const i3    = i * 3;
    pos[i3]     = r * Math.cos(angle);
    pos[i3 + 1] = (Math.random() - 0.5) * 0.4;
    pos[i3 + 2] = r * Math.sin(angle);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  return new THREE.Points(geo, new THREE.PointsMaterial({
    color:           0x999999,
    size:            0.035,
    map:             tex,
    alphaMap:        tex,
    transparent:     true,
    opacity:         0.3,
    sizeAttenuation: true,
    blending:        THREE.AdditiveBlending,
    depthWrite:      false,
  }));
}

/* ══════════════════════════════════════════════════════ */

const Galaxy = ({ scrollProgressRef }: GalaxyProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene  = new THREE.Scene();
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const isNarrow = aspect < 1;
    const camera = new THREE.PerspectiveCamera(
      isNarrow ? 62 : 50,
      aspect,
      0.1,
      100,
    );
    /* Slightly overhead so the spiral is visible;
       pull back on narrow/portrait screens to avoid cropping. */
    camera.position.set(0, isNarrow ? 5 : 4, isNarrow ? 11 : 9);
    camera.lookAt(0, 0, 0);

    /* ── Galaxy group (all layers rotate together) ──── */
    const galaxy = new THREE.Group();
    scene.add(galaxy);

    const circleTex = createCircleTexture();
    galaxy.add(createCore(circleTex));
    galaxy.add(createArms(circleTex));
    galaxy.add(createScatter(circleTex));

    /* ── Central glow sprites ────────────────────────── */
    const glowCfgs = [
      { color: SILVER, scale: 3.0, opacity: 0.14 },
      { color: MIST,  scale: 5.0, opacity: 0.05 },
      { color: GRAY,   scale: 2.0, opacity: 0.09 },
    ];
    const glowSprites: THREE.Sprite[] = [];
    glowCfgs.forEach(cfg => {
      const mat = new THREE.SpriteMaterial({
        map:         circleTex,
        color:       cfg.color,
        transparent: true,
        opacity:     cfg.opacity,
        blending:    THREE.AdditiveBlending,
        depthTest:   false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(cfg.scale, cfg.scale, 1);
      galaxy.add(sprite);
      glowSprites.push(sprite);
    });

    /* ── Resize ──────────────────────────────────────── */
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const narrow = w < h;
      camera.fov = narrow ? 62 : 50;
      camera.position.set(0, narrow ? 5 : 4, narrow ? 11 : 9);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas);

    /* ── Animation loop ──────────────────────────────── */
    const startMs = Date.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - startMs) / 1000;
      const p = scrollProgressRef.current; // 0 → 1

      /* Rotate galaxy — continuous + scroll-driven */
      galaxy.rotation.y = t * 0.08 + p * Math.PI * 3;

      /* Subtle tilt wobble */
      galaxy.rotation.x = Math.sin(t * 0.05) * 0.04;

      /* Pulse glow sprites */
      glowCfgs.forEach((cfg, i) => {
        const s = cfg.scale * (1 + Math.sin(t * (1.4 + i * 0.3)) * 0.1);
        glowSprites[i].scale.set(s, s, 1);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      circleTex.dispose();
      scene.traverse(obj => {
        if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
        if (obj instanceof THREE.Sprite) {
          (obj.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  );
};

export default Galaxy;
