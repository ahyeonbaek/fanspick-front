import { FC } from 'react';
import styles from '@css/productTable/productTableMenu.module.css';

interface ProductDetailProps {
  image?: string;
  onClick?: () => void;
  productName: string;
  className?: string;
}

const ProductDetail: FC<ProductDetailProps> = (props) => {
  const { image, onClick, productName } = props;

  return (
    <div className={styles.detail}>
      <a onClick={onClick}>
        <img src={image} className={styles.image} />
      </a>
      <div>
        <a onClick={onClick} className={styles.a}>
          {productName}
        </a>
      </div>
    </div>
  );
};

export default ProductDetail;
