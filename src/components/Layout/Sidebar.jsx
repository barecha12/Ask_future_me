import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Brain, Home, PlusCircle, Search as SearchIcon, Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}><Brain size={20} /></div>
        <span>Ask Future Me</span>
      </div>
      <nav className={styles.nav}>
        <NavLink onClick={handleNavClick} to="/" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem} end>
          <Home size={20} />
          Dashboard
        </NavLink>
        <NavLink onClick={handleNavClick} to="/add" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <PlusCircle size={20} />
          Add Solution
        </NavLink>
        <NavLink onClick={handleNavClick} to="/search" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <SearchIcon size={20} />
          Browse & Search
        </NavLink>
        <div style={{ flex: 1 }}></div>
        <NavLink onClick={handleNavClick} to="/settings" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <SettingsIcon size={20} />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
