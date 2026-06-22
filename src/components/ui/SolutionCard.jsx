import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Clock, Eye, Star } from 'lucide-react';
import styles from './SolutionCard.module.css';

const SolutionCard = ({ solution }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/solution/${solution.id}`);
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return styles.easy;
      case 'moderate': return styles.moderate;
      case 'difficult': return styles.difficult;
      default: return '';
    }
  };

  return (
    <div className={`${styles.card} hover-lift`} onClick={handleClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            {solution.isFavorite && <Star size={16} fill="var(--warning)" color="var(--warning)" style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }} />}
            {solution.title}
          </h3>
          <div className={styles.category}>
            <Folder size={14} />
            {solution.category || 'Uncategorized'}
          </div>
        </div>
        {solution.difficulty && (
          <span className={`${styles.badge} ${getDifficultyClass(solution.difficulty)}`}>
            {solution.difficulty}
          </span>
        )}
      </div>

      <div className={styles.description}>
        {solution.description || solution.solution?.substring(0, 100) + '...'}
      </div>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {solution.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className={styles.tag}>#{tag}</span>
          ))}
          {solution.tags?.length > 3 && (
            <span className={styles.tag}>+{solution.tags.length - 3}</span>
          )}
        </div>
        
        <div className={styles.meta}>
          {solution.timeSaved && (
            <span className={styles.metaItem} title="Estimated time saved">
              <Clock size={14} />
              {solution.timeSaved}
            </span>
          )}
          <span className={styles.metaItem} title="Views">
            <Eye size={14} />
            {solution.views || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
