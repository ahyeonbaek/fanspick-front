import { FC } from 'react';
import { Modal } from 'ys-project-ui';
import style from '@css/tokenModal.module.css';

interface TokenExpirationProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenExpiration: FC<TokenExpirationProps> = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      minWidth={400}
      minHeight={100}
      backgroundColor="#f9f9f9"
      padding={20}
      borderRadius={8}
    >
      <h2 className={style.tokenH2}>세션 만료</h2>
      <p className={style.tokenP}>토큰이 만료되었습니다. 다시 로그인해주세요.</p>
      <Modal.Button
        onClick={onClose}
        className={style.tokenModalButton}
      >
        로그인
      </Modal.Button>
    </Modal>
  );
};

export default TokenExpiration;