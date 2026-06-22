import React, { useState, useMemo } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SolutionCard from '../components/ui/SolutionCard';
import styles from './Search.module.css';

const Search = () => {
  const { solutions } = useAppContext();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract all unique categories
  const categories = useMemo(() => {
    const cats = new Set(solutions.map(s => s.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [solutions]);

  // Filter solutions
  const filteredSolutions = useMemo(() => {
    return solutions.filter(solution => {
      const matchesCategory = activeCategory === 'All' || solution.category === activeCategory;
      if (!matchesCategory) return false;

      if (!query.trim()) return true;

      const q = query.toLowerCase();
      const titleMatch = solution.title.toLowerCase().includes(q);
      const descMatch = (solution.description || '').toLowerCase().includes(q);
      const solMatch = solution.solution.toLowerCase().includes(q);
      const tagsMatch = solution.tags?.some(tag => tag.toLowerCase().includes(q));

      return titleMatch || descMatch || solMatch || tagsMatch;
    });
  }, [solutions, query, activeCategory]);

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <SearchIcon className={styles.searchIcon} size={24} />
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Search problems, solutions, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        
        {categories.length > 1 && (
          <div className={styles.filters}>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`${styles.filterBadge} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.resultsHeader}>
        <span>Found {filteredSolutions.length} result{filteredSolutions.length !== 1 ? 's' : ''}</span>
      </div>

      {filteredSolutions.length > 0 ? (
        <div className={styles.grid}>
          {filteredSolutions.map(solution => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <SearchIcon size={48} color="var(--border-color)" style={{ margin: '0 auto 1rem' }} />
          <h3>No solutions found</h3>
          <p>Try adjusting your search query or filters.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
