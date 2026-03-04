import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // 사이드바 상태를 제어하는 내부 State (불변성 유지)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // 리플렉션(우측 패널) 상태 제어
    const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);

    // 각 패널을 토글하는 불변성 기반 함수들
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const toggleReflections = () => setIsReflectionsOpen(prev => !prev);

    // 강제 종료 함수
    const closeAllDrawers = () => {
        setIsSidebarOpen(false);
        setIsReflectionsOpen(false);
    };

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setIsSidebarOpen,
            toggleSidebar,
            isReflectionsOpen,
            setIsReflectionsOpen,
            toggleReflections,
            closeAllDrawers
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
