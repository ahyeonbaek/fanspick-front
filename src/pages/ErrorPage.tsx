import { useNavigate } from 'react-router-dom';
import styles from '@css/ErrorPage.module.css';
import { useUserContext } from '@context/UserContext';

const ErrorPage = ({}) => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const handleHomeClick = () => {
    // if (user?.role === 'user') {
    //   navigate('/');
    // } else if (user?.role === 'manager') {
    //   navigate('/main');
    // }
    navigate('/');
  };

  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title}>404 ERROR</h1>
      <p className={styles.message}>죄송합니다. 페이지를 찾을 수 없습니다.</p>
      <p className={styles.message}>존재하지 않는 주소를 입력하셨거나,</p>
      <p className={styles.message}>
        요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
      </p>
      <img src="/icons/user_header_logo.png" alt="Error Illustration" />
      <button
        className={styles.button}
        onClick={handleHomeClick}
        style={{
          backgroundColor: user?.role === 'manager' ? '#ffacac' : '#ffd700',
        }}
      >
        홈으로
      </button>
    </div>
  );
};

export default ErrorPage;
