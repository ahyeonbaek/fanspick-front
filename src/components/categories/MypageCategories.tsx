import { FC } from 'react';
import { Button } from 'ys-project-ui';
import styles from '@css/mypage/mypage.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '@context/UserContext';
import userCategories from '@consts/user/userCategories';

interface Category {
  path: string;
  label: string;
}


interface Header {
  className?: string;
}

const MypageHeader: FC<Header> = (props) => {
  const { className } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserContext();

  const isActive = (path: string) => location.pathname === path;

  const categories: Category[] = user?.role === 'user' ? userCategories : [];

  return (
    <div className={className}>
      <div className={styles.h1_box}>
        <h1 className={styles.h1}>마이페이지</h1>
      </div>
      <div className={styles.button_box}>
        {categories.map((category) => (
          <Button
            key={category.path}
            className={`${styles.buttons} ${
              isActive(category.path) ? styles.active : ''
            }`}
            label={category.label}
            onClick={() => navigate(category.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default MypageHeader;
