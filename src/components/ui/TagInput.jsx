import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './TagInput.module.css';

const TagInput = ({ tags, setTags, placeholder = "Add tag and press Enter" }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={styles.container}>
      <div className={styles.tagsWrapper}>
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>
            #{tag}
            <button type="button" onClick={() => removeTag(tag)} className={styles.removeBtn}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className={styles.input}
        />
      </div>
      <small className={styles.helpText}>Press Enter or comma to add a tag</small>
    </div>
  );
};

export default TagInput;
