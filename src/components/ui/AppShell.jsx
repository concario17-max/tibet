import React from 'react';

const AppShell = ({ sidebar, rightPanel, children, desktopGridColumns }) => {
    const desktopGridStyle = desktopGridColumns
        ? { '--desktop-frame-columns': desktopGridColumns }
        : undefined;

    return (
        <div className="relative z-10 flex h-screen min-h-screen w-full overflow-hidden bg-sand-primary transition-colors duration-500 dark:bg-dark-bg xl:bg-transparent dark:xl:bg-transparent">
            <div className="pointer-events-none fixed inset-0 z-[-1] bg-grid-slate-900/[0.04] bg-[bottom_1px_center] transition-opacity duration-500 dark:bg-grid-slate-100/[0.03]" />

            <div
                className={`relative flex h-full min-h-0 w-full flex-1 overflow-hidden ${
                    desktopGridColumns ? 'xl:grid xl:[grid-template-columns:var(--desktop-frame-columns)]' : ''
                }`}
                style={desktopGridStyle}
            >
                {sidebar}
                <div className={`flex min-h-0 min-w-0 flex-1 flex-col ${desktopGridColumns ? 'xl:col-start-2 xl:w-full' : ''}`}>
                    {children}
                </div>
                {rightPanel}
            </div>
        </div>
    );
};

export default React.memo(AppShell);
