import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { partMap } from '../../data/parts';
import { stepsByMode } from '../../data/steps';
import { useSimulationStore } from '../../store/simulationStore';

const material = (color, active, xray) => ({
  color,
  transparent: true,
  opacity: xray ? 0.34 : active ? 1 : 0.82,
  roughness: 0.42,
  metalness: 0.12,
});

function useShouldShowPart(partId) {
  const installed = useSimulationStore((state) => state.installed);
  const mode = useSimulationStore((state) => state.mode);

  if (mode === 'assembly') {
    return installed?.[partId] === true;
  }

  if (mode === 'disassembly') {
    return installed?.[partId] === true;
  }

  return false;
}

function useCurrentPartId() {
  const mode = useSimulationStore((state) => state.mode);
  const currentStep = useSimulationStore((state) => state.currentStep);

  return stepsByMode[mode]?.[currentStep]?.partId;
}

function Label({ partId, position }) {
  const part = partMap[partId];

  return (
    <Html position={position} center distanceFactor={9}>
      <div className="pointer-events-none rounded-md border border-white/15 bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-white shadow-xl">
        {part?.name || partId}
      </div>
    </Html>
  );
}

function Clickable({ partId, children, position = [0, 0, 0] }) {
  const selectPart = useSimulationStore((state) => state.selectPart);
  const tryAction = useSimulationStore((state) => state.tryAction);
  const currentPartId = useCurrentPartId();
  const active = currentPartId === partId;

  return (
    <group
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
        selectPart(partId);
        tryAction(partId);
      }}
    >
      {children(active)}
    </group>
  );
}

export function PCCase({ xray, exploded }) {
  const installed = useSimulationStore((state) => state.installed);
  const mode = useSimulationStore((state) => state.mode);

  const sidePanelVisible =
    mode === 'assembly'
      ? installed['case-panel'] === false || installed['close-case'] === true
      : installed['case-panel'] === true;

  return (
    <group position={exploded ? [-2.2, 0.25, 0.15] : [0, 0, 0]}>
      {/* Open chassis frame - always visible */}
      <mesh position={[0, 0, -1.08]}>
        <boxGeometry args={[4.6, 3.1, 0.12]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={xray ? 0.18 : 0.92} wireframe={xray} roughness={0.5} metalness={0.15} />
      </mesh>

      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[4.6, 0.14, 2.2]} />
        <meshStandardMaterial color="#111827" transparent opacity={xray ? 0.22 : 0.95} wireframe={xray} roughness={0.5} />
      </mesh>

      <mesh position={[0, -1.55, 0]}>
        <boxGeometry args={[4.6, 0.14, 2.2]} />
        <meshStandardMaterial color="#111827" transparent opacity={xray ? 0.22 : 0.95} wireframe={xray} roughness={0.5} />
      </mesh>

      <mesh position={[2.3, 0, 0]}>
        <boxGeometry args={[0.16, 3.1, 2.2]} />
        <meshStandardMaterial color="#111827" transparent opacity={xray ? 0.2 : 0.92} wireframe={xray} roughness={0.5} />
      </mesh>

      <mesh position={[-2.3, 0, 0]}>
        <boxGeometry args={[0.16, 3.1, 2.2]} />
        <meshStandardMaterial color="#111827" transparent opacity={xray ? 0.2 : 0.92} wireframe={xray} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0, 1.08]}>
        <boxGeometry args={[4.5, 0.08, 0.1]} />
        <meshStandardMaterial color="#334155" transparent opacity={xray ? 0.2 : 0.85} wireframe={xray} />
      </mesh>

      {/* Removable side panel */}
      {sidePanelVisible && (
        <Clickable partId="case-panel" position={[exploded ? -0.85 : 0, exploded ? 0.2 : 0, exploded ? 0.6 : 0]}>
          {(active) => (
            <>
              <mesh position={[0.05, 0.05, 1.13]}>
                <boxGeometry args={[4.1, 2.55, 0.08]} />
                <meshStandardMaterial
                  color="#7dd3fc"
                  transparent
                  opacity={active ? 0.85 : 0.65}
                  roughness={0.25}
                  metalness={0.1}
                />
              </mesh>

              <Label partId="case-panel" position={[0, 1.85, 1.25]} />
            </>
          )}
        </Clickable>
      )}

      {!sidePanelVisible && (
        <Label partId="case-panel" position={[0, 1.85, 1.25]} />
      )}

      {/* Motherboard tray and rear I/O frame */}
      <mesh position={[-1.86, 0.12, -0.32]}>
        <boxGeometry args={[0.13, 2.4, 1.3]} />
        <meshStandardMaterial color="#020617" roughness={0.5} />
      </mesh>

      <mesh position={[0.05, -1.06, 1.03]}>
        <boxGeometry args={[4.2, 0.16, 0.14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.45} />
      </mesh>

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
    <Clickable partId="motherboard" position={exploded ? [0, 0.95, -1.35] : [-0.45, 0, -0.6]}>
      {(active) => (
        <>
          <mesh>
            <boxGeometry args={[2.45, 2.05, 0.08]} />
            <meshStandardMaterial {...material('#0ea5e9', active, xray)} />
          </mesh>

          <mesh position={[0.15, 0.1, 0.07]}>
            <boxGeometry args={[0.55, 0.55, 0.08]} />
            <meshStandardMaterial color="#dbeafe" />
          </mesh>

          <mesh position={[-0.75, -0.25, 0.08]}>
            <boxGeometry args={[0.25, 1.15, 0.08]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>

          <mesh position={[-1.05, -0.25, 0.08]}>
            <boxGeometry args={[0.12, 1.15, 0.08]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>

          <Label partId="motherboard" position={[0, 1.35, 0.28]} />
        </>
      )}
    </Clickable>
  );
}

export function CPU({ xray, exploded }) {
  const show = useShouldShowPart('cpu');
  if (!show) return null;

  return (
    <Clickable partId="cpu" position={exploded ? [1.65, 1.35, -0.5] : [-0.3, 0.12, -0.49]}>
      {(active) => (
        <>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.12]} />
            <meshStandardMaterial {...material('#f8fafc', active, xray)} metalness={0.45} />
          </mesh>

          <Label partId="cpu" position={[0.52, 0.46, 0.28]} />
        </>
      )}
    </Clickable>
  );
}

export function ThermalPaste({ exploded }) {
  const show = useShouldShowPart('thermal-paste');
  if (!show) return null;

  return (
    <Clickable partId="thermal-paste" position={exploded ? [2.25, 1.35, -0.3] : [-0.3, 0.12, -0.38]}>
      {(active) => (
        <>
          <mesh>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color={active ? '#f0f9ff' : '#bae6fd'} roughness={0.15} />
          </mesh>

          <Label partId="thermal-paste" position={[0.66, 0.18, 0.28]} />
        </>
      )}
    </Clickable>
  );
}

export function Cooler({ xray, exploded }) {
  const show = useShouldShowPart('cooler');
  const fan = useRef();
  const poweredOn = useSimulationStore((state) => state.poweredOn);

  useFrame((_, delta) => {
    if (fan.current && poweredOn) {
      fan.current.rotation.z += delta * 10;
    }
  });

  if (!show) return null;

  return (
    <Clickable partId="cooler" position={exploded ? [1.95, 0.65, -0.2] : [-0.3, 0.12, -0.24]}>
      {(active) => (
        <group>
          <mesh>
            <boxGeometry args={[0.78, 0.78, 0.18]} />
            <meshStandardMaterial {...material('#94a3b8', active, xray)} metalness={0.35} />
          </mesh>

          <mesh ref={fan} position={[0, 0, 0.13]}>
            <torusGeometry args={[0.24, 0.04, 12, 36]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          <Label partId="cooler" position={[0.74, 0.12, 0.38]} />
        </group>
      )}
    </Clickable>
  );
}

export function RAM({ xray, exploded }) {
  const show = useShouldShowPart('ram');
  if (!show) return null;

  return (
    <Clickable partId="ram" position={exploded ? [-1.65, 1.15, -0.7] : [-1.1, -0.25, -0.45]}>
      {(active) => (
        <>
          <mesh>
            <boxGeometry args={[0.15, 1.1, 0.16]} />
            <meshStandardMaterial {...material('#22c55e', active, xray)} />
          </mesh>

          <Label partId="ram" position={[-0.42, 0.66, 0.32]} />
        </>
      )}
    </Clickable>
  );
}

export function Storage({ xray, exploded }) {
  const show = useShouldShowPart('storage');
  if (!show) return null;

  return (
    <Clickable partId="storage" position={exploded ? [1.6, -1.2, 0.1] : [1.15, -0.95, -0.3]}>
      {(active) => (
        <>
          <mesh>
            <boxGeometry args={[0.88, 0.55, 0.2]} />
            <meshStandardMaterial {...material('#facc15', active, xray)} />
          </mesh>

          <Label partId="storage" position={[0.2, 0.62, 0.34]} />
        </>
      )}
    </Clickable>
  );
}

export function PSU({ xray, exploded }) {
  const show = useShouldShowPart('psu');
  if (!show) return null;

  return (
    <Clickable partId="psu" position={exploded ? [-2.2, -1.2, 0.2] : [-1.35, -1.05, -0.15]}>
      {(active) => (
        <>
          <mesh>
            <boxGeometry args={[1.05, 0.7, 0.75]} />
            <meshStandardMaterial {...material('#f97316', active, xray)} metalness={0.2} />
          </mesh>

          <Label partId="psu" position={[-0.42, 0.62, 0.58]} />
        </>
      )}
    </Clickable>
  );
}

export function GPU({ xray, exploded }) {
  const show = useShouldShowPart('gpu');
  if (!show) return null;

  return (
    <Clickable partId="gpu" position={exploded ? [0.2, -1.35, 0.55] : [-0.15, -0.75, 0.08]}>
      {(active) => (
        <group>
          <mesh>
            <boxGeometry args={[1.55, 0.42, 0.24]} />
            <meshStandardMaterial {...material('#8b5cf6', active, xray)} />
          </mesh>

          <mesh position={[0.35, 0, 0.16]}>
            <torusGeometry args={[0.13, 0.025, 8, 24]} />
            <meshStandardMaterial color="#111827" />
          </mesh>

          <Label partId="gpu" position={[0.1, -0.48, 0.48]} />
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

  if (!show) return null;

  const visible = mode === 'assembly' ? true : currentPartId === 'power-cables' || cableView || selectedPart?.includes('cables');

  if (!visible) return null;

  return (
    <Clickable partId="power-cables" position={exploded ? [0, -2.05, 0] : [0, 0, 0]}>
      {() => (
        <group>
          <mesh position={[-0.8, -0.8, 0.28]} rotation={[0, 0, 0.65]}>
            <cylinderGeometry args={[0.025, 0.025, 2.3, 12]} />
            <meshStandardMaterial color="#fb7185" emissive="#7f1d1d" emissiveIntensity={0.4} />
          </mesh>

          <mesh position={[0.75, -0.55, 0.28]} rotation={[0, 0, -0.9]}>
            <cylinderGeometry args={[0.022, 0.022, 1.65, 12]} />
            <meshStandardMaterial color="#2dd4bf" emissive="#0f766e" emissiveIntensity={0.35} />
          </mesh>

          <Label partId="power-cables" position={[0, -1.65, 0.8]} />
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
  const visible = mode === 'assembly' ? true : currentPartId === 'front-panel' || cableView || selectedPart === 'front-panel';

  if (!show || !visible) return null;

  return (
    <Clickable partId="front-panel" position={exploded ? [0.8, -2.05, 0.2] : [0, 0, 0]}>
      {(active) => (
        <group>
          <mesh position={[0.95, 0.2, 0.36]} rotation={[0, 0, 1.05]}>
            <cylinderGeometry args={[0.018, 0.018, 1.45, 12]} />
            <meshStandardMaterial color={active ? '#67e8f9' : '#2dd4bf'} emissive="#0f766e" emissiveIntensity={active ? 0.9 : 0.4} />
          </mesh>

          <mesh position={[1.25, 0.55, 0.42]}>
            <boxGeometry args={[0.28, 0.16, 0.08]} />
            <meshStandardMaterial color="#2dd4bf" emissive="#0f766e" emissiveIntensity={active ? 0.8 : 0.35} />
          </mesh>

          <Label partId="front-panel" position={[1.15, 0.95, 0.65]} />
        </group>
      )}
    </Clickable>
  );
}
