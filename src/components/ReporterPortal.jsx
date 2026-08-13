import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Camera, MapPin, X } from 'lucide-react';
import { DEFECT_CATEGORIES, SUBCITIES } from '../data/initialData';
import { useLang } from '../i18n/LangContext';

export default function ReporterPortal({ incidents, onAddIncident }) {
  const { t } = useLang();
  const [showFormModal, setShowFormModal] = useState(false);
  const [defectType, setDefectType] = useState('pothole');
  const [subcity, setSubcity] = useState('Bole Sub-City');
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState([9.0107, 38.7612]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setSelectedCoords([pos.coords.latitude, pos.coords.longitude]),
        () => {}
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
    const newTicket = {
      id: `AF-${Math.floor(200 + Math.random() * 800)}`,
      title: categoryObj.categoryName || 'Defect',
      category: categoryObj.label || 'General Issue',
      defectType,
      subcity,
      landmark: `GPS: ${selectedCoords[0].toFixed(4)}° N, ${selectedCoords[1].toFixed(4)}° E`,
      agency: categoryObj.agency || 'AACRA',
      severity: 80,
      status: 'High Priority',
      urgency: 3,
      description: description || 'Reported via citizen app.',
      coords: [...selectedCoords],
      reportedAt: t.justNow,
      sla: '24 Hours SLA',
      reporter: reporterContact || 'Citizen',
      photoUrl: photoUrl || categoryObj.defaultPhoto
    };

    onAddIncident(newTicket);
    confetti({ particleCount: 70, spread: 55, origin: { y: 0.6 } });
    setShowFormModal(false);
    setDescription('');
    setPhotoUrl(null);
  };

  return (
    <div className="reporter-container">
      <div className="reporter-card-frame">
        {/* Header */}
        <div className="reporter-header">
          <h2>{t.appName}</h2>
          <p>{t.whatNeedsFixing} {t.letsMakeAddisBetter}</p>
        </div>

        {/* Hero Report CTA */}
        <div className="hero-report-box">
          <div className="camera-circle-lg">
            <Camera size={34} />
          </div>
          <button className="btn-report-lg" onClick={() => setShowFormModal(true)}>
            {t.reportAnIssue}
          </button>
        </div>

        {/* My Reports List */}
        <div className="my-reports-section">
          <div className="section-title-row">
            <h3>{t.myReports}</h3>
            <span className="link-btn">{t.viewAll}</span>
          </div>

          <div className="reports-card-list">
            {incidents.slice(0, 5).map((item) => {
              const cls = item.status === 'High Priority' ? 'high' : item.status === 'In Progress' ? 'progress' : 'resolved';
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
                    <span className={`badge-pill ${cls}`}>{item.status}</span>
                    <span className="time-ago">{item.reportedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{t.reportAnIssue}</h3>
              <button className="btn-close" onClick={() => setShowFormModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>{t.issueType} *</label>
                <select value={defectType} onChange={e => setDefectType(e.target.value)} required>
                  {DEFECT_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t.subCity}</label>
                <select value={subcity} onChange={e => setSubcity(e.target.value)}>
                  {SUBCITIES.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>{t.description}</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                ></textarea>
              </div>

              <div className="form-group">
                <label>{t.contactOptional}</label>
                <input
                  type="tel"
                  value={reporterContact}
                  onChange={e => setReporterContact(e.target.value)}
                  placeholder="+251 9..."
                />
              </div>

              <div className="form-group">
                <label>{t.photoEvidence}</label>
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                  <input type="file" accept="image/*" id="photo-reporter" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  {!photoUrl ? (
                    <label htmlFor="photo-reporter" style={{ cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                      {t.attachPhoto}
                    </label>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <img src={photoUrl} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                      <button type="button" onClick={() => setPhotoUrl(null)} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>×</button>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-report-lg">
                {t.submitReport}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
