import { create } from 'zustand';
import { stepsByMode } from '../data/steps';

const emptyInstalled = {
  'case-panel': false,
  motherboard: false,
  cpu: false,
  'thermal-paste': false,
  cooler: false,
  ram: false,
  storage: false,
  psu: false,
  gpu: false,
  'power-cables': false,
  'front-panel': false,
  'cable-management': false,
  'close-case': false,
  'power-test': false,
};

const fullInstalled = Object.fromEntries(
  Object.keys(emptyInstalled).map((key) => [key, true])
);

const now = () => Date.now();

export const useSimulationStore = create((set, get) => ({
  mode: 'assembly',
  currentStep: 0,
  selectedPart: null,
  installed: { ...emptyInstalled },
  isSessionActive: false,
  mistakes: 0,
  score: 0,
  startedAt: null,
  endedAt: null,
  feedback: 'Choose assembly or disassembly, then start the session.',
  xray: false,
  exploded: false,
  cableView: false,
  autoRotate: true,
  poweredOn: false,

  setMode: (mode) =>
    set({
      mode,
      currentStep: 0,
      selectedPart: null,
      installed: mode === 'assembly' ? { ...emptyInstalled } : { ...fullInstalled },
      isSessionActive: false,
      mistakes: 0,
      score: 0,
      startedAt: null,
      endedAt: null,
      feedback:
        mode === 'assembly'
          ? 'Assembly selected. Start the session to begin.'
          : 'Disassembly selected. Start the session to begin.',
      poweredOn: false,
    }),

  startSession: () =>
    set((state) => ({
      currentStep: 0,
      selectedPart: null,
      installed: state.mode === 'assembly' ? { ...emptyInstalled } : { ...fullInstalled },
      isSessionActive: true,
      mistakes: 0,
      score: 0,
      startedAt: now(),
      endedAt: null,
      feedback:
        state.mode === 'assembly'
          ? 'Session started. Open the case panel first.'
          : 'Session started. Power off the computer first.',
      poweredOn: false,
    })),

  endSession: () =>
    set((state) => ({
      isSessionActive: false,
      selectedPart: null,
      endedAt: now(),
      feedback:
        state.mode === 'assembly'
          ? 'Assembly session ended. Start a new session to continue practicing.'
          : 'Disassembly session ended. Start a new session to continue practicing.',
      poweredOn: false,
    })),

  selectPart: (partId) =>
    set((state) => ({
      selectedPart: state.isSessionActive ? partId : null,
      feedback: state.isSessionActive ? state.feedback : 'Start the session before selecting parts.',
    })),

  toggle: (key) => set((state) => ({ [key]: !state[key] })),

  tryAction: (partId) => {
    const state = get();
    const steps = stepsByMode[state.mode];
    const step = steps[state.currentStep];

    if (!state.isSessionActive) {
      set({ feedback: 'Start the session before placing or removing parts.' });
      return;
    }

    if (!step) return;

    if (step.partId !== partId) {
      set((current) => ({
        mistakes: current.mistakes + 1,
        score: Math.max(0, current.score - 5),
        feedback: `Incorrect Placement! ${step.title} is required now.`,
      }));
      return;
    }

    const isFinal = state.currentStep >= steps.length - 1;

    set((current) => {
      const updatedInstalled = { ...current.installed };

      if (current.mode === 'assembly') {
        updatedInstalled[partId] = true;
      } else {
        updatedInstalled[partId] = false;
      }

      return {
        installed: updatedInstalled,
        currentStep: isFinal ? current.currentStep : current.currentStep + 1,
        score: current.score + step.points,
        isSessionActive: !isFinal,
        endedAt: isFinal ? now() : current.endedAt,
        selectedPart: null,
        feedback: isFinal
          ? current.mode === 'assembly'
            ? 'Build complete. Final power-on animation is ready.'
            : 'Disassembly complete. All parts are removed properly.'
          : 'Correct! Continue to the next step.',
        poweredOn: current.mode === 'assembly' && isFinal,
      };
    });
  },

  reset: () =>
    set((state) => ({
      currentStep: 0,
      selectedPart: null,
      installed: state.mode === 'assembly' ? { ...emptyInstalled } : { ...fullInstalled },
      isSessionActive: false,
      mistakes: 0,
      score: 0,
      startedAt: null,
      endedAt: null,
      feedback:
        state.mode === 'assembly'
          ? 'Assembly reset. Start the session to begin.'
          : 'Disassembly reset. Start the session to begin.',
      poweredOn: false,
    })),
}));
