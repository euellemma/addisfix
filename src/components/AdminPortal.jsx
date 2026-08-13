import React, { useState } from 'react';
import {
  Plus, Bell, AlertTriangle, Clock, CheckCircle2, List,
  Camera, Users, Check, MapPin, X, Search, RotateCcw,
  BarChart2, Zap, TrendingUp, Activity
} from 'lucide-react';
import AddisMap from './AddisMap';
import { DEFECT_CATEGORIES, INITIAL_INCIDENTS } from '../data/initialData';
import { useLang } from '../i18n/LangContext';

// ─── Helper: badge class from status ──────────────────────────────
function badgeClass(status) {
  if (status === 'High Priority' || status === 'reported') return 'high';
  if (status === 'In Progress' || status === 'triaged') return 'progress';
  if (status === 'Resolved' || status === 'resolved') return 'resolved';
  return 'progress';
}

// ─── Analytics Mini-Chart (pure CSS bar chart) ────────────────────
function BarMiniChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
      {data.map(d => (
        <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
          <div style={{
            width: '100%', borderRadius: '4px 4px 0 0',
            height: `${(d.value / max) * 52}px`,
            background: d.color || 'var(--color-primary)',
            transition: 'height 0.4s ease',
            minHeight: '4px'
          }} />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600, textAlign: 'center' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cls = badgeClass(status);
  return <span className={`badge-pill ${cls}`}>{status}</span>;
}

// ─── Admin Tabs ───────────────────────────────────────────────────
const TABS = ['overview', 'reports', 'map', 'analytics'];

export default function AdminPortal({ incidents, onUpdateStatus, onAddIncident, onResetData }) {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newCategory, setNewCategory] = useState('pothole');
  const [newDesc, setNewDesc] = useState('');
  const [newSubcity, setNewSubcity] = useState('Bole Sub-City');
  const [newUrgency, setNewUrgency] = useState(3);
  const [selectedCoords, setSelectedCoords] = useState([9.0107, 38.7612]);

  // Table filters
  const [search, setSearch] = useState('');
  const [filterAgency, setFilterAgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [detailItem, setDetailItem] = useState(null);

  // KPIs
  const totalCount = incidents.length;
  const highPriorityCount = incidents.filter(i => i.status === 'High Priority' || i.severity >= 80).length;
  const inProgressCount = incidents.filter(i => i.status === 'In Progress').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  // Filtered incidents for the Reports table
  const filteredIncidents = incidents.filter(item => {
    const term = search.toLowerCase();
    const matchSearch = item.id?.toLowerCase().includes(term)
      || item.title?.toLowerCase().includes(term)
      || item.subcity?.toLowerCase().includes(term)
      || item.landmark?.toLowerCase().includes(term)
      || item.category?.toLowerCase().includes(term);
    const matchAgency = filterAgency === 'all' || item.agency === filterAgency;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchAgency && matchStatus;
  });

  // Status advancement
  const statusFlow = { 'High Priority': 'Triaged', Triaged: 'In Progress', 'In Progress': 'Resolved' };

  const handleCreateReport = (e) => {
    e.preventDefault();
    const categoryObj = DEFECT_CATEGORIES.find(c => c.value === newCategory) || {};
    const newTicket = {
      id: `AF-${Math.floor(106 + Math.random() * 894)}`,
      title: categoryObj.categoryName || 'Urban Defect',
      category: categoryObj.label || 'General Issue',
      defectType: newCategory,
      subcity: newSubcity,
      landmark: `GPS: ${selectedCoords[0].toFixed(4)}° N, ${selectedCoords[1].toFixed(4)}° E`,
      agency: categoryObj.agency || 'AACRA',
      severity: newUrgency >= 4 ? 90 : newUrgency >= 3 ? 75 : 55,
      status: 'High Priority',
      urgency: newUrgency,
      description: newDesc || 'Dispatched from Admin Console.',
      coords: [...selectedCoords],
      reportedAt: 'Just now',
      sla: '24 Hours SLA',
      reporter: 'Admin Dispatch',
      photoUrl: categoryObj.defaultPhoto
    };
    onAddIncident(newTicket);
    setShowNewReportModal(false);
    setNewDesc('');
  };

  // Analytics data
  const agencyData = ['AACRA', 'AAWSA', 'EEU', 'Sanitation'].map(a => ({
    label: a,
    value: incidents.filter(i => i.agency === a).length,
    color: a === 'AACRA' ? '#2563eb' : a === 'AAWSA' ? '#0891b2' : a === 'EEU' ? '#d97706' : '#16a34a'
  }));

  const defectData = DEFECT_CATEGORIES.slice(0, 5).map(cat => ({
    label: cat.categoryName,
    value: incidents.filter(i => i.defectType === cat.value).length,
    color: '#2563eb'
  }));

  const avgSeverity = incidents.length > 0
    ? Math.round(incidents.reduce((sum, i) => sum + (i.severity || 50), 0) / incidents.length)
    : 0;
  const resolutionRate = incidents.length > 0
    ? Math.round((resolvedCount / incidents.length) * 100)
    : 0;

  // Tab label map
  const tabLabels = {
    overview: t.overview,
    reports: t.reports,
    map: t.map,
    analytics: t.analytics,
  };

  return (
    <div className="admin-topnav-layout">
      {/* ── Top Tab Bar (no sidebar) ── */}
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="icon-btn" title={t.resetDemo} onClick={() => {
              if (confirm(t.resetDemo + '?')) onResetData();
            }}>
              <RotateCcw size={17} />
            </button>
            <button className="icon-btn"><Bell size={17} /></button>
            <button className="btn-primary" onClick={() => setShowNewReportModal(true)}>
              <Plus size={17} /> {t.newReport}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-workspace-full">

        {/* ════════════════════════════════════
            TAB: OVERVIEW
        ════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <>
            <div className="workspace-header" style={{ marginTop: '0' }}>
              <h2>{t.overview}</h2>
            </div>

            {/* KPI Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-pill total"><List size={22} /></div>
                <div className="stat-details">
                  <span className="stat-num">{totalCount}</span>
                  <span className="stat-label">{t.total}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-pill high"><AlertTriangle size={22} /></div>
                <div className="stat-details">
                  <span className="stat-num">{highPriorityCount}</span>
                  <span className="stat-label">{t.highPriority}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-pill progress"><Clock size={22} /></div>
                <div className="stat-details">
                  <span className="stat-num">{inProgressCount}</span>
                  <span className="stat-label">{t.inProgress}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-pill resolved"><CheckCircle2 size={22} /></div>
                <div className="stat-details">
                  <span className="stat-num">{resolvedCount}</span>
                  <span className="stat-label">{t.resolved}</span>
                </div>
              </div>
            </div>

            {/* Two-Column Section */}
            <div className="dashboard-columns">
              {/* Recent Reports */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>{t.recentReports}</h3>
                  <button className="link-btn" onClick={() => setActiveTab('reports')}>
                    {t.viewAllReports}
                  </button>
                </div>
                <div className="reports-card-list">
                  {incidents.slice(0, 5).map(item => (
                    <div key={item.id} className="report-item-row" onClick={() => setDetailItem(item)} style={{ cursor: 'pointer' }}>
                      <img src={item.photoUrl} alt={item.title} className="report-thumb" />
                      <div className="report-info">
                        <h4>{item.title}</h4>
                        <span className="report-location">
                          <MapPin size={12} /> {item.subcity}
                        </span>
                      </div>
                      <div className="report-badge-meta">
                        <StatusBadge status={item.status} />
                        <span className="time-ago">{item.reportedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="dash-card">
                <div className="dash-card-header"><h3>{t.reportMap}</h3></div>
                <AddisMap
                  selectedCoords={selectedCoords}
                  setSelectedCoords={setSelectedCoords}
                  incidents={incidents}
                />
              </div>
            </div>

            {/* How It Works */}
            <div className="how-it-works-card">
              <h3>{t.howItWorks}</h3>
              <div className="steps-flow">
                <div className="step-item">
                  <div className="step-icon-circle step-1"><Camera size={20} /></div>
                  <span className="step-label">{t.step1}</span>
                </div>
                <span className="flow-arrow">→</span>
                <div className="step-item">
                  <div className="step-icon-circle step-2"><Users size={20} /></div>
                  <span className="step-label">{t.step2}</span>
                </div>
                <span className="flow-arrow">→</span>
                <div className="step-item">
                  <div className="step-icon-circle step-3"><Check size={20} /></div>
                  <span className="step-label">{t.step3}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════
            TAB: REPORTS (Full Triage Table)
        ════════════════════════════════════ */}
        {activeTab === 'reports' && (
          <>
            <div className="workspace-header">
              <h2>{t.reports}</h2>
            </div>

            {/* Filters */}
            <div className="table-controls">
              <div className="search-box">
                <Search size={15} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <select value={filterAgency} onChange={e => setFilterAgency(e.target.value)}>
                  <option value="all">{t.allAgencies}</option>
                  <option value="AACRA">AACRA</option>
                  <option value="AAWSA">AAWSA</option>
                  <option value="EEU">EEU</option>
                  <option value="Sanitation">Sanitation</option>
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">{t.allStatuses}</option>
                  <option value="High Priority">{t.highPriorityStatus}</option>
                  <option value="Triaged">{t.triaged}</option>
                  <option value="In Progress">{t.inProgressStatus}</option>
                  <option value="Resolved">{t.resolvedStatus}</option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.ticketId}</th>
                    <th>{t.category}</th>
                    <th>{t.location}</th>
                    <th>{t.agency}</th>
                    <th>{t.severityScore}</th>
                    <th>{t.status}</th>
                    <th>{t.slaTarget}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>
                        {t.noResults}
                      </td>
                    </tr>
                  ) : filteredIncidents.map(item => {
                    const sev = item.severity || 50;
                    const sevClass = sev >= 85 ? 'critical' : sev >= 70 ? 'high' : sev >= 45 ? 'medium' : 'low';
                    const next = statusFlow[item.status];

                    return (
                      <tr key={item.id} onClick={() => setDetailItem(item)} style={{ cursor: 'pointer' }}>
                        <td>
                          <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                            {item.id}
                          </strong>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {(item.description || '').substring(0, 40)}…
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.subcity}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.landmark}</div>
                        </td>
                        <td>
                          <span className="agency-tag">{item.agency}</span>
                        </td>
                        <td>
                          <span className={`severity-pill ${sevClass}`}>{sev}/100</span>
                        </td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                        <td style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                          {item.sla}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          {next ? (
                            <button
                              className="btn-advance"
                              onClick={() => onUpdateStatus(item.id, next)}
                            >
                              {t.advanceTo} {next}
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--color-green)', fontWeight: 700 }}>
                              {t.closed}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ════════════════════════════════════
            TAB: MAP (Full Map View)
        ════════════════════════════════════ */}
        {activeTab === 'map' && (
          <>
            <div className="workspace-header">
              <h2>{t.map}</h2>
            </div>
            <div className="dash-card" style={{ padding: '1.5rem' }}>
              <AddisMap
                selectedCoords={selectedCoords}
                setSelectedCoords={setSelectedCoords}
                incidents={incidents}
                fullHeight
              />
            </div>

            {/* Map legend */}
            <div className="dash-card" style={{ marginTop: '1.25rem' }}>
              <div className="dash-card-header"><h3>Map Legend</h3></div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { color: '#ef4444', label: t.highPriority },
                  { color: '#d97706', label: t.inProgress },
                  { color: '#16a34a', label: t.resolved }
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: l.color, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════
            TAB: ANALYTICS
        ════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <>
            <div className="workspace-header">
              <h2>{t.analytics}</h2>
            </div>

            {/* Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div className="stat-card">
                <div className="stat-icon-pill resolved"><TrendingUp size={22} /></div>
                <div className="stat-details">
                  <span className="stat-num">{resolutionRate}%</span>
                  <span className="stat-label">{t.resolutionRate}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-pill progress"><Activity size={22} /></div>
                <div className="stat-details">
                  <span className="stat-num">{avgSeverity}</span>
                  <span className="stat-label">{t.avgSeverity}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-pill high"><Zap size={22} /></div>
                <div className="stat-details">
                  <span className="stat-num">{highPriorityCount}</span>
                  <span className="stat-label">{t.highPriority}</span>
                </div>
              </div>
            </div>

            <div className="dashboard-columns">
              {/* Agency Breakdown Chart */}
              <div className="dash-card">
                <div className="dash-card-header"><h3>{t.agencyBreakdown}</h3></div>
                <BarMiniChart data={agencyData} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
                  {agencyData.map(d => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: d.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{d.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', width: '100px' }}>
                          <div style={{ height: '100%', borderRadius: '99px', background: d.color, width: `${incidents.length > 0 ? (d.value / incidents.length) * 100 : 0}%` }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', width: '28px', textAlign: 'right' }}>{d.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defect Breakdown Chart */}
              <div className="dash-card">
                <div className="dash-card-header"><h3>{t.defectBreakdown}</h3></div>
                <BarMiniChart data={defectData.map((d, i) => ({
                  ...d,
                  color: ['#2563eb', '#0891b2', '#d97706', '#16a34a', '#8b5cf6'][i]
                }))} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
                  {defectData.map((d, i) => {
                    const colors = ['#2563eb', '#0891b2', '#d97706', '#16a34a', '#8b5cf6'];
                    return (
                      <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors[i], flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{d.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', width: '100px' }}>
                            <div style={{ height: '100%', borderRadius: '99px', background: colors[i], width: `${incidents.length > 0 ? (d.value / incidents.length) * 100 : 0}%` }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', width: '28px', textAlign: 'right' }}>{d.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      {/* ════════════════════════════════════
          Detail Drawer (click row → slide-in)
      ════════════════════════════════════ */}
      {detailItem && (
        <div className="modal-overlay" onClick={() => setDetailItem(null)}>
          <div className="detail-drawer" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                {detailItem.id}
              </h3>
              <button className="btn-close" onClick={() => setDetailItem(null)}><X size={18} /></button>
            </div>

            <img
              src={detailItem.photoUrl}
              alt={detailItem.title}
              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
              {[
                { label: t.category, value: detailItem.title },
                { label: t.agency, value: detailItem.agency },
                { label: t.status, value: detailItem.status },
                { label: t.severityScore, value: `${detailItem.severity}/100` },
                { label: t.location, value: detailItem.subcity },
                { label: t.slaTarget, value: detailItem.sla },
              ].map(f => (
                <div key={f.label} style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>{f.label}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{f.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t.description}</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{detailItem.description}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {statusFlow[detailItem.status] && (
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    onUpdateStatus(detailItem.id, statusFlow[detailItem.status]);
                    setDetailItem(null);
                  }}
                >
                  {t.advanceTo} {statusFlow[detailItem.status]}
                </button>
              )}
              <button
                className="btn-secondary"
                style={{ flex: detailItem.status === 'Resolved' ? '1' : 'unset' }}
                onClick={() => setDetailItem(null)}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          New Report Modal
      ════════════════════════════════════ */}
      {showNewReportModal && (
        <div className="modal-overlay" onClick={() => setShowNewReportModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t.createDispatchReport}</h3>
              <button className="btn-close" onClick={() => setShowNewReportModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>{t.defectCategory}</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  {DEFECT_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t.subCity}</label>
                <select value={newSubcity} onChange={e => setNewSubcity(e.target.value)}>
                  {['Bole Sub-City', 'Kirkos Sub-City', 'Arada Sub-City', 'Addis Ketema Sub-City', 'Yeka Sub-City'].map(sc => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Urgency Level</label>
                <select value={newUrgency} onChange={e => setNewUrgency(parseInt(e.target.value))}>
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                  <option value={4}>Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t.description}</label>
                <textarea
                  rows="3"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                {t.submitDispatch}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
