'use client';
import { useState, useEffect } from 'react';

import dynamic from "next/dynamic";


const Map = dynamic(() => import("@/components/Map"), { ssr: false });
import { calculateDistance } from '../utils/distance';
import { LOCATIONS, PROXIMITY_THRESHOLD_MILES, Location } from '../data/locations';






export default function Home() {
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);
  const [locations, setLocations] = useState<Location[]>(LOCATIONS);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLocationClick = (index: number, point: { longitude: number; latitude: number }) => {
    const newLocations = [...locations];

    // Create a new object for the specific location to avoid mutating the original
    newLocations[index] = {
      ...newLocations[index],
      extraPoints: [
        ...(newLocations[index].extraPoints || []),
        point
      ]
    };

    setLocations(newLocations);
  };

  const nearbyLocationNames: string[] = [];

  if (userLocation) {
    locations.forEach(location => {
      const dist = calculateDistance(userLocation.latitude, userLocation.longitude, location.latitude, location.longitude);
      if (dist <= PROXIMITY_THRESHOLD_MILES) {
        nearbyLocationNames.push(location.name);
      }
    });
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start gap-8">
        {locations.map((location, index) => (
          <div key={location.name} className="w-full">
            <h2 className="text-xl font-bold mb-4 dark:text-white">{location.name}</h2>
            <Map
              center={{ latitude: location.latitude, longitude: location.longitude }}
              extraPoints={location.extraPoints}
              onMapClick={(point) => handleLocationClick(index, point)}
            />
          </div>
        ))}


        {userLocation && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Your Location</h2>
            <Map center={userLocation} enableLocate={true} />
            {nearbyLocationNames.length > 0 && (
              <div className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-none">
                {nearbyLocationNames.map(name => (
                  <div key={name} className="proximity-alert">
                    You are within {PROXIMITY_THRESHOLD_MILES} miles of {name}!
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}
