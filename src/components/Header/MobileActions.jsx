import React from 'react';
import { Menu, Edit3 } from 'lucide-react';

const MobileActions = ({ isChapter, toggleSidebar, toggleReflections }) => {
    return (
        <>
            {/* 왼쪽 모바일 토글 (Chapter 화면 전용) */}
            {isChapter && (
                <div className="flex justify-start lg:hidden mr-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* 모바일 우측 토글 (Chapter 화면 전용) */}
            {isChapter && (
                <div className="flex xl:hidden">
                    <button
                        onClick={toggleReflections}
                        className="p-2 -mr-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                    >
                        <Edit3 className="w-5 h-5" />
                    </button>
                </div>
            )}
        </>
    );
};

export default React.memo(MobileActions);
