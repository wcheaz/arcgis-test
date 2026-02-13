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
    },
    {
        name: "San Francisco, CA",
        latitude: 37.8199,
        longitude: -122.4783
    },
    {
        name: "New York, NY",
        latitude: 40.6892,
        longitude: -74.0445
    },
    {
        name: "London, UK",
        latitude: 51.5007,
        longitude: -0.1246
    },
    {
        name: "Paris, France",
        latitude: 48.8584,
        longitude: 2.2945
    },
    {
        name: "Sydney, Australia",
        latitude: -33.8568,
        longitude: 151.2153
    },
    {
        name: "Tokyo, Japan",
        latitude: 35.6586,
        longitude: 139.7454
    },
    {
        name: "Cairo, Egypt",
        latitude: 29.9792,
        longitude: 31.1342
    }
];

export const PROXIMITY_THRESHOLD_MILES = 50;
