import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserCheck, ShieldCheck, BarChart2 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="brand-icon-box">
            <BarChart2 size={20} />
          </div>
          <span className="brand-title">Addis Fix</span>
        </div>

        <div className="portal-nav-group">
          {/* Reporter Portal (/) */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            <UserCheck size={17} />
            <span>Reporter App (/)</span>
          </NavLink>

          {/* Admin Portal (/admin) */}
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            <ShieldCheck size={17} />
            <span>Admin Console (/admin)</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
