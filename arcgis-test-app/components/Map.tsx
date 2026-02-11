'use client';
import { useEffect, useState } from 'react';
import { ArcgisMap, ArcgisLocate, ArcgisHome } from '@arcgis/map-components-react';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-map';
import '@arcgis/map-components/dist/components/arcgis-locate';
import '@arcgis/map-components/dist/components/arcgis-home';

import '@/styles/Map.css';

export interface MapProps {
    center: {
        longitude: number;
        latitude: number;
    };
    zoom?: number;
    enableLocate?: boolean;
}

export default function Map({ center, zoom = 12, enableLocate = false }: MapProps) {
    const [view, setView] = useState<any>(null);

    useEffect(() => {
        if (!view) return;

        let graphicsLayer = view.map.findLayerById("center-point-layer") as GraphicsLayer;
        if (!graphicsLayer) {
            graphicsLayer = new GraphicsLayer({ id: "center-point-layer" });
            view.map.add(graphicsLayer);
        }

        graphicsLayer.removeAll();
        const point = new Point(center);
        const graphic = new Graphic({
            geometry: point,
            symbol: new SimpleMarkerSymbol({
                style: "circle",
                color: [226, 119, 40],
                outline: {
                    color: [255, 255, 255],
                    width: 2
                }
            })
        });
        graphicsLayer.add(graphic);

    }, [view, center]);

    return (
        <div className="map-container">
            <ArcgisMap
                basemap="streets-navigation-vector"
                center={new Point(center)}
                zoom={zoom}
                onArcgisViewReadyChange={(e: any) => setView(e.target.view)}
            >
                {enableLocate ? <ArcgisLocate slot="top-left" /> : <ArcgisHome slot="top-left" />}
            </ArcgisMap>
        </div>
    );
}