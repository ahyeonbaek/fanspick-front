import { FC } from "react";
import Star from "@components/review/Star"; 

interface StarRatingProps {
  rating: number;
  onRatingChange: (newRating: number) => void;
}

const StarRating: FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const handleClick = (index: number) => {
    onRatingChange(index);
  };

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          filled={star <= rating}
          onClick={() => handleClick(star)}
          width="40px"
          height="40px"
        />
      ))}
    </div>
  );
};

export default StarRating;