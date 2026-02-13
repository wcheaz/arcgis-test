export interface Location {
    name: string;
    latitude: number;
    longitude: number;
    extraPoints?: { latitude: number; longitude: number }[];
}

export const LOCATIONS: Location[] = [
    {
        name: "Raleigh, NC",
        latitude: 35.7796,
        longitude: -78.6382,
    },
    {
        name: "The White House",
        latitude: 38.8977,
        longitude: -77.0365
    },
    {
        name: "Cary, NC",
        latitude: 35.7915,
        longitude: -78.7811
    }
];

export const PROXIMITY_THRESHOLD_MILES = 50;
