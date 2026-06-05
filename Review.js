import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/Firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore";

export default function Review() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load reviews
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewList);
    });

    return () => unsubscribe();
  }, []);

  // Submit review
  const submitReview = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!comment.trim()) {
      alert("Please write your review");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        alert("Please login first");
        return;
      }

      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userName: name,
        userEmail: user.email,
        rating,
        comment,
        createdAt: serverTimestamp()
      });

      setName("");
      setComment("");
      setRating(5);

      alert("Review submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page">
      <div className="container">

        <h2>💬 Reviews & Feedback</h2>

        {/* Review Form */}
        <form onSubmit={submitReview} className="review-form">

          {/* NAME FIELD ADDED */}
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
            <option value={4}>⭐⭐⭐⭐ (4)</option>
            <option value={3}>⭐⭐⭐ (3)</option>
            <option value={2}>⭐⭐ (2)</option>
            <option value={1}>⭐ (1)</option>
          </select>

          <label>Your Review</label>
          <textarea
            rows="4"
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* Reviews List */}
        <div className="reviews-list">
          <h3>All Reviews</h3>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card">

                <div className="review-top">
                  <h4>{review.userName}</h4>
                  <span>{"⭐".repeat(review.rating)}</span>
                </div>

                <p>{review.comment}</p>

                <small>
                  {review.createdAt?.toDate
                    ? review.createdAt.toDate().toLocaleString()
                    : ""}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .review-page{
          min-height:100vh;
          background:#0f172a;
          color:white;
          padding:20px;
        }

        .container{
          max-width:800px;
          margin:auto;
        }

        h2{
          text-align:center;
          margin-bottom:20px;
        }

        .review-form{
          background:#111827;
          padding:20px;
          border-radius:16px;
          display:flex;
          flex-direction:column;
          gap:12px;
          margin-bottom:30px;
        }

        label{
          font-weight:600;
        }

        input, select, textarea{
          background:#1e293b;
          border:none;
          color:white;
          padding:10px;
          border-radius:10px;
        }

        button{
          background:#2563eb;
          color:white;
          border:none;
          padding:12px;
          border-radius:10px;
          cursor:pointer;
          font-weight:bold;
        }

        button:disabled{
          opacity:0.6;
        }

        .reviews-list{
          display:flex;
          flex-direction:column;
          gap:15px;
        }

        .review-card{
          background:#111827;
          padding:15px;
          border-radius:14px;
        }

        .review-top{
          display:flex;
          justify-content:space-between;
        }

        .review-card p{
          margin:10px 0;
        }

        small{
          color:#94a3b8;
        }
      `}</style>
    </div>
  );
}