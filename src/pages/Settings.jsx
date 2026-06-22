import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2, Database, User, Lock, Info, HardDrive, FileText, Shield, ChevronRight, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './Settings.module.css';

const Settings = () => {
  const { solutions, importData, clearAllData, userName, updateProfile, changePassword, password } = useAppContext();
  const fileInputRef = useRef(null);

  const [nameEdit, setNameEdit] = useState(userName);
  const [nameSaved, setNameSaved] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const storageUsed = (() => {
    try {
      const raw = JSON.stringify(localStorage);
      return (new Blob([raw]).size / 1024).toFixed(1);
    } catch { return '?'; }
  })();

  // Detect browser name
  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'Microsoft Edge';
    if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Google Chrome';
    if (ua.includes('Firefox/')) return 'Mozilla Firefox';
    if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
    if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
    return 'Unknown Browser';
  };

  // Detect OS
  const getOS = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows NT 10.0')) return 'Windows 10/11';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac OS X')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Unknown OS';
  };

  const totalViews = solutions.reduce((sum, s) => sum + (s.views || 0), 0);
  const favoritesCount = solutions.filter(s => s.isFavorite).length;
  const withReminders = solutions.filter(s => s.reviewSchedule).length;
  const oldestSolution = solutions.length > 0
    ? new Date(Math.min(...solutions.map(s => new Date(s.createdAt)))).toLocaleDateString()
    : '—';
  const categoriesCount = new Set(solutions.map(s => s.category).filter(Boolean)).size;

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(solutions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `ask-future-me-backup-${new Date().toISOString().slice(0, 10)}.json`);
    link.click();
  };

  const handleExportCSV = () => {
    if (solutions.length === 0) return;
    const headers = ['Title', 'Category', 'Difficulty', 'Date Added', 'Time Saved'];
    const rows = solutions.map(s => [
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.category || ''}"`,
      `"${s.difficulty || ''}"`,
      `"${new Date(s.createdAt).toLocaleDateString()}"`,
      `"${s.timeSaved || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `ask-future-me-export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (importData(json)) alert('Data imported successfully!');
        else alert('Invalid backup file format.');
      } catch { alert('Error reading file. Please use a valid JSON backup.'); }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSaveName = () => {
    if (!nameEdit.trim()) return;
    updateProfile(nameEdit.trim(), null);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);
    if (currentPw !== password) { setPwError('Current password is incorrect.'); return; }
    if (newPw.length < 4) { setPwError('New password must be at least 4 characters.'); return; }
    if (newPw === 'admin') { setPwError('Cannot reuse the default password.'); return; }
    if (newPw !== confirmPw) { setPwError('New passwords do not match.'); return; }
    changePassword(newPw);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you absolutely sure? This will delete ALL your saved solutions. This cannot be undone.')) {
      if (window.confirm('Final confirmation: delete EVERYTHING?')) {
        clearAllData();
      }
    }
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Settings</h2>
        <p className={styles.pageSubtitle}>Manage your profile, security, and data preferences.</p>
      </div>

      {/* Profile */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))' }}>
            <User size={18} color="var(--accent-primary)" />
          </div>
          <div>
            <h3 className={styles.cardTitle}>Profile</h3>
            <p className={styles.cardDescription}>Update how your name appears in the application.</p>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>Display Name</label>
            <div className={styles.fieldInput}>
              <input
                className={styles.input}
                value={nameEdit}
                onChange={e => setNameEdit(e.target.value)}
                placeholder="Your name"
              />
              <button className={`btn btn-primary ${styles.inlineBtn}`} onClick={handleSaveName}>
                {nameSaved ? <><Check size={15} /> Saved</> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))' }}>
            <Lock size={18} color="#10b981" />
          </div>
          <div>
            <h3 className={styles.cardTitle}>Security</h3>
            <p className={styles.cardDescription}>Change your password to keep your knowledge base secure.</p>
          </div>
        </div>
        <div className={styles.cardBody}>
          {pwError && <div className={styles.alert} style={{ borderColor: 'var(--danger)', background: 'rgba(239,68,68,0.08)', color: 'var(--danger)' }}>{pwError}</div>}
          {pwSuccess && <div className={styles.alert} style={{ borderColor: '#10b981', background: 'rgba(16,185,129,0.08)', color: '#10b981' }}><Check size={14} /> Password updated successfully.</div>}
          <form onSubmit={handleChangePassword}>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Current Password</label>
              <input type="password" className={styles.input} value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>New Password</label>
              <input type="password" className={styles.input} value={newPw} onChange={e => setNewPw(e.target.value)} required />
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Confirm New Password</label>
              <input type="password" className={styles.input} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
            </div>
            <button type="submit" className={`btn btn-primary`} style={{ marginTop: '0.5rem' }}>
              <Shield size={15} /> Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Data Management */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))' }}>
            <Database size={18} color="#f59e0b" />
          </div>
          <div>
            <h3 className={styles.cardTitle}>Data Management</h3>
            <p className={styles.cardDescription}>Your data lives entirely in your browser. Export it regularly as a backup.</p>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.statRow}>
            <div className={styles.statItem}>
              <HardDrive size={16} color="var(--text-secondary)" />
              <span><strong>{solutions.length}</strong> solutions saved</span>
            </div>
            <div className={styles.statItem}>
              <FileText size={16} color="var(--text-secondary)" />
              <span><strong>{storageUsed} KB</strong> used in localStorage</span>
            </div>
          </div>
          <div className={styles.actionRows}>
            <button className={styles.actionRow} onClick={handleExportJSON}>
              <div className={styles.actionRowLeft}>
                <Download size={16} color="var(--accent-primary)" />
                <div>
                  <div className={styles.actionRowTitle}>Export JSON Backup</div>
                  <div className={styles.actionRowDesc}>Full backup — includes all fields and metadata</div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-secondary)" />
            </button>
            <button className={styles.actionRow} onClick={handleExportCSV}>
              <div className={styles.actionRowLeft}>
                <Download size={16} color="#10b981" />
                <div>
                  <div className={styles.actionRowTitle}>Export CSV Summary</div>
                  <div className={styles.actionRowDesc}>Spreadsheet-friendly export for sharing</div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-secondary)" />
            </button>
            <button className={styles.actionRow} onClick={() => fileInputRef.current?.click()}>
              <div className={styles.actionRowLeft}>
                <Upload size={16} color="#a855f7" />
                <div>
                  <div className={styles.actionRowTitle}>Import JSON Backup</div>
                  <div className={styles.actionRowDesc}>Restore from a previously exported backup file</div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-secondary)" />
            </button>
            <input type="file" accept=".json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} />
          </div>
        </div>
      </div>

      {/* About */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.1))' }}>
            <Info size={18} color="#3b82f6" />
          </div>
          <div>
            <h3 className={styles.cardTitle}>About This Session</h3>
            <p className={styles.cardDescription}>Live information about your environment and knowledge base.</p>
          </div>
        </div>
        <div className={styles.cardBody}>
          <p className={styles.groupLabel}>🖥️ Environment</p>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>Browser</span>
              <span className={styles.aboutValue}>{getBrowser()}</span>
            </div>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>Operating System</span>
              <span className={styles.aboutValue}>{getOS()}</span>
            </div>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>Storage Engine</span>
              <span className={styles.aboutValue}>localStorage</span>
            </div>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>Storage Used</span>
              <span className={styles.aboutValue}>{storageUsed} KB</span>
            </div>
          </div>

          <p className={styles.groupLabel} style={{ marginTop: '1.25rem' }}>📚 Knowledge Base</p>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>Total Solutions</span>
              <span className={styles.aboutValue}>{solutions.length}</span>
            </div>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>Total Views</span>
              <span className={styles.aboutValue}>{totalViews}</span>
            </div>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>Favorites</span>
              <span className={styles.aboutValue}>{favoritesCount}</span>
            </div>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>With Reminders</span>
              <span className={styles.aboutValue}>{withReminders}</span>
            </div>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>Categories Used</span>
              <span className={styles.aboutValue}>{categoriesCount}</span>
            </div>
            <div className={styles.aboutItem}>
              <span className={styles.aboutLabel}>First Solution</span>
              <span className={styles.aboutValue}>{oldestSolution}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${styles.card} ${styles.dangerCard}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ background: 'rgba(239,68,68,0.1)' }}>
            <Trash2 size={18} color="var(--danger)" />
          </div>
          <div>
            <h3 className={styles.cardTitle} style={{ color: 'var(--danger)' }}>Danger Zone</h3>
            <p className={styles.cardDescription}>Irreversible actions that permanently delete your data.</p>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.dangerRow}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Erase All Knowledge</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Permanently deletes all {solutions.length} saved solutions. Export a backup before doing this.
              </p>
            </div>
            <button className={`btn btn-danger`} onClick={handleReset}>
              <Trash2 size={15} /> Erase Everything
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
