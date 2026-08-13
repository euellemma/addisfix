import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { getSeverityColor } from '../utils/severityEngine';

export default function AddisMap({ selectedCoords, setSelectedCoords, gpsAccuracy, incidents = [], onLocateGps }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerGroup = useRef(null);
  const userMarker = useRef(null);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Initialize Leaflet Map centered on Addis Ababa
    const map = L.map(mapRef.current).setView(selectedCoords || [9.0107, 38.7612], 13);
    leafletMap.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | Addis Fix GPS'
    }).addTo(map);

    markerGroup.current = L.layerGroup().addTo(map);

    // Map click handler to adjust pin coordinates
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (setSelectedCoords) {
        setSelectedCoords([lat, lng]);
      }
    });

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  // Update selected location pin & center map when coords change
  useEffect(() => {
    if (!leafletMap.current || !selectedCoords) return;

    if (userMarker.current) {
      leafletMap.current.removeLayer(userMarker.current);
    }

    const pinIcon = L.divIcon({
      className: 'user-gps-icon',
      html: `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="background:#0284c7; width:18px; height:18px; border-radius:50%; border:3px solid white; box-shadow:0 0 12px rgba(2,132,199,0.8); z-index:2;"></div>
          <div style="position:absolute; width:34px; height:34px; background:rgba(2,132,199,0.25); border-radius:50%; animation: pulse-ring 2s infinite;"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    userMarker.current = L.marker(selectedCoords, { icon: pinIcon })
      .addTo(leafletMap.current)
      .bindPopup(`
        <div style="font-family:sans-serif; text-align:center; padding:2px;">
          <strong style="color:#0284c7;">📍 Incident Location (GPS Tagged)</strong><br/>
          <span style="font-size:0.8em; color:#475569;">${selectedCoords[0].toFixed(5)}° N, ${selectedCoords[1].toFixed(5)}° E</span>
          ${gpsAccuracy ? `<br/><span style="font-size:0.75em; color:#10b981;">Accuracy: &plusmn;${Math.round(gpsAccuracy)}m</span>` : ''}
        </div>
      `);

  }, [selectedCoords, gpsAccuracy]);

  // Update incident markers
  useEffect(() => {
    if (!leafletMap.current || !markerGroup.current) return;

    markerGroup.current.clearLayers();

    incidents.forEach(item => {
      if (item.coords && Array.isArray(item.coords)) {
        const color = getSeverityColor(item.severity);
        const icon = L.divIcon({
          className: 'incident-marker',
          html: `<div style="background:${color}; width:14px; height:14px; border-radius:50%; border:2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.6);"></div>`,
          iconSize: [16, 16]
        });

        const marker = L.marker(item.coords, { icon });
        marker.bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <strong style="color:#0f172a;">${item.id}: ${item.category}</strong><br/>
            <span style="font-size:0.8em; color:#475569;">Agency: ${item.agency}</span><br/>
            <span style="font-size:0.8em; color:#475569;">GPS: ${item.coords[0].toFixed(4)}, ${item.coords[1].toFixed(4)}</span><br/>
            <strong style="font-size:0.85em; color:${color};">Score: ${item.severity}/100 (${item.status})</strong>
          </div>
        `);
        markerGroup.current.addLayer(marker);
      }
    });
  }, [incidents]);

  return (
    <div className="map-card">
      <div className="map-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Addis Ababa Incident Map</h3>
        {onLocateGps && (
          <button
            type="button"
            className="btn-secondary sm"
            onClick={onLocateGps}
            title="Fetch current GPS position from device"
          >
            <LocateFixed size={14} />
            <span>Get GPS Location</span>
          </button>
        )}
      </div>
      <div ref={mapRef} className="map-container" style={{ height: '280px', width: '100%' }}></div>
      <div className="map-footer">
        <span>
          GPS Target: {selectedCoords[0].toFixed(5)}° N, {selectedCoords[1].toFixed(5)}° E
        </span>
        <button
          type="button"
          className="btn-secondary sm"
          onClick={() => leafletMap.current && leafletMap.current.setView(selectedCoords, 14)}
        >
          Center Pin
        </button>
      </div>
    </div>
  );
}
