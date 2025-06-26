import { useNavigate } from 'react-router-dom';
import styles from '../../css/product/product.module.css';
import FavoritesBtn from './FavoritesBtn';
import { addCommas } from '../../utils/util';

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: {
    name: string[];
  };
}
const ProductCard: React.FC<ProductProps> = ({ image, name, price, _id }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imgBox}>
        <img src={image} alt="상품 이미지" className={styles.productImage} />
        <FavoritesBtn className={styles.favoritImage} productId={_id} />
      </div>
      <div className={styles.cardTextBox}>
        <h3>{name}</h3>
        <p>{addCommas(price)}원</p>
      </div>
    </div>
  );
};

export default ProductCard;
