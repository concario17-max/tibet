import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Hide navigations on Chapter page for 3-Column focus
    const isChapter = location.pathname.includes('/chapter');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 px-8 flex justify-center text-center items-center transition-all duration-500 border-b border-sand-tertiary ${scrolled ? 'glass-panel py-4' : 'bg-transparent py-6'} ${isChapter ? 'bg-white' : ''}`}>
            <nav className={`flex ${isChapter ? 'justify-between w-full px-4' : 'justify-center flex-col items-center'}`}>
                <div className={`mb-4 transition-all duration-500 flex items-center gap-3 ${isChapter ? 'scale-90 mb-0' : 'scale-100'}`}>
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <span className="material-symbols-outlined text-gold-primary text-3xl">auto_stories</span>
                        <span className="serif-title text-base tracking-widest text-charcoal-main font-bold">The Bardo Thodol</span>
                    </Link>
                </div>

                {!isChapter && (
                    <div className="flex items-center">
                        <Link to="/chapter" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main">
                            Compendium
                        </Link>
                        <Link to="/album" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main">
                            Lexicon
                        </Link>
                        <Link to="/chapter" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main">
                            Commentaries
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
