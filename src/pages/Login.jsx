import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './Auth.module.css';

const Login = () => {
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');
  const { login, password } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(inputPassword)) {
      if (password === 'admin') {
        navigate('/change-password');
      } else {
        navigate('/');
      }
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={`animate-fade-in ${styles.card}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Brain size={28} />
          </div>
        </div>

        <div>
          <p className={styles.appName}>Ask Future Me</p>
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Enter your password to unlock your knowledge base.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {password === 'admin' && (
          <div className={styles.hint}>
            <strong>First time?</strong> The default password is <strong>admin</strong>. You'll be asked to change it after logging in.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.fieldLabel} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.button}`}>
            <Lock size={17} /> Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
