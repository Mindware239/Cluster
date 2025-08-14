import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Staff from './pages/Staff';
import Promotions from './pages/Promotions';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto overlay-prevention">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
