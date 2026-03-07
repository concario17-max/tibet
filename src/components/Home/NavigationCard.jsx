import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePremiumInteractions } from '../../hooks/usePremiumInteractions';

const NavigationCard = ({ to, label, title, description, icon, exploreLabel, exploreIcon, fadeUp }) => {
    const { ref, style, onMouseMove, onMouseLeave } = usePremiumInteractions(12);

    return (
        <motion.div
            ref={ref}
            variants={fadeUp}
            className="h-full perspective-1000"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={style}
        >
            <Link to={to} className="group relative flex flex-col h-[340px] sm:h-[440px] rounded-3xl overflow-hidden premium-card backdrop-blur-3xl">
                <div className="noise-overlay" />

                <div className="absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-b from-gold-surface/20 to-transparent pointer-events-none">
                    <span className="material-symbols-outlined text-8xl md:text-[140px] text-gold-dim opacity-10 group-hover:opacity-30 transition-all duration-1000 ease-premium group-hover:scale-110 mb-12">{icon}</span>
                </div>

                <div className="relative z-10 flex flex-col h-full p-8 md:p-10 justify-end">
                    <span className="absolute top-8 left-8 bg-white/80 backdrop-blur-md text-[#1A1A1A] px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.25em] uppercase border border-[#D6C7A2]/30 shadow-xl">{label}</span>

                    <div className="w-12 h-[1px] bg-[#B29A62]/40 mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-700 ease-premium" />
                    <h3 className="serif-title text-3xl md:text-4xl text-[#1A1A1A] group-hover:text-[#8C6D45] transition-colors duration-700 mb-3">{title}</h3>
                    <p className="text-[#1A1A1A]/50 text-[14px] font-noto font-light leading-relaxed group-hover:text-[#1A1A1A]/80 transition-colors duration-700 mb-8">
                        {description}
                    </p>

                    <div className="flex items-center gap-4 overflow-hidden">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B29A62] font-bold group-hover:translate-x-2 transition-transform duration-700 ease-premium">{exploreLabel}</span>
                        <div className="w-6 h-[1px] bg-[#B29A62]/30 group-hover:w-10 transition-all duration-700 ease-premium" />
                        <span className="material-symbols-outlined text-[18px] text-[#B29A62] group-hover:translate-x-4 transition-transform duration-700 delay-100">{exploreIcon}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default React.memo(NavigationCard);
