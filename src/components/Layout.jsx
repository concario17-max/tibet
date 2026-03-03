import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = ({ playbackRequest, setPlaybackRequest }) => {
    return (
        <div className="min-h-screen selection:bg-gold-primary/20 bg-sand-primary font-serif text-charcoal-main antialiased flex flex-col relative overflow-x-hidden">
            <Header />

            <main className="flex-1 flex flex-col">
                <Outlet context={{ setPlaybackRequest }} />
            </main>
        </div>
    );
};

export default Layout;
