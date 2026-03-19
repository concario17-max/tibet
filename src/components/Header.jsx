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
        toggleCommentaryPanel: () => {},
        isCommentaryOpen: true,
        isSidebarOpen: true,
    };
    const { toggleSidebar, toggleCommentaryPanel, isCommentaryOpen, isSidebarOpen } = uiContext;

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

    const desktopContentOffset = isReadingMode
        ? {
              '--header-right-offset': isCommentaryOpen ? (isSidebarOpen ? '400px' : '800px') : '0px',
              '--header-rail-padding': '24px',
          }
        : undefined;

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full border-b border-gold-primary/10 transition-colors duration-500 dark:border-dark-border/50 ${
                scrolled || isReadingMode
                    ? 'bg-sand-primary/82 backdrop-blur-xl dark:bg-dark-bg/84'
                    : 'bg-sand-primary/68 backdrop-blur-lg dark:bg-dark-bg/72'
            }`}
        >
            <div
                className="flex h-[60px] w-full items-center justify-between px-4 sm:h-16 sm:px-6 xl:px-0"
                style={desktopContentOffset}
            >
                <div
                    className="flex min-w-0 items-center gap-1 text-text-primary dark:text-dark-text-primary sm:gap-2"
                    style={desktopContentOffset ? { paddingLeft: 'var(--header-rail-padding)' } : undefined}
                >
                    <MobileActions isReadingMode={isReadingMode} toggleSidebar={toggleSidebar} />
                    <Branding isReadingMode={isReadingMode} />
                </div>

                <div
                    className="ml-2 flex shrink-0 items-center justify-end gap-1.5 sm:ml-3 sm:gap-3"
                    style={desktopContentOffset ? { marginRight: 'var(--header-right-offset)', paddingRight: 'var(--header-rail-padding)' } : undefined}
                >
                    {isReadingMode ? (
                        <button
                            onClick={toggleCommentaryPanel}
                            className={`group inline-flex h-10 items-center gap-2 rounded-full border px-3 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm transition-all duration-300 sm:h-11 sm:px-4 sm:text-[11px] sm:tracking-[0.16em] ${
                                isCommentaryOpen
                                    ? 'border-gold-primary/24 bg-white/60 text-gold-primary hover:border-gold-primary/30 hover:bg-white/72 dark:border-gold-primary/24 dark:bg-dark-surface/62 dark:text-gold-light dark:hover:bg-dark-surface/78'
                                    : 'border-gold-primary/12 bg-white/42 text-gold-primary/90 hover:border-gold-primary/24 hover:bg-white/58 dark:border-dark-border/60 dark:bg-dark-surface/42 dark:text-gold-light dark:hover:border-gold-primary/20 dark:hover:bg-dark-surface/60'
                            }`}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold-primary/10 bg-gold-surface/40 text-[#8A7756] transition-colors group-hover:border-gold-primary/22 group-hover:text-gold-primary dark:border-dark-border dark:bg-dark-bg/55 dark:text-gold-light">
                                <span className="material-symbols-outlined text-[14px]">notes</span>
                            </span>
                            <span className="hidden min-[420px]:inline">Commentary</span>
                        </button>
                    ) : null}
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);
