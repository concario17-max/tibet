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
                    className="px-6 py-2.5 rounded-full border border-[#D6C7A2]/60 bg-white/40 backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/70 hover:text-white hover:bg-[#B29A62] hover:border-[#B29A62] hover:shadow-lg hover:shadow-[#B29A62]/20 transition-all duration-500"
                >
                    {item.name}
                </button>
            ))}
        </motion.nav>
    );
};

export default React.memo(HomeNavigation);
