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
   FRAGMENT SHADER — Schwarzschild geodesic raytracer (Interstellar-style)
   ────────────────────────────────────────────────────────────────────────── */
const frag = /* glsl */`
  #define STEP    0.08
  #define NSTEPS  400
  #define PI      3.14159265358979323846
  #define TAU     6.28318530717958647692

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uCamPos;
  uniform vec3  uCamDir;
  uniform vec3  uCamUp;
  uniform float uFov;
  uniform float uOffset;

  const float DISK_IN  = 2.6;
  const float DISK_OUT = 7.0;

  /* ── Hash / noise ─────────────────────────────────────── */
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  /* ── Smooth noise ─────────────────────────────────────── */
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  /* ── 3-D unit direction → equirectangular UV [0,1]² ───── */
  vec2 dirToUV(vec3 d) {
    d = normalize(d);
    float lon = atan(d.z, d.x);
    float lat = asin(clamp(d.y, -1.0, 1.0));
    return vec2(lon / TAU + 0.5, lat / PI + 0.5);
  }

  /* ── Procedural star field ─────────────────────────────── */
  vec3 starField(vec3 dir) {
    vec2 uv  = dirToUV(dir);
    vec3 col = vec3(0.0);

    vec2 grid1 = floor(uv * 140.0);
    vec2 frac1 = fract(uv * 140.0);
    float h1   = hash(grid1);
    if (h1 > 0.91) {
      vec2  sp  = vec2(hash(grid1 + 0.1), hash(grid1 + 0.2));
      float d   = length(frac1 - sp);
      float gw  = smoothstep(0.10, 0.0, d);
      float b   = pow((h1 - 0.91) / 0.09, 2.0) * 4.0 * gw;
      float t1  = hash(grid1 + 5.1);
      vec3  sc  = t1 < 0.35 ? vec3(0.75, 0.82, 1.0)
                : t1 < 0.65 ? vec3(1.00, 0.98, 0.95)
                :              vec3(1.00, 0.88, 0.70);
      col += sc * b;
    }

    vec2 grid2 = floor(uv * 400.0);
    vec2 frac2 = fract(uv * 400.0);
    float h2   = hash(grid2 + 17.4);
    if (h2 > 0.96) {
      vec2  sp  = vec2(hash(grid2 + 44.4), hash(grid2 + 55.5));
      float d   = length(frac2 - sp);
      float gw  = smoothstep(0.06, 0.0, d);
      float b   = (h2 - 0.96) / 0.04 * gw;
      float t2  = hash(grid2 + 33.3);
      col += mix(vec3(0.80, 0.80, 0.85), vec3(0.70, 0.72, 0.78), t2) * b * 0.45;
    }

    return col;
  }

  /* ── Accretion disk — Interstellar / Gargantua style ──── */
  vec4 diskColor(float r, float phi, vec3 hitPos) {
    float t = 1.0 - clamp((r - DISK_IN) / (DISK_OUT - DISK_IN), 0.0, 1.0);

    /* Subtle Doppler beaming (much tamer than before) */
    float orbSpeed = 1.0 / sqrt(r);
    vec3 diskVel = normalize(vec3(-hitPos.z, 0.0, hitPos.x)) * orbSpeed;
    vec3 toCamera = normalize(uCamPos - hitPos);
    float dopplerRaw = dot(normalize(diskVel), toCamera);
    float doppler = 1.0 + 0.20 * dopplerRaw;   /* keep it subtle */

    /* Smooth flowing texture — seamless around the full disk */
    float angle = phi - uTime * 0.20;
    float band1 = sin(angle * 6.0 + r * 3.5) * 0.5 + 0.5;
    float band2 = sin(angle * 10.0 - r * 5.0 + 2.0) * 0.5 + 0.5;
    /* Use cos/sin of angle for noise input so it wraps seamlessly at ±π */
    vec2 seamlessUV = vec2(cos(angle) * r, sin(angle) * r) * 0.8 + uTime * 0.04;
    float nz    = noise(seamlessUV);
    float filament = 0.70 + 0.20 * band1 + 0.10 * band2;
    filament *= 0.85 + 0.15 * nz;

    /* Temperature-based color gradient (hot white inner → warm outer) */
    vec3 hotWhite   = vec3(1.00, 1.00, 1.00);
    vec3 warmWhite  = vec3(1.00, 0.94, 0.82);
    vec3 warmGold   = vec3(0.95, 0.78, 0.50);
    vec3 coolAmber  = vec3(0.70, 0.45, 0.20);
    vec3 darkEdge   = vec3(0.30, 0.18, 0.08);

    vec3 col;
    if (t > 0.85) {
      col = mix(warmWhite, hotWhite, (t - 0.85) / 0.15);
    } else if (t > 0.55) {
      col = mix(warmGold, warmWhite, (t - 0.55) / 0.30);
    } else if (t > 0.20) {
      col = mix(coolAmber, warmGold, (t - 0.20) / 0.35);
    } else {
      col = mix(darkEdge, coolAmber, t / 0.20);
    }

    /* Apply texture and Doppler */
    col *= filament;
    col *= doppler;

    /* Brightness: intense inner edge, falling off outward */
    float brightness = 0.35 + t * 1.8;
    col *= brightness;

    /* Hot inner edge glow — moderate */
    col += warmWhite * smoothstep(0.80, 1.0, t) * 1.0;

    /* Soft edge fades so the disk doesn't cut sharply */
    float edgeFade = smoothstep(DISK_OUT, DISK_OUT - 1.2, r)
                   * smoothstep(DISK_IN - 0.15, DISK_IN + 0.4, r);
    col *= edgeFade;

    float alpha = clamp(length(col) * 0.45, 0.0, 1.0);
    return vec4(col, alpha);
  }

  /* ── Main ─────────────────────────────────────────────── */
  void main() {
    float aspect = uResolution.x / uResolution.y;
    float uvfov  = tan(uFov * 0.5 * (PI / 180.0));
    vec2  ndc    = (2.0 * gl_FragCoord.xy / uResolution - 1.0)
                 * vec2(aspect, 1.0);
    ndc.x       += uOffset;

    /* Camera basis */
    vec3 fwd   = normalize(uCamDir);
    vec3 right = normalize(cross(fwd, normalize(uCamUp)));
    vec3 up    = cross(right, fwd);

    /* Initial ray direction */
    vec3 pixPos = uCamPos + fwd
                + right * ndc.x * uvfov
                + up    * ndc.y * uvfov;
    vec3 vel    = normalize(pixPos - uCamPos);

    /* Conserved angular-momentum² (Schwarzschild metric) */
    vec3  Lv = cross(uCamPos, vel);
    float h2 = dot(Lv, Lv);

    /* ── Leapfrog geodesic integration ───────────────────── */
    vec3  color       = vec3(0.0);
    float totalAlpha  = 0.0;
    bool  hitHorizon  = false;
    vec3  pos         = uCamPos;
    vec3  prevPos     = uCamPos;
    float closestR    = 100.0;

    for (int i = 0; i < NSTEPS; i++) {
      prevPos = pos;
      pos    += vel * STEP;

      float r2 = dot(pos, pos);
      float r  = sqrt(r2);

      if (!hitHorizon) closestR = min(closestR, r);

      /* Geodesic acceleration */
      vel += -1.5 * h2 / (r2 * r2 * r) * pos * STEP;

      /* Event horizon — pure black, no glow leaks */
      if (r < 1.0) {
        hitHorizon = true;
        break;
      }

      if (r > 30.0) break;

      /* Accretion disk — y = 0 plane crossing */
      if (prevPos.y * pos.y < 0.0) {
        float lam = -prevPos.y / vel.y;
        vec3  hit = prevPos + lam * vel;
        float rh  = length(hit);

        if (rh >= DISK_IN && rh <= DISK_OUT) {
          float phi  = atan(hit.x, hit.z) - uTime * 0.20;
          vec4  dcol = diskColor(rh, phi, hit);
          /* Front-to-back alpha compositing */
          color     += dcol.rgb * dcol.a * (1.0 - totalAlpha);
          totalAlpha = totalAlpha + dcol.a * (1.0 - totalAlpha);
        }
      }
    }

    /* ── Event horizon: pure black ──────────────────────── */
    if (hitHorizon) {
      /* Only keep disk light that was accumulated before falling in */
      /* The shadow itself is black — no photon ring or glow inside */
      gl_FragColor = vec4(color, 1.0);
      return;
    }

    /* ── Photon ring — only for escaped rays that grazed close ── */
    /* Very thin, bright ring right at the photon sphere r ≈ 1.5  */
    float photonDist = abs(closestR - 1.5);
    float photonRing = exp(-photonDist * photonDist * 80.0) * 1.2;
    color += vec3(1.0, 0.95, 0.85) * photonRing * (1.0 - totalAlpha);

    /* ── Background stars ──────────────────────────────── */
    vec3 finalDir = normalize(pos - prevPos);
    float lensMag = 1.0 + 0.2 * exp(-photonDist * photonDist * 12.0);
    color += starField(finalDir) * lensMag * (1.0 - totalAlpha);

    /* ── Tone mapping (Reinhard) ──────────────────────── */
    color = color / (1.0 + color * 0.35);
    color = pow(color, vec3(0.94));

    gl_FragColor = vec4(color, 1.0);
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
      uOffset: { value: 0.6 },  // shift black hole left; eases to 0 on scroll
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
      const orbitAngle = t * 0.06;
      const r          = 10.0 - p * 8.0;            // 10 → 2.0 (deep into darkness)
      const incline    = 8 * Math.PI / 180;         // near edge-on like Gargantua

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
      uniforms.uOffset.value = Math.max(0, 0.6 * (1.0 - p / 0.42)); // ease to center

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
