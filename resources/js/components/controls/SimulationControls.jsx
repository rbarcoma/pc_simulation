import { Eye, PauseCircle, PlayCircle, Power, RotateCcw, RotateCw, Sparkles, Split } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSimulationStore } from '../../store/simulationStore';

const toggles = [
  ['exploded', Split, 'Exploded'],
  ['xray', Eye, 'X-Ray'],
  ['autoRotate', RotateCw, 'Rotate'],
];

export function SimulationControls() {
  const store = useSimulationStore();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      <Button
        variant={store.isSessionActive ? 'secondary' : 'primary'}
        onClick={store.startSession}
        title="Start session"
        className="h-11 px-3"
      >
        <PlayCircle size={17} />
        <span>Start Session</span>
      </Button>
      <Button
        variant="secondary"
        onClick={store.endSession}
        disabled={!store.isSessionActive}
        title="End session"
        className="h-11 px-3"
      >
        <PauseCircle size={17} />
        <span>End Session</span>
      </Button>
      {toggles.map(([key, Icon, label]) => (
        <Button
          key={key}
          variant={store[key] ? 'primary' : 'secondary'}
          onClick={() => store.toggle(key)}
          title={label}
          className="h-11 px-3"
        >
          <Icon size={17} />
          <span>{label}</span>
        </Button>
      ))}
      <Button variant="secondary" onClick={store.reset} title="Reset simulation" className="h-11 px-3">
        <RotateCcw size={17} />
        <span>Reset</span>
      </Button>
      {store.poweredOn && (
        <Button variant="primary" className="h-11 px-3 xl:col-span-2">
          <Power size={17} />
          <span>Power Test Passed</span>
          <Sparkles size={15} />
        </Button>
      )}
    </div>
  );
}
