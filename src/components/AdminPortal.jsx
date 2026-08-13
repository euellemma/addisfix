import React, { useState } from 'react';
import { Search, RotateCcw, AlertTriangle, Clock, CheckCircle2, Zap } from 'lucide-react';
import { INITIAL_INCIDENTS } from '../data/initialData';

export default function AdminPortal({ incidents, onUpdateStatus, onResetData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // KPI calculations
  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter(i => i.severity >= 85).length;
  const inProgressCount = incidents.filter(i => i.status === 'In-Progress').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  // Filtered incidents list
  const filtered = incidents.filter(item => {
    const matchSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.subcity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.landmark.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAgency = agencyFilter === 'all' || item.agency === agencyFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchAgency && matchStatus;
  });

  const getNextStatus = (current) => {
    switch(current) {
      case 'Reported': return 'Triaged';
      case 'Triaged': return 'In-Progress';
      case 'In-Progress': return 'Resolved';
      default: return null;
    }
  };

  return (
    <div className="content-container">
      <div className="dashboard-header">
        <div>
          <div className="portal-badge admin-badge">Agency Inter-Agency Dispatch Console</div>
          <h2>Municipal Command & Incident Triage Portal</h2>
          <p>Real-time incident queue & inter-agency dispatch for AACRA, AAWSA, EEU, and Sanitation Teams.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={onResetData}>
            <RotateCcw size={16} />
            <span>Reset Demo Incidents</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon icon-blue">
            <Clock size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-num">{totalIncidents}</span>
            <span className="kpi-label">Active Total Incidents</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon icon-red">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-num">{criticalCount}</span>
            <span className="kpi-label">Critical High-Severity</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon icon-orange">
            <Zap size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-num">{inProgressCount}</span>
            <span className="kpi-label">Dispatched In-Progress</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon icon-green">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-num">{resolvedCount}</span>
            <span className="kpi-label">Resolved (SLA Met)</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="table-controls">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by ID, Sub-City, Landmark, or Keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={agencyFilter} onChange={(e) => setAgencyFilter(e.target.value)}>
            <option value="all">All Responsible Agencies</option>
            <option value="AACRA">AACRA (Roads Authority)</option>
            <option value="AAWSA">AAWSA (Water & Sewerage)</option>
            <option value="EEU">EEU (Electric Utility)</option>
            <option value="Sanitation">City Sanitation Dept</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Ticket Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Triaged">Triaged</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Incident Queue Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Defect Category</th>
              <th>Sub-City & Location</th>
              <th>Agency</th>
              <th>Severity Score</th>
              <th>Status</th>
              <th>SLA Target</th>
              <th>Admin Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                  No matching incident tickets found in triage queue.
                </td>
              </tr>
            ) : (
              filtered.map(item => {
                const sevClass = item.severity >= 85 ? 'critical' : item.severity >= 70 ? 'high' : item.severity >= 45 ? 'medium' : 'low';
                const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
                const nextStatus = getNextStatus(item.status);

                return (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                        {item.id}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.category}</div>
                      <div style={{ fontSize: '0.78em', color: 'var(--text-dim)' }}>
                        {item.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td>
                      <div>{item.subcity}</div>
                      <div style={{ fontSize: '0.75em', color: 'var(--text-dim)' }}>{item.landmark}</div>
                    </td>
                    <td>
                      <span className="badge-tag">{item.agency}</span>
                    </td>
                    <td>
                      <span className={`severity-pill ${sevClass}`}>{item.severity}/100</span>
                    </td>
                    <td>
                      <span className={`badge-status ${statusClass}`}>{item.status}</span>
                    </td>
                    <td style={{ fontSize: '0.8em', fontFamily: 'var(--font-mono)' }}>
                      {item.sla}
                    </td>
                    <td>
                      {nextStatus ? (
                        <button
                          className="btn-action"
                          onClick={() => onUpdateStatus(item.id, nextStatus)}
                        >
                          Advance to {nextStatus}
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78em', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                          ✔ Closed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
