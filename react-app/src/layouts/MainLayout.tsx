import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import Header from '../components/navigation/Header';
import Footer from '../components/navigation/Footer';
import Sidebar from '../components/navigation/Sidebar';
import NotificationsContainer from '../components/common/NotificationsContainer';

const MainLayout: React.FC = () => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1">
          <div className="container-custom py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
      <NotificationsContainer />
    </div>
  );
};

export default MainLayout;