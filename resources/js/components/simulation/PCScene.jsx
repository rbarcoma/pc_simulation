import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { useDrop } from 'react-dnd';
import { useSimulationStore } from '../../store/simulationStore';
import { stepsByMode } from '../../data/steps';
import { partMap } from '../../data/parts';
import {
  PCCase,
  Motherboard,
  CPU,
  ThermalPaste,
  Cooler,
  RAM,
  Storage,
  PSU,
  GPU,
  CableSystem,
  FrontPanelCables,
} from './ComputerParts';

function OfficeDesk({ position, size = [2.2, 0.12, 1.05], topColor = '#6b7280', legColor = '#1f2937' }) {
  const [width, height, depth] = size;
  const legX = width / 2 - 0.14;
  const legZ = depth / 2 - 0.14;

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color={topColor} roughness={0.52} metalness={0.08} />
      </mesh>
      {[
        [-legX, -0.48, -legZ],
        [legX, -0.48, -legZ],
        [-legX, -0.48, legZ],
        [legX, -0.48, legZ],
      ].map((legPosition) => (
        <mesh key={legPosition.join('-')} position={legPosition}>
          <boxGeometry args={[0.08, 0.88, 0.08]} />
          <meshStandardMaterial color={legColor} roughness={0.42} metalness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function BackgroundComputer({ position, rotation = [0, 0, 0], accent = '#38bdf8' }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.3, -0.18]}>
        <boxGeometry args={[0.88, 0.52, 0.06]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.3, -0.14]}>
        <boxGeometry args={[0.74, 0.4, 0.025]} />
        <meshStandardMaterial color="#1e293b" emissive={accent} emissiveIntensity={0.14} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.02, -0.18]}>
        <boxGeometry args={[0.18, 0.36, 0.05]} />
        <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.25} />
      </mesh>
      <mesh position={[0, -0.22, -0.18]}>
        <boxGeometry args={[0.54, 0.05, 0.32]} />
        <meshStandardMaterial color="#475569" roughness={0.48} metalness={0.18} />
      </mesh>
      <mesh position={[0.82, -0.02, -0.1]}>
        <boxGeometry args={[0.38, 0.74, 0.42]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.18} />
      </mesh>
      <mesh position={[0.82, 0.04, 0.12]}>
        <boxGeometry args={[0.28, 0.46, 0.025]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[-0.42, -0.28, 0.16]}>
        <boxGeometry args={[0.54, 0.035, 0.18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      <mesh position={[0.2, -0.28, 0.18]}>
        <boxGeometry args={[0.16, 0.04, 0.24]} />
        <meshStandardMaterial color="#020617" roughness={0.48} />
      </mesh>
    </group>
  );
}

function OfficeEnvironment({ theme }) {
  const isLight = theme === 'light';
  const wallColor = isLight ? '#dbeafe' : '#172033';
  const sideWallColor = isLight ? '#cbd5e1' : '#111827';
  const floorColor = isLight ? '#94a3b8' : '#334155';
  const tableColor = isLight ? '#94a3b8' : '#475569';

  return (
    <group position={[0, -0.42, -1.25]}>
      <mesh position={[0, 0.08, -3.25]}>
        <boxGeometry args={[8.4, 4.4, 0.12]} />
        <meshStandardMaterial color={wallColor} roughness={0.64} />
      </mesh>
      <mesh position={[-4.2, 0.08, -1.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4.1, 4.4, 0.12]} />
        <meshStandardMaterial color={sideWallColor} roughness={0.68} />
      </mesh>
      <mesh position={[4.2, 0.08, -1.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4.1, 4.4, 0.12]} />
        <meshStandardMaterial color={sideWallColor} roughness={0.68} />
      </mesh>
      <mesh position={[0, -1.55, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.5, 7.2]} />
        <meshStandardMaterial color={floorColor} roughness={0.78} metalness={0.04} />
      </mesh>

      {[-1.6, 0, 1.6].map((x) => (
        <group key={x} position={[x, 1.28, -3.16]}>
          <mesh>
            <boxGeometry args={[1.08, 0.78, 0.05]} />
            <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={isLight ? 0.06 : 0.16} roughness={0.18} />
          </mesh>
          {[
            [0, 0.43, 0.04, 1.18, 0.06, 0.05],
            [0, -0.43, 0.04, 1.18, 0.06, 0.05],
            [-0.59, 0, 0.04, 0.06, 0.86, 0.05],
            [0.59, 0, 0.04, 0.06, 0.86, 0.05],
            [0, 0, 0.045, 0.04, 0.78, 0.05],
          ].map(([barX, barY, barZ, barWidth, barHeight, barDepth]) => (
            <mesh key={`${barX}-${barY}`} position={[barX, barY, barZ]}>
              <boxGeometry args={[barWidth, barHeight, barDepth]} />
              <meshStandardMaterial color="#334155" roughness={0.32} metalness={0.22} />
            </mesh>
          ))}
        </group>
      ))}

      <mesh position={[-2.9, 0.35, -3.05]}>
        <boxGeometry args={[1.2, 0.08, 0.36]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.16} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[-3.28 + index * 0.36, 0.55, -3.02]}>
          <boxGeometry args={[0.18, 0.32, 0.24]} />
          <meshStandardMaterial color={index === 1 ? '#0ea5e9' : '#f59e0b'} roughness={0.42} />
        </mesh>
      ))}

      <OfficeDesk position={[0, -1.02, -0.35]} size={[2.95, 0.14, 1.28]} topColor={tableColor} />
      <OfficeDesk position={[-2.95, -1.08, -1.95]} size={[1.85, 0.12, 0.92]} topColor={tableColor} />
      <OfficeDesk position={[2.95, -1.08, -1.95]} size={[1.85, 0.12, 0.92]} topColor={tableColor} />

      <BackgroundComputer position={[-2.95, -0.86, -1.95]} rotation={[0, 0.28, 0]} accent="#22d3ee" />
      <BackgroundComputer position={[2.95, -0.86, -1.95]} rotation={[0, -0.28, 0]} accent="#a855f7" />

      <mesh position={[-1.05, -0.82, 0.16]}>
        <boxGeometry args={[0.68, 0.035, 0.24]} />
        <meshStandardMaterial color="#020617" roughness={0.52} />
      </mesh>
      <mesh position={[1.05, -0.84, 0.16]}>
        <boxGeometry args={[0.22, 0.04, 0.28]} />
        <meshStandardMaterial color="#111827" roughness={0.46} />
      </mesh>
    </group>
  );
}

function SceneContent({ theme }) {
  const installed = useSimulationStore((state) => state.installed);
  const xray = useSimulationStore((state) => state.xray);
  const exploded = useSimulationStore((state) => state.exploded);
  const cableView = useSimulationStore((state) => state.cableView);
  const autoRotate = useSimulationStore((state) => state.autoRotate);

  const isLight = theme === 'light';

  return (
    <>
      <color attach="background" args={[isLight ? '#eef2ff' : '#0f172a']} />
      <ambientLight intensity={isLight ? 1.05 : 0.72} />
      <directionalLight position={[5, 5, 5]} intensity={isLight ? 1.55 : 1.25} />
      <directionalLight position={[-4, 4, -3]} intensity={0.45} color="#bfdbfe" />
      <pointLight position={[-4, 3, 4]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[-0.35, 0.75, 0.45]} intensity={2.1} distance={3.2} decay={1.65} color="#e0f2fe" />
      <pointLight position={[0.95, -0.2, 0.38]} intensity={1.1} distance={2.6} decay={1.75} color="#7dd3fc" />
      <pointLight position={[0.05, 0.15, 0.95]} intensity={1} distance={2.8} decay={1.85} color="#f8fafc" />
      <pointLight position={[-1.1, -0.35, 0.72]} intensity={0.65} distance={2.2} decay={1.9} color="#c4b5fd" />
      <spotLight
        position={[-1.2, 1.45, 1.2]}
        angle={0.55}
        penumbra={0.7}
        intensity={1.15}
        distance={4}
        color="#ffffff"
        target-position={[-0.15, 0.05, -0.35]}
      />

      <OfficeEnvironment theme={theme} />

      {/* CASE dapat always visible */}
      <PCCase xray={xray} exploded={exploded} />

      {/* These parts lalabas lang kapag installed na */}
      {installed.motherboard && <Motherboard xray={xray} exploded={exploded} />}
      {installed.cpu && <CPU xray={xray} exploded={exploded} />}
      {installed['thermal-paste'] && <ThermalPaste exploded={exploded} />}
      {installed.cooler && <Cooler xray={xray} exploded={exploded} />}
      {installed.ram && <RAM xray={xray} exploded={exploded} />}
      {installed.storage && <Storage xray={xray} exploded={exploded} />}
      {installed.psu && <PSU xray={xray} exploded={exploded} />}
      {installed.gpu && <GPU xray={xray} exploded={exploded} />}

      <CableSystem cableView={cableView} exploded={exploded} />
      <FrontPanelCables cableView={cableView} exploded={exploded} />
      <PlacementGuide3D exploded={exploded} />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
      />
    </>
  );
}

const placementGuides = {
    'case-panel': {
        position: [0.05, 0.05, 1.22],
        size: [4.1, 2.55],
        html: [155, 94],
        labelOffset: [0, 1.7, 0.14]
    },
    motherboard: {
        position: [-0.48, 0.35, -0.55],
        size: [1.50, 1.96],
        html: [146, 116],
        labelOffset: [0, 1.36, 0.16]
    },
    cpu: {
        position: [-0.46, 0.71, -0.47],
        size: [0.28, 0.29],
        html: [62, 62],
        labelOffset: [0.72, 0.6, 0.14]
    },
    'thermal-paste': {
        position: [-0.47, 0.71, -0.46],
        size: [0.21, 0.21],
        html: [48, 48],
        labelOffset: [-0.78, 0.58, 0.14]
    },
    cooler: {
        position: [-0.47, 0.71, -0.45],
        size: [0.21, 0.21],
        html: [76, 76],
        labelOffset: [0.92, 0.62, 0.14]
    },
    ram: {
        position: [0.01, 0.71, -0.45],
        size: [0.23, 0.89],
        html: [82, 112],
        labelOffset: [0.08, 0.78, 0.14]
    },
    storage: {
        position: [-0.21, -0.40, -0.46],
        size: [0.57, 0.14],
        html: [98, 32],
        labelOffset: [0.34, 0.42, 0.14]
    },
    psu: {
        position: [-0.81, -1.0, -0.45],
        size: [1.05, 0.6],
        html: [96, 68],
        labelOffset: [0.15, 0.35, 0.14]
    },
    gpu: {
        position: [-0.72, 0.15, -0.43],
        size: [0.80, 0.18],
        html: [128, 48],
        labelOffset: [0.08, -0.54, 0.14]
    },
    'power-cables': {
        position: [-0.45, -0.48, 0.44],
        size: [2.25, 1.2],
        html: [168, 88],
        labelOffset: [-1.35, 0.9, 0.16]
    },
    'front-panel': {
        position: [1.18, 0.22, 0.62],
        size: [0.48, 0.95],
        html: [58, 90],
        labelOffset: [0.78, 0.56, 0.16]
    },
    'cable-management': {
        position: [0, -1.08, 0.72],
        size: [2.45, 0.34],
        html: [168, 44],
        labelOffset: [0, 0.68, 0.16]
    },
    'close-case': {
        position: [0.05, 0.05, 1.22],
        size: [4.1, 2.55],
        html: [155, 94],
        labelOffset: [0, 1.7, 0.14]
    },
    'power-test': {
        position: [2.38, 0.95, 0.64],
        size: [0.36, 0.36],
        html: [48, 48],
        labelOffset: [0.05, 0.48, 0.14]
    },
};

function PlacementGuide3D({ exploded }) {
  const mode = useSimulationStore((state) => state.mode);
  const currentStep = useSimulationStore((state) => state.currentStep);
  const isSessionActive = useSimulationStore((state) => state.isSessionActive);
  const tryAction = useSimulationStore((state) => state.tryAction);
  const step = stepsByMode[mode][currentStep];
  const part = step ? partMap[step.partId] : null;
  const guide = step ? placementGuides[step.partId] : null;
  const clickOnlySteps = new Set(['case-panel', 'power-test']);
  const shouldShowGuide = mode === 'assembly' && !clickOnlySteps.has(step?.partId);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'part',
      drop: (item) => tryAction(item.partId),
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    }),
    [tryAction],
  );

  if (!isSessionActive || !step || !guide || !shouldShowGuide) return null;

  const position = exploded && step.partId === 'case-panel'
    ? [guide.position[0] - 2.2, guide.position[1] + 0.25, guide.position[2] + 0.15]
    : guide.position;

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={guide.size} />
        <meshBasicMaterial color={isOver ? '#34d399' : '#38bdf8'} transparent opacity={isOver ? 0.22 : 0.13} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={guide.size} />
        <meshBasicMaterial color={isOver ? '#6ee7b7' : '#7dd3fc'} wireframe transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <Html center transform distanceFactor={7} position={[0, 0, 0.04]} zIndexRange={[20, 10]}>
        <div
          ref={drop}
          className="rounded-lg"
          style={{ width: `${guide.html[0]}px`, height: `${guide.html[1]}px` }}
        />
      </Html>
      <Html center transform distanceFactor={7} position={guide.labelOffset} zIndexRange={[30, 21]}>
        <div className="whitespace-nowrap rounded-md border border-white/5 bg-slate-950/90 px-2 py-1 text-[5px] font-bold text-white shadow-xl">
          Place {part?.name || step.title} here
        </div>
      </Html>
    </group>
  );
}

export function PCScene({ theme }) {
  const mode = useSimulationStore((state) => state.mode);
  const currentStep = useSimulationStore((state) => state.currentStep);
  const isSessionActive = useSimulationStore((state) => state.isSessionActive);
  const missDrop = useSimulationStore((state) => state.missDrop);
  const step = stepsByMode[mode][currentStep];
  const clickOnlySteps = new Set(['case-panel', 'power-test']);
  const hasPlacementGuide = isSessionActive && mode === 'assembly' && !clickOnlySteps.has(step?.partId) && Boolean(placementGuides[step?.partId]);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'part',
      drop: (item, monitor) => {
        if (hasPlacementGuide && !monitor.didDrop()) {
          missDrop(item.partId);
        }
      },
      collect: (monitor) => ({
        isOver: hasPlacementGuide && monitor.isOver({ shallow: true }),
      }),
    }),
    [hasPlacementGuide, missDrop],
  );

  return (
    <div
      ref={drop}
      className={`relative min-h-[560px] overflow-hidden rounded-xl border bg-white shadow-sm transition dark:bg-slate-950 ${
        isOver ? 'border-sky-300 ring-4 ring-sky-400/30' : 'border-slate-200 dark:border-white/10'
      }`}
    >
      <Canvas camera={{ position: [0, 1.2, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <SceneContent theme={theme} />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white">
        {hasPlacementGuide ? 'Drag parts onto the 3D guide inside the case' : 'Click the highlighted 3D part to continue'}
      </div>
    </div>
  );
}
