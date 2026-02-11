'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start gap-8">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Raleigh, NC</h2>
          <Map center={{ longitude: -78.6382, latitude: 35.7796 }} />
        </div>

        {userLocation && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Your Location</h2>
            <Map center={userLocation} enableLocate={true} />
          </div>
        )}
      </main>
    </div>
  );
}
