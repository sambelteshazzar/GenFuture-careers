import React, { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { addBookmark, removeBookmark, isBookmarked } from '../services/bookmarks';

const BookmarkButton = ({ userId, itemType, itemId, itemName, onBookmarkChange }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && itemId) {
      checkBookmarkStatus();
    }
  }, [userId, itemId, itemType]);

  const checkBookmarkStatus = async () => {
    try {
      const status = await isBookmarked(userId, itemType, itemId);
      setBookmarked(status);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleToggle = async (e) => {
    e.stopPropagation();

    if (!userId) {
      alert('Please sign in to bookmark items');
      return;
    }

    setLoading(true);
    try {
      if (bookmarked) {
        await removeBookmark(userId, itemType, itemId);
        setBookmarked(false);
      } else {
        await addBookmark(userId, itemType, itemId, itemName);
        setBookmarked(true);
      }

      if (onBookmarkChange) {
        onBookmarkChange(bookmarked);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="bookmark-btn"
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <BookmarkSolid className="w-5 h-5 text-yellow-500" />
      ) : (
        <BookmarkOutline className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
      )}
    </button>
  );
};

export default BookmarkButton;
