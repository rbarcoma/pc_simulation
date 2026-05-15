import { Cpu, HardDrive, MemoryStick, Microchip, Plug, SquareStack, Wind } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { parts } from '../../data/parts';
import { stepsByMode } from '../../data/steps';
import { useSimulationStore } from '../../store/simulationStore';

const icons = {
  cpu: Cpu,
  ram: MemoryStick,
  motherboard: Microchip,
  storage: HardDrive,
  psu: Plug,
  gpu: SquareStack,
  cooler: Wind,
};

export function PartsTray() {
  const { mode, currentStep, selectedPart, selectPart, tryAction } = useSimulationStore();
  const activePart = stepsByMode[mode][currentStep]?.partId;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/86 p-3 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-slate-950/78 dark:shadow-black/30">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="font-bold text-slate-950 dark:text-white">Components</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Tap once, then tap again to place</p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-2">
        {parts.map((part) => {
          return <PartCard key={part.id} part={part} activePart={activePart} selectedPart={selectedPart} selectPart={selectPart} tryAction={tryAction} />;
        })}
      </div>
    </div>
  );
}

function PartCard({ part, activePart, selectedPart, selectPart, tryAction }) {
  const Icon = icons[part.id] || SquareStack;
  const active = part.id === activePart;
  const selected = part.id === selectedPart;
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'part',
    item: { partId: part.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [part.id]);

  return (
    <button
      ref={drag}
      onClick={() => (selected ? tryAction(part.id) : selectPart(part.id))}
      className={`flex min-h-20 cursor-grab flex-col items-start justify-between rounded-lg border p-3 text-left transition active:cursor-grabbing ${
        active
          ? 'border-sky-400 bg-sky-50 shadow-lg shadow-sky-500/10 dark:bg-sky-500/15'
          : 'border-slate-200 bg-white hover:border-sky-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-400/40'
      } ${selected ? 'ring-2 ring-sky-400' : ''} ${isDragging ? 'opacity-45' : ''}`}
      title={part.guide}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <Icon size={18} style={{ color: part.color }} />
        {active && <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white">NEXT</span>}
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-950 dark:text-white">{part.name}</span>
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{part.brand}</span>
      </span>
    </button>
  );
}
