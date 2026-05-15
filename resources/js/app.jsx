import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LandingPage } from './pages/LandingPage';
import { SimulationPage } from './pages/SimulationPage';

function App() {
    const [screen, setScreen] = useState('landing');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((value) => (value === 'dark' ? 'light' : 'dark'));

    return (
        screen === 'landing'
            ? <LandingPage onStart={() => setScreen('simulation')} theme={theme} onThemeToggle={toggleTheme} />
            : <SimulationPage onBack={() => setScreen('landing')} theme={theme} onThemeToggle={toggleTheme} />
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <DndProvider backend={HTML5Backend}>
            <App />
        </DndProvider>
    </React.StrictMode>
);
