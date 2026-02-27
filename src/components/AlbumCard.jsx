import React from 'react';
import { Play, Info, MoreHorizontal, Music } from 'lucide-react';

const AlbumCard = ({ album, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(album)}
            className="premium-card group cursor-pointer space-y-6"
        >
            <div className="aspect-[4/5] overflow-hidden bg-bg-primary relative shadow-sm">
                {/* Album Art Placeholder with Golden Texture Style */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-gold-primary/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="text-gold-primary/30 w-24 h-24 stroke-[0.3]" />
                </div>

                {/* Luxury Overlays */}
                <div className="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-gold-primary/50 flex items-center justify-center backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform duration-700 bg-black/20">
                        <Play className="text-gold-primary fill-gold-primary ml-1" size={24} />
                    </div>
                </div>
                <div className="absolute inset-4 border border-gold-primary/10 scale-105 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700"></div>
            </div>

            <div className="space-y-3 px-4 pb-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-gold-primary text-[10px] tracking-[0.4em] uppercase font-medium">Sacred Collection</p>
                        <h3 className="text-lg font-serif text-[#e2e8f0] group-hover:text-gold-primary transition-colors duration-300 leading-tight">
                            {album.title}
                        </h3>
                    </div>
                    <button className="text-text-primary/30 hover:text-gold-primary transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
                <div className="h-px w-8 bg-gold-primary/30 group-hover:w-full transition-all duration-1000"></div>
                <p className="text-text-primary/60 text-[10px] tracking-wide line-clamp-2 leading-relaxed italic">
                    Guided chanting and ancient rituals preserved for the path of awakening.
                </p>
            </div>
        </div>
    );
};

export default AlbumCard;
