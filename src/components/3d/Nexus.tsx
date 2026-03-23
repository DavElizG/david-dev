/**
 * Nexus.tsx — Glowing torus-knot with scroll-driven rotation.
 *
 * A trefoil torus knot (p=2, q=3) with:
 *  - Solid emissive mesh (purple, metallic)
 *  - Wireframe overlay (cyan, subtle) for a tech/code aesthetic
 *  - 200 floating particles orbiting in a spherical cloud
 *  - Scroll progress drives rotation speed + slight scale breathing
 *  - Two orbiting point lights for dynamic highlights
 *
 * Canvas uses alpha:true so it composites over the section's StarField.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';

interface NexusProps {
  scrollProgressRef: MutableRefObject<number>;
}

const SILVER = 0xe0e0e0;
const GRAY   = 0x909090;
const MIST   = 0xcccccc;

/* ── Particle cloud builder ───────────────────────────── */
function createParticles(): { points: THREE.Points; speeds: Float32Array; phases: Float32Array } {
  const COUNT = 200;
  const positions = new Float32Array(COUNT * 3);
  const speeds    = new Float32Array(COUNT);
  const phases    = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 3.5 + Math.random() * 3.5;
    const i3    = i * 3;

    positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    speeds[i] = 0.04 + Math.random() * 0.12;
    phases[i] = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color:           MIST,
    size:            0.055,
    transparent:     true,
    opacity:         0.5,
    sizeAttenuation: true,
    blending:        THREE.AdditiveBlending,
    depthWrite:      false,
  });

  return { points: new THREE.Points(geo, mat), speeds, phases };
}

/* ══════════════════════════════════════════════════════════ */

const Nexus = ({ scrollProgressRef }: NexusProps) => {
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
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    /* ── Lighting ────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x1a0a2e, 1.5));

    const purpleLight = new THREE.PointLight(SILVER, 5, 30);
    purpleLight.position.set(4, 3, 5);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(GRAY, 3, 25);
    cyanLight.position.set(-4, -2, 4);
    scene.add(cyanLight);

    /* ── Torus Knot — solid ─────────────────────────── */
    const knotGeo = new THREE.TorusKnotGeometry(2.2, 0.45, 200, 32, 2, 3);

    const solidMat = new THREE.MeshStandardMaterial({
      color:             SILVER,
      emissive:          SILVER,
      emissiveIntensity: 0.35,
      roughness:         0.18,
      metalness:         0.85,
      transparent:       true,
      opacity:           0.92,
    });
    const solidKnot = new THREE.Mesh(knotGeo, solidMat);
    scene.add(solidKnot);

    /* ── Torus Knot — wireframe overlay ──────────────── */
    const wireMat = new THREE.MeshBasicMaterial({
      color:       GRAY,
      wireframe:   true,
      transparent: true,
      opacity:     0.08,
    });
    const wireKnot = new THREE.Mesh(knotGeo, wireMat);
    scene.add(wireKnot);

    /* ── Inner glow core ─────────────────────────────── */
    const glowMat = new THREE.MeshBasicMaterial({
      color:       SILVER,
      transparent: true,
      opacity:     0.06,
    });
    const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 16), glowMat);
    scene.add(glowSphere);

    /* ── Floating particles ──────────────────────────── */
    const { points: particles, speeds: pSpeeds } = createParticles();
    scene.add(particles);

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
    const PARTICLE_COUNT = 200;
    const pGeo = particles.geometry;
    const startMs = Date.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - startMs) / 1000;
      const p = scrollProgressRef.current; // 0 → 1

      /* Knot rotation — time + scroll-driven */
      const scrollAngle = p * Math.PI * 4; // 2 full rotations over section
      solidKnot.rotation.y = t * 0.15 + scrollAngle;
      solidKnot.rotation.x = t * 0.08 + scrollAngle * 0.3;
      wireKnot.rotation.copy(solidKnot.rotation);

      /* Subtle scale breathing driven by scroll */
      const breathe = 1 + Math.sin(t * 1.5) * 0.03 + p * 0.08;
      solidKnot.scale.setScalar(breathe);
      wireKnot.scale.setScalar(breathe);

      /* Orbit lights */
      purpleLight.position.set(
        5 * Math.cos(t * 0.3),
        3 * Math.sin(t * 0.4),
        5,
      );
      cyanLight.position.set(
        -4 * Math.cos(t * 0.25),
        -3 * Math.sin(t * 0.35),
        4,
      );

      /* Pulse wireframe opacity with scroll */
      wireMat.opacity = 0.06 + p * 0.12;

      /* Glow pulse */
      glowSphere.scale.setScalar(1 + Math.sin(t * 1.2) * 0.08);

      /* Orbit particles around Y axis */
      const posArr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const x = posArr[i3], z = posArr[i3 + 2];
        const speed = pSpeeds[i] * (1 + p * 1.5);
        const cos = Math.cos(speed * 0.016);
        const sin = Math.sin(speed * 0.016);
        posArr[i3]     = x * cos - z * sin;
        posArr[i3 + 2] = x * sin + z * cos;
      }
      pGeo.attributes.position.needsUpdate = true;

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

export default Nexus;
