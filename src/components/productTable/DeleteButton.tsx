import styles from '@css/productTable/productTable.module.css';

interface deleteProps {
  onClick: (id: string) => void;
  productId: string;
  className?: string;
  image?: string;
}

const DeleteButton = ({
  onClick,
  productId,
  className,
  image,
}: deleteProps) => {
  return (
    <div className={className}>
      <a onClick={() => onClick(productId)} className={styles.deletebutton}>
        <img src={image} className={styles.trash} />
      </a>
    </div>
  );
};

export default DeleteButton;
