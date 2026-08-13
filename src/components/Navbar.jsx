import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserCheck, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand">
          <div className="brand-badge">
            <span className="pulse-dot"></span>
            <span>Addis Ababa CivicTech</span>
          </div>
          <h1 className="brand-title">
            Addis Fix <span className="badge-tag">React Prototype</span>
          </h1>
          <p className="brand-subtitle">Structured Incident Triage & Inter-Agency Maintenance Tracker</p>
        </div>

        <div className="portal-nav-group">
          {/* Reporter Portal (Entry point /) */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            <UserCheck size={18} />
            <span>Citizen Reporter (/)</span>
          </NavLink>

          {/* Admin Portal (Entry point /admin) */}
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            <ShieldCheck size={18} />
            <span>Agency Admin (/admin)</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
