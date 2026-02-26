import React from 'react';
import { Home, Music, BookOpen, User, Search } from 'lucide-react';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-transparent">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 border border-border-gold flex items-center justify-center rounded-sm">
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
                <button className="px-6 py-2 border border-border-gold text-[10px] tracking-[0.3em] uppercase text-gold-primary hover:bg-gold-primary hover:text-white-soft transition-all duration-500">
                    Inquire
                </button>
            </div>
        </header>
    );
};

export default Header;
