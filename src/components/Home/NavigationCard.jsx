import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavigationCard = ({ to, label, title, description, icon, exploreLabel, exploreIcon, fadeUp }) => {
    return (
        <motion.div variants={fadeUp} className="h-full">
            <Link to={to} className="group relative flex flex-col h-[340px] sm:h-[440px] rounded-2xl overflow-hidden premium-card hover:shadow-2xl transition-all duration-700 backdrop-blur-xl">
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-b from-gold-surface/30 to-transparent pointer-events-none">
                    <span className="material-symbols-outlined text-8xl md:text-[130px] text-gold-dim opacity-20 group-hover:opacity-40 transition-all duration-700 ease-out group-hover:scale-110 mb-12">{icon}</span>
                </div>

                <div className="relative z-10 flex flex-col h-full p-6 md:p-8 justify-end">
                    <span className="absolute top-6 left-6 bg-white/90 backdrop-blur text-[#1A1A1A] px-2.5 py-1 rounded text-[8px] font-bold tracking-[0.2em] uppercase border border-[#D6C7A2]/50 shadow-sm">{label}</span>

                    <div className="w-8 h-[1px] bg-[#B29A62]/60 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500 ease-out" />
                    <h3 className="serif-title text-2xl md:text-3xl text-[#1A1A1A] group-hover:text-[#8C6D45] transition-colors duration-500 mb-2">{title}</h3>
                    <p className="text-[#1A1A1A]/60 text-[13px] font-noto font-light group-hover:text-[#1A1A1A]/80 transition-colors duration-500 mb-6">
                        {description}
                    </p>

                    <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#B29A62] font-bold group-hover:translate-x-2 transition-transform duration-500">{exploreLabel}</span>
                        <span className="material-symbols-outlined text-[14px] text-[#B29A62] group-hover:translate-x-3 transition-transform duration-500 delay-75">{exploreIcon}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default React.memo(NavigationCard);
