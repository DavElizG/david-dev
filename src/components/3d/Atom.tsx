/**
 * Atom.tsx — 3D atom with orbiting rings and scroll-driven rotation.
 *
 * Visual layers:
 *  1. Ring trail particles — 60 additive Points per ring, orbit with spinGroup
 *  2. Orbit rings — TorusGeometry with MeshStandardMaterial (emissive + metalness)
 *  3. Electrons — sphere on each ring, orbits via spinGroup.rotation.z
 *  4. Nucleus — glowing sphere + pulsing halo
 *
 * Ring orbital planes slowly precess (tiltGroup rotation) so the rings
 * visually orbit the nucleus in 3D, not just spin in a fixed plane.
 *
 * Canvas uses alpha:true — composites over section's StarField background.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';

interface AtomProps {
  scrollProgressRef: MutableRefObject<number>;
}

const SILVER = 0xe0e0e0;
const GRAY   = 0x909090;
const MIST   = 0xcccccc;

const RING_CONFIGS = [
  { radius: 2.8, color: SILVER, tilt: [1.05, 0,     0.3 ] as const, speed: 1.0 },
  { radius: 3.4, color: GRAY,   tilt: [-0.6, 0.78,  0   ] as const, speed: 1.4 },
  { radius: 2.2, color: MIST,  tilt: [0.5, -1.05,  0.4 ] as const, speed: 0.8 },
];

/* ── Ring trail particles ────────────────────────────────────────────── */
function createRingParticles(radius: number, color: number): THREE.Points {
  const COUNT = 60;
  const positions = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const a  = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
    const r  = radius + (Math.random() - 0.5) * 0.25;
    const i3 = i * 3;
    positions[i3]     = r * Math.cos(a);
    positions[i3 + 1] = r * Math.sin(a);
    positions[i3 + 2] = (Math.random() - 0.5) * 0.12;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color,
    size:            0.06,
    transparent:     true,
    opacity:         0.45,
    sizeAttenuation: true,
    blending:        THREE.AdditiveBlending,
    depthTest:       false,
  });

  return new THREE.Points(geo, mat);
}

/* ══════════════════════════════════════════════════════════════════════ */

interface RingEntry {
  tiltGroup: THREE.Group;
  spinGroup: THREE.Group;
  cfg: typeof RING_CONFIGS[0];
}

const Atom = ({ scrollProgressRef }: AtomProps) => {
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
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    camera.position.set(1.2, 0.6, 10);
    camera.lookAt(0, 0, 0);

    /* ── Lighting ────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x281840, 1.2));

    const purpleLight = new THREE.PointLight(SILVER, 4, 28);
    purpleLight.position.set(4, 4, 6);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(GRAY, 2.5, 22);
    cyanLight.position.set(-5, -3, 5);
    scene.add(cyanLight);

    /* ── Nucleus ─────────────────────────────────────── */
    const nucleusMat = new THREE.MeshStandardMaterial({
      color:             SILVER,
      emissive:          SILVER,
      emissiveIntensity: 0.55,
      roughness:         0.15,
      metalness:         0.75,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), nucleusMat));

    const glowMat = new THREE.MeshBasicMaterial({ color: SILVER, transparent: true, opacity: 0.10 });
    const glow    = new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 16), glowMat);
    scene.add(glow);

    const glow2Mat = new THREE.MeshBasicMaterial({ color: MIST, transparent: true, opacity: 0.04 });
    const glow2    = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), glow2Mat);
    scene.add(glow2);

    /* ── Rings + electrons + trail particles ─────────── */
    const rings: RingEntry[] = [];

    RING_CONFIGS.forEach(cfg => {
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
      scene.add(tiltGroup);

      const spinGroup = new THREE.Group();
      tiltGroup.add(spinGroup);

      /* Ring tube */
      const ringMat = new THREE.MeshStandardMaterial({
        color:             cfg.color,
        emissive:          cfg.color,
        emissiveIntensity: 0.25,
        roughness:         0.35,
        metalness:         0.65,
        transparent:       true,
        opacity:           0.75,
      });
      spinGroup.add(new THREE.Mesh(
        new THREE.TorusGeometry(cfg.radius, 0.045, 20, 140),
        ringMat,
      ));

      /* Electron */
      const elMat = new THREE.MeshStandardMaterial({
        color:             cfg.color,
        emissive:          cfg.color,
        emissiveIntensity: 0.85,
        roughness:         0.08,
        metalness:         0.95,
      });
      const el = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), elMat);
      el.position.set(cfg.radius, 0, 0);
      spinGroup.add(el);

      /* Trail particles */
      spinGroup.add(createRingParticles(cfg.radius, cfg.color));

      rings.push({ tiltGroup, spinGroup, cfg });
    });

    /* ── Resize ──────────────────────────────────────── */
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas);

    /* ── Animation loop ──────────────────────────────── */
    const startMs = Date.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - startMs) / 1000;
      const p = scrollProgressRef.current;

      rings.forEach(({ tiltGroup, spinGroup, cfg }) => {
        /* Spin electron + trail around ring */
        spinGroup.rotation.z = t * 0.45 * cfg.speed + p * Math.PI * 6 * cfg.speed;

        /* Precess orbital plane — makes the ring visually orbit the nucleus in 3D */
        tiltGroup.rotation.x = cfg.tilt[0] + t * 0.12 * cfg.speed;
        tiltGroup.rotation.y = cfg.tilt[1] + t * 0.09 * cfg.speed;
      });

      /* Orbit primary light for dynamic highlights */
      purpleLight.position.set(
        4 * Math.cos(t * 0.28),
        4 * Math.sin(t * 0.35),
        6,
      );

      /* Pulse nucleus glow */
      glow.scale.setScalar(1 + Math.sin(t * 2.1) * 0.13);
      glow2.scale.setScalar(1 + Math.sin(t * 1.3) * 0.08);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else (mat as THREE.Material).dispose();
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

export default Atom;
