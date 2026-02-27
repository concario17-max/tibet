import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

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
        <header className={`fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center transition-all duration-500 ${scrolled ? 'glass-panel py-4' : 'bg-transparent'}`}>
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-gold-primary/30 flex items-center justify-center rounded-sm">
                    <span className="text-gold-primary font-serif italic text-xl">B</span>
                </div>
                <span className="font-serif text-lg tracking-widest text-gold-primary uppercase">Bardo Silence</span>
            </div>

            <nav className="hidden md:flex space-x-12">
                {['Gallery', 'Prayers', 'Philosophy', 'About'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="text-text-primary text-xs tracking-[0.2em] uppercase hover:text-gold-primary transition-colors duration-300"
                    >
                        {item}
                    </a>
                ))}
            </nav>

            <div className="flex items-center space-x-6">
                <button className="text-text-primary hover:text-gold-primary transition-colors">
                    <Search size={18} strokeWidth={1.5} />
                </button>
                <button className="px-6 py-2 border border-gold-primary/30 text-[10px] tracking-[0.3em] uppercase text-gold-primary hover:bg-gold-primary hover:text-bg-primary transition-all duration-500 rounded-sm">
                    Inquire
                </button>
            </div>
        </header>
    );
};

export default Header;
