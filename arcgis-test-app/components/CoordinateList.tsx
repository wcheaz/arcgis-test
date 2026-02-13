import React from 'react';

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface CoordinateListProps {
    title: string;
    points: Coordinate[] | undefined;
    onPointClick?: (point: Coordinate) => void;
    onPointDelete?: (point: Coordinate) => void;
}

const CoordinateList: React.FC<CoordinateListProps> = ({ title, points, onPointClick, onPointDelete }) => {
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
                            onClick={() => onPointClick && onPointClick(point)}
                            className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-md border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 group cursor-pointer relative"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-zinc-400 group-hover:text-blue-500 transition-colors">#{index + 1}</span>
                                {onPointDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPointDelete(point);
                                        }}
                                        className="p-1 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        title="Delete Coordinate"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                )}
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
