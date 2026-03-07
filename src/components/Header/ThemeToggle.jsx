import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="p-2 -mr-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors ml-2"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
        </button>
    );
};

export default React.memo(ThemeToggle);
