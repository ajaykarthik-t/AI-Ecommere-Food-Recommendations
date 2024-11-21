"use client";
import { ProductInterface } from "@/interfaces";
import React from "react";
import axios from "axios";
import { Button, Modal, Rate, message } from "antd";

function ProductReviews({ product }: { product: ProductInterface }) {
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [comment = "", setComment] = React.useState<string>("");
  const [rating = 0, setRating] = React.useState<number>(0);
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [reviews, setReviews] = React.useState([]);

  const getReviews = async () => {
    try {
      const endPoint = `/api/reviews?product=${product._id}`;
      const response = await axios.get(endPoint);
      setReviews(response.data);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  };

  const submitReview = async () => {
    try {
      setLoading(true);
      const endPoint = `/api/reviews`;
      const response = await axios.post(endPoint, {
        comment,
        rating,
        product: product._id,
      });
      message.success(response.data.message);
      getReviews();
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
      setShowReviewForm(false);
    }
  };

  React.useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <Button type="primary" onClick={() => {
          setComment("");
          setRating(0);
          setShowReviewForm(true);
        }}>
          Write a review
        </Button>
      </div>
      {reviews.length === 0 && (
        <div className="text-gray-500">
          <span>No reviews yet. Be the first to review this product.</span>
        </div>
      )}

      <div className="flex flex-col gap-5 mt-5">
        {reviews.map((review: any) => (
          <div
            key={review._id}
            className="flex flex-col gap-2 border border-gray-400 p-3 border-solid"
          >
            <div className="flex justify-between ">
              <div className="flex gap-2 items-center">
                <div className="flex p-3 items-center justify-center bg-gray-600 rounded-full h-8 w-8 text-white">
                   <span>
                     {review.user.name[0]}
                   </span>
                </div>
                <span className="text-sm">{review.user.name}</span>
              </div>
              <Rate disabled defaultValue={review.rating} 
               style={{
                  color: "#26577C"
               }}
              />
            </div>

            <span className="text-sm text-gray-500">{review.comment}</span>
          </div>
        ))}
      </div>

      <Modal
        open={showReviewForm}
        onCancel={() => setShowReviewForm(false)}
        title={
          <div className="flex justify-between items-center uppercase">
            <h1 className="text-2xl font-semibold">Write a review</h1>
          </div>
        }
        closable={false}
        okText="Submit review"
        cancelText="Cancel"
        onOk={submitReview}
        confirmLoading={loading}
      >
        <div className="flex flex-col gap-5">
          <div>
            <span>Comment</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <span>Rating</span>
            <Rate value={rating} onChange={(value) => setRating(value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductReviews;
