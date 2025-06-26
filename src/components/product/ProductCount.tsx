import { useState } from 'react';
import styles from '../../css/product/productDetail.module.css';

interface ProductCountProps {
  onChange: (count: number) => void;
}

const ProductCount = ({ onChange }: ProductCountProps) => {
  const [count, setCount] = useState(1);

  const increaseCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    onChange(newCount);
  };

  const decreaseCount = () => {
    const newCount = count > 1 ? count - 1 : count;
    setCount(newCount);
    onChange(newCount);
  };

  return (
    <div className={styles.productCount}>
      <button onClick={decreaseCount}>-</button>
      <span>{count}</span>
      <button onClick={increaseCount}>+</button>
    </div>
  );
};

export default ProductCount;
