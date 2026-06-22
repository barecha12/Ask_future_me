import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Folder, Clock, CheckCircle, ExternalLink, Calendar, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import styles from './SolutionDetail.module.css';

const SolutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { solutions, deleteSolution, recordView, updateSolution, toggleFavorite } = useAppContext();
  
  const [solution, setSolution] = useState(null);
  const [showReminders, setShowReminders] = useState(false);

  useEffect(() => {
    const sol = solutions.find(s => s.id === id);
    if (sol) {
      setSolution(sol);
    }
  }, [id, solutions]); // Re-run when solutions change to get the updated favorite status

  useEffect(() => {
    // Record view only once when navigating to this specific solution
    const viewTimeout = setTimeout(() => {
      recordView(id);
    }, 1000);
    return () => clearTimeout(viewTimeout);
  }, [id]); // specifically omit solutions to prevent loop or double-counting

  if (!solution) {
    return (
      <div className={styles.container}>
        <p>Solution not found or deleted.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Dashboard</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      deleteSolution(id);
      navigate('/');
    }
  };

  const setReminder = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    updateSolution(id, { reviewSchedule: date.toISOString() });
    setShowReminders(false);
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={`${styles.actionsBar} no-print`}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className={styles.actionBtns}>
          <button 
            className="btn btn-secondary" 
            onClick={() => toggleFavorite(id)}
            style={{ color: solution.isFavorite ? 'var(--warning)' : 'inherit' }}
          >
            <Star size={16} fill={solution.isFavorite ? "currentColor" : "none"} /> 
            {solution.isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
          
          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary" onClick={() => setShowReminders(!showReminders)}>
              <Calendar size={16} /> Schedule Review
            </button>
            {showReminders && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
                boxShadow: 'var(--shadow-md)', zIndex: 10
              }}>
                <button className="btn btn-secondary" onClick={() => setReminder(1)} style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}>In 1 Day</button>
                <button className="btn btn-secondary" onClick={() => setReminder(3)} style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}>In 3 Days</button>
                <button className="btn btn-secondary" onClick={() => setReminder(7)} style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}>In 1 Week</button>
                <button className="btn btn-secondary" onClick={() => setReminder(30)} style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}>In 1 Month</button>
              </div>
            )}
          </div>
          
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{solution.title}</h1>
          <div className={`${styles.metaTags} no-print`}>
            <span className={styles.metaTag}><Folder size={16} /> {solution.category}</span>
            {solution.difficulty && (
              <span className={styles.metaTag}>
                <span className={`badge ${solution.difficulty.toLowerCase()}`}>
                  {solution.difficulty}
                </span>
              </span>
            )}
            {solution.confidence && (
              <span className={styles.metaTag}><CheckCircle size={16} /> {solution.confidence}</span>
            )}
          </div>
          {solution.tags && solution.tags.length > 0 && (
            <div className={styles.tags}>
              {solution.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.content}>
          {solution.description && (
            <div className={styles.section}>
              <h3>Symptoms & Context</h3>
              <div className={styles.sectionContent}>
                <ReactMarkdown>{solution.description}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3>The Solution</h3>
            <div className={styles.sectionContent} style={{ borderColor: 'var(--accent-primary)', backgroundColor: 'var(--accent-light)' }}>
              <ReactMarkdown>{solution.solution}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className={`${styles.statsFooter} no-print`}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Added</span>
            <span className={styles.statValue}>{new Date(solution.createdAt).toLocaleDateString()}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Views</span>
            <span className={styles.statValue}>{solution.views || 0}</span>
          </div>
          {solution.timeSaved && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Time Saved</span>
              <span className={styles.statValue}>{solution.timeSaved}</span>
            </div>
          )}
          {solution.source && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Source</span>
              <span className={styles.statValue}>
                <a href={solution.source.startsWith('http') ? solution.source : '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {solution.source.substring(0, 20)}{solution.source.length > 20 ? '...' : ''}
                  <ExternalLink size={12} />
                </a>
              </span>
            </div>
          )}
          {solution.reviewSchedule && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Next Review</span>
              <span className={styles.statValue} style={{ color: 'var(--warning)' }}>
                {new Date(solution.reviewSchedule).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionDetail;
