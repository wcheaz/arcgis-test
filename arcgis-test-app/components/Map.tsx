'use client';
import { useEffect, useState, memo, useMemo } from 'react';
import { ArcgisMap, ArcgisLocate, ArcgisHome } from '@arcgis/map-components-react';
import Point from '@arcgis/core/geometry/Point';
import Polyline from '@arcgis/core/geometry/Polyline';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
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
    extraPoints?: Array<{
        longitude: number;
        latitude: number;
    }>;
    zoom?: number;
    enableLocate?: boolean;
    userLocation?: {
        longitude: number;
        latitude: number;
    };
    showCenterGraphic?: boolean;
    onMapClick?: (point: { longitude: number; latitude: number }) => void;
    focusPoint?: { longitude: number; latitude: number } | null;
}

function Map({ center, zoom = 12, enableLocate = false, extraPoints, userLocation, showCenterGraphic = true, onMapClick, focusPoint }: MapProps) {
    const [view, setView] = useState<any>(null);

    const centerPoint = useMemo(() => new Point(center), [center.latitude, center.longitude]);

    useEffect(() => {
        if (!view || !focusPoint) return;

        view.goTo({
            target: new Point(focusPoint),
            zoom: 15
        }, {
            duration: 1000,
            easing: "ease-in-out"
        });

    }, [view, focusPoint]);

    useEffect(() => {
        if (!view) return;

        let graphicsLayer = view.map.findLayerById("center-point-layer") as GraphicsLayer;
        if (!graphicsLayer) {
            graphicsLayer = new GraphicsLayer({ id: "center-point-layer" });
            view.map.add(graphicsLayer);
        }

        graphicsLayer.removeAll();

        // Draw lines first so they appear behind points
        if (extraPoints && extraPoints.length > 0) {
            const paths = extraPoints.map(p => [
                [center.longitude, center.latitude],
                [p.longitude, p.latitude]
            ]);

            const lineGraphic = new Graphic({
                geometry: new Polyline({
                    paths: paths
                }),
                symbol: new SimpleLineSymbol({
                    color: [255, 0, 0], // Red
                    width: 2,
                    style: "solid"
                })
            });
            graphicsLayer.add(lineGraphic);
        }

        if (userLocation) {
            const userPath = [
                [center.longitude, center.latitude],
                [userLocation.longitude, userLocation.latitude]
            ];

            const userLineGraphic = new Graphic({
                geometry: new Polyline({
                    paths: [userPath]
                }),
                symbol: new SimpleLineSymbol({
                    color: [0, 0, 255], // Blue
                    width: 2,
                    style: "solid"
                })
            });
            graphicsLayer.add(userLineGraphic);

            const userPointGraphic = new Graphic({
                geometry: new Point(userLocation),
                symbol: new SimpleMarkerSymbol({
                    style: "circle",
                    color: [0, 0, 255], // Blue
                    outline: {
                        color: [255, 255, 255], // White
                        width: 2
                    }
                })
            });
            graphicsLayer.add(userPointGraphic);
        }

        if (showCenterGraphic) {
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
        }

        if (extraPoints) {
            extraPoints.forEach(p => {
                const extraGraphic = new Graphic({
                    geometry: new Point(p),
                    symbol: new SimpleMarkerSymbol({
                        style: "square",
                        color: [0, 0, 255], // Blue
                        outline: {
                            color: [255, 255, 255], // White
                            width: 2
                        }
                    })
                });
                graphicsLayer.add(extraGraphic);
            });
        }

        if (extraPoints && extraPoints.length > 0 && !focusPoint) {
            const zoomTargets = [new Point(center)];
            extraPoints.forEach(p => zoomTargets.push(new Point(p)));

            if (userLocation) {
                zoomTargets.push(new Point(userLocation));
            }

            view.goTo(zoomTargets, {
                padding: { top: 100, right: 100, bottom: 100, left: 100 }
            });
        }

        const handle = view.on("click", (event: any) => {
            if (onMapClick) {
                const { longitude, latitude } = event.mapPoint;
                onMapClick({ longitude, latitude });
            }
        });

        return () => {
            handle.remove();
        };

    }, [view, center, extraPoints, userLocation, showCenterGraphic, onMapClick, focusPoint]);

    return (
        <div className="map-container">
            <ArcgisMap
                basemap="streets-navigation-vector"
                center={centerPoint}
                zoom={zoom}
                onArcgisViewReadyChange={(e: any) => setView(e.target.view)}
            >
                {enableLocate ? <ArcgisLocate slot="top-left" /> : <ArcgisHome slot="top-left" />}
            </ArcgisMap>
        </div>
    );
}

export default memo(Map);