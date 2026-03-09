import React from 'react';
import { Link } from 'react-router-dom';

const Branding = () => {
    return (
        <div className="flex items-center justify-center pointer-events-auto">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined text-gold-primary text-[24px] sm:text-[28px]">auto_stories</span>
                <span className="font-serif text-[14px] sm:text-[17px] tracking-[0.1em] sm:tracking-[0.15em] text-charcoal-main dark:text-dark-text-primary font-bold uppercase mt-0.5 whitespace-nowrap">
                    The Bardo Thodol
                </span>
            </Link>
        </div>
    );
};

export default React.memo(Branding);
