import React from 'react';
import { Menu } from 'lucide-react';

const MobileActions = ({ isReadingMode, toggleSidebar }) => {
    return (
        <>
            {isReadingMode && (
                <div className="flex justify-start mr-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            )}
        </>
    );
};

export default React.memo(MobileActions);
