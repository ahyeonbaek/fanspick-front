import { FC } from "react";

interface StarProps {
  filled: boolean;
  onClick: () => void;
  width?: string;
  height?: string;
}

const Star: FC<StarProps> = ({
  filled,
  onClick,
  width = "20px",
  height = "20px",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "#ffd700" : "gray"}
      onClick={onClick}
      style={{ width, height, cursor: "pointer" }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
};

export default Star;
