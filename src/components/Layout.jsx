import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import GlobalPlayer from './GlobalPlayer';
import CompendiumModal from './CompendiumModal';
import CommentariesModal from './CommentariesModal';
import LexiconModal from './LexiconModal';

const Layout = ({ playbackRequest, setPlaybackRequest }) => {
    return (
        <div className="min-h-screen selection:bg-gold-primary/20 bg-sand-primary dark:bg-dark-bg font-serif text-charcoal-main dark:text-dark-text-primary antialiased flex flex-col relative overflow-x-hidden transition-colors duration-500">
            <Header />

            <main className="flex-1 flex flex-col">
                <Outlet context={{ setPlaybackRequest }} />
            </main>

            <GlobalPlayer playbackRequest={playbackRequest} setPlaybackRequest={setPlaybackRequest} />
            <CompendiumModal />
            <CommentariesModal />
            <LexiconModal />
        </div>
    );
};

export default Layout;
