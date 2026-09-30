/**
 * HoneyChain Interactive Real-World Scalable Tile Map
 * Powered by Leaflet & OpenStreetMap / CartoDB Dark Matter
 *
 * Provides real world scalability:
 * - Zoom seamlessly from global continent view down to country, state, district, city, street, and building level (just like food/e-commerce delivery apps!)
 * - Shows real roads, highways (e.g. NH48, Mumbai-Pune Expressway), districts (Satara, Pune, Mumbai, Kolhapur), neighborhoods (Bandra, Colaba, Shivaji Nagar, Mahabaleshwar)
 * - Animated glowing delivery/custody route polyline with gradient and real-time traveling honey particle
 * - Multiple real tile layer options: Dark Carto (modern delivery dark theme), Satellite Imagery (Esri World Imagery), and OpenStreetMap Standard
 * - Custom interactive SVG markers with pulsing origin hive, stage badges, and detailed delivery popups
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TraceabilityBatch, TraceabilityLocation, TransportRouteSegment } from './types';
import { Layers, MapPin, Navigation, Eye, CheckCircle2, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { haptics } from '../../../utils/haptics';

interface TraceabilityFlatMapProps {
  batch: TraceabilityBatch;
  selectedLocation: TraceabilityLocation | null;
  onSelectLocation: (loc: TraceabilityLocation) => void;
  onSelectSegment?: (seg: TransportRouteSegment) => void;
}

type TileProvider = 'cartoDark' | 'satellite' | 'street';

export const TraceabilityFlatMap: React.FC<TraceabilityFlatMapProps> = ({
  batch,
  selectedLocation,
  onSelectLocation,
  onSelectSegment,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeGlowPolylineRef = useRef<L.Polyline | null>(null);
  const honeyParticleMarkerRef = useRef<L.Marker | null>(null);
  const animFrameIdRef = useRef<number>(0);

  const [activeTileProvider, setActiveTileProvider] = useState<TileProvider>('street');
  const [zoomLevel, setZoomLevel] = useState<number>(9);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>([18.5204, 73.8567]);

  // Tile layer configurations powered by OpenStreetMap
  const TILE_CONFIGS: Record<TileProvider, { url: string; attribution: string; maxZoom: number; label: string }> = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19,
      label: 'OpenStreetMap Standard',
    },
    cartoDark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
      maxZoom: 20,
      label: 'OpenStreetMap Dark (Delivery)',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, GeoEye & &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19,
      label: 'OpenStreetMap Satellite Hybrid',
    },
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map already initialized
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = batch.locations.length > 0
      ? [batch.locations[0].latitude, batch.locations[0].longitude]
      : [18.5204, 73.8567];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 9,
      minZoom: 2,
      maxZoom: 20,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // Add Tile Layer
    const tileConfig = TILE_CONFIGS[activeTileProvider];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer group for location pins
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;

    // Track zoom and center
    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });
    map.on('moveend', () => {
      const c = map.getCenter();
      setCurrentCenter([c.lat, c.lng]);
    });

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Provider Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    map.removeLayer(tileLayerRef.current);

    const tileConfig = TILE_CONFIGS[activeTileProvider];
    const newLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);
    tileLayerRef.current = newLayer;
  }, [activeTileProvider]);

  // Update Markers, Route Polylines, and Traveling Particle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    if (routeGlowPolylineRef.current) {
      map.removeLayer(routeGlowPolylineRef.current);
      routeGlowPolylineRef.current = null;
    }
    if (honeyParticleMarkerRef.current) {
      map.removeLayer(honeyParticleMarkerRef.current);
      honeyParticleMarkerRef.current = null;
    }

    const locations = batch.locations || [];
    if (locations.length === 0) return;

    const latLngs: L.LatLngTuple[] = locations.map((loc) => [loc.latitude, loc.longitude]);

    // 1. Draw Glowing Amber Delivery Route Polyline
    if (latLngs.length > 1) {
      // Glow under-layer
      const glowPolyline = L.polyline(latLngs, {
        color: '#f59e0b',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routeGlowPolylineRef.current = glowPolyline;

      // Crisp delivery courier line
      const mainPolyline = L.polyline(latLngs, {
        color: '#fbbf24',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routePolylineRef.current = mainPolyline;

      // 2. Animated Honey Delivery Vehicle / Particle
      const particleIcon = L.divIcon({
        className: 'honey-delivery-vehicle',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 28px; height: 28px; background: rgba(245, 158, 11, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 14px; height: 14px; background: linear-gradient(135deg, #fef08a, #f59e0b); border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 12px #f59e0b; display: flex; align-items: center; justify-content: center;">
              <div style="width: 4px; height: 4px; background: #78350f; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const particleMarker = L.marker(latLngs[0], { icon: particleIcon, zIndexOffset: 1000 }).addTo(map);
      honeyParticleMarkerRef.current = particleMarker;

      // Animate along route line
      let progress = 0;
      let lastTime = performance.now();

      const animateParticle = (time: number) => {
        const dt = (time - lastTime) / 1000;
        lastTime = time;

        progress = (progress + dt * 0.1) % 1.0; // 10 second traverse

        // Interpolate along route segments
        const totalSegments = latLngs.length - 1;
        const segmentFloat = progress * totalSegments;
        const segIdx = Math.min(Math.floor(segmentFloat), totalSegments - 1);
        const segT = segmentFloat - segIdx;

        const pA = latLngs[segIdx];
        const pB = latLngs[segIdx + 1];

        const curLat = pA[0] + (pB[0] - pA[0]) * segT;
        const curLng = pA[1] + (pB[1] - pA[1]) * segT;

        particleMarker.setLatLng([curLat, curLng]);
        animFrameIdRef.current = requestAnimationFrame(animateParticle);
      };

      animFrameIdRef.current = requestAnimationFrame(animateParticle);
    }

    // 3. Render Rich Location Pins with Delivery Details
    locations.forEach((loc, idx) => {
      const isOrigin = idx === 0;
      const isSelected = selectedLocation?.id === loc.id;
      const isCurrent = loc.status === 'current';

      let pinColor = '#f59e0b'; // Amber
      if (loc.status === 'completed') pinColor = '#10b981'; // Green
      if (loc.status === 'warning') pinColor = '#f59e0b';
      if (loc.status === 'failed') pinColor = '#ef4444';

      const customIcon = L.divIcon({
        className: 'honey-location-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition: transform 0.2s ease;">
            ${
              isOrigin || isCurrent || isSelected
                ? `<div style="position: absolute; top: -4px; width: 40px; height: 40px; border-radius: 50%; background: ${pinColor}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ''
            }
            <div style="
              width: ${isSelected ? '34px' : '28px'};
              height: ${isSelected ? '34px' : '28px'};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              background: ${pinColor};
              border: 2px solid #ffffff;
              box-shadow: 0 4px 14px rgba(0,0,0,0.8), 0 0 10px ${pinColor};
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="transform: rotate(45deg); font-size: 11px; font-weight: bold; color: #0b0805; font-family: monospace;">
                ${isOrigin ? '🐝' : `#${loc.stageNumber}`}
              </span>
            </div>
            <div style="
              margin-top: 4px;
              background: rgba(12, 8, 4, 0.92);
              border: 1px solid rgba(245, 158, 11, 0.4);
              padding: 2px 6px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 600;
              color: #fef08a;
              white-space: nowrap;
              font-family: 'Plus Jakarta Sans', sans-serif;
              box-shadow: 0 4px 10px rgba(0,0,0,0.6);
            ">
              ${loc.name.length > 22 ? loc.name.substring(0, 22) + '...' : loc.name}
            </div>
          </div>
        `,
        iconSize: [40, 52],
        iconAnchor: [20, 36],
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });

      // Interactive popup
      const popupContent = `
        <div style="padding: 4px 2px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-family: monospace; font-weight: bold; color: #f59e0b; background: rgba(245,158,11,0.15); padding: 2px 6px; border-radius: 4px;">
              STAGE 0${loc.stageNumber} · ${loc.stageLabel.toUpperCase()}
            </span>
            <span style="font-size: 9px; font-family: monospace; color: #10b981; font-weight: bold;">
              ${loc.status === 'completed' ? '✓ VERIFIED' : '● CURRENT'}
            </span>
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-bottom: 2px;">
            ${loc.name}
          </div>
          <div style="font-size: 11px; color: #fde68a; opacity: 0.85; margin-bottom: 8px;">
            📍 ${loc.locationName} (${loc.region})
          </div>
          <div style="background: rgba(0,0,0,0.4); border-radius: 8px; padding: 6px; font-size: 10px; color: #cbd5e1; font-family: monospace; margin-bottom: 6px;">
            <div>⏱ ${loc.timestamp}</div>
            <div>👤 Custodian: ${loc.actor}</div>
            ${loc.blockchainTx ? `<div style="color: #f59e0b; margin-top: 2px;">🔗 Tx: ${loc.blockchainTx.substring(0, 14)}...</div>` : ''}
          </div>
          <div style="font-size: 10px; color: #94a3b8; line-height: 1.4;">
            ${loc.details}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });

      marker.on('click', () => {
        haptics.cellSelect();
        onSelectLocation(loc);
      });

      markersGroup.addLayer(marker);
    });

    // Auto-fit bounds if no explicit location selected
    if (!selectedLocation && latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [batch, selectedLocation, onSelectLocation]);

  // Center smoothly on Selected Location when changed from external props
  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 14, {
      animate: true,
      duration: 1.2,
    });
  }, [selectedLocation]);

  // Zoom controls helper
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
    haptics.tap();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
    haptics.tap();
  };

  const handleFitRoute = () => {
    if (!mapInstanceRef.current) return;
    const latLngs: L.LatLngTuple[] = batch.locations.map((l) => [l.latitude, l.longitude]);
    if (latLngs.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
      haptics.tap();
    }
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl bg-[#090502]">
      {/* Real Interactive Leaflet Tile Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Map Controls: Tile Provider Switcher & Scalability Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        {/* Tile Layer Selector */}
        <div className="flex items-center p-1 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/40 shadow-xl text-xs font-mono">
          <button
            onClick={() => {
              setActiveTileProvider('street');
              haptics.tap();
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTileProvider === 'street'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-amber-300/80 hover:text-white'
            }`}
          >
            🗺️ OpenStreetMap
          </button>
          <button
            onClick={() => {
              setActiveTileProvider('cartoDark');
              haptics.tap();
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTileProvider === 'cartoDark'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-amber-300/80 hover:text-white'
            }`}
          >
            🌙 OSM Dark Delivery
          </button>
          <button
            onClick={() => {
              setActiveTileProvider('satellite');
              haptics.tap();
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTileProvider === 'satellite'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-amber-300/80 hover:text-white'
            }`}
          >
            🛰️ Satellite
          </button>
        </div>

        {/* Fit Route Button */}
        <button
          onClick={handleFitRoute}
          className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-xl transition-all"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Fit Complete Route</span>
        </button>

        {/* Quick Zoom Presets */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-black/80 backdrop-blur-md border border-amber-900/60 text-[11px] font-mono text-amber-300">
          <span className="px-1.5 text-amber-400/70 text-[10px]">Jump to:</span>
          <button
            onClick={() => {
              mapInstanceRef.current?.flyTo([17.9237, 73.6586], 15);
              haptics.tap();
            }}
            className="px-2 py-0.5 rounded hover:bg-amber-950/70 text-amber-200 cursor-pointer"
            title="Zoom to Mahabaleshwar Apiary Forest"
          >
            🐝 Apiary
          </button>
          <button
            onClick={() => {
              mapInstanceRef.current?.flyTo([18.5204, 73.8567], 14);
              haptics.tap();
            }}
            className="px-2 py-0.5 rounded hover:bg-amber-950/70 text-amber-200 cursor-pointer"
            title="Zoom to Pune Processing Hub"
          >
            🏭 Pune Hub
          </button>
          <button
            onClick={() => {
              mapInstanceRef.current?.flyTo([18.9220, 72.8347], 16);
              haptics.tap();
            }}
            className="px-2 py-0.5 rounded hover:bg-amber-950/70 text-amber-200 cursor-pointer"
            title="Zoom to Colaba Mumbai Consumer Street"
          >
            📍 Colaba
          </button>
        </div>
      </div>

      {/* Floating Scalability Zoom Level Indicator (Like Uber/Swiggy Delivery) */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/30 text-xs font-mono text-amber-300 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          Zoom: {zoomLevel}x ·{' '}
          {zoomLevel <= 5
            ? 'Continental Overview'
            : zoomLevel <= 8
            ? 'State / Regional View'
            : zoomLevel <= 11
            ? 'District Level'
            : zoomLevel <= 14
            ? 'City & Towns'
            : 'Street & Building Level'}
        </span>
      </div>

      {/* Bottom Floating Delivery Status Banner */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0e0804]/90 backdrop-blur-md border border-amber-500/40 shadow-2xl text-xs font-mono text-amber-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold text-white">LIVE COURIER & TRANSIT:</span>
          <span>{batch.batchId}</span>
          <span className="text-amber-500/50">·</span>
          <span className="text-amber-400 font-semibold">{batch.productName}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-amber-300/80">
          <span>Total Distance: <strong className="text-white">{batch.totalDistanceKm} km</strong></span>
          <span>Waypoints: <strong className="text-white">{batch.locations.length} Stations</strong></span>
          <span>Target Destination: <strong className="text-emerald-400">{batch.locations[batch.locations.length - 1]?.locationName}</strong></span>
        </div>
      </div>
    </div>
  );
};
