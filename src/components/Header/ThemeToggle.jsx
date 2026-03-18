import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-primary/18 bg-white/78 text-gold-primary shadow-[0_10px_24px_-20px_rgba(166,139,92,0.9)] backdrop-blur-sm transition-all duration-300 hover:border-gold-primary/35 hover:bg-gold-surface/80 dark:border-dark-border/70 dark:bg-dark-surface/80 dark:text-gold-light dark:hover:border-gold-primary/30 dark:hover:bg-dark-bg/80 sm:h-11 sm:w-11"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
        </button>
    );
};

export default React.memo(ThemeToggle);
