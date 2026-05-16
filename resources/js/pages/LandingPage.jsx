import { ArrowRight, Cpu, HardDrive, MemoryStick, Microchip, Moon, Sun, Wrench, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/ui/Button';

function PreviewPC({ theme }) {
  const isLight = theme === 'light';

  return (
    <Canvas camera={{ position: [4.2, 2.5, 4.8], fov: 42 }} dpr={[1, 1.6]}>
      <color attach="background" args={[isLight ? '#ffffff' : '#020617']} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} />
      <pointLight position={[-3, 2.4, 3]} intensity={1.1} color="#38bdf8" />
      <group rotation={[-0.14, -0.52, 0]} position={[0.55, -0.08, -0.2]}>
        <mesh position={[0, 0, -0.72]}>
          <boxGeometry args={[3.4, 2.35, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.42} />
        </mesh>
        <mesh position={[0, 1.18, 0]}>
          <boxGeometry args={[3.5, 0.12, 1.55]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>
        <mesh position={[0, -1.18, 0]}>
          <boxGeometry args={[3.5, 0.12, 1.55]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>
        <mesh position={[-1.75, 0, 0]}>
          <boxGeometry args={[0.12, 2.35, 1.55]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>
        <mesh position={[1.75, 0, 0]}>
          <boxGeometry args={[0.12, 2.35, 1.55]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>
        <mesh position={[-0.2, 0.02, -0.62]}>
          <boxGeometry args={[1.75, 1.45, 0.08]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.18, 0.16, -0.5]}>
          <boxGeometry args={[0.46, 0.46, 0.12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.45} />
        </mesh>
        <mesh position={[-0.78, -0.12, -0.49]}>
          <boxGeometry args={[0.12, 0.82, 0.14]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[-0.58, -0.12, -0.49]}>
          <boxGeometry args={[0.12, 0.82, 0.14]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
        <mesh position={[-0.04, -0.62, -0.25]}>
          <boxGeometry args={[1.25, 0.25, 0.2]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
        <mesh position={[-1.1, -0.88, -0.28]}>
          <boxGeometry args={[0.7, 0.48, 0.55]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        <mesh position={[1.04, -0.68, -0.28]}>
          <boxGeometry args={[0.62, 0.42, 0.22]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
    </Canvas>
  );
}

const highlights = [
  ['Assembly', 'Follow the build from open case to final power test.'],
  ['Disassembly', 'Remove each component in the correct order.'],
  ['Guided', 'Get step instructions, labels, safety notes, and scoring.'],
];

const parts = [
  [Microchip, 'Motherboard'],
  [Cpu, 'CPU'],
  [MemoryStick, 'RAM'],
  [HardDrive, 'Storage'],
  [Zap, 'Power'],
  [Wrench, 'Tools'],
];

export function LandingPage({ onStart, theme, onThemeToggle }) {
  return (
    <main className="min-h-screen bg-white text-slate-950 transition dark:bg-slate-950 dark:text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 md:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-500 text-white">
              <Cpu size={20} />
            </span>
            <span>PC Build Lab</span>
          </div>
          <Button variant="secondary" onClick={onThemeToggle} title="Toggle theme">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </Button>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="mb-4 text-sm font-semibold uppercase text-sky-600 dark:text-sky-300">
              WEB-BASED IT LEARNING SIMULATOR
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
              3D Computer Assembly & Disassembly Simulation
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
              A web-based 3D simulation platform for IT students and aspiring IT professionals to learn computer assembly and disassembly through interactive practice, guided procedures, and real-time validation.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button onClick={onStart} className="h-12 px-5">
                Start Simulation
                <ArrowRight size={18} />
              </Button>
              <a href="#overview" className="text-sm font-semibold text-slate-600 transition hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-300">
                View overview
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="h-[390px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950 md:h-[480px]"
          >
            <PreviewPC theme={theme} />
          </motion.div>
        </div>
      </section>

      <section id="overview" className="border-y border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-10 md:grid-cols-3 md:px-8">
          {highlights.map(([title, copy]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950">
              <h2 className="font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Core Parts Covered</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Learn the main components before practicing in the 3D workspace.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {parts.map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-white/10">
                <Icon size={16} className="text-sky-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
