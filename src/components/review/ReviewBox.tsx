import styles from '@css/review.module.css';
import deleteIcon from '/icons/trash.png';
import editIcon from '/icons/edit_icon.png';
import Star from './Star';

interface ReviewBoxProps {
  profileImg: string;
  username: string;
  productName: string;
  reviewTitle: string;
  productImgs: string[];
  reviewContent: string;
  starpoint: number;
  className?: string;
  hideIcons?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  reviewImages?: string[];
}

const ReviewBox: React.FC<ReviewBoxProps> = ({
  profileImg,
  username,
  productName,
  reviewTitle,
  productImgs = [],
  reviewContent,
  starpoint,
  className = '',
  hideIcons = false,
  onEditClick,
  onDeleteClick,
  reviewImages = [],
}) => {
  return (
    <div className={`${styles.reviewBox} ${className}`}>
      {!hideIcons && (
        <div className={styles.iconContainer}>
          <img
            src={editIcon}
            alt="수정"
            className={styles.editIcon}
            onClick={onEditClick}
          />
          <img
            src={deleteIcon}
            alt="삭제"
            className={styles.deleteIcon}
            onClick={onDeleteClick}
          />
        </div>
      )}
      <div className={styles.profileBox}>
        <img
          src={profileImg}
          alt="프로필 이미지"
          className={styles.profileImg}
        />
        <div className={styles.profileInfoBox}>
          <p className={styles.username}>{username}</p>
          <div className={styles.starBox}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} filled={star <= starpoint} onClick={() => {}} />
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className={styles.productName}>{productName}</p>
        <div className={styles.productImgBox}>
          {productImgs.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`상품 이미지 ${index}`}
              className={styles.productImg}
            />
          ))}
        </div>
        <p className={styles.reviewTitle}>{reviewTitle}</p>
        <p className={styles.reviewContent}>{reviewContent}</p>
        <div className={styles.reviewImgBox}>
          {reviewImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`리뷰 이미지 ${index}`}
              className={styles.reviewImg}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewBox;
