import React from 'react';
import { BookOpenText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Branding = () => {
    return (
        <div className="pointer-events-auto flex items-center justify-center">
            <Link to="/" className="group flex min-w-0 items-center gap-1 truncate sm:gap-2.5">
                <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                    <BookOpenText className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
                <span className="mt-0.5 truncate font-serif text-[18px] font-medium tracking-[0.03em] text-charcoal-main transition-colors group-hover:text-gold-primary dark:text-dark-text-primary sm:text-[24px] sm:tracking-[0.04em]">
                    The Bardo Thodol
                </span>
            </Link>
        </div>
    );
};

export default React.memo(Branding);
