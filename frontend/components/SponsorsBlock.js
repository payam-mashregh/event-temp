// frontend/components/SponsorsBlock.js
import React from 'react';

export default function SponsorsBlock({ sponsors }) {
    if (!sponsors || sponsors.length === 0) {
        return null; // Don't render the section if there are no sponsors
    }

    return (
        <div className="bg-light py-16 border-t">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-dark">حامیان رویداد</h2>
                    <p className="text-secondary mt-2">با تشکر از همراهی حامیان گرامی</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {sponsors.map(sponsor => (
                        <a 
                            key={sponsor.id} 
                            href={sponsor.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="grayscale hover:grayscale-0 transition-all duration-300"
                        >
                            <img 
                                src={sponsor.logo_url || 'https://placehold.co/150x80?text=' + sponsor.name} 
                                alt={sponsor.name}
                                className="h-20 object-contain"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}