/**
 * BlackHoleScene.tsx — Error-boundary wrapper + lazy loader for BlackHole
 *
 * BlackHole uses a raw Three.js renderer (no @react-three/fiber).
 * This wrapper catches any WebGL / shader errors so a broken GPU
 * never crashes the rest of the hero section.
 */
import { Component, lazy, Suspense } from 'react';
import type { MutableRefObject, ReactNode } from 'react';

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: Error) {
    console.warn('[BlackHoleScene] WebGL error caught:', err.message);
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/* Lazy-load the shader-heavy component so it never blocks hero text */
const BlackHole = lazy(() => import('./BlackHole'));

interface BlackHoleSceneProps {
  scrollProgressRef: MutableRefObject<number>;
}

const BlackHoleScene = ({ scrollProgressRef }: BlackHoleSceneProps) => (
  <SceneErrorBoundary>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={null}>
        <BlackHole scrollProgressRef={scrollProgressRef} />
      </Suspense>
    </div>
  </SceneErrorBoundary>
);

export default BlackHoleScene;
