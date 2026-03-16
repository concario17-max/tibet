import React from 'react';
import { Music, Play } from 'lucide-react';

const AlbumCard = ({ album, onSelect }) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(album)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-sand-tertiary bg-white text-left transition-all duration-300 hover:shadow-xl hover:shadow-gold-primary/5"
        >
            <div className="relative h-48 overflow-hidden">
                {album.coverImage ? (
                    <img src={album.coverImage} alt={album.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-main to-gold-primary/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Music className="h-24 w-24 stroke-[0.3] text-gold-primary/30" />
                        </div>
                    </>
                )}

                <div className="absolute inset-0 z-10 flex items-center justify-center bg-charcoal-main/80 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-primary/50 bg-black/20 backdrop-blur-md transition-transform duration-700 group-hover:scale-100 scale-90">
                        <Play className="ml-1 fill-gold-primary text-gold-primary" size={24} />
                    </div>
                </div>
                <div className="absolute inset-4 scale-105 border border-gold-primary/10 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />
            </div>

            <div className="flex flex-1 flex-col space-y-4 bg-sand-primary p-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-primary">Chants Entry</p>
                    <h3 className="serif-title text-xl leading-tight text-charcoal-main transition-colors duration-300 group-hover:text-gold-primary">
                        {album.title}
                    </h3>
                </div>
                <div className="h-px w-8 bg-gold-primary/30 transition-all duration-1000 group-hover:w-full" />
                <p className="flex-1 font-sans text-sm font-medium leading-relaxed text-charcoal-main/80 line-clamp-3">
                    {album.description || 'Guided chanting and ancient rituals fully preserved for the path of awakening.'}
                </p>
            </div>
        </button>
    );
};

export default AlbumCard;
