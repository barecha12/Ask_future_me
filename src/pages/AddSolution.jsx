import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TagInput from '../components/ui/TagInput';
import styles from './AddSolution.module.css';

const CATEGORIES = [
  'Technology', 'Programming', 'Career', 'Education', 
  'Health', 'Government', 'Home', 'Finance', 'Travel', 
  'Productivity', 'Personal'
];

const AddSolution = () => {
  const { solutions, addSolution } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    solution: '',
    category: 'Technology',
    tags: [],
    difficulty: 'Moderate',
    timeSaved: '',
    confidence: 'Usually works',
    source: ''
  });

  const [similarSolutions, setSimilarSolutions] = useState([]);

  // Extract all known tags from existing solutions + common static tags
  const knownTags = useMemo(() => {
    const defaultTags = ['react', 'windows', 'css', 'javascript', 'html', 'python', 'wifi', 'printer', 'interview', 'bug', 'fix', 'error', 'setup', 'linux', 'mac'];
    const allUserTags = solutions.flatMap(s => s.tags || []);
    return Array.from(new Set([...defaultTags, ...allUserTags])).filter(Boolean);
  }, [solutions]);

  const [suggestedTags, setSuggestedTags] = useState([]);

  // Auto-tag suggestions based on title/description text
  useEffect(() => {
    const text = (formData.title + ' ' + formData.description).toLowerCase();
    const suggestions = knownTags.filter(tag => 
      text.includes(tag.toLowerCase()) && !formData.tags.includes(tag.toLowerCase())
    ).slice(0, 5);
    setSuggestedTags(suggestions);
  }, [formData.title, formData.description, formData.tags, knownTags]);

  // Similarity Detection
  useEffect(() => {
    if (formData.title.length > 3) {
      const query = formData.title.toLowerCase();
      const matches = solutions.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.tags?.some(t => t.includes(query))
      ).slice(0, 3);
      setSimilarSolutions(matches);
    } else {
      setSimilarSolutions([]);
    }
  }, [formData.title, solutions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (newTags) => {
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDoc = addSolution(formData);
    navigate(`/solution/${newDoc.id}`);
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Add New Solution</h2>
        <p className={styles.subtitle}>Document a problem you've solved to help your future self.</p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        
        {similarSolutions.length > 0 && (
          <div className={`animate-fade-in ${styles.similarAlert}`}>
            <div className={styles.similarAlertHeader}>
              <AlertCircle size={20} />
              Wait! You might have solved this before.
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              We found similar entries in your knowledge base:
            </p>
            <div className={styles.similarList}>
              {similarSolutions.map(s => (
                <div key={s.id} className={styles.similarItem}>
                  <span>{s.title}</span>
                  <button type="button" className="btn btn-secondary viewBtn" onClick={() => navigate(`/solution/${s.id}`)}>
                    View <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="title">Problem Title *</label>
          <input 
            type="text" 
            id="title" 
            name="title"
            required
            className="form-control" 
            placeholder="e.g. Laptop WiFi not connecting, CSS button centering"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select 
                id="category" 
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.col}>
            <div className="form-group">
              <label className="form-label" htmlFor="tags">Tags</label>
              <TagInput tags={formData.tags} setTags={handleTagsChange} />
              {suggestedTags.length > 0 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Suggested:</span>
                  {suggestedTags.map(tag => (
                    <button 
                      key={tag} 
                      type="button" 
                      onClick={() => handleTagsChange([...formData.tags, tag])}
                      style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Symptoms & Context</label>
          <textarea 
            id="description" 
            name="description"
            className={`form-control ${styles.textarea}`} 
            placeholder="What happened? What were you trying to achieve?"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="solution">The Solution *</label>
          <textarea 
            id="solution" 
            name="solution"
            required
            className={`form-control ${styles.textarea} ${styles.large}`} 
            placeholder="Detailed explanation of how the problem was solved..."
            value={formData.solution}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <div className="form-group">
              <label className="form-label" htmlFor="difficulty">Difficulty</label>
              <select id="difficulty" name="difficulty" className="form-control" value={formData.difficulty} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Difficult">Difficult</option>
              </select>
            </div>
          </div>
          <div className={styles.col}>
            <div className="form-group">
              <label className="form-label" htmlFor="timeSaved">Estimated Time Saved</label>
              <input 
                type="text" 
                id="timeSaved" 
                name="timeSaved"
                className="form-control" 
                placeholder="e.g. 30 minutes, 2 hours"
                value={formData.timeSaved}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <div className="form-group">
              <label className="form-label" htmlFor="confidence">Confidence Level</label>
              <select id="confidence" name="confidence" className="form-control" value={formData.confidence} onChange={handleChange}>
                <option value="Not sure">Not sure</option>
                <option value="Usually works">Usually works</option>
                <option value="Always works">Always works</option>
              </select>
            </div>
          </div>
          <div className={styles.col}>
            <div className="form-group">
              <label className="form-label" htmlFor="source">Source (Optional)</label>
              <input 
                type="text" 
                id="source" 
                name="source"
                className="form-control" 
                placeholder="e.g. StackOverflow, Personal Trial"
                value={formData.source}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary"><Save size={18} /> Save Solution</button>
        </div>
      </form>
    </div>
  );
};

export default AddSolution;
