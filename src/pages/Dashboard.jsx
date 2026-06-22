import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Calendar, Folder, BookOpen, Clock, Tag, Star, AlertCircle, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';
import SolutionCard from '../components/ui/SolutionCard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { solutions, userName } = useAppContext();
  const navigate = useNavigate();

  // Derived stats
  const stats = useMemo(() => {
    const total = solutions.length;
    const now = new Date();
    
    // Simplistic check for recent (last 7 days)
    const recent = solutions.filter(s => {
      const added = new Date(s.createdAt);
      return (now - added) / (1000 * 60 * 60 * 24) <= 7;
    }).length;

    // Tags count
    const tagsCount = {};
    solutions.forEach(s => {
      s.tags?.forEach(tag => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1;
      });
    });
    const mostUsedTags = Object.entries(tagsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(t => t[0]);

    return { total, recent, mostUsedTags: mostUsedTags.length > 0 ? mostUsedTags.join(', ') : 'None' };
  }, [solutions]);

  const recentSolutions = solutions.slice(0, 3); // top 3 newest
  
  const favorites = useMemo(() => solutions.filter(s => s.isFavorite), [solutions]);
  
  const dueForReview = useMemo(() => {
    const today = new Date();
    return solutions.filter(s => {
      if (!s.reviewSchedule) return false;
      const reviewDate = new Date(s.reviewSchedule);
      return reviewDate <= today;
    });
  }, [solutions]);

  // Chart Data preparation
  const trendData = useMemo(() => {
    // Get last 7 days count
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const count = solutions.filter(s => {
        const sDate = new Date(s.createdAt);
        return sDate.getDate() === d.getDate() && sDate.getMonth() === d.getMonth() && sDate.getFullYear() === d.getFullYear();
      }).length;
      
      data.push({ name: dateStr, solutions: count });
    }
    return data;
  }, [solutions]);

  const categoryData = useMemo(() => {
    const counts = {};
    solutions.forEach(s => {
      const cat = s.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [solutions]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#64748b'];

  if (solutions.length === 0) {
    return (
      <div className={`animate-fade-in ${styles.dashboard}`}>
        <div className={styles.welcome}>
          <h2>Welcome, {userName.split(' ')[0]}!</h2>
          <p>Your knowledge base is completely empty. Let's start building it.</p>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIconContainer}>
            <BookOpen size={64} style={{ color: 'var(--accent-primary)', opacity: 0.5 }} />
            <div className={styles.emptyGlow}></div>
          </div>
          <h3 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '1rem 0' }}>Your Future Self Will Thank You</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
            Capture a solution you've figured out today, so you never have to waste time searching for it again.
          </p>
          <button className={`btn btn-primary hover-lift`} onClick={() => navigate('/add')} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            <PlusCircle size={20} /> Add Your First Solution
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in ${styles.dashboard}`}>
      <div className={styles.welcome}>
        <h2>Welcome back, <span className="gradient-text">{userName.split(' ')[0]}</span>!</h2>
        <p>You've already solved {stats.total} problems than you remember.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-panel hover-lift`}>
          <div className={styles.statIcon} style={{ background: 'var(--gradient-icon)', color: 'var(--accent-primary)' }}><BookOpen size={24} /></div>
          <div className={styles.statContent}>
            <h3>Total Solutions</h3>
            <p className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.total}</p>
          </div>
        </div>
        <div className={`${styles.statCard} glass-panel hover-lift`}>
          <div className={styles.statIcon} style={{ background: 'var(--gradient-icon)', color: 'var(--accent-primary)' }}><Tag size={24} /></div>
          <div className={styles.statContent}>
            <h3>Top Tags</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{stats.mostUsedTags}</p>
          </div>
        </div>
        <div className={`${styles.statCard} glass-panel hover-lift`}>
          <div className={styles.statIcon} style={{ background: 'var(--gradient-icon)', color: 'var(--accent-primary)' }}><Clock size={24} /></div>
          <div className={styles.statContent}>
            <h3>Added This Week</h3>
            <p className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.recent}</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <button className={`${styles.actionBtn} hover-lift`} onClick={() => navigate('/add')}>
          <PlusCircle size={20} /> Add New Solution
        </button>
        <button className={`${styles.actionBtn} hover-lift`} onClick={() => navigate('/search')}>
          <Search size={20} /> Search Past Solutions
        </button>
        <button className={`${styles.actionBtn} hover-lift`} onClick={() => navigate('/search?filter=reminders')}>
          <Calendar size={20} /> View Reminders
        </button>
        <button className={`${styles.actionBtn} hover-lift`} onClick={() => navigate('/search?filter=categories')}>
          <Folder size={20} /> Browse Categories
        </button>
      </div>

      <div className={styles.chartsGrid}>
        <div className={`${styles.chartContainer} glass-panel`}>
          <h3 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}><BarChart2 size={20} /> Activity (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="solutions" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-primary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {categoryData.length > 0 && (
          <div className={`${styles.chartContainer} glass-panel`}>
            <h3 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}><PieChartIcon size={20} /> Categories</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {dueForReview.length > 0 && (
        <div className={styles.section} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--warning)' }}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle} style={{ color: 'var(--warning)' }}><AlertCircle size={20} /> Due for Review</h3>
          </div>
          <div className={styles.cardsGrid}>
            {dueForReview.map(solution => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}><Star size={20} fill="var(--warning)" color="var(--warning)" /> Favorites & Pinned</h3>
          </div>
          <div className={styles.cardsGrid}>
            {favorites.map(solution => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}><Clock size={20} /> Recently Added</h3>
          {solutions.length > 3 && (
            <button className={styles.viewAll} onClick={() => navigate('/search')}>View All</button>
          )}
        </div>
        
        {recentSolutions.length > 0 ? (
          <div className={styles.cardsGrid}>
            {recentSolutions.map(solution => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen size={48} color="var(--border-color)" />
            <h3>No solutions yet</h3>
            <p>Your knowledge base is empty. Add your first solution to start building your personal memory system.</p>
            <button className="btn btn-primary" onClick={() => navigate('/add')}>
              <PlusCircle size={18} /> Add Your First Solution
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
