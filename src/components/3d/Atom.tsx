/**
 * Atom.tsx — Raw Three.js atom with scroll-driven ring rotation
 *
 * Lightweight 3D atom: glowing nucleus + 3 tilted orbit rings + electrons.
 * Ring rotation is driven by a mutable ref (written by GSAP ScrollTrigger).
 * Uses alpha:true so it composites over the dark background.
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
  { radius: 2.5, color: PURPLE, tilt: [1.05, 0,    0.3 ] as const, speed: 1.0 },
  { radius: 3.0, color: CYAN,   tilt: [-0.6, 0.78, 0   ] as const, speed: 1.4 },
  { radius: 2.0, color: LILAC,  tilt: [0.5, -1.05, 0.4 ] as const, speed: 0.8 },
];

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
    camera.position.z = 9;

    /* ── Nucleus ── */
    const nucleusGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const nucleusMat = new THREE.MeshBasicMaterial({ color: PURPLE });
    const nucleus    = new THREE.Mesh(nucleusGeo, nucleusMat);
    scene.add(nucleus);

    /* Outer glow sphere (pulsing) */
    const glowGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: PURPLE, transparent: true, opacity: 0.12,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    /* ── Orbit rings + electrons ── */
    const ringGroups: THREE.Group[] = [];
    const electronAngles: number[]  = [];   // base angle offsets

    RING_CONFIGS.forEach((cfg, idx) => {
      const group = new THREE.Group();
      group.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);

      /* Ring (thin torus) */
      const ringGeo = new THREE.TorusGeometry(cfg.radius, 0.02, 8, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color, transparent: true, opacity: 0.5,
      });
      group.add(new THREE.Mesh(ringGeo, ringMat));

      /* Electron */
      const elGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const elMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const el    = new THREE.Mesh(elGeo, elMat);
      el.name     = 'electron';
      group.add(el);

      scene.add(group);
      ringGroups.push(group);
      electronAngles.push((idx * Math.PI * 2) / 3);  // evenly spaced starts
    });

    /* ── Resize ── */
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas);

    /* ── Animation loop ── */
    const startMs = Date.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - startMs) / 1000;
      const p = scrollProgressRef.current;   // 0 → 1

      ringGroups.forEach((group, i) => {
        const cfg   = RING_CONFIGS[i];
        const angle = t * 0.4 * cfg.speed + p * Math.PI * 4 * cfg.speed;

        /* Rotate entire group around its local Z → rings spin in their own plane */
        group.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
        group.rotateZ(angle);

        /* Move electron along the ring */
        const el = group.getObjectByName('electron') as THREE.Mesh;
        if (el) {
          const a = electronAngles[i] + angle * 1.8;
          el.position.set(
            cfg.radius * Math.cos(a),
            cfg.radius * Math.sin(a),
            0,
          );
        }
      });

      /* Pulse nucleus glow */
      glow.scale.setScalar(1 + Math.sin(t * 2) * 0.12);

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
        position: 'absolute',
        inset:    0,
        width:    '100%',
        height:   '100%',
        pointerEvents: 'none',
        display:  'block',
      }}
    />
  );
};

export default Atom;
