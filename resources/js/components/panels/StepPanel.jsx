import { AlertTriangle, CheckCircle2, Clock, Target } from 'lucide-react';
import { stepsByMode } from '../../data/steps';
import { partMap } from '../../data/parts';
import { useSimulationStore } from '../../store/simulationStore';

export function StepPanel() {
  const { mode, setMode, currentStep, feedback, mistakes, score, startedAt, endedAt, isSessionActive } = useSimulationStore();
  const steps = stepsByMode[mode];
  const step = steps[currentStep] || steps[steps.length - 1];
  const part = partMap[step.partId];
  const progress = Math.round(((currentStep + (feedback.includes('complete') ? 1 : 0)) / steps.length) * 100);
  const elapsed = startedAt ? Math.max(0, Math.floor(((endedAt || Date.now()) - startedAt) / 1000)) : 0;
  const sessionLabel = isSessionActive ? 'Session Active' : startedAt ? 'Session Ended' : 'Session Not Started';

  return (
    <aside className="rounded-xl border border-slate-200 bg-white/86 p-4 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-slate-950/78 dark:shadow-black/30">
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-white/10">
        {['assembly', 'disassembly'].map((item) => (
          <button
            key={item}
            onClick={() => setMode(item)}
            disabled={isSessionActive}
            className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
              mode === item ? 'bg-sky-500 text-white shadow' : 'text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-white/10'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={`mb-4 rounded-lg border px-3 py-2 text-sm font-semibold ${
        isSessionActive
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100'
          : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
      }`}>
        {sessionLabel}
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</span>
        <span>{progress}% complete</span>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>

      <h2 className="text-xl font-bold text-slate-950 dark:text-white">{step.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.instruction}</p>

      {part && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: part.color }} />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{part.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{part.brand} - {part.type}</p>
              <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{part.info}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle size={16} />
          Safety Reminder
        </div>
        <p className="mt-1 leading-5">{part?.safety || 'Never install components while the computer is powered on.'}</p>
      </div>

      <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-950 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-100">
        <div className="flex items-center gap-2 font-semibold">
          <CheckCircle2 size={16} />
          Feedback
        </div>
        <p className="mt-1 leading-5">{feedback}</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <Metric icon={Target} label="Score" value={score} />
        <Metric icon={AlertTriangle} label="Mistakes" value={mistakes} />
        <Metric icon={Clock} label="Time" value={`${elapsed}s`} />
      </div>
    </aside>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/5">
      <Icon className="mx-auto mb-1 text-sky-500" size={16} />
      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
