import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SimulationControls } from '../components/controls/SimulationControls';
import { PartsTray } from '../components/panels/PartsTray';
import { StepPanel } from '../components/panels/StepPanel';
import { PCScene } from '../components/simulation/PCScene';

export function SimulationPage({ onBack, theme, onThemeToggle }) {
  return (
    <main className="min-h-screen bg-slate-100 p-3 text-slate-950 transition dark:bg-slate-950 dark:text-white md:p-5">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/86 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onBack} title="Back to landing">
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-lg font-black md:text-xl">PC Build Lab</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Interactive assembly and disassembly workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onThemeToggle} title="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)_330px]">
          <div className="order-2 lg:order-1">
            <PartsTray />
          </div>
          <section className="order-1 flex min-h-[620px] flex-col gap-4 lg:order-2">
            <PCScene theme={theme} />
            <SimulationControls />
          </section>
          <div className="order-3">
            <StepPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
