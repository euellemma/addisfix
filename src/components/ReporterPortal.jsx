import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Camera, MapPin, Upload, X, Navigation, LocateFixed, Send, CheckCircle2 } from 'lucide-react';
import { DEFECT_CATEGORIES, SUBCITIES } from '../data/initialData';
import { calculateSeverityScore } from '../utils/severityEngine';

export default function ReporterPortal({ incidents, onAddIncident }) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [defectType, setDefectType] = useState('pothole');
  const [subcity, setSubcity] = useState('Bole Sub-City');
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState([9.0107, 38.7612]);

  // Acquire GPS on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setSelectedCoords([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn(err)
      );
    }
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoUrl(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryObj = DEFECT_CATEGORIES.find(c => c.value === defectType) || {};
    const title = categoryObj.categoryName || "Defect";

    const newTicket = {
      id: `AF-${Math.floor(106 + Math.random() * 90)}`,
      title,
      category: categoryObj.label || "General Issue",
      defectType,
      subcity,
      landmark: `GPS: ${selectedCoords[0].toFixed(4)}° N, ${selectedCoords[1].toFixed(4)}° E`,
      agency: categoryObj.agency || "AACRA",
      severity: 85,
      status: "High Priority",
      urgency: 3,
      description: description || "Reported via mobile reporter app.",
      coords: [...selectedCoords],
      reportedAt: "Just now",
      sla: "24 Hours SLA",
      reporter: reporterContact || "Citizen",
      photoUrl: photoUrl || categoryObj.defaultPhoto
    };

    onAddIncident(newTicket);

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });

    setShowFormModal(false);
    setDescription('');
    setPhotoUrl(null);
  };

  return (
    <div className="reporter-container">
      <div className="reporter-card-frame">
        {/* Header matching mobile view in new-design.jpg */}
        <div className="reporter-header">
          <h2>Addis Fix</h2>
          <p>What needs fixing? Let's make Addis better together.</p>
        </div>

        {/* Big Action Box with camera circle */}
        <div className="hero-report-box">
          <div className="camera-circle-lg">
            <Camera size={34} />
          </div>
          <button className="btn-report-lg" onClick={() => setShowFormModal(true)}>
            Report an Issue
          </button>
        </div>

        {/* My Reports List matching new-design.jpg */}
        <div className="my-reports-section">
          <div className="section-title-row">
            <h3>My Reports</h3>
            <button className="link-btn">View all</button>
          </div>

          <div className="reports-card-list">
            {incidents.slice(0, 4).map((item) => {
              const badgeClass = item.status === 'High Priority' ? 'high' : item.status === 'In Progress' ? 'progress' : 'resolved';

              return (
                <div key={item.id} className="report-item-row">
                  <img src={item.photoUrl} alt={item.title} className="report-thumb" />
                  <div className="report-info">
                    <h4>{item.title}</h4>
                    <span className="report-location">
                      <MapPin size={12} /> {item.subcity}
                    </span>
                  </div>
                  <div className="report-badge-meta">
                    <span className={`badge-pill ${badgeClass}`}>{item.status}</span>
                    <span className="time-ago">{item.reportedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simple Clean Modal Form */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Report an Infrastructure Issue</h3>
              <button className="btn-close" onClick={() => setShowFormModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Issue Type *</label>
                <select value={defectType} onChange={(e) => setDefectType(e.target.value)} required>
                  {DEFECT_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sub-City Area</label>
                <select value={subcity} onChange={(e) => setSubcity(e.target.value)}>
                  {SUBCITIES.map(sc => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the hazard or defect..."
                ></textarea>
              </div>

              <div className="form-group">
                <label>Photo Evidence</label>
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                  <input type="file" accept="image/*" id="photo-mod" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  {!photoUrl ? (
                    <label htmlFor="photo-mod" style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
                      + Attach Photo
                    </label>
                  ) : (
                    <img src={photoUrl} alt="Upload preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                  )}
                </div>
              </div>

              <button type="submit" className="btn-report-lg" style={{ marginTop: '0.5rem' }}>
                Submit Incident Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
