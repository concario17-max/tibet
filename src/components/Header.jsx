import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import Branding from './Header/Branding';
import ThemeToggle from './Header/ThemeToggle';
import MobileActions from './Header/MobileActions';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isAlbum = location.pathname === '/album';
    const isReadingMode = location.pathname.includes('/chapter') || location.pathname.includes('/text');

    const uiContext = useUI() || {
        toggleSidebar: () => {},
        toggleRightPanelMode: () => {},
        rightPanelMode: 'reflections',
    };
    const { toggleSidebar, toggleRightPanelMode, rightPanelMode } = uiContext;

    const themeContext = useTheme() || { theme: 'light', toggleTheme: () => {} };
    const { theme, toggleTheme } = themeContext;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isHome || isAlbum) return null;

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-8 flex items-center transition-all duration-500 border-b border-sand-tertiary dark:border-dark-border/50 ${
                scrolled ? 'glass-panel py-2' : 'bg-transparent py-2 sm:py-3'
            } ${isReadingMode ? 'bg-white/80 dark:bg-[#070707]/80 backdrop-blur-md' : ''}`}
        >
            <div className="flex-1 flex justify-start">
                <MobileActions isReadingMode={isReadingMode} toggleSidebar={toggleSidebar} />
            </div>

            <div className="flex-none">
                <Branding isReadingMode={isReadingMode} />
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
                {isReadingMode ? (
                    <>
                        <button
                            onClick={toggleRightPanelMode}
                            className="inline-flex items-center gap-2 rounded-full border border-gold-border/40 bg-white/80 px-4 py-2 text-[12px] font-bold tracking-[0.14em] text-[#9A7B4F] shadow-sm transition-colors hover:bg-gold-surface/45 dark:border-[#333] dark:bg-dark-surface dark:text-gold-light dark:hover:bg-dark-bg/80"
                        >
                            <span className="uppercase">
                                {rightPanelMode === 'reflections' ? 'COMMENTARY' : 'REFLECTIONS'}
                            </span>
                            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                        </button>
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    </>
                ) : (
                    <div className="w-[40px]" />
                )}
            </div>
        </header>
    );
};

export default React.memo(Header);
