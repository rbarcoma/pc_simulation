import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { useDrop } from 'react-dnd';
import { useSimulationStore } from '../../store/simulationStore';
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

export function PCScene() {
  const tryAction = useSimulationStore((state) => state.tryAction);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'part',
      drop: (item) => tryAction(item.partId),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [tryAction],
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
        Drag parts here or tap a highlighted 3D component
      </div>
    </div>
  );
}
