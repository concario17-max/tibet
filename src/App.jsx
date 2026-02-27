import { useState, useCallback } from 'react';
import Header from './components/Header';
import AlbumCard from './components/AlbumCard';
import PlayerContainer from './components/PlayerContainer';
import AlbumDetail from './components/AlbumDetail';
import { ALBUMS } from './utils/constants';
import { BookOpen } from 'lucide-react';

function App() {
    const [viewingAlbum, setViewingAlbum] = useState(null);
    const [playbackRequest, setPlaybackRequest] = useState(null);

    const handleAlbumSelect = useCallback((album) => {
        setViewingAlbum(album);
    }, []);

    const handlePlayTrack = useCallback((trackIndex) => {
        setPlaybackRequest({
            album: viewingAlbum,
            trackIndex,
            timestamp: Date.now()
        });
    }, [viewingAlbum]);

    return (
        <div className="min-h-screen selection:bg-gold-primary/20 bg-bg-primary">
            <Header />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-10 scale-110"></div>
                <div className="absolute inset-0 bg-bg-primary mix-blend-multiply opacity-60"></div>

                <div className="relative z-10 text-center space-y-10 max-w-4xl px-4 animate-in fade-in zoom-in duration-1000">
                    <p className="text-gold-primary text-[10px] tracking-[1em] uppercase font-medium">Tibetan Book of the Dead</p>
                    <h1 className="text-6xl md:text-9xl font-serif text-text-primary leading-[0.9] tracking-tighter">
                        The Art of <br /> <span className="gold-gradient-text italic font-thin">Sacred Passage</span>
                    </h1>
                    <div className="w-12 h-px bg-gold-primary/30 mx-auto"></div>
                    <p className="text-text-primary/60 max-w-md mx-auto text-xs leading-loose font-light tracking-widest uppercase">
                        Experience the profound prayers and ancient chanting protocols,
                        curated for modern spiritual seekers.
                    </p>

                    <div className="pt-10">
                        <a href="#gallery" className="group relative px-12 py-5 overflow-hidden border border-gold-primary/30 rounded-none transition-all duration-700 hover:border-gold-primary">
                            <span className="relative z-10 text-[10px] tracking-[0.5em] uppercase text-gold-primary transition-colors duration-700 group-hover:text-white-soft">
                                Explore the Void
                            </span>
                            <div className="absolute inset-0 bg-gold-primary translate-y-full transition-transform duration-700 cubic-bezier(0.19, 1, 0.22, 1) group-hover:translate-y-0"></div>
                        </a>
                    </div>
                </div>

                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6 opacity-30">
                    <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold-primary to-transparent"></div>
                </div>
            </section>

            {/* Album Selection Section */}
            <section id="gallery" className="py-40 px-8 bg-white-soft relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto space-y-32">
                    <div className="text-center space-y-6">
                        <p className="text-gold-primary text-[10px] tracking-[0.4em] uppercase">Sacred Collections</p>
                        <h2 className="text-5xl md:text-6xl font-serif text-text-primary">Ritual Library</h2>
                        <div className="w-8 h-px bg-gold-primary/20 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-16">
                        {ALBUMS.map((album) => (
                            <AlbumCard
                                key={album.id}
                                album={album}
                                onSelect={handleAlbumSelect}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Philosophy Section Preview */}
            <section className="py-40 px-8 bg-charcoal text-white-soft text-center space-y-12">
                <div className="max-w-2xl mx-auto space-y-8 opacity-80">
                    <BookOpen className="w-8 h-8 mx-auto text-gold-primary stroke-[1]" />
                    <h3 className="text-3xl font-serif tracking-wide italic">"That which is called death is a middle ground between one state and another."</h3>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-gold-primary/60">— The Great Liberation by Hearing</p>
                </div>
            </section>

            {/* Album Detail Overlay */}
            <AlbumDetail
                album={viewingAlbum}
                isOpen={!!viewingAlbum}
                onClose={() => setViewingAlbum(null)}
                onPlayTrack={handlePlayTrack}
            />

            {/* Audio Player Overlay */}
            <PlayerContainer
                request={playbackRequest}
                onClose={() => setPlaybackRequest(null)}
            />
        </div>
    );
}

export default App;
