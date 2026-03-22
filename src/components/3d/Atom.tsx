/**
 * Atom.tsx — Three.js atom with proper 3D lighting and scroll-driven rotation.
 *
 * Architecture:
 *  - Each ring uses a TWO-GROUP hierarchy:
 *      tiltGroup (permanent tilt rotation) → spinGroup (Z-rotation updated each frame)
 *    This guarantees the ring spins correctly in its own tilted plane without
 *    the per-frame rotation.set() → rotateZ() drift bug.
 *  - MeshStandardMaterial + PointLights give real 3D shading (highlights / shadows).
 *  - scrollProgressRef drives ring speed via GSAP ScrollTrigger (written externally).
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';

interface AtomProps {
  scrollProgressRef: MutableRefObject<number>;
}

const PURPLE = 0xa855f7;
const CYAN   = 0x06b6d4;
const LILAC  = 0xc084fc;

const RING_CONFIGS = [
  { radius: 2.8, color: PURPLE, tilt: [1.05, 0,     0.3 ] as const, speed: 1.0 },
  { radius: 3.4, color: CYAN,   tilt: [-0.6, 0.78,  0   ] as const, speed: 1.4 },
  { radius: 2.2, color: LILAC,  tilt: [0.5, -1.05,  0.4 ] as const, speed: 0.8 },
];

interface RingEntry {
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
    /* Slight offset so the atom has visible depth/perspective */
    camera.position.set(1.2, 0.6, 10);
    camera.lookAt(0, 0, 0);

    /* ── Lighting ──────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x281840, 1.2));

    const purpleLight = new THREE.PointLight(PURPLE, 4, 28);
    purpleLight.position.set(4, 4, 6);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(CYAN, 2.5, 22);
    cyanLight.position.set(-5, -3, 5);
    scene.add(cyanLight);

    /* ── Nucleus ────────────────────────────────────────── */
    const nucleusMat = new THREE.MeshStandardMaterial({
      color:              PURPLE,
      emissive:           PURPLE,
      emissiveIntensity:  0.55,
      roughness:          0.15,
      metalness:          0.75,
    });
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), nucleusMat);
    scene.add(nucleus);

    /* Outer glow halo */
    const glowMat = new THREE.MeshBasicMaterial({ color: PURPLE, transparent: true, opacity: 0.10 });
    const glow    = new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 16), glowMat);
    scene.add(glow);

    /* ── Rings + electrons ──────────────────────────────── */
    const rings: RingEntry[] = [];

    RING_CONFIGS.forEach(cfg => {
      /* Outer group: permanent tilt — NEVER modified after creation */
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
      scene.add(tiltGroup);

      /* Inner group: spins around local Z each frame */
      const spinGroup = new THREE.Group();
      tiltGroup.add(spinGroup);

      /* Ring — thicker tube + more radial segments = rounder, 3D-looking tube */
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

      /* Electron — fixed at (radius, 0, 0) in spinGroup space; orbits via group rotation */
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

      rings.push({ spinGroup, cfg });
    });

    /* ── Resize observer ────────────────────────────────── */
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas);

    /* ── Animation loop ─────────────────────────────────── */
    const startMs = Date.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - startMs) / 1000;
      const p = scrollProgressRef.current; // 0 → 1

      /* Spin each ring's inner group — tiltGroup never touched */
      rings.forEach(({ spinGroup, cfg }) => {
        spinGroup.rotation.z = t * 0.45 * cfg.speed + p * Math.PI * 6 * cfg.speed;
      });

      /* Slowly orbit the primary light for dynamic highlights */
      purpleLight.position.set(
        4 * Math.cos(t * 0.28),
        4 * Math.sin(t * 0.35),
        6,
      );

      /* Pulse nucleus glow */
      glow.scale.setScalar(1 + Math.sin(t * 2.1) * 0.13);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
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

export default Atom;
