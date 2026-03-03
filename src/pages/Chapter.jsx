import React from 'react';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';

const Chapter = () => {
    return (
        <div className="flex w-full min-h-screen bg-sand-primary mt-20">
            <LeftSidebar />
            <ReadingPanel />
            <RightSidebar />
        </div>
    );
};

export default Chapter;
