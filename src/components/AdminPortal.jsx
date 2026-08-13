import React, { useState } from 'react';
import {
  Home, FileText, Map, BarChart2, Settings, HelpCircle,
  Plus, Bell, AlertTriangle, Clock, CheckCircle2, List,
  Camera, Users, Check, MapPin, X
} from 'lucide-react';
import AddisMap from './AddisMap';

export default function AdminPortal({ incidents, onUpdateStatus, onAddIncident }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'reports' | 'map' | 'stats'
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('pothole');
  const [description, setDescription] = useState('');
  const [selectedCoords, setSelectedCoords] = useState([9.0107, 38.7612]);

  // Compute stat totals exactly as in new-design.jpg
  const totalCount = incidents.length;
  const highPriorityCount = incidents.filter(i => i.status === 'High Priority' || i.severity >= 80).length;
  const inProgressCount = incidents.filter(i => i.status === 'In Progress').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  const handleCreateReport = (e) => {
    e.preventDefault();
    const newTicket = {
      id: `AF-${Math.floor(106 + Math.random() * 90)}`,
      title: selectedCategory === 'pothole' ? 'Pothole' : selectedCategory === 'drainage' ? 'Blocked Drain' : 'Infrastructure Issue',
      category: selectedCategory,
      subcity: "Bole Sub-City",
      landmark: "Bole Road near Airport",
      agency: "AACRA",
      severity: 85,
      status: "High Priority",
      urgency: 4,
      description: description || "New issue reported from Admin console.",
      coords: selectedCoords,
      reportedAt: "Just now",
      sla: "6 Hours SLA",
      reporter: "Admin Dispatch",
      photoUrl: incidents[0]?.photoUrl
    };
    onAddIncident(newTicket);
    setShowNewReportModal(false);
    setDescription('');
  };

  return (
    <div className="admin-layout">
      {/* Left Sidebar matching new-design.jpg */}
      <aside className="admin-sidebar">
        <div>
          <div className="brand-group" style={{ marginBottom: '2rem', padding: '0 8px' }}>
            <div className="brand-icon-box">
              <BarChart2 size={20} />
            </div>
            <span className="brand-title">Addis Fix</span>
          </div>

          <nav className="sidebar-menu">
            <button
              className={`sidebar-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button
              className={`sidebar-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <FileText size={18} />
              <span>Reports</span>
            </button>
            <button
              className={`sidebar-item ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <Map size={18} />
              <span>Map</span>
            </button>
            <button
              className={`sidebar-item ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <BarChart2 size={18} />
              <span>Stats</span>
            </button>

            <button
              className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-item">
            <HelpCircle size={18} />
            <span>Help</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Workspace */}
      <main className="admin-workspace">
        {/* Top Header */}
        <div className="workspace-header">
          <h2>Overview</h2>
          <div className="header-controls">
            <button className="icon-btn" title="Notifications">
              <Bell size={18} />
            </button>
            <button className="btn-primary" onClick={() => setShowNewReportModal(true)}>
              <Plus size={18} />
              <span>+ New Report</span>
            </button>
          </div>
        </div>

        {/* Stat Cards Row matching new-design.jpg (Total: 9, High Priority: 5, In Progress: 2, Resolved: 3) */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-pill total">
              <List size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-num">{totalCount}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-pill high">
              <AlertTriangle size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-num">{highPriorityCount}</span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-pill progress">
              <Clock size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-num">{inProgressCount}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-pill resolved">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-num">{resolvedCount}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        </div>

        {/* Dashboard 2 Column Section matching new-design.jpg */}
        <div className="dashboard-columns">
          {/* Recent Reports List */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Recent Reports</h3>
              <button className="link-btn" onClick={() => setActiveTab('reports')}>
                View all reports
              </button>
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

          {/* Report Map Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Report Map</h3>
            </div>
            <AddisMap
              selectedCoords={selectedCoords}
              setSelectedCoords={setSelectedCoords}
              incidents={incidents}
            />
          </div>
        </div>

        {/* How It Works Card matching bottom of new-design.jpg */}
        <div className="how-it-works-card">
          <h3>How it works</h3>
          <div className="steps-flow">
            <div className="step-item">
              <div className="step-icon-circle step-1">
                <Camera size={20} />
              </div>
              <span className="step-label">1. Report</span>
            </div>

            <span className="flow-arrow">&rarr;</span>

            <div className="step-item">
              <div className="step-icon-circle step-2">
                <Users size={20} />
              </div>
              <span className="step-label">2. Review</span>
            </div>

            <span className="flow-arrow">&rarr;</span>

            <div className="step-item">
              <div className="step-icon-circle step-3">
                <Check size={20} />
              </div>
              <span className="step-label">3. Resolve</span>
            </div>
          </div>
        </div>
      </main>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create New Dispatch Report</h3>
              <button className="btn-close" onClick={() => setShowNewReportModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Defect Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="pothole">Pothole</option>
                  <option value="drainage">Blocked Drain</option>
                  <option value="power_utility">Street Light</option>
                  <option value="road_damage">Sidewalk</option>
                  <option value="water_utility">Water Leakage</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter defect notes..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Dispatch Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
