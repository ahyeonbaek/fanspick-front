import { FC } from 'react';
import styles from '@css/productTable/productTable.module.css';

interface QuantityButtonProps {
  onClick: (id: string) => void;
  label: string;
  id: string;
  className?: string;
}

const QuantityButton: FC<QuantityButtonProps> = (props) => {
  const { onClick, label, id, className } = props;

  return (
    <div className={className}>
      <button className={styles.increase} onClick={() => onClick(id)}>
        {label}
      </button>
    </div>
  );
};

export default QuantityButton;
