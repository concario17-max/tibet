import React from 'react';

const SidebarLayout = ({
    isOpen,
    isDesktopOpen,
    onClose,
    position = 'left',
    mobileWidthClass = 'w-80',
    desktopClassName = 'xl:w-full',
    children,
}) => {
    const isLeft = position === 'left';
    const mobileTranslateClosed = isLeft ? '-translate-x-full' : 'translate-x-full';
    const borderClass = isLeft ? 'border-r' : 'border-l';
    const placementClass = isLeft ? 'left-0' : 'right-0';
    const mobileStateClass = isOpen
        ? 'translate-x-0 overflow-hidden shadow-2xl xl:shadow-none'
        : mobileTranslateClosed;
    const desktopStateClass = isDesktopOpen
        ? `${desktopClassName} xl:translate-x-0 xl:opacity-100 xl:pointer-events-auto`
        : 'xl:w-0 xl:translate-x-0 xl:opacity-0 xl:pointer-events-none xl:overflow-hidden xl:border-none';

    return (
        <>
            {isOpen ? (
                <div
                    className="fixed inset-0 z-40 bg-black/50 opacity-100 backdrop-blur-sm transition-opacity duration-300 xl:hidden"
                    onClick={onClose}
                />
            ) : null}

            <aside
                className={`fixed inset-y-0 ${placementClass} z-50 flex ${mobileWidthClass} flex-col bg-white/80 font-inter backdrop-blur-xl transition-all duration-500 dark:bg-dark-bg/95 xl:sticky xl:top-16 xl:h-[calc(100vh-64px)] xl:shrink-0 ${borderClass} border-gold-primary/20 dark:border-dark-border/50 ${mobileStateClass} ${desktopStateClass}`}
            >
                {children}
            </aside>
        </>
    );
};

export default React.memo(SidebarLayout);
