import React from "react";

interface ReviewsProps {
  destinationId: string;
}

const mockReviews = [
  {
    name: "Ali Khan",
    rating: 5,
    comment: "Breathtaking views and amazing hospitality! Highly recommended.",
  },
  {
    name: "Sara Ahmed",
    rating: 4,
    comment: "A wonderful adventure, the guide was very knowledgeable.",
  },
];

const Reviews: React.FC<ReviewsProps> = ({ destinationId }) => {
  return (
    <div className="space-y-6">
      {mockReviews.map((review, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-green-800">{review.name}</span>
            <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
      <div className="mt-4">
        <form className="flex flex-col gap-2">
          <input type="text" placeholder="Your name" className="border rounded-md p-2" />
          <textarea placeholder="Your review" className="border rounded-md p-2" />
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
