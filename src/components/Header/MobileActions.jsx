import React from 'react';
import { Menu } from 'lucide-react';

const MobileActions = ({ isReadingMode, toggleSidebar }) => {
    return (
        <>
            {isReadingMode && (
                <div className="mr-2 flex justify-start sm:mr-3">
                    <button
                        onClick={toggleSidebar}
                        className="-ml-1 shrink-0 rounded-xl p-2 text-gold-primary transition-all duration-300 hover:bg-gold-surface/50 dark:text-gold-light dark:hover:bg-dark-surface/50"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            )}
        </>
    );
};

export default React.memo(MobileActions);
