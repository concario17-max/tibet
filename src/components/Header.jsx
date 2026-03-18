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
            className={`fixed top-0 left-0 z-50 w-full border-b border-gold-primary/10 transition-colors duration-500 dark:border-dark-border/50 ${
                scrolled || isReadingMode
                    ? 'bg-sand-primary/82 backdrop-blur-xl dark:bg-dark-bg/84'
                    : 'bg-sand-primary/68 backdrop-blur-lg dark:bg-dark-bg/72'
            }`}
        >
            <div className="mx-auto flex h-15 w-full items-center justify-between px-4 sm:h-16 sm:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-1 text-text-primary dark:text-dark-text-primary sm:gap-2">
                    <MobileActions isReadingMode={isReadingMode} toggleSidebar={toggleSidebar} />
                    <Branding isReadingMode={isReadingMode} />
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:ml-3 sm:gap-3">
                    {isReadingMode ? (
                        <button
                            onClick={toggleRightPanelMode}
                            className="group inline-flex h-10 items-center gap-2 rounded-full border border-gold-primary/12 bg-white/42 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-primary/90 backdrop-blur-sm transition-all duration-300 hover:border-gold-primary/24 hover:bg-white/58 dark:border-dark-border/60 dark:bg-dark-surface/42 dark:text-gold-light dark:hover:border-gold-primary/20 dark:hover:bg-dark-surface/60 sm:h-11 sm:px-4 sm:text-[11px] sm:tracking-[0.16em]"
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold-primary/10 bg-gold-surface/40 text-[#8A7756] transition-colors group-hover:border-gold-primary/22 group-hover:text-gold-primary dark:border-dark-border dark:bg-dark-bg/55 dark:text-gold-light">
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
