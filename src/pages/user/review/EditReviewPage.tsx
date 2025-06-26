import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Star from '@components/review/Star';
import styles from '@css/review.module.css';
import uploadImg from '/icons/addImg.png';
import { Button } from 'ys-project-ui';
import { toast } from 'react-toastify';
import api from '@utils/api';
import axios from 'axios';
import closeImg from '/icons/closeImg.png';
// import AWS from 'aws-sdk';

// AWS S3 환경 변수
// const ACCESS_KEY_ID = import.meta.env.VITE_ACCESS_KEY_ID;
// const SECRET_ACCESS_KEY = import.meta.env.VITE_SECRET_ACCESS_KEY;
// const REGION = import.meta.env.VITE_REGION;
// const BUCKET_NAME = 'fanspick';

const EditReviewPage = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [rating, setRating] = useState(3);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [previewImg, setPreviewImg] = useState<string[]>([]);
  const [reviewPhotos, setReviewPhotos] = useState<File[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  // AWS S3 설정
  // const configAws = () => {
  //   AWS.config.update({
  //     accessKeyId: ACCESS_KEY_ID,
  //     secretAccessKey: SECRET_ACCESS_KEY,
  //     region: REGION,
  //   });
  //   return new AWS.S3();
  // };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await api.get(`/review/${reviewId}`);
        const review = response.data.review;

        setProduct(review.productId);
        setRating(review.starpoint);
        setReviewTitle(review.title);
        setReviewContent(review.content);
        setPreviewImg(review.image || []);
      } catch (error) {
        console.error('리뷰 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    if (reviewId) {
      fetchReview();
    } else {
      console.error('리뷰 ID가 유효하지 않습니다.');
    }
  }, [reviewId]);

  const handleClick = (index: number) => {
    setRating(index);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = 3 - previewImg.length; // 3개 제한에서 남은 슬롯 계산

    if (remainingSlots <= 0) {
      toast.warning('최대 3개의 이미지만 업로드 가능합니다.');
      return;
    }

    const filesToAdd = fileArray.slice(0, remainingSlots); // 남은 슬롯만큼 파일 제한
    const previewArray = filesToAdd.map((file) => URL.createObjectURL(file));

    setReviewPhotos((prev) => [...prev, ...filesToAdd]);
    setPreviewImg((prev) => [...prev, ...previewArray]);
  };

  const handleImageDelete = (index: number) => {
    setPreviewImg((prev) => prev.filter((_, i) => i !== index));
    setReviewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = () => {
    inputFileRef.current?.click();
  };

  const handleReviewUpdate = async () => {
    try {
      const s3UploadPromises = reviewPhotos.map((file) => uploadToS3(file));
      const s3Urls = (await Promise.all(s3UploadPromises)).filter((url) => url);

      // 기존 previewImg에서 blob이 아닌 S3 URL만 남기고 새로 업로드된 S3 URL 추가
      const updatedImages = [
        ...previewImg.filter((img) => !img.startsWith('blob:')),
        ...s3Urls,
      ];

      const updatedReview = {
        title: reviewTitle,
        content: reviewContent,
        starpoint: rating,
        image: updatedImages,
      };

      await api.put(`/review/${reviewId}`, updatedReview);
      toast.success('리뷰가 성공적으로 수정되었습니다!');
      navigate('/mypage-review');
    } catch (error) {
      console.error('리뷰 수정 오류:', error);
      toast.error('리뷰 수정 중 오류가 발생했습니다.');
    }
  };

  // const uploadToS3 = async (file: File) => {
  //   try {
  //     const s3 = configAws();
  //     const uploadParams = {
  //       Bucket: BUCKET_NAME,
  //       Key: `review/${file.name}`,
  //       Body: file,
  //       ACL: 'public-read',
  //     };

  //     const data = await s3.upload(uploadParams).promise();
  //     return data.Location;
  //   } catch (error) {
  //     toast.error('이미지 업로드에 실패했습니다.');
  //     return null;
  //   }
  // };
  const uploadToS3 = async (file: File) => {
    try {
      const response = await api.get('/aws/presigned-url'); // S3 presigned URL 가져오기
      const { url } = response.data;

      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      console.log('업로드된 이미지 URL:', url.split('?')[0]);
      return url.split('?')[0];
    } catch (err) {
      console.error('AWS S3 업로드 실패:', err);
      return null;
    }
  };

  return (
    <div className={styles.addReviewWrap}>
      <h1 className={styles.h1}>리뷰수정</h1>
      <h3 className={styles.h3}>이상품 어떠셨나요?</h3>
      {product && (
        <div className={styles.productInfoBox}>
          <img
            className={styles.productImg}
            src={product.image}
            alt="상품 이미지"
          />
          <div className={styles.productInfo}>
            <p className={styles.productTitle}>상품명: {product.name}</p>
            <p className={styles.productPrice}>가격: {product.price}원</p>
          </div>
        </div>
      )}
      <div className={styles.reviewStarWrap}>
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
      <p className={styles.label}>리뷰 제목</p>
      <input
        type="text"
        value={reviewTitle}
        onChange={(e) => setReviewTitle(e.target.value)}
        className={styles.input}
      />
      <p className={styles.label}>본문 입력</p>
      <textarea
        className={styles.textarea}
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
      />
      <p className={styles.label}>사진 첨부</p>
      <div className={styles.uploadContainer}>
        {previewImg.map((photo, index) => (
          <div key={`previewImg-${index}`} className={styles.previewImgBox}>
            <img src={photo} alt="리뷰 사진" className={styles.imagePreview} />
            {/* <button
              type="button"
              className={styles.removeButton}
              onClick={() => handleImageDelete(index)}
            >
              &times;
            </button> */}
            <img
              src={closeImg}
              alt="이미지 제거 버튼"
              className={styles.removeButton}
              onClick={() => handleImageDelete(index)}
            />
          </div>
        ))}
        {previewImg.length < 3 && (
          <div className={styles.uploadButton} onClick={handleImageUpload}>
            <input
              className={styles.uploadInput}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              ref={inputFileRef}
              multiple
            />
            <img
              src={uploadImg}
              alt="업로드 아이콘"
              className={styles.uploadIcon}
            />
          </div>
        )}
      </div>
      <Button
        className={styles.addButton}
        label="리뷰 수정하기"
        onClick={handleReviewUpdate}
      />
    </div>
  );
};

export default EditReviewPage;
