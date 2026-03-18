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
            className={`glass-panel fixed top-0 left-0 z-50 w-full border-b border-gold-primary/20 shadow-sm transition-colors duration-500 dark:border-dark-border/60 ${
                scrolled || isReadingMode ? 'bg-white/80 backdrop-blur-md dark:bg-[#070707]/80' : 'bg-white/72 backdrop-blur-md dark:bg-[#070707]/72'
            }`}
        >
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-5">
                <div className="flex min-w-0 flex-1 items-center gap-1 text-text-primary dark:text-dark-text-primary sm:gap-2">
                    <MobileActions isReadingMode={isReadingMode} toggleSidebar={toggleSidebar} />
                    <Branding isReadingMode={isReadingMode} />
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:ml-3 sm:gap-3">
                    {isReadingMode ? (
                        <button
                            onClick={toggleRightPanelMode}
                            className="group inline-flex h-10 items-center gap-2 rounded-full border border-gold-primary/18 bg-white/78 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-primary shadow-[0_10px_24px_-20px_rgba(166,139,92,0.9)] backdrop-blur-sm transition-all duration-300 hover:border-gold-primary/35 hover:bg-gold-surface/80 dark:border-dark-border/70 dark:bg-dark-surface/80 dark:text-gold-light dark:hover:border-gold-primary/30 dark:hover:bg-dark-bg/80 sm:h-11 sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold-primary/20 bg-white/85 text-[#8A7756] transition-colors group-hover:border-gold-primary/35 group-hover:text-gold-primary dark:border-dark-border dark:bg-dark-bg/70 dark:text-gold-light">
                                <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                            </span>
                            <span className="hidden min-[420px]:inline">
                                {rightPanelMode === 'reflections' ? 'Commentary' : 'Reflections'}
                            </span>
                        </button>
                    ) : null}
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);
