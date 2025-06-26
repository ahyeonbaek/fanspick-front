import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'ys-project-ui';
import api from '@utils/api';
import styles from '@css/login.module.css';
import showPasswordIcon from '/icons/showPassword.png';
import hidePasswordIcon from '/icons/hidePassword.png';
import kakaoLoginIcon from '/icons/kakao_login.png';
import googleLoginIcon from '/icons/google_login.png';
import naverLoginIcon from '/icons/naver_login.png';
import { useUserContext } from '@context/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleCartMerge } from './user/categories/ProductDetail';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
    id: '',
    name: '',
    role: '',
    profileImage: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saveEmail, setSaveEmail] = useState(false);

  const { updateUser, updateToken } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setUser((prev) => ({ ...prev, email: savedEmail }));
      setSaveEmail(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSaveEmailChange = () => {
    setSaveEmail((prev) => {
      const newSaveEmail = !prev;
      if (newSaveEmail) {
        localStorage.setItem('savedEmail', user.email);
      }
      if (!newSaveEmail) {
        localStorage.removeItem('savedEmail');
      }
      return newSaveEmail;
    });
  };

  const handleLogin = async () => {
    const { email, password } = user;

    if (!email.trim() || !password.trim()) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (saveEmail) {
      localStorage.setItem('savedEmail', email);
    }

    try {
      const response = await api.post('/oauth/login', { email, password });

      if (response.status === 200) {
        const userData = response.data.user;
        const token = response.data.token;
        const tokenExpiry = response.data.tokenExpiry;

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', tokenExpiry.toString());

        updateUser(userData);
        updateToken(token);
        toast.info(`${userData.name}님 안녕하세요!`);
        handleCartMerge(userData.id);

        if (userData.role === 'user') {
          navigate('/'); // 일반 사용자
        } else if (userData.role === 'manager') {
          navigate('/'); // 관리자
        } else {
          console.log('알 수 없는 사용자입니다.');
        }
      }
    } catch (error) {
      console.log('로그인 실패. 다시 시도하세요.');
    }
  };

  // 간편로그인
  const handleClickOauth = (loginType: string) => {
    window.location.href = `/api/oauth/${loginType}`;
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>로그인</h1>
      <form className={styles.form}>
        <Input.Box className={styles.inputRow}>
          <Input.Label className={styles.inputLabel}>이메일</Input.Label>
          <Input
            type="email"
            name="email"
            value={user?.email || ''}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="이메일을 입력해주세요"
            required
          />
        </Input.Box>

        <div className={styles.passwordRow}>
          <Input.Box className={styles.inputRow}>
            <Input.Label className={styles.inputLabel}>비밀번호</Input.Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={user.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="비밀번호를 입력해주세요"
              required
            />
          </Input.Box>
          <img
            src={showPassword ? hidePasswordIcon : showPasswordIcon}
            alt={showPassword ? 'Hide Password' : 'Show Password'}
            className={styles.showPasswordIcon}
            onClick={toggleShowPassword}
          />
        </div>

        {/* 이메일 저장 체크박스 추가 */}
        <div className={styles.saveEmailRow}>
          <Input.Box className={styles.inputBox}>
            <Input.Label htmlFor="saveEmail" className={styles.saveEmailLabel}>
              이메일 저장하기
            </Input.Label>
            <Input
              type="checkbox"
              id="saveEmail"
              className={styles.saveEmailCheckbox}
              checked={saveEmail || false}
              onChange={handleSaveEmailChange}
            />
          </Input.Box>
        </div>

        <Button
          type="button"
          label="로그인"
          onClick={handleLogin}
          className={styles.loginButton}
        />
      </form>

      <div className={styles.simpleLogin}>
        <hr className={styles.separator} />
        <span className={styles.simpleLoginText}>간편로그인</span>
        <hr className={styles.separator} />
      </div>

      {/* oauth 추가 예정 */}
      <div className={styles.socialLogin}>
        <img
          src={googleLoginIcon}
          alt="Google Login"
          className={styles.socialButton}
          onClick={() => handleClickOauth('google')}
        />
        <img
          src={kakaoLoginIcon}
          alt="Kakao Login"
          className={styles.socialButton}
          onClick={() => handleClickOauth('kakao')}
        />
        <img
          src={naverLoginIcon}
          alt="Naver Login"
          className={styles.socialButton}
          onClick={() => handleClickOauth('naver')}
        />
      </div>

      <p className={styles.signupPrompt}>
        계정이 없으신가요?{' '}
        <span onClick={() => navigate('/signup')} className={styles.signupLink}>
          회원가입
        </span>
      </p>
    </div>
  );
}

export default Login;
