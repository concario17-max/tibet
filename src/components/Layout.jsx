import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import GlobalPlayer from './GlobalPlayer';
import CompendiumModal from './CompendiumModal';

const Layout = ({ playbackRequest, setPlaybackRequest }) => {
    return (
        <div className="min-h-screen selection:bg-gold-primary/20 bg-sand-primary font-serif text-charcoal-main antialiased flex flex-col relative overflow-x-hidden">
            <Header />

            <main className="flex-1 flex flex-col">
                <Outlet context={{ setPlaybackRequest }} />
            </main>

            <GlobalPlayer playbackRequest={playbackRequest} setPlaybackRequest={setPlaybackRequest} />
            <CompendiumModal />
        </div>
    );
};

export default Layout;
