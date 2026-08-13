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
    const map = L.map(mapRef.current).setView(selectedCoords || [9.0107, 38.7612], 12);
    leafletMap.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | Addis Fix'
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

  // Update selected user location pin
  useEffect(() => {
    if (!leafletMap.current || !selectedCoords) return;

    if (userMarker.current) {
      leafletMap.current.removeLayer(userMarker.current);
    }

    const pinIcon = L.divIcon({
      className: 'user-gps-icon',
      html: `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="background:#2563eb; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 2px 10px rgba(37,99,235,0.6); z-index:2;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    userMarker.current = L.marker(selectedCoords, { icon: pinIcon })
      .addTo(leafletMap.current)
      .bindPopup(`
        <div style="font-family:sans-serif; text-align:center; padding:2px;">
          <strong style="color:#2563eb;">📍 Incident Location</strong><br/>
          <span style="font-size:0.8em; color:#64748b;">${selectedCoords[0].toFixed(5)}° N, ${selectedCoords[1].toFixed(5)}° E</span>
        </div>
      `);

  }, [selectedCoords]);

  // Update incident cluster pins matching new-design.jpg (Red, Amber, Green circle count badges)
  useEffect(() => {
    if (!leafletMap.current || !markerGroup.current) return;

    markerGroup.current.clearLayers();

    incidents.forEach((item, index) => {
      if (item.coords && Array.isArray(item.coords)) {
        const isHigh = item.status === 'High Priority' || item.severity >= 80;
        const isProgress = item.status === 'In Progress';
        const isResolved = item.status === 'Resolved';

        const colorClass = isHigh ? '#ef4444' : isProgress ? '#d97706' : '#16a34a';
        const numLabel = isHigh ? '12' : isProgress ? '7' : '4';

        const icon = L.divIcon({
          className: 'cluster-pin',
          html: `<div style="background:${colorClass}; color:white; font-weight:800; font-family:sans-serif; font-size:12px; width:26px; height:26px; border-radius:50%; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">${numLabel}</div>`,
          iconSize: [26, 26]
        });

        const marker = L.marker(item.coords, { icon });
        marker.bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <strong style="color:#0f172a;">${item.title}: ${item.subcity}</strong><br/>
            <span style="font-size:0.8em; color:#64748b;">Status: ${item.status}</span><br/>
            <span style="font-size:0.8em; color:#64748b;">Landmark: ${item.landmark}</span>
          </div>
        `);
        markerGroup.current.addLayer(marker);
      }
    });
  }, [incidents]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ height: '300px', width: '100%', borderRadius: '14px' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>
        <button
          type="button"
          className="link-btn"
          onClick={() => onLocateGps && onLocateGps()}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <LocateFixed size={14} /> My Location
        </button>
        <button
          type="button"
          className="link-btn"
          onClick={() => leafletMap.current && leafletMap.current.setView([9.0107, 38.7612], 12)}
        >
          View full map
        </button>
      </div>
    </div>
  );
}
