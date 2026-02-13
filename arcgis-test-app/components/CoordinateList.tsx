import React from 'react';

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface CoordinateListProps {
    title: string;
    points: Coordinate[] | undefined;
}

const CoordinateList: React.FC<CoordinateListProps> = ({ title, points }) => {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 shadow-md rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {points ? `${points.length} points` : 'No points'}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {points && points.length > 0 ? (
                    points.map((point, index) => (
                        <div
                            key={index}
                            className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-md border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 group"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-zinc-400 group-hover:text-blue-500 transition-colors">#{index + 1}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider text-zinc-400">Lat</span>
                                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{point.latitude.toFixed(4)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider text-zinc-400">Lon</span>
                                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{point.longitude.toFixed(4)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 p-4 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="text-sm">No points added yet</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoordinateList;
