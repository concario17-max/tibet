import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

const isDesktopLayout = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches;

export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktopLayout);
    const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    const [isCommentariesOpen, setIsCommentariesOpen] = useState(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);

    const [activeVerse, setActiveVerse] = useState(() => {
        try {
            const saved = localStorage.getItem('tibet_active_verse');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    React.useEffect(() => {
        if (activeVerse === undefined) return;
        localStorage.setItem('tibet_active_verse', JSON.stringify(activeVerse));
    }, [activeVerse]);

    const toggleSidebar = React.useCallback(() => setIsSidebarOpen((prev) => !prev), []);
    const toggleReflections = React.useCallback(() => setIsReflectionsOpen((prev) => !prev), []);

    const closeAllDrawers = React.useCallback(() => {
        setIsSidebarOpen(false);
        setIsReflectionsOpen(false);
    }, []);

    const providerValue = React.useMemo(() => ({
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isReflectionsOpen,
        setIsReflectionsOpen,
        isCompendiumOpen,
        setIsCompendiumOpen,
        isCommentariesOpen,
        setIsCommentariesOpen,
        isLexiconOpen,
        setIsLexiconOpen,
        toggleReflections,
        closeAllDrawers,
        activeVerse,
        setActiveVerse,
    }), [isSidebarOpen, isReflectionsOpen, isCompendiumOpen, isCommentariesOpen, isLexiconOpen, toggleSidebar, toggleReflections, closeAllDrawers, activeVerse]);

    return (
        <UIContext.Provider value={providerValue}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
