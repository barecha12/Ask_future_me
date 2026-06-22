import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './Auth.module.css';

const ChangePassword = () => {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { updateProfile, password, isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (password !== 'admin') return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!newName.trim()) { setError('Please enter your name.'); return; }
    if (newPassword.length < 4) { setError('Password must be at least 4 characters.'); return; }
    if (newPassword === 'admin') { setError('Please choose a password different from the default.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    updateProfile(newName.trim(), newPassword);
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={`animate-fade-in ${styles.card}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <ShieldAlert size={28} />
          </div>
        </div>

        <div>
          <p className={styles.appName}>Ask Future Me</p>
          <h2 className={styles.title}>Set up your account</h2>
          <p className={styles.subtitle}>
            Before you continue, please choose your name and a personal password.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.fieldLabel} htmlFor="newName">Your Name</label>
            <input
              type="text"
              id="newName"
              className={styles.input}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. John Doe"
              autoFocus
              required
            />
          </div>
          <div className={styles.divider} />
          <div>
            <label className={styles.fieldLabel} htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.fieldLabel} htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.button}`}>
            Save &amp; Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
