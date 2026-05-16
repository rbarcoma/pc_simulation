import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
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

function SceneContent() {
  const installed = useSimulationStore((state) => state.installed);
  const xray = useSimulationStore((state) => state.xray);
  const exploded = useSimulationStore((state) => state.exploded);
  const cableView = useSimulationStore((state) => state.cableView);
  const autoRotate = useSimulationStore((state) => state.autoRotate);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-4, 3, 4]} intensity={1.2} color="#38bdf8" />

      <Stars radius={80} depth={40} count={600} factor={3} fade speed={1} />

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
  'case-panel': { position: [0.05, 0.05, 1.22], size: [4.1, 2.55], html: [155, 94], labelOffset: [0, 1.7, 0.14] },
  motherboard: { position: [-0.45, 0, -0.5], size: [2.45, 2.05], html: [150, 125], labelOffset: [0, 1.45, 0.16] },
  cpu: { position: [-0.3, 0.12, -0.34], size: [0.58, 0.58], html: [62, 62], labelOffset: [0.72, 0.6, 0.14] },
  'thermal-paste': { position: [-0.3, 0.12, -0.26], size: [0.28, 0.28], html: [48, 48], labelOffset: [-0.78, 0.58, 0.14] },
  cooler: { position: [-0.3, 0.12, -0.08], size: [0.82, 0.82], html: [76, 76], labelOffset: [0.92, 0.62, 0.14] },
  ram: { position: [-1.1, -0.25, -0.26], size: [0.28, 1.15], html: [46, 104], labelOffset: [-0.58, 0.78, 0.14] },
  storage: { position: [1.15, -0.95, -0.06], size: [0.88, 0.55], html: [82, 54], labelOffset: [0.15, 0.72, 0.14] },
  psu: { position: [-1.35, -1.05, 0.28], size: [1.05, 0.7], html: [96, 68], labelOffset: [-0.45, 0.8, 0.14] },
  gpu: { position: [-0.15, -0.75, 0.28], size: [1.55, 0.42], html: [128, 48], labelOffset: [0, -0.72, 0.14] },
  'power-cables': { position: [-0.45, -0.48, 0.44], size: [2.25, 1.2], html: [168, 88], labelOffset: [-1.35, 0.9, 0.16] },
  'front-panel': { position: [1.18, 0.22, 0.62], size: [0.48, 0.95], html: [58, 90], labelOffset: [0.78, 0.56, 0.16] },
  'cable-management': { position: [0, -1.08, 0.72], size: [2.45, 0.34], html: [168, 44], labelOffset: [0, 0.68, 0.16] },
  'close-case': { position: [0.05, 0.05, 1.22], size: [4.1, 2.55], html: [155, 94], labelOffset: [0, 1.7, 0.14] },
  'power-test': { position: [2.38, 0.95, 0.64], size: [0.36, 0.36], html: [48, 48], labelOffset: [0.05, 0.48, 0.14] },
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
        <div className="whitespace-nowrap rounded-md border border-white/10 bg-slate-950/90 px-2 py-1 text-[10px] font-bold text-white shadow-xl">
          Place {part?.name || step.title} here
        </div>
      </Html>
    </group>
  );
}

export function PCScene() {
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
      className={`relative min-h-[560px] overflow-hidden rounded-xl border bg-slate-950 shadow-sm transition ${
        isOver ? 'border-sky-300 ring-4 ring-sky-400/30' : 'border-slate-200 dark:border-white/10'
      }`}
    >
      <Canvas camera={{ position: [0, 1.2, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white">
        {hasPlacementGuide ? 'Drag parts onto the 3D guide inside the case' : 'Click the highlighted 3D part to continue'}
      </div>
    </div>
  );
}
