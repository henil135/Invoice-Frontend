import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Review = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    title: "",
    comment: "",
    rating: 0,
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (ratingValue) => {
    setFormData({ ...formData, rating: ratingValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the API to submit the review
      const response = await axios.post(
        "http://localhost:8001/api/feedback/feedback",
        formData
      );

      if (response.status === 201) {
        alert("Review submitted successfully!");

        // Reset the form after successful submission
        setFormData({
          email: "",
          name: "",
          title: "",
          comment: "",
          rating: 0,
        });
      } else {
        setErrorMessage("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto mt-40"
>
  <div>
    <div className="md:w-[30%] w-[50%] pb-3 mx-auto">
      <img src="/img/logo.png" className="mb-4" />
    </div>

    <div className="px-7">
      <h1 className="text-xl font-bold mb-2 text-center">Give us your feedback!</h1>
      <p className="text-gray-600 text-center text-sm">
        Your feedback is essential to us, helping us improve and provide the best possible experience. This page features real
        customer testimonials, a user-friendly form to submit reviews, and a star rating system for quick insights.
      </p>
    </div>
  </div>

  {errorMessage && (
    <p className="text-red-500 text-sm text-center my-4">{errorMessage}</p>
  )}

  <div className="mt-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 mb-2 font-semibold">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-2xl mb-2"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2 font-semibold">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-2xl mb-2"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2 font-semibold">Your Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-2xl mb-4"
          required
        />
      </div>
    </div>
    <div className="my-3">
      <label className="block text-gray-700 mb-2 font-semibold">Rating</label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={`text-3xl px-1 ${formData.rating >= star ? "text-yellow-500" : "text-gray-400"}`}
            onClick={() => handleRatingChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
    <label className="block text-gray-700 mb-2 font-semibold">Additional feedback</label>
    <textarea
      name="comment"
      value={formData.comment}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded-2xl mb-4"
      rows="4"
      required
    ></textarea>
  </div>

  <button
    type="submit"
    className="bg-[#438a7a] w-full sm:w-[30%] text-white py-2 px-4 rounded-full"
  >
    Submit Review(s)
  </button>
</form>

  );
};

export default Review;
