import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout" id="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="dashboard-main">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
