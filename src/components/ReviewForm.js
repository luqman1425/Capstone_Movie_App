import React, { useState } from 'react';
import axios from 'axios';

function ReviewForm({ movieId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  async function submitReview(e) {
    e.preventDefault();
    try {
      await axios.post(`/api/movies/review/${movieId}`, { rating, comment }, { withCredentials: true });
      alert('Review submitted!');
      if (onReviewSubmitted) onReviewSubmitted();
      setRating(5);
      setComment('');
    } catch {
      alert('Failed to submit review.');
    }
  }

  return (
    <form onSubmit={submitReview}>
      <label>
        Rating (1-5):
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
      </label>
      <br />
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here"
        />
      </label>
      <br />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
