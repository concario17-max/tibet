import React from 'react';
import { Link } from 'react-router-dom';

const Branding = ({ isChapter }) => {
    return (
        <div className={`transition-all duration-500 flex items-center gap-3 ${isChapter ? 'scale-90 sm:scale-100 flex-1' : 'scale-100 mb-4 justify-center w-full'}`}>
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined text-gold-primary text-[28px]">auto_stories</span>
                <span className="font-serif text-[15px] sm:text-[17px] tracking-[0.15em] text-charcoal-main dark:text-dark-text-primary font-bold uppercase mt-0.5">
                    The Bardo Thodol
                </span>
            </Link>
        </div>
    );
};

export default React.memo(Branding);
