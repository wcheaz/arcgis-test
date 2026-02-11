'use client';
import { ArcgisMap, ArcgisLocate } from '@arcgis/map-components-react';
import Point from '@arcgis/core/geometry/Point';

export default function Map() {
    return (
        <div style={{ height: '500px', width: '100%' }}>
            <ArcgisMap
                basemap="streets-navigation-vector"
                center={new Point({ longitude: -78.6382, latitude: 35.7796 })} // Raleigh, NC coordinates
                zoom={12}
            >
                <ArcgisLocate slot="top-left" />
            </ArcgisMap>
        </div>
    );
}