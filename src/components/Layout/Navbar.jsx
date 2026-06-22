import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './Navbar.module.css';

const Navbar = ({ onMenuToggle }) => {
  const { theme, toggleTheme, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/add':
        return 'Add Solution';
      case '/search':
        return 'Browse & Search';
      case '/settings':
        return 'Settings';
      default:
        if (location.pathname.startsWith('/solution/')) return 'Solution Detail';
        return 'Ask Future Me';
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.leftGroup}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
        <h1 className={styles.title}>{getPageTitle()}</h1>
      </div>
      <div className={styles.actions}>
        <button 
          className={styles.themeToggle} 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button 
          className={styles.themeToggle} 
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          style={{ color: 'var(--danger)' }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
