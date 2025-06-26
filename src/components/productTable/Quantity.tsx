import styles from '@css/productTable/productTable.module.css';

interface QuantityProps {
  quantity: number;
  className?: string;
}

const Quantity = ({ quantity, className }: QuantityProps) => {
  return (
    <div className={className}>
      <p className={styles.quantity}>{quantity}</p>
    </div>
  );
};

export default Quantity;
