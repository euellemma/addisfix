import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReporterPortal from './components/ReporterPortal';
import AdminPortal from './components/AdminPortal';
import { INITIAL_INCIDENTS } from './data/initialData';

export default function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('addisfix_incidents_v2');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  useEffect(() => {
    localStorage.setItem('addisfix_incidents_v2', JSON.stringify(incidents));
  }, [incidents]);

  const handleAddIncident = (newTicket) => {
    setIncidents(prev => [newTicket, ...prev]);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setIncidents(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedSla = newStatus === 'Resolved' ? 'Resolved (SLA Met)' : item.sla;
          return { ...item, status: newStatus, sla: updatedSla };
        }
        return item;
      })
    );
  };

  const handleResetData = () => {
    if (confirm("Reset incidents feed to default Addis Ababa seed data?")) {
      setIncidents(INITIAL_INCIDENTS);
    }
  };

  return (
    <BrowserRouter>
      <div id="app">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Entry Point 1: Reporter Portal at / */}
            <Route
              path="/"
              element={
                <ReporterPortal
                  incidents={incidents}
                  onAddIncident={handleAddIncident}
                />
              }
            />

            {/* Entry Point 2: Admin Portal at /admin */}
            <Route
              path="/admin"
              element={
                <AdminPortal
                  incidents={incidents}
                  onUpdateStatus={handleUpdateStatus}
                  onResetData={handleResetData}
                />
              }
            />

            {/* Fallback to / */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="footer-container">
            <p>
              Addis Fix React Prototype &bull; Citizen Reporting Portal (<code>/</code>) &amp; Agency Admin Console (<code>/admin</code>) &bull; Cloudflare Pages Ready
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
