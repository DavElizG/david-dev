import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Html, 
  ContactShadows, 
  Environment,
  MeshWobbleMaterial,
  OrbitControls
} from '@react-three/drei';
import { useTheme } from '../../../context';
import { usePersonalInfo } from '../../../hooks';
import * as THREE from 'three';

// Componente para representar las partículas de código flotante
const CodeParticles = ({ count = 25, darkMode }: { count?: number, darkMode: boolean }) => {
  const particles = useRef<(THREE.Mesh | null)[]>([]);
  
  const colorsPrimary = darkMode 
    ? ['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8']  // Azules para modo oscuro
    : ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF']; // Azules más oscuros para modo claro
    
  const colorsSecondary = darkMode 
    ? ['#A5B4FC', '#818CF8', '#6366F1', '#4F46E5']  // Purpuras/indigo para modo oscuro
    : ['#6366F1', '#4F46E5', '#4338CA', '#3730A3']; // Indigo más oscuro para modo claro
    
  const allColors = [...colorsPrimary, ...colorsSecondary];
  
  // Creamos las partículas de forma memoizada para que no se recreen en cada renderizado
  const particleData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12, // Más dispersión en X
        (Math.random() - 0.5) * 10, // Menos dispersión en Y
        (Math.random() - 0.5) * 6   // Menor dispersión en Z para mantener visibilidad
      ] as [number, number, number],
      color: allColors[i % allColors.length], // Use i to select a color from the array
      size: 0.1 + Math.random() * 0.2,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      speed: {
        rotate: 0.01 + Math.random() * 0.02,
        float: 0.005 + Math.random() * 0.01
      }
    }));
  }, [darkMode]);
  
  // Animación para las partículas
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    particles.current.forEach((particle, i) => {
      if (!particle) return;
      
      // Movimiento ondulante personalizado para cada partícula
      const { position } = particleData[i];
      
      particle.position.y = position[1] + Math.sin(time * particleData[i].speed.float + i) * 0.5;
      particle.position.x = position[0] + Math.cos(time * particleData[i].speed.float + i) * 0.3;
      particle.rotation.x += particleData[i].speed.rotate * 0.5;
      particle.rotation.z += particleData[i].speed.rotate * 0.3;
    });
  });
  
  // Símbolos de código
  const symbols = ['{', '}', '()', ';', '//', '[]', '=>', '<>', '&&', '||', '<=', '>=', '===', '++', '--'];
  
  return (
    <>
      {particleData.map((data, i) => (
        <mesh
          key={i}
          ref={el => particles.current[i] = el}
          position={data.position}
        >
          <Html
            center
            distanceFactor={10}
          >
            <div
              style={{
                color: data.color,
                fontSize: `${(data.size * 6) + 0.8}rem`,
                fontWeight: 'bold',
                fontFamily: 'monospace',
                textShadow: darkMode 
                  ? '0 0 5px rgba(255,255,255,0.5)' 
                  : '0 0 5px rgba(0,0,0,0.3)',
              }}
            >
              {symbols[i % symbols.length]}
            </div>
          </Html>
        </mesh>
      ))}
    </>
  );
};

// Componente para crear esferas decorativas
const DecoSpheres = ({ darkMode }: { darkMode: boolean }) => {
  const spheres = useRef<(THREE.Mesh | null)[]>([]);
  
  const positions = useMemo<[number, number, number][]>(() => {
    return [
      [-4, 2, -1],
      [4, -2, 0],
      [-3, -3, 1],
      [3, 3, -2],
    ];
  }, []);
  
  const colors = darkMode
    ? ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB']
    : ['#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'];
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    spheres.current.forEach((sphere, i) => {
      if (!sphere) return;
      // Movimiento suave en forma de onda
      sphere.position.y = positions[i][1] + Math.sin(t * 0.5 + i * 2) * 0.5;
      sphere.position.x = positions[i][0] + Math.cos(t * 0.4 + i) * 0.3;
    });
  });
  
  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} ref={el => spheres.current[i] = el} position={pos}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <MeshWobbleMaterial 
            color={colors[i]} 
            factor={0.1} 
            speed={1}
            metalness={0.8}
            roughness={0.2} 
          />
        </mesh>
      ))}
    </>
  );
};

// Componente para crear un plano con código
const CodePlane = ({ darkMode }: { darkMode: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Fragmento de código que se muestra en el cubo
  const codeSnippet = `
function DevPortfolio() {
  const skills = useSkills();
  const projects = useProjects();
  
  return (
    <main className="portfolio">
      <Header />
      <Projects data={projects} />
      <Skills data={skills} />
      <Contact />
    </main>
  );
}
  `;

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <mesh 
        ref={meshRef}
        rotation={[0.3, -0.5, 0]}
      >
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color={darkMode ? "#1E293B" : "#F8FAFC"} />
        <Html transform position={[0, 0.1, 0.1]} scale={0.5} rotation-x={-0.3} rotation-y={0.5}>
          <div
            style={{
              width: '600px',
              padding: '30px',
              borderRadius: '10px',
              background: darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.9)',
              color: darkMode ? '#94A3B8' : '#334155',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              whiteSpace: 'pre',
              boxShadow: darkMode 
                ? '0 0 30px rgba(148, 163, 184, 0.1)' 
                : '0 0 30px rgba(51, 65, 85, 0.1)',
              lineHeight: '1.5'
            }}
          >
            <div style={{color: darkMode ? '#38BDF8' : '#0EA5E9'}}>{codeSnippet}</div>
          </div>
        </Html>
      </mesh>
    </Float>
  );
};

// Componente de nombre flotante
const NameDisplay = ({ darkMode }: { darkMode: boolean }) => {
  const { personalInfo, loading } = usePersonalInfo();
  
  if (loading) return null;
  
  const firstName = personalInfo?.name?.split(' ')[0] || 'David';
  const title = personalInfo?.title || 'Desarrollador Frontend';
  
  return (
    <Float
      speed={3}
      rotationIntensity={0.1}
      floatIntensity={0.4}
      position={[0, -3, 1]}
    >
      <Html center>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: darkMode ? '#F1F5F9' : '#0F172A',
          padding: '20px',
          borderRadius: '20px',
          background: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.85)',
          boxShadow: darkMode 
            ? '0 15px 25px rgba(0, 0, 0, 0.3)' 
            : '0 15px 25px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(8px)',
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            textShadow: darkMode 
              ? '0 0 15px rgba(59, 130, 246, 0.5)' 
              : '0 0 10px rgba(37, 99, 235, 0.3)',
            color: darkMode ? '#F1F5F9' : '#0F172A',
          }}>
            {firstName}
          </h1>
          <p style={{
            fontSize: '1.25rem',
            margin: 0,
            color: darkMode ? '#38BDF8' : '#0EA5E9',
            fontWeight: '500',
          }}>
            {title}
          </p>
        </div>
      </Html>
    </Float>
  );
};

// Componente principal que contiene la escena 3D
const ThreeDHeader = () => {
  const { darkMode } = useTheme();
  const backgroundColor = darkMode ? '#0F172A' : '#F8FAFC'; // Colores Tailwind slate-900 y slate-50

  return (
    <div className={`w-full h-[65vh] bg-transparent relative z-10`} style={{ minHeight: '500px' }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        className="canvas-container"
        dpr={[1, 2]}
      >
        <color attach="background" args={[backgroundColor]} />
        
        {/* Iluminación */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8}
          color={darkMode ? "#94A3B8" : "#FFFFFF"} 
        />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={0.5} 
          color={darkMode ? "#60A5FA" : "#3B82F6"} 
        />
        
        <group position={[0, 0, 0]}>
          <CodePlane darkMode={darkMode} />
          <CodeParticles count={25} darkMode={darkMode} />
          <DecoSpheres darkMode={darkMode} />
          <NameDisplay darkMode={darkMode} />
        </group>
        
        <ContactShadows 
          position={[0, -5, 0]} 
          opacity={darkMode ? 0.3 : 0.5} 
          scale={20} 
          blur={2} 
          far={6} 
          color={darkMode ? "#1E293B" : "#94A3B8"}
        />
        
        <Environment preset="city" />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDHeader;