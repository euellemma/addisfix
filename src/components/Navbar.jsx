import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserCheck, ShieldCheck, BarChart2 } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="brand-icon-box">
            <BarChart2 size={20} />
          </div>
          <span className="brand-title">{t.appName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="portal-nav-group">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              <UserCheck size={17} />
              <span>{t.reporterApp}</span>
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            >
              <ShieldCheck size={17} />
              <span>{t.adminConsole}</span>
            </NavLink>
          </div>

          {/* Language Toggle */}
          <button className="lang-toggle-btn" onClick={toggleLang} title="Switch Language / ቋንቋ ቀይር">
            <span className={lang === 'en' ? 'lang-active' : ''}>EN</span>
            <span className="lang-divider">|</span>
            <span className={lang === 'am' ? 'lang-active' : ''}>አማ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
