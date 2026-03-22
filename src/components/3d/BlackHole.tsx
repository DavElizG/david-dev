/**
 * BlackHole.tsx — Geodesic raytracer black hole (pure Three.js, no R3F)
 *
 * Based on the physics from vlwkaos/threejs-blackhole:
 *  - Schwarzschild metric (rs = 1.0 in natural units)
 *  - Leapfrog photon geodesic:  accel = -(3/2) * h² * r / |r|^5
 *  - Accretion disk: y=0 plane intersection, r ∈ [DISK_IN, DISK_OUT]
 *  - Aurora palette instead of blackbody temperatures
 *  - Procedural starfield (no textures needed)
 *
 * The "camera" is a fixed THREE.Camera at z=1 (just a carrier for renders).
 * All camera state lives in shader uniforms: uCamPos, uCamDir, uCamUp, uFov.
 * Scroll progress drives uCamPos zoom (r: 10 → 3.5) + orbital rotation.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   VERTEX SHADER — trivial passthrough; clip-space quad fills screen exactly
   ────────────────────────────────────────────────────────────────────────── */
const vert = /* glsl */`
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

/* ──────────────────────────────────────────────────────────────────────────
   FRAGMENT SHADER — Schwarzschild geodesic raytracer
   ────────────────────────────────────────────────────────────────────────── */
const frag = /* glsl */`
  #define STEP    0.10
  #define NSTEPS  300
  #define PI      3.14159265358979323846
  #define TAU     6.28318530717958647692

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uCamPos;
  uniform vec3  uCamDir;
  uniform vec3  uCamUp;
  uniform float uFov;

  const float DISK_IN  = 2.0;
  const float DISK_OUT = 6.0;

  /* ── Hash / noise ─────────────────────────────────────── */
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  /* ── 3-D unit direction → equirectangular UV [0,1]² ───── */
  vec2 dirToUV(vec3 d) {
    d = normalize(d);
    float lon = atan(d.z, d.x);
    float lat = asin(clamp(d.y, -1.0, 1.0));
    return vec2(lon / TAU + 0.5, lat / PI + 0.5);
  }

  /* ── Procedural star field (two layers) ────────────────── */
  vec3 starField(vec3 dir) {
    vec2 uv  = dirToUV(dir);
    vec3 col = vec3(0.0);

    /* Layer 1 — sparse, bright: each cell has a random sub-cell star position */
    vec2 grid1 = floor(uv * 120.0);
    vec2 frac1 = fract(uv * 120.0);
    float h1   = hash(grid1);
    if (h1 > 0.92) {
      vec2  sp  = vec2(hash(grid1 + 0.1), hash(grid1 + 0.2)); /* random position in cell */
      float d   = length(frac1 - sp);
      float gw  = smoothstep(0.08, 0.0, d);                   /* circular glow */
      float b   = pow((h1 - 0.92) / 0.08, 2.0) * 3.5 * gw;
      float t1  = hash(grid1 + 5.1);
      vec3  sc  = t1 < 0.35 ? vec3(0.75, 0.80, 1.0)
                : t1 < 0.65 ? vec3(1.00, 1.00, 1.0)
                :              vec3(1.00, 0.88, 0.65);
      col += sc * b;
    }

    /* Layer 2 — dense, dim */
    vec2 grid2 = floor(uv * 350.0);
    vec2 frac2 = fract(uv * 350.0);
    float h2   = hash(grid2 + 17.4);
    if (h2 > 0.965) {
      vec2  sp  = vec2(hash(grid2 + 44.4), hash(grid2 + 55.5));
      float d   = length(frac2 - sp);
      float gw  = smoothstep(0.07, 0.0, d);
      float b   = (h2 - 0.965) / 0.035 * gw;
      float t2  = hash(grid2 + 33.3);
      col += mix(vec3(0.80, 0.70, 1.0), vec3(0.70, 0.90, 1.0), t2) * b * 0.40;
    }

    /* Faint nebula tint — large-scale colour blobs */
    vec2 nbCell = floor(uv * 10.0);
    float nb    = hash(nbCell + 99.7) * 0.07;
    col += mix(vec3(0.20, 0.04, 0.45), vec3(0.00, 0.08, 0.30),
               hash(nbCell)) * nb;

    return col;
  }

  /* ── Aurora accretion disk ──────────────────────────────── */
  /*  Replaces the blackbody temp_to_color() from the reference;
      uses the portfolio's purple / cyan / pink palette instead. */
  vec4 diskColor(float r, float phi) {
    /* Normalized radius: 1.0 at inner edge, 0.0 at outer edge */
    float t = 1.0 - clamp((r - DISK_IN) / (DISK_OUT - DISK_IN), 0.0, 1.0);

    /* Swirling aurora bands */
    float swirl  = sin(phi * 5.0 - uTime * 1.6 + r * 2.8) * 0.5 + 0.5;
    float swirl2 = sin(phi * 3.0 + uTime * 1.1 - r * 4.5) * 0.5 + 0.5;

    vec3 purple = vec3(0.66, 0.33, 0.97);   /* #a855f7 */
    vec3 cyan   = vec3(0.02, 0.71, 0.83);   /* #06b6d4 */
    vec3 pink   = vec3(0.93, 0.28, 0.60);   /* #ec4899 */

    vec3 col = mix(purple, cyan,  swirl);
    col      = mix(col,    pink,  swirl2 * 0.45);
    col     *= 0.35 + t * 2.2;

    /* Hot, bright inner edge — near the Schwarzschild radius */
    col += vec3(1.0, 0.85, 1.0) * smoothstep(0.50, 1.00, t) * 1.4;

    float alpha = clamp(dot(col, col) / 3.0, 0.0, 1.0);
    return vec4(col, alpha);
  }

  /* ── Main ─────────────────────────────────────────────── */
  void main() {
    float aspect = uResolution.x / uResolution.y;
    float uvfov  = tan(uFov * 0.5 * (PI / 180.0));
    vec2  ndc    = (2.0 * gl_FragCoord.xy / uResolution - 1.0)
                 * vec2(aspect, 1.0);

    /* Camera basis */
    vec3 fwd   = normalize(uCamDir);
    vec3 right = normalize(cross(fwd, normalize(uCamUp)));
    vec3 up    = cross(right, fwd);

    /* Initial ray direction */
    vec3 pixPos = uCamPos + fwd
                + right * ndc.x * uvfov
                + up    * ndc.y * uvfov;
    vec3 vel    = normalize(pixPos - uCamPos);

    /* Conserved angular-momentum² = |r × v|²  (Schwarzschild metric) */
    vec3  Lv = cross(uCamPos, vel);
    float h2 = dot(Lv, Lv);

    /* ── Leapfrog geodesic integration ───────────────────── */
    vec4  color      = vec4(0.0);
    bool  hitHorizon = false;
    vec3  pos        = uCamPos;
    vec3  prevPos    = uCamPos;

    for (int i = 0; i < NSTEPS; i++) {
      prevPos = pos;
      pos    += vel * STEP;

      float r2 = dot(pos, pos);
      float r  = sqrt(r2);               /* computed once — reused below    */

      /* Geodesic acceleration: −(3/2) h² r / |r|^5
         pow(r2, 2.5) = r2·r2·r — avoids expensive pow() on GPU             */
      vel += -1.5 * h2 / (r2 * r2 * r) * pos * STEP;

      /* Event horizon — absorb ray */
      if (r < 1.0) {
        hitHorizon = true;
        break;
      }

      /* Early escape — ray has clearly left the system */
      if (r > 25.0) break;

      /* Accretion disk — y = 0 plane crossing */
      if (prevPos.y * pos.y < 0.0) {
        float lam = -prevPos.y / vel.y;
        vec3  hit = prevPos + lam * vel;
        float rh  = length(hit);

        if (rh >= DISK_IN && rh <= DISK_OUT) {
          /* Disk rotates: phi -= time * Keplerian speed proxy */
          float phi = atan(hit.x, hit.z) - uTime * 0.40;
          color    += diskColor(rh, phi);
        }
      }
    }

    /* ── Background — ray escaped ──────────────────────── */
    if (!hitHorizon) {
      vec3 finalDir = normalize(pos - prevPos);
      color.rgb += starField(finalDir);
    }

    gl_FragColor = vec4(clamp(color.rgb, 0.0, 3.0), 1.0);
  }
`;

/* ──────────────────────────────────────────────────────────────────────────
   React component — manages the raw Three.js + canvas lifecycle
   ────────────────────────────────────────────────────────────────────────── */
interface BlackHoleProps {
  scrollProgressRef: MutableRefObject<number>;
}

const BlackHole = ({ scrollProgressRef }: BlackHoleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ──────────────────────────────────────── */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false });
    } catch {
      return; // WebGL unavailable — SceneErrorBoundary will hide the canvas
    }

    const dpr = Math.min(window.devicePixelRatio, 1.0);
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    /* ── Scene / camera (camera is a dummy; all optics live in uniforms) ── */
    const scene    = new THREE.Scene();
    const dummyCam = new THREE.Camera();

    /* ── Uniforms ─────────────────────────────────────── */
    const uniforms: Record<string, THREE.IUniform> = {
      uTime:       { value: 0.0 },
      uResolution: { value: new THREE.Vector2(
        canvas.clientWidth  * dpr,
        canvas.clientHeight * dpr,
      )},
      uCamPos: { value: new THREE.Vector3(0, 1.8, 10) },
      uCamDir: { value: new THREE.Vector3(0, -1.8, -10).normalize() },
      uCamUp:  { value: new THREE.Vector3(0, 1, 0) },
      uFov:    { value: 55.0 },
    };

    /* ── Fullscreen quad ─────────────────────────────── */
    const material = new THREE.ShaderMaterial({
      vertexShader:   vert,
      fragmentShader: frag,
      uniforms,
      depthTest:  false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    /* ── Resize ──────────────────────────────────────── */
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    });
    ro.observe(canvas);

    /* ── Animation loop ──────────────────────────────── */
    const camPos = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const startMs = Date.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (Date.now() - startMs) / 1000;
      const p = scrollProgressRef.current;          // 0 → 1

      /* Slow orbital rotation + scroll-driven zoom */
      const orbitAngle = t * 0.08;
      const r          = 10.0 - p * 6.5;            // 10 → 3.5
      const incline    = 12 * Math.PI / 180;        // look slightly down at disk

      camPos.set(
        r * Math.cos(incline) * Math.sin(orbitAngle),
        r * Math.sin(incline),
        r * Math.cos(incline) * Math.cos(orbitAngle),
      );
      camDir.copy(camPos).negate().normalize();      // always face origin

      uniforms.uTime.value   = t;
      uniforms.uCamPos.value.copy(camPos);
      uniforms.uCamDir.value.copy(camDir);
      uniforms.uFov.value    = 55.0 - p * 15.0;     // 55° → 40° (zoom-lens feel)

      renderer.render(scene, dummyCam);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
};

export default BlackHole;
