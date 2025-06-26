import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUserContext } from '../../context/UserContext';

interface ProductProps {
  productId: string;
  className: string;
}
const FavoritesBtn: FC<ProductProps> = ({ productId, className }) => {
  const { user } = useUserContext();
  const userId = user?.id;

  // 사용자별 즐겨찾기 키 생성
  const favoritesKey = `favorite_${userId}`;

  // 초기값 설정 시 로컬 스토리지 확인
  const initialFavorite = () => {
    if (!userId) return false;
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    return favorites.some(
      (item: { productId: string }) => item.productId === productId,
    ); // 객체 배열에서 _id 비교
  };

  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    // 유저가 바뀌거나, productId가 바뀌었을 때 로컬 스토리지를 다시 확인
    setIsFavorite(initialFavorite());
  }, [productId, userId]);

  // 좋아요 상태 토글 함수
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); /* 버튼 눌러도 페이지 이동안하게 */
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    if (!isFavorite) {
      // 즐겨찾기에 추가
      const updatedFavorites = [...favorites, { productId }];
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
      toast.success('즐겨찾기에 추가되었습니다.');
    } else {
      // 즐겨찾기에서 제거
      const updatedFavorites = favorites.filter(
        (favorite: { productId: string }) => favorite.productId !== productId,
      );
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
      toast.success('즐겨찾기에서 제거되었습니다.');
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <svg
      onClick={toggleFavorite}
      className={className}
      width="23"
      height="21"
      viewBox="-2 -2 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 18.35L8.55 17.03C3.4 12.36 0 9.27 0 5.5C0 2.41 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.08C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.41 20 5.5C20 9.27 16.6 12.36 11.45 17.03L10 18.35Z"
        fill={isFavorite ? 'black' : 'none'}
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};

export default FavoritesBtn;
