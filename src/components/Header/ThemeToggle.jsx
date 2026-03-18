import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-primary/12 bg-white/42 text-gold-primary/90 backdrop-blur-sm transition-all duration-300 hover:border-gold-primary/24 hover:bg-white/58 dark:border-dark-border/60 dark:bg-dark-surface/42 dark:text-gold-light dark:hover:border-gold-primary/20 dark:hover:bg-dark-surface/60 sm:h-11 sm:w-11"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
        </button>
    );
};

export default React.memo(ThemeToggle);
