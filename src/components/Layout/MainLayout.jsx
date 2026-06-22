import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className={styles.bg}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
        <div className={`${styles.orb} ${styles.orb3}`}></div>
      </div>

      <div className={styles.layout}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={styles.mainContent}>
          <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
          <main className={styles.pageContainer}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
