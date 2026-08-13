import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReporterPortal from './components/ReporterPortal';
import AdminPortal from './components/AdminPortal';
import { INITIAL_INCIDENTS } from './data/initialData';
import { LangProvider } from './i18n/LangContext';

export default function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('addisfix_incidents_v3');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  useEffect(() => {
    localStorage.setItem('addisfix_incidents_v3', JSON.stringify(incidents));
  }, [incidents]);

  const handleAddIncident = (ticket) =>
    setIncidents(prev => [ticket, ...prev]);

  const handleUpdateStatus = (id, newStatus) =>
    setIncidents(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: newStatus, sla: newStatus === 'Resolved' ? 'Resolved (SLA Met)' : item.sla }
          : item
      )
    );

  const handleResetData = () => setIncidents(INITIAL_INCIDENTS);

  return (
    <BrowserRouter>
      <LangProvider>
        <div id="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={<ReporterPortal incidents={incidents} onAddIncident={handleAddIncident} />}
              />
              <Route
                path="/admin"
                element={
                  <AdminPortal
                    incidents={incidents}
                    onUpdateStatus={handleUpdateStatus}
                    onAddIncident={handleAddIncident}
                    onResetData={handleResetData}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="site-footer">
            <div className="footer-container">
              Addis Fix Prototype &bull; Citizen Reporter (/) &amp; Agency Admin (/admin)
            </div>
          </footer>
        </div>
      </LangProvider>
    </BrowserRouter>
  );
}
