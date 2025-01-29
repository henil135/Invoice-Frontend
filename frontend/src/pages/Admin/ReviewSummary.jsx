import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewSummary = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:8001/api/feedback/feedback");
        if (response.status === 200) {
          setReviews(response.data);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("An error occurred while fetching reviews. Please try again.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading reviews...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="bg-gray-50 p-8 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8">Review Summary</h1>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-600">No reviews submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${
                        review.rating >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">{review.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{review.comment}</p>
              <p className="text-sm text-gray-500">By: {review.name}</p>
              <p className="text-sm text-gray-500">Email: {review.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
