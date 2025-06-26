import styles from '@css/productTable/productTable.module.css';

interface ProductPriceProps {
  content: string | number;
  className?: string;
}

const ProductContent = ({ content, className }: ProductPriceProps) => {
  return (
    <div className={className}>
      <p className={styles.productcontent}>{content}</p>
    </div>
  );
};

export default ProductContent;
