import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-center text-center items-center transition-all duration-500 border-b border-champagne dark:border-slate-800 ${scrolled ? 'glass-panel py-4' : 'bg-transparent'}`}>
            <nav className="flex justify-center flex-col items-center">
                <div className="mb-4">
                    <Link to="/">
                        <span className="material-symbols-outlined text-primary text-4xl hover:text-muted-gold transition-colors">temple_buddhist</span>
                    </Link>
                </div>

                <div className="flex items-center">
                    <Link to="/chapter" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors text-slate-800 dark:text-slate-200">
                        Compendium
                    </Link>
                    <Link to="/album" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors text-slate-800 dark:text-slate-200">
                        Lexicon
                    </Link>
                    <Link to="/chapter" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors text-slate-800 dark:text-slate-200">
                        Commentaries
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
