import { useEffect, useState } from 'react';
import ReviewBox from '@components/review/ReviewBox';
import paginationStyles from '@/css/pagination.module.css';
import userPaginationStyles from '@/css/userPagination.module.css';
import styles from '@css/review.module.css';
import defaultProfile from '/icons/user_icon.png';
import api from '@utils/api';
import { Pagination } from 'ys-project-ui';

interface Review {
  _id: string;
  userId: {
    name: string;
    profileImage: string;
  };
  title: string;
  content: string;
  image: string[];
  starpoint: number;
  createdAt: string;
}

const ProductReviewPage = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const reviewsPerPage = 2;

  const fetchReviews = async (page: number) => {
    try {
      const response = await api.get(
        `/review/product/${productId}?page=${page}&itemsPerPage=${reviewsPerPage}`,
      );
      if (response.status === 200) {
        setReviews(response.data.reviews);
        setTotalReviews(response.data.totalCount);
      }
    } catch (err) {
      console.error('리뷰 불러오기 오류:', err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, productId]);

  return (
    <div>
      <div className={styles.reviewListWrap}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewBox
              key={review._id}
              profileImg={review.userId.profileImage || defaultProfile}
              username={review.userId.name}
              reviewTitle={review.title}
              productImgs={review.image.length > 0 ? review.image : []}
              reviewContent={review.content}
              starpoint={review.starpoint}
              hideIcons={true}
            />
          ))
        ) : (
          <p>등록된 리뷰가 없습니다.</p>
        )}
      </div>

      {totalReviews > 0 && (
        <Pagination
          itemLength={totalReviews}
          value={currentPage}
          itemCountPerPage={reviewsPerPage}
          onPageChange={handlePageChange}
          className={paginationStyles.pagination}
        >
          <div className={paginationStyles.pageContainer}>
            <Pagination.Navigator
              type="prev"
              className={`${paginationStyles.pageNavigate} ${userPaginationStyles.pageNavigate}`}
            />
            <Pagination.PageButtons
              className={`${paginationStyles.pageButton} ${userPaginationStyles.pageButton}`}
            />
            <Pagination.Navigator
              type="next"
              className={`${paginationStyles.pageNavigate} ${userPaginationStyles.pageNavigate}`}
            />
          </div>
        </Pagination>
      )}
    </div>
  );
};

export default ProductReviewPage;
