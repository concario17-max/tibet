import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getDesktopFrameColumns } from '../components/ui/desktopFrame';

const UIContext = createContext();

const DESKTOP_BREAKPOINT = '(min-width: 1280px)';
const COMMENTARY_PANEL = 'commentary';

const isDesktopLayout = () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_BREAKPOINT).matches;
const resolveNextState = (nextValue, currentValue) => (typeof nextValue === 'function' ? nextValue(currentValue) : nextValue);

export const UIProvider = ({ children }) => {
    const [isDesktopViewport, setIsDesktopViewport] = useState(isDesktopLayout);

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [activeMobileRightPanel, setActiveMobileRightPanel] = useState(null);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
        if (typeof window === 'undefined') return true;

        const saved = localStorage.getItem('tibet_desktop_sidebar');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [activeDesktopRightPanel, setActiveDesktopRightPanel] = useState(() => {
        if (typeof window === 'undefined') return COMMENTARY_PANEL;

        const saved = localStorage.getItem('tibet_desktop_right_panel');
        return saved !== null ? JSON.parse(saved) : COMMENTARY_PANEL;
    });

    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    const [isCommentariesOpen, setIsCommentariesOpen] = useState(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);

    const [activeVerse, setActiveVerse] = useState(() => {
        try {
            const saved = localStorage.getItem('tibet_active_verse');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            return null;
        }
    });

    useEffect(() => {
        if (activeVerse === undefined) return;
        localStorage.setItem('tibet_active_verse', JSON.stringify(activeVerse));
    }, [activeVerse]);

    useEffect(() => {
        const handleResize = () => {
            const nextIsDesktop = isDesktopLayout();
            setIsDesktopViewport(nextIsDesktop);

            if (nextIsDesktop) {
                setIsMobileSidebarOpen(false);
                setActiveMobileRightPanel(null);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        localStorage.setItem('tibet_desktop_sidebar', JSON.stringify(isDesktopSidebarOpen));
    }, [isDesktopSidebarOpen]);

    useEffect(() => {
        localStorage.setItem('tibet_desktop_right_panel', JSON.stringify(activeDesktopRightPanel));
    }, [activeDesktopRightPanel]);

    const toggleMobileSidebar = useCallback(() => {
        setIsMobileSidebarOpen((prev) => !prev);
    }, []);

    const toggleDesktopSidebar = useCallback(() => {
        setIsDesktopSidebarOpen((prev) => !prev);
    }, []);

    const toggleMobileCommentaryPanel = useCallback(() => {
        setActiveMobileRightPanel((prev) => (prev === COMMENTARY_PANEL ? null : COMMENTARY_PANEL));
    }, []);

    const toggleDesktopCommentaryPanel = useCallback(() => {
        setActiveDesktopRightPanel((prev) => (prev === COMMENTARY_PANEL ? null : COMMENTARY_PANEL));
    }, []);

    const toggleSidebar = useCallback(() => {
        if (isDesktopViewport) {
            toggleDesktopSidebar();
            return;
        }

        toggleMobileSidebar();
    }, [isDesktopViewport, toggleDesktopSidebar, toggleMobileSidebar]);

    const toggleCommentaryPanel = useCallback(() => {
        if (isDesktopViewport) {
            toggleDesktopCommentaryPanel();
            return;
        }

        toggleMobileCommentaryPanel();
    }, [isDesktopViewport, toggleDesktopCommentaryPanel, toggleMobileCommentaryPanel]);

    const setResponsiveSidebarOpen = useCallback(
        (nextValue) => {
            if (isDesktopViewport) {
                setIsDesktopSidebarOpen((currentValue) => resolveNextState(nextValue, currentValue));
                return;
            }

            setIsMobileSidebarOpen((currentValue) => resolveNextState(nextValue, currentValue));
        },
        [isDesktopViewport],
    );

    const setResponsiveCommentaryOpen = useCallback(
        (nextValue) => {
            if (isDesktopViewport) {
                setActiveDesktopRightPanel((currentValue) => {
                    const resolved = resolveNextState(nextValue, currentValue === COMMENTARY_PANEL);
                    return resolved ? COMMENTARY_PANEL : null;
                });
                return;
            }

            setActiveMobileRightPanel((currentValue) => {
                const resolved = resolveNextState(nextValue, currentValue === COMMENTARY_PANEL);
                return resolved ? COMMENTARY_PANEL : null;
            });
        },
        [isDesktopViewport],
    );

    const closeAllDrawers = useCallback(() => {
        setIsMobileSidebarOpen(false);
        setActiveMobileRightPanel(null);
    }, []);

    const isMobileCommentaryOpen = activeMobileRightPanel === COMMENTARY_PANEL;
    const isDesktopCommentaryOpen = activeDesktopRightPanel === COMMENTARY_PANEL;
    const desktopGridColumns = getDesktopFrameColumns(isDesktopSidebarOpen, isDesktopCommentaryOpen);

    const providerValue = useMemo(
        () => ({
            isMobileSidebarOpen,
            setIsMobileSidebarOpen,
            activeMobileRightPanel,
            setActiveMobileRightPanel,
            isDesktopSidebarOpen,
            setIsDesktopSidebarOpen,
            activeDesktopRightPanel,
            setActiveDesktopRightPanel,
            isMobileCommentaryOpen,
            isDesktopCommentaryOpen,
            desktopGridColumns,
            toggleMobileSidebar,
            toggleDesktopSidebar,
            toggleMobileCommentaryPanel,
            toggleDesktopCommentaryPanel,
            isSidebarOpen: isDesktopViewport ? isDesktopSidebarOpen : isMobileSidebarOpen,
            setIsSidebarOpen: setResponsiveSidebarOpen,
            toggleSidebar,
            isCommentaryOpen: isDesktopViewport ? isDesktopCommentaryOpen : isMobileCommentaryOpen,
            setIsCommentaryOpen: setResponsiveCommentaryOpen,
            toggleCommentaryPanel,
            isCompendiumOpen,
            setIsCompendiumOpen,
            isCommentariesOpen,
            setIsCommentariesOpen,
            isLexiconOpen,
            setIsLexiconOpen,
            closeAllDrawers,
            activeVerse,
            setActiveVerse,
        }),
        [
            isMobileSidebarOpen,
            activeMobileRightPanel,
            isDesktopSidebarOpen,
            activeDesktopRightPanel,
            isMobileCommentaryOpen,
            isDesktopCommentaryOpen,
            desktopGridColumns,
            isDesktopViewport,
            toggleMobileSidebar,
            toggleDesktopSidebar,
            toggleMobileCommentaryPanel,
            toggleDesktopCommentaryPanel,
            setResponsiveSidebarOpen,
            toggleSidebar,
            setResponsiveCommentaryOpen,
            toggleCommentaryPanel,
            isCompendiumOpen,
            isCommentariesOpen,
            isLexiconOpen,
            closeAllDrawers,
            activeVerse,
        ],
    );

    return <UIContext.Provider value={providerValue}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);
