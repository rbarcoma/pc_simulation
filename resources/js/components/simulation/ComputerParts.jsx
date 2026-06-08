import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CatmullRomCurve3, Vector3 } from 'three';
import { partMap } from '../../data/parts';
import { stepsByMode } from '../../data/steps';
import { useSimulationStore } from '../../store/simulationStore';
import { SketchfabComputerModel } from './SketchfabComputerModel';

const material = (color, active, xray) => ({
  color,
  transparent: true,
  opacity: xray ? 0.34 : active ? 1 : 0.82,
  roughness: 0.42,
  metalness: 0.12,
});

function useShouldShowPart(partId) {
  const installed = useSimulationStore((state) => state.installed);
  return installed?.[partId] === true;
}

function useCurrentPartId() {
  const mode = useSimulationStore((state) => state.mode);
  const currentStep = useSimulationStore((state) => state.currentStep);
  return stepsByMode[mode]?.[currentStep]?.partId;
}

function Label({ partId, position }) {
  const part = partMap[partId];
  const showLabels = useSimulationStore((state) => state.showLabels);

  if (!showLabels) return null;

  return (
    <Html position={position} center distanceFactor={9}>
      <div className="pointer-events-none rounded-md border border-white/15 bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-white shadow-xl">
        {part?.name || partId}
      </div>
    </Html>
  );
}

function Clickable({ partId, children, position = [0, 0, 0], hitFilter = null }) {
  const selectPart = useSimulationStore((state) => state.selectPart);
  const tryAction = useSimulationStore((state) => state.tryAction);
  const currentPartId = useCurrentPartId();
  const active = currentPartId === partId;

  return (
    <group
      position={position}
      onPointerDown={(event) => {
        if (hitFilter && !hitFilter(event)) return;

        event.stopPropagation();
        selectPart(partId);
        tryAction(partId);
      }}
    >
      {children(active)}
    </group>
  );
}

function DetailBox({ position, size, color, metalness = 0.1, roughness = 0.45, opacity = 1 }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

function Screw({ position, radius = 0.045 }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 4]}>
      <cylinderGeometry args={[radius, radius, 0.026, 24]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.24} />
    </mesh>
  );
}

function Fan({ position = [0, 0, 0], radius = 0.24, active = false, poweredOn = false }) {
  const fan = useRef();

  useFrame((_, delta) => {
    if (fan.current && poweredOn) {
      fan.current.rotation.z += delta * 14;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[radius, 0.035, 12, 42]} />
        <meshStandardMaterial color={active ? '#38bdf8' : '#111827'} roughness={0.35} />
      </mesh>
      <mesh ref={fan}>
        <cylinderGeometry args={[radius * 0.28, radius * 0.28, 0.04, 28]} />
        <meshStandardMaterial color="#020617" metalness={0.25} roughness={0.35} />
      </mesh>
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={index} rotation={[0, 0, index * ((Math.PI * 2) / 5)]} position={[0, radius * 0.34, 0.025]}>
          <boxGeometry args={[radius * 0.16, radius * 0.58, 0.022]} />
          <meshStandardMaterial color="#1f2937" roughness={0.32} />
        </mesh>
      ))}
    </group>
  );
}

function CaseFanModel({ position, rotation = [0, 0, 0], targetBox = [0.52, 0.52, 0.12], xray = false }) {
  return (
    <group position={position} rotation={rotation}>
      <SketchfabComputerModel
        partId="fan"
        xray={xray}
        targetBox={targetBox}
        replaceGreenWith="#e01cfa"
        replaceLightWith="#020617"
      />

        <pointLight
            color="#e01cfa"
            intensity={xray ? 0.18 : 0.42}
            distance={0.85} decay={1.9}
        />
    </group>
  );
}

function CaseFanModels({ xray }) {
  const fans = [
  { position: [-1.30, 0.89, 0.27], rotation: [0, Math.PI / 2, 0], targetBox: [1.10, 0.90, 1.0] },
  { position: [1.30, 0.90, 0.01], rotation: [0, Math.PI / 2, 0], targetBox: [1.10, 0.90, 1.0] },
  { position: [1.30, 0.02, 0.01], rotation: [0, Math.PI / 2, 0], targetBox: [1.10, 0.90, 1.0] },
  { position: [1.30, -0.87, 0.01], rotation: [0, Math.PI / 2, 0], targetBox: [1.10, 0.90, 1.0] },
];

  return (
    <>
      {fans.map((fan) => (
        <CaseFanModel key={fan.position.join('-')} xray={xray} {...fan} />
      ))}
    </>
  );
}

function GoldContacts({ count = 8, start = -0.36, y = -0.58, z = 0.1, spacing = 0.1 }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <DetailBox
          key={index}
          position={[start + index * spacing, y, z]}
          size={[0.055, 0.08, 0.018]}
          color="#d97706"
          metalness={0.7}
          roughness={0.25}
        />
      ))}
    </>
  );
}

function CableSegment({ from, to, color, radius = 0.018, emissive = color }) {
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const angleZ = -Math.atan2(dx, dy);

  return (
    <mesh position={mid} rotation={[0, 0, angleZ]}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.35} roughness={0.35} />
    </mesh>
  );
}

function CableConnector({ position, color, size = [0.16, 0.1, 0.08] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.35} />
    </mesh>
  );
}

function CablePath({ points, color, radius, emissive }) {
  return (
    <>
      {points.slice(0, -1).map((point, index) => (
        <CableSegment
          key={`${point.join('-')}-${index}`}
          from={point}
          to={points[index + 1]}
          color={color}
          radius={radius}
          emissive={emissive}
        />
      ))}
    </>
  );
}

function CurvedCable({ points, color = '#111827', radius = 0.016, emissive = '#020617', offset = [0, 0, 0] }) {
  const curve = useMemo(
    () => new CatmullRomCurve3(
      points.map(([x, y, z]) => new Vector3(x + offset[0], y + offset[1], z + offset[2])),
      false,
      'catmullrom',
      0.45,
    ),
    [offset, points],
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 40, radius, 10, false]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.16} roughness={0.62} metalness={0.04} />
    </mesh>
  );
}

function CableBundle({ points, count = 6, spacing = 0.018, radius = 0.012, active = false }) {
  const center = (count - 1) / 2;

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <CurvedCable
          key={index}
          points={points}
          radius={radius}
          color={active ? '#1f2937' : '#0f172a'}
          emissive={active ? '#0ea5e9' : '#020617'}
          offset={[(index - center) * spacing, 0, (index % 2) * 0.008]}
        />
      ))}
    </>
  );
}

function SleevedCableStrand({ points, strandIndex, count, spacing, radius, active = false, spreadAxis = 'y' }) {
  const curve = useMemo(() => {
    const center = (count - 1) / 2;
    const strandOffset = (strandIndex - center) * spacing;
    const axisIndex = spreadAxis === 'z' ? 2 : spreadAxis === 'x' ? 0 : 1;

    return new CatmullRomCurve3(
      points.map((point, pointIndex) => {
        const progress = points.length <= 1 ? 0 : pointIndex / (points.length - 1);
        const bendOffset = Math.sin(progress * Math.PI) * strandOffset * 0.42;
        const endOffset = strandOffset * (0.55 + progress * 0.45);
        const nextPoint = [...point];

        nextPoint[axisIndex] += endOffset;
        nextPoint[0] += bendOffset * 0.35;
        nextPoint[2] += ((strandIndex % 2) - 0.5) * spacing * 0.36;

        return new Vector3(...nextPoint);
      }),
      false,
      'catmullrom',
      0.34,
    );
  }, [count, points, spacing, spreadAxis, strandIndex]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 52, radius, 12, false]} />
      <meshStandardMaterial
        color={active ? '#1e293b' : '#030712'}
        emissive={active ? '#1d4ed8' : '#020617'}
        emissiveIntensity={active ? 0.12 : 0.04}
        roughness={0.86}
        metalness={0.02}
      />
    </mesh>
  );
}

function CableComb({ position, size = [0.32, 0.045, 0.08] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#020617" roughness={0.52} metalness={0.18} />
    </mesh>
  );
}

function SleevedCableBundle({ points, count, spacing = 0.018, radius = 0.011, active = false, spreadAxis = 'y', combs = [] }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <SleevedCableStrand
          key={index}
          points={points}
          strandIndex={index}
          count={count}
          spacing={spacing}
          radius={radius}
          active={active}
          spreadAxis={spreadAxis}
        />
      ))}
      {combs.map((comb) => (
        <CableComb key={comb.position.join('-')} {...comb} />
      ))}
    </>
  );
}

export function PCCase({ xray, exploded }) {
  const installed = useSimulationStore((state) => state.installed);
  const mode = useSimulationStore((state) => state.mode);
  const currentPartId = useCurrentPartId();

  const sidePanelVisible =
    mode === 'assembly'
      ? installed['case-panel'] === false || installed['close-case'] === true
      : installed['case-panel'] === true;
  const isCasePanelStep = currentPartId === 'case-panel' && sidePanelVisible;

  const caseModel = (
    <SketchfabComputerModel
      partId="case"
      active={isCasePanelStep}
      activeMeshName="glass"
      hiddenMeshName={sidePanelVisible ? 'fan' : ['glass', 'fan']}
      xray={xray}
      opacity={xray ? 0.34 : 1}
    />
  );

  return (
    <group position={exploded ? [-2.2, 0.25, 0.15] : [0, 0, 0]}>
      <Clickable
        partId="case-panel"
        hitFilter={(event) => isCasePanelStep && event.object.name.toLowerCase().includes('glass')}
      >
        {() => caseModel}
      </Clickable>
      <CaseFanModels xray={xray} />
      <PowerButton xray={xray} />
    </group>
  );
}

export function PowerButton({ xray }) {
  const currentPartId = useCurrentPartId();
  const installed = useSimulationStore((state) => state.installed);
  const show = currentPartId === 'power-test' || installed['power-test'];

  if (!show) return null;

  return (
    <Clickable partId="power-test" position={[2.39, 0.95, 0.58]}>
      {(active) => (
        <>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
            <meshStandardMaterial
              color={active ? '#22c55e' : '#38bdf8'}
              emissive={active ? '#16a34a' : '#0369a1'}
              emissiveIntensity={active ? 1.4 : 0.5}
              transparent
              opacity={xray ? 0.35 : 1}
            />
          </mesh>
          <Label partId="power-test" position={[0, 0.42, 0]} />
        </>
      )}
    </Clickable>
  );
}

export function Motherboard({ xray, exploded }) {
  const show = useShouldShowPart('motherboard');
  if (!show) return null;

  return (
    <Clickable partId="motherboard" position={exploded ? [0, 0.95, -1.35] : [-0.55, 0.35, -0.38]}>
      {(active) => (
        <group>
          <SketchfabComputerModel
            partId="motherboard"
            active={active}
            xray={xray}
            />
        </group>
      )}
    </Clickable>
  );
}

export function CPU({ xray, exploded }) {
  const show = useShouldShowPart('cpu');
  if (!show) return null;

  return (
    <Clickable partId="cpu" position={exploded ? [1.65, 1.35, -0.5] : [-0.47, 0.71, -0.47]}>
      {(active) => (
        <group>
          <SketchfabComputerModel
            partId="cpu"
            active={active}
            xray={xray}
          />
          <Label partId="cpu" position={[0.52, 0.46, 0.28]} />
        </group>
      )}
    </Clickable>
  );
}

export function ThermalPaste({ exploded }) {
  const show = useShouldShowPart('thermal-paste');
  if (!show) return null;

  return (
    <Clickable partId="thermal-paste" position={exploded ? [2.25, 1.35, -0.3] : [-0.47, 0.71, -0.46]}>
      {(active) => (
        <>
          <mesh scale={[1, 1, 0.035]}>
            <sphereGeometry args={[0.10, 32, 16]} />
            <meshStandardMaterial
                color="#9ca3af" roughness={0.45}
            />
          </mesh>
          <Label partId="thermal-paste" position={[0.66, 0.18, 0.28]} />
        </>
      )}
    </Clickable>
  );
}

export function Cooler({ xray, exploded }) {
  const show = useShouldShowPart('cooler');
  const poweredOn = useSimulationStore((state) => state.poweredOn);
  if (!show) return null;

  return (
    <Clickable partId="cooler" position={exploded ? [1.95, 0.65, -0.2] : [-0.46, 0.39, -0.32]}>
      {(active) => (
        <group>
          <SketchfabComputerModel
            partId="cooler"
            active={active}
            xray={xray}
            position={[0, 0.35, 0]}
            rotation={[Math.PI / 2, 1.56, 0]}
            tintColor="#020617"
          />
          <Label partId="cooler" position={[0.74, 0.12, 0.38]} />
        </group>
      )}
    </Clickable>
  );
}

export function RAM({ xray, exploded }) {
  const show = useShouldShowPart('ram');
  if (!show) return null;
  const slotOffsets = [-0.17, -0.10, -0.03, 0.03];

  return (
    <Clickable partId="ram" position={exploded ? [-1.65, 1.15, -0.7] : [0.08, 0.72, -0.34]}>
      {(active) => (
        <group>
          {slotOffsets.map((offset) => (
            <group key={offset} position={[offset, 0, 0]}>
              <SketchfabComputerModel
                partId="ram"
                active={active}
                xray={xray}
                targetBox={[0.2, 0.93, 0.33]}
                rotation={[0, Math.PI / 2, Math.PI / 2]}
              />
            </group>
          ))}
          <Label partId="ram" position={[0, 0.78, 0.18]} />
        </group>
      )}
    </Clickable>
  );
}

export function Storage({ xray, exploded }) {
  const show = useShouldShowPart('storage');
  if (!show) return null;

  return (
    <Clickable partId="storage" position={exploded ? [1.6, -1.2, 0.1] : [-0.22, -0.40, -0.46]}>
      {(active) => (
        <group>
          <SketchfabComputerModel
            partId="storage"
            active={active}
            xray={xray}
            targetBox={[0.70, 0.16, 0.05]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <Label partId="storage" position={[0.18, 0.32, 0.22]} />
        </group>
      )}
    </Clickable>
  );
}

export function PSU({ xray, exploded }) {
  const show = useShouldShowPart('psu');
  const poweredOn = useSimulationStore((state) => state.poweredOn);
  if (!show) return null;

  return (
    <Clickable partId="psu" position={exploded ? [-2.2, -1.2, 0.2] : [-1.01, -1.05, -0.20]}>
      {(active) => (
        <group>
          <SketchfabComputerModel
            partId="psu"
            active={active}
            xray={xray}
          />
          <Label partId="psu" position={[-0.42, 0.62, 0.58]} />
        </group>
      )}
    </Clickable>
  );
}

export function GPU({ xray, exploded }) {
  const show = useShouldShowPart('gpu');
  const poweredOn = useSimulationStore((state) => state.poweredOn);
  if (!show) return null;

  return (
    <Clickable partId="gpu" position={exploded ? [0.2, -1.35, 0.55] : [-0.47, 0.020, -0.15]}>
      {(active) => (
        <group>
          <SketchfabComputerModel
            partId="gpu"
            active={active}
            xray={xray}
            targetBox={[2.00, 1.60, 1.50]}
            rotation={[0, Math.PI / 1, 0]}
          />
          <Label partId="gpu" position={[0.08, -0.34, 0.46]} />
        </group>
      )}
    </Clickable>
  );
}

export function CableSystem({ cableView, exploded }) {
  const installed = useSimulationStore((state) => state.installed);
  const mode = useSimulationStore((state) => state.mode);
  const selectedPart = useSimulationStore((state) => state.selectedPart);
  const currentPartId = useCurrentPartId();
  const show = installed['power-cables'];
  const visible = mode === 'assembly' || currentPartId === 'power-cables' || cableView || selectedPart?.includes('cables') || show;
  const psuRoot = [-1.24, -1.02, 0.5];
  const motherboard24Pin = [0.82, 0.2, 0.5];
  const cpu8Pin = [-0.86, 0.84, 0.5];
  const gpu8Pin = [0.24, -0.32, 0.5];

  if (!show || !visible) return null;

  return (
    <Clickable partId="power-cables" position={exploded ? [0, -2.05, 0] : [0, 0, 0]}>
      {(active) => (
        <group>
          <CableConnector position={psuRoot} color="#020617" size={[0.42, 0.32, 0.18]} />
          <CableConnector position={motherboard24Pin} color="#020617" size={[0.2, 0.56, 0.12]} />
          <CableConnector position={cpu8Pin} color="#020617" size={[0.26, 0.16, 0.12]} />
          <CableConnector position={gpu8Pin} color="#020617" size={[0.28, 0.14, 0.12]} />

          <DetailBox position={[-1.24, -0.84, 0.59]} size={[0.46, 0.05, 0.035]} color="#1f2937" metalness={0.28} roughness={0.32} />
          <DetailBox position={[0.71, 0.2, 0.58]} size={[0.035, 0.52, 0.026]} color="#1f2937" metalness={0.28} roughness={0.32} />
          <DetailBox position={[-0.86, 0.74, 0.58]} size={[0.22, 0.03, 0.026]} color="#1f2937" metalness={0.28} roughness={0.32} />
          <DetailBox position={[0.24, -0.42, 0.58]} size={[0.28, 0.035, 0.026]} color="#1f2937" metalness={0.28} roughness={0.32} />

          <SleevedCableBundle
            active={active}
            count={12}
            spacing={0.014}
            radius={0.0095}
            spreadAxis="y"
            points={[psuRoot, [-1.1, -0.62, 0.72], [-0.34, 0.08, 0.74], [0.54, 0.18, 0.66], motherboard24Pin]}
            combs={[
              { position: [-1.06, -0.66, 0.72], size: [0.24, 0.08, 0.08] },
              { position: [0.52, 0.2, 0.66], size: [0.24, 0.12, 0.08] },
            ]}
          />
          <SleevedCableBundle
            active={active}
            count={4}
            spacing={0.016}
            radius={0.0105}
            spreadAxis="x"
            points={[psuRoot, [-1.36, -0.36, 0.72], [-1.18, 0.56, 0.7], cpu8Pin]}
            combs={[
              { position: [-1.3, -0.42, 0.72], size: [0.1, 0.08, 0.08] },
              { position: [-1.02, 0.58, 0.7], size: [0.1, 0.08, 0.08] },
            ]}
          />
          <SleevedCableBundle
            active={active}
            count={8}
            spacing={0.013}
            radius={0.0105}
            spreadAxis="y"
            points={[psuRoot, [-0.98, -0.86, 0.74], [-0.26, -0.58, 0.72], [0.08, -0.38, 0.64], gpu8Pin]}
            combs={[
              { position: [-0.92, -0.86, 0.74], size: [0.18, 0.08, 0.08] },
              { position: [0.08, -0.38, 0.64], size: [0.18, 0.08, 0.08] },
            ]}
          />

          <Label partId="power-cables" position={[-1.62, -0.58, 0.95]} />
        </group>
      )}
    </Clickable>
  );
}

export function FrontPanelCables({ cableView, exploded }) {
  const installed = useSimulationStore((state) => state.installed);
  const mode = useSimulationStore((state) => state.mode);
  const selectedPart = useSimulationStore((state) => state.selectedPart);
  const currentPartId = useCurrentPartId();
  const show = installed['front-panel'];
  const visible = mode === 'assembly' || currentPartId === 'front-panel' || cableView || selectedPart === 'front-panel' || show;

  if (!show || !visible) return null;

  return (
    <Clickable partId="front-panel" position={exploded ? [0.8, -2.05, 0.2] : [0, 0, 0]}>
      {(active) => (
        <group>
          <CableConnector position={[1.66, 0.7, 0.5]} color="#2dd4bf" size={[0.28, 0.16, 0.08]} />
          <CableConnector position={[0.68, 0.18, 0.44]} color="#2dd4bf" size={[0.22, 0.12, 0.08]} />
          <CableConnector position={[0.54, -0.02, 0.45]} color="#38bdf8" size={[0.18, 0.1, 0.07]} />

          <CablePath color={active ? '#67e8f9' : '#2dd4bf'} emissive="#0f766e" radius={0.016} points={[[1.66, 0.7, 0.5], [1.36, 0.7, 0.5], [0.68, 0.18, 0.44]]} />
          <CablePath color="#38bdf8" emissive="#075985" radius={0.014} points={[[1.66, 0.62, 0.52], [1.22, 0.42, 0.5], [0.54, -0.02, 0.45]]} />
          <CablePath color="#5eead4" emissive="#0f766e" radius={0.012} points={[[1.66, 0.78, 0.48], [1.28, 0.84, 0.5], [0.72, 0.3, 0.44]]} />

          <Label partId="front-panel" position={[1.78, 0.94, 0.86]} />
        </group>
      )}
    </Clickable>
  );
}
