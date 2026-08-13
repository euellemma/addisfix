import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Send, Upload, MapPin, Navigation, LocateFixed, CheckCircle2, AlertCircle } from 'lucide-react';
import AddisMap from './AddisMap';
import { DEFECT_CATEGORIES } from '../data/initialData';
import { calculateSeverityScore, getSeverityColor } from '../utils/severityEngine';

export default function ReporterPortal({ incidents, onAddIncident }) {
  const [defectType, setDefectType] = useState('');
  const [urgency, setUrgency] = useState(2);
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  
  // GPS State (Default to Addis Ababa center if permission pending)
  const [selectedCoords, setSelectedCoords] = useState([9.0107, 38.7612]);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('fetching'); // 'fetching' | 'success' | 'manual' | 'error'
  const [photoUrl, setPhotoUrl] = useState(null);

  // Trigger GPS detection on mount
  useEffect(() => {
    fetchGpsLocation();
  }, []);

  const fetchGpsLocation = () => {
    setGpsStatus('fetching');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setSelectedCoords([latitude, longitude]);
          setGpsAccuracy(accuracy);
          setGpsStatus('success');
        },
        (error) => {
          console.warn("Geolocation warning:", error.message);
          setGpsStatus('error');
          // Default to central Addis Ababa Bole/Kirkos location
          setSelectedCoords([9.0107, 38.7612]);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsStatus('error');
    }
  };

  const handleMapCoordChange = (coords) => {
    setSelectedCoords(coords);
    setGpsStatus('manual');
  };

  // Compute live severity score
  const { score, levelText, levelClass } = calculateSeverityScore(defectType, urgency, gpsStatus === 'success');

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!defectType) {
      alert("Please select a Defect Category!");
      return;
    }

    const categoryObj = DEFECT_CATEGORIES.find(c => c.value === defectType) || {};
    const newId = `AF-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newTicket = {
      id: newId,
      category: categoryObj.categoryName || "General Urban Defect",
      defectType,
      subcity: "GPS Geotagged",
      landmark: `GPS: ${selectedCoords[0].toFixed(5)}° N, ${selectedCoords[1].toFixed(5)}° E`,
      agency: categoryObj.agency || "AACRA",
      severity: score,
      status: "Reported",
      urgency,
      description: description || "No detailed description provided.",
      coords: [...selectedCoords],
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      sla: "24 Hours SLA Standard",
      reporter: reporterContact || "Anonymous Citizen",
      photoUrl
    };

    onAddIncident(newTicket);

    // Trigger celebration effect
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 }
    });

    alert(`Incident Ticket ${newId} Submitted via GPS Coordinates! Routed to ${newTicket.agency}.`);

    // Reset Form
    setDefectType('');
    setDescription('');
    setReporterContact('');
    setPhotoUrl(null);
  };

  return (
    <div className="content-container">
      <div className="portal-header reporter-theme">
        <div className="portal-badge">Citizen GPS Incident Reporter</div>
        <h2>Report an Urban Infrastructure Issue</h2>
        <p>Your location is captured automatically via device GPS for instant inter-agency dispatch.</p>
      </div>

      <div className="portal-grid">
        {/* Left Column: Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="incident-form">
            
            {/* GPS Location Status Box */}
            <div className="gps-location-card">
              <div className="gps-header">
                <div className="gps-title">
                  <Navigation size={18} className="gps-icon" />
                  <span>Automatic GPS Geotag</span>
                </div>
                <button
                  type="button"
                  className="btn-secondary sm"
                  onClick={fetchGpsLocation}
                >
                  <LocateFixed size={14} />
                  <span>Re-Fetch GPS</span>
                </button>
              </div>

              <div className="gps-coordinates-display">
                <div className="coord-value">
                  {selectedCoords[0].toFixed(5)}° N, {selectedCoords[1].toFixed(5)}° E
                </div>
                <div className="gps-status-badge">
                  {gpsStatus === 'success' && (
                    <span className="badge-gps success">
                      <CheckCircle2 size={13} /> GPS Locked {gpsAccuracy ? `(±${Math.round(gpsAccuracy)}m)` : ''}
                    </span>
                  )}
                  {gpsStatus === 'fetching' && (
                    <span className="badge-gps fetching">
                      <LocateFixed size={13} className="spin" /> Acquiring GPS signal...
                    </span>
                  )}
                  {gpsStatus === 'manual' && (
                    <span className="badge-gps manual">
                      <MapPin size={13} /> Custom Pin Adjusted on Map
                    </span>
                  )}
                  {gpsStatus === 'error' && (
                    <span className="badge-gps fallback">
                      <AlertCircle size={13} /> Default Addis Location (Click map to adjust pin)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Defect Category Selection */}
            <div className="form-group">
              <label htmlFor="defect-type">Defect Category *</label>
              <select
                id="defect-type"
                value={defectType}
                onChange={(e) => setDefectType(e.target.value)}
                required
              >
                <option value="">-- Select Defect Category --</option>
                {DEFECT_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="urgency">Perceived Urgency & Impact</label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(parseInt(e.target.value))}
                >
                  <option value={1}>Low - Minor nuisance / aesthetic issue</option>
                  <option value={2}>Medium - Impeding normal traffic flow</option>
                  <option value={3}>High - Vehicle damage or water leakage</option>
                  <option value={4}>Critical - Immediate safety or flood danger</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reporter-contact">Citizen Contact (Optional for SMS updates)</label>
                <input
                  type="tel"
                  id="reporter-contact"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="+251 9..."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Observations</label>
              <textarea
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe defect depth, size, hazards, or specific details..."
              ></textarea>
            </div>

            {/* Photo Attachment Simulation */}
            <div className="form-group">
              <label>Photo Evidence Attachment</label>
              <div className="photo-upload-sim">
                <input
                  type="file"
                  id="photo-input"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="file-input-hidden"
                />
                {!photoUrl ? (
                  <label htmlFor="photo-input" className="upload-placeholder">
                    <Upload size={28} />
                    <p>Click to upload incident photo</p>
                    <span className="subtext">JPG, PNG up to 10MB</span>
                  </label>
                ) : (
                  <div className="photo-preview-box">
                    <img src={photoUrl} alt="Incident preview" />
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => setPhotoUrl(null)}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Live Severity Engine Preview */}
            <div className="score-engine-card">
              <div className="score-header">
                <span>Automated Severity Score Engine</span>
                <strong>Score: {score}/100 ({levelText})</strong>
              </div>
              <div className="score-bar">
                <div
                  className={`score-fill ${levelClass}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <p className="score-breakdown">
                Severity algorithm factors defect category weight, urgency rating, and verified GPS coordinate precision.
              </p>
            </div>

            <button type="submit" className="btn-primary submit-btn">
              <Send size={18} />
              <span>Submit GPS Incident Ticket to Triage System</span>
            </button>
          </form>
        </div>

        {/* Right Column: Map & Stream */}
        <div className="map-sidebar">
          <AddisMap
            selectedCoords={selectedCoords}
            setSelectedCoords={handleMapCoordChange}
            gpsAccuracy={gpsAccuracy}
            incidents={incidents}
            onLocateGps={fetchGpsLocation}
          />

          {/* Mini Live Stream Feed */}
          <div className="mini-feed-card">
            <h3>Recent Geotagged Submissions</h3>
            <div className="feed-list">
              {incidents.slice(0, 5).map(item => (
                <div key={item.id} className="feed-item">
                  <div className="feed-item-header">
                    <span className="feed-item-title">{item.id}: {item.category}</span>
                    <span
                      style={{
                        color: getSeverityColor(item.severity),
                        fontWeight: 700,
                        fontSize: '0.78rem'
                      }}
                    >
                      Score {item.severity}
                    </span>
                  </div>
                  <div className="feed-item-meta">
                    GPS: {item.coords ? `${item.coords[0].toFixed(4)}, ${item.coords[1].toFixed(4)}` : item.landmark} &bull; Routed to <strong>{item.agency}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
