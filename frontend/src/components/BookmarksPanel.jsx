import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBookmarks } from '../services/bookmarks';
import { BookmarkIcon, AcademicCapIcon, BriefcaseIcon, BuildingLibraryIcon } from '@heroicons/react/24/solid';

const BookmarksPanel = ({ userId, onItemClick }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadBookmarks();
    }
  }, [userId, filter]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const filterType = filter === 'all' ? null : filter;
      const data = await getBookmarks(userId, filterType);
      setBookmarks(data);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'university':
        return <BuildingLibraryIcon className="w-5 h-5 text-blue-500" />;
      case 'course':
        return <AcademicCapIcon className="w-5 h-5 text-green-500" />;
      case 'career_path':
        return <BriefcaseIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <BookmarkIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bookmarks-panel">
      <div className="panel-header">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BookmarkIcon className="w-6 h-6 text-yellow-500" />
          My Bookmarks
        </h3>
      </div>

      <div className="filter-tabs">
        {['all', 'university', 'course', 'career_path'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`filter-tab ${filter === type ? 'active' : ''}`}
          >
            {type === 'all' ? 'All' : type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading bookmarks...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="empty-state">
          <BookmarkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No bookmarks yet</p>
          <p className="text-sm text-gray-400">Start exploring and save items you're interested in!</p>
        </div>
      ) : (
        <div className="bookmarks-list">
          {bookmarks.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              className="bookmark-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onItemClick && onItemClick(bookmark)}
            >
              <div className="bookmark-icon">
                {getIcon(bookmark.item_type)}
              </div>
              <div className="bookmark-content">
                <h4 className="bookmark-title">{bookmark.item_name}</h4>
                <p className="bookmark-type">{bookmark.item_type.replace('_', ' ')}</p>
                {bookmark.notes && (
                  <p className="bookmark-notes">{bookmark.notes}</p>
                )}
                <p className="bookmark-date">Saved {formatDate(bookmark.created_at)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        .bookmarks-panel {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: #6b7280;
          font-weight: 600;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          text-transform: capitalize;
        }

        .filter-tab:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .bookmarks-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 600px;
          overflow-y: auto;
        }

        .bookmark-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bookmark-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }

        .bookmark-icon {
          flex-shrink: 0;
        }

        .bookmark-content {
          flex: 1;
          min-width: 0;
        }

        .bookmark-title {
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .bookmark-type {
          font-size: 0.875rem;
          color: #6b7280;
          text-transform: capitalize;
          margin-bottom: 0.5rem;
        }

        .bookmark-notes {
          font-size: 0.875rem;
          color: #374151;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bookmark-date {
          font-size: 0.75rem;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default BookmarksPanel;
