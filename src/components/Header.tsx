import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@context/UserContext';
import styles from '@css/header.module.css';
import cartIcon from '/icons/cart_icon.png';
import defaultProfile from '/icons/user_icon.png';
import fanspickLogo from '/icons/user_header_logo.png';
import userMenu from '@consts/user/userHeader';
import managerMenu from '@consts/manager/managerHeader';

interface MenuItem {
  path: string;
  label: string;
}

const Header = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();
  console.log('헤더', user);

  const fullPath =
    window.location.pathname + decodeURIComponent(window.location.search);
  const currentPath = decodeURIComponent(window.location.search); // URL에서 인코딩된 문자열을 디코딩

  // 메뉴 렌더링
  const renderMenu = () => {
    const menu: MenuItem[] = user?.role === 'manager' ? managerMenu : userMenu;

    return menu.map((item, index) => (
      <li key={index} className={styles.navItem}>
        <a
          href={item.path}
          className={`${
            fullPath === item.path || currentPath === item.path
              ? styles.active
              : styles.navLink
          }`}
        >
          {item.label}
        </a>
      </li>
    ));
  };

  return (
    <header
      className={styles.header}
      style={{
        backgroundColor: user?.role === 'manager' ? '#ffacac' : '#ffd700',
      }}
    >
      <div className={styles.headerContent}>
        <a className={styles.logo} onClick={() => navigate('/')}>
          <img
            src={fanspickLogo}
            alt="FansPick Logo"
            className={styles.logoImage}
          />
        </a>
        <nav className={styles.headerNav}>
          <ul className={styles.navList}>{renderMenu()}</ul>
        </nav>

        <div className={styles.icons}>
          {user ? (
            <>
              <span className={styles.logoutText} onClick={logout}>
                logout
              </span>
              <a onClick={() => navigate('/mypage')}>
                <img
                  src={user.profileImage || defaultProfile}
                  alt="Profile"
                  className={styles.profileIcon}
                />
              </a>
              {user.role !== 'manager' && (
                <>
                  <a onClick={() => navigate(`/cart`)}>
                    <img
                      src={cartIcon}
                      alt="Shopping Cart"
                      className={styles.icon}
                    />
                  </a>
                </>
              )}
            </>
          ) : (
            <>
              <span
                className={styles.loginText}
                onClick={() => navigate('/login')}
              >
                Login
              </span>
              <a href="/cart">
                <img
                  src={cartIcon}
                  alt="Shopping Cart"
                  className={styles.icon}
                />
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
