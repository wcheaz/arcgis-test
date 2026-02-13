'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';

import dynamic from "next/dynamic";


const Map = dynamic(() => import("@/components/Map"), { ssr: false });
import CoordinateList from '@/components/CoordinateList';
import { calculateDistance } from '../utils/distance';
import { LOCATIONS, PROXIMITY_THRESHOLD_MILES, Location } from '../data/locations';






export default function Home() {
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);
  const [locations, setLocations] = useState<Location[]>(LOCATIONS);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [userExtraPoints, setUserExtraPoints] = useState<Array<{ longitude: number; latitude: number }>>([]);






  const [presetFocusPoint, setPresetFocusPoint] = useState<{ longitude: number; latitude: number } | null>(null);
  const [userFocusPoint, setUserFocusPoint] = useState<{ longitude: number; latitude: number } | null>(null);

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

  const handlePresetMapClick = useCallback((point: { longitude: number; latitude: number }) => {
    setLocations(prevLocations => {
      const newLocations = [...prevLocations];
      newLocations[currentLocationIndex] = {
        ...newLocations[currentLocationIndex],
        extraPoints: [
          ...(newLocations[currentLocationIndex].extraPoints || []),
          point
        ]
      };
      return newLocations;
    });
  }, [currentLocationIndex]);

  const handleUserMapClick = useCallback((point: { longitude: number; latitude: number }) => {
    setUserExtraPoints(prev => [...prev, point]);
  }, []);

  const handlePresetListClick = useCallback((point: { longitude: number; latitude: number }) => {
    setPresetFocusPoint(point);
  }, []);

  const handleUserListClick = useCallback((point: { longitude: number; latitude: number }) => {
    setUserFocusPoint(point);
  }, []);

  // Reset focus point when changing locations so map can auto-fit again if needed, 
  // though auto-fit might triggering on mount/prop change is intricate. 
  // Actually, if we change location, we probably want the new map to fit all points, 
  // so clearing focusPoint is good.
  useEffect(() => {
    setPresetFocusPoint(null);
  }, [currentLocationIndex]);


  const presetCenter = useMemo(() => ({
    latitude: locations[currentLocationIndex].latitude,
    longitude: locations[currentLocationIndex].longitude
  }), [locations, currentLocationIndex]);

  const handleNext = () => {
    setCurrentLocationIndex((prevIndex) => (prevIndex + 1) % locations.length);
  };

  const handlePrev = () => {
    setCurrentLocationIndex((prevIndex) => (prevIndex - 1 + locations.length) % locations.length);
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
    <div className="grid grid-cols-1 sm:grid-cols-5 min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <div className="sm:col-span-4 flex flex-col justify-center items-center p-8 sm:p-16 gap-8 w-full bg-white dark:bg-black">
        <div className="w-full max-w-7xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              aria-label="Previous Location"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className="text-xl font-bold dark:text-white text-center flex-1">{locations[currentLocationIndex].name}</h2>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              aria-label="Next Location"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          <Map
            center={presetCenter}
            extraPoints={locations[currentLocationIndex].extraPoints}
            userLocation={userLocation || undefined}
            onMapClick={handlePresetMapClick}
            focusPoint={presetFocusPoint}
          />
        </div>


        {userLocation && (
          <div className="w-full max-w-7xl">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Your Location</h2>
            <Map
              center={userLocation}
              userLocation={userLocation}
              enableLocate={true}
              showCenterGraphic={false}
              extraPoints={userExtraPoints}
              onMapClick={handleUserMapClick}
              focusPoint={userFocusPoint}
            />
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
      </div>
      {/* Right side 1/5th */}
      <div className="hidden sm:flex sm:col-span-1 flex-col gap-4 p-4 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black overflow-y-auto h-screen sticky top-0">
        <div className="flex-1 overflow-hidden flex flex-col">
          <CoordinateList
            title={`${locations[currentLocationIndex].name} Points`}
            points={locations[currentLocationIndex].extraPoints || []}
            onPointClick={handlePresetListClick}
          />
        </div>
        {userLocation && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <CoordinateList
              title="Your Location Points"
              points={userExtraPoints}
              onPointClick={handleUserListClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
