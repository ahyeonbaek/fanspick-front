import React from 'react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { Modal } from 'ys-project-ui';
import styles from '../css/mypage/addressSearch.module.css';
import { useUserContext } from '../context/UserContext';

interface AddressSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: Address) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { user } = useUserContext();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      minWidth={400}
      minHeight={300}
      padding={20}
      borderRadius={10}
      className={styles.modal}
    >
      <DaumPostcode className={styles.daumpostcode} onComplete={onComplete} />
      <Modal.Button
        onClick={onClose}
        className={styles.modal_button}
        style={{
          backgroundColor: user?.role === 'manager' ? '#ffacac' : '#ffd700',
        }}
      >
        닫기
      </Modal.Button>
    </Modal>
  );
};

export default AddressSearch;
