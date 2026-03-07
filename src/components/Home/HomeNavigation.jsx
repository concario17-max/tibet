import React from 'react';
import { motion } from 'framer-motion';

const HomeNavigation = ({ setIsCompendiumOpen, setIsLexiconOpen, setIsCommentariesOpen }) => {
    const navItems = [
        { name: 'Compendium', action: () => setIsCompendiumOpen(true) },
        { name: 'Lexicon', action: () => setIsLexiconOpen(true) },
        { name: 'Commentaries', action: () => setIsCommentariesOpen(true) }
    ];

    return (
        <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-10 md:mb-14 z-20 relative"
        >
            {navItems.map((item, i) => (
                <button
                    key={i}
                    onClick={item.action}
                    className="group relative px-8 py-3 rounded-full border border-[#D6C7A2]/30 bg-white/10 backdrop-blur-xl text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-[#1A1A1A]/60 overflow-hidden transition-all duration-700 ease-premium hover:border-gold-primary/50 hover:text-gold-primary"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/0 via-gold-primary/5 to-gold-primary/0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-premium" />
                    <span className="relative z-10">{item.name}</span>
                </button>
            ))}
        </motion.nav>
    );
};

export default React.memo(HomeNavigation);
