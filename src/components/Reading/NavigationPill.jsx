import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationPill = ({ globalIndex, verseId, onPrevious, onNext }) => {
    return (
        <div className="flex justify-center mt-12 mb-8">
            <div className="flex items-center justify-between w-[200px] px-6 py-[14px] rounded-full bg-white/60 dark:bg-[#111] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gold-border/10 dark:border-[#333] backdrop-blur-md transition-all duration-300">
                <button
                    onClick={onPrevious}
                    disabled={!onPrevious}
                    className="text-slate-400 dark:text-slate-500 hover:text-gold-primary dark:hover:text-gold-light disabled:opacity-30 disabled:hover:text-slate-400 transition-colors outline-none focus:outline-none"
                    aria-label="Previous Verse"
                >
                    <ChevronLeft size={20} strokeWidth={1.5} />
                </button>

                <span className="font-inter font-[600] text-[15px] letter-spacing-tight text-slate-700 dark:text-gray-200">
                    {globalIndex || verseId.replace('chapter-', '')}
                </span>

                <button
                    onClick={onNext}
                    disabled={!onNext}
                    className="text-slate-400 dark:text-slate-500 hover:text-gold-primary dark:hover:text-gold-light disabled:opacity-30 disabled:hover:text-slate-400 transition-colors outline-none focus:outline-none"
                    aria-label="Next Verse"
                >
                    <ChevronRight size={20} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
};

export default React.memo(NavigationPill);
