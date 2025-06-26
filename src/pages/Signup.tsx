import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordPattern, emailPattern } from '@consts/patterns';
import { Input, Button, Modal } from 'ys-project-ui';
import styles from '@css/signup.module.css';
import Terms from '@components/Terms';
import api from '@utils/api';
import { toast } from 'react-toastify';

function Signup() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSignup = async () => {
    const { name, email, password, confirmPassword, role,  } = user;

    if (!name.trim()) {
      toast.error('이름을 입력해주세요.');
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (!passwordPattern.test(password)) {
      toast.error(
        '비밀번호는 최소 8자, 문자, 숫자, 특수 문자를 포함해야 합니다.',
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isTermsChecked) {
      toast.error('약관에 동의하셔야 회원가입이 가능합니다.');
      return;
    }

    try {
      const response = await api.post('/oauth/signup', {
        name,
        email,
        password,
        role,
        termsAccepted: isTermsChecked,
      });

      if (response.status === 201) {
        toast.success('회원가입 성공!');
        navigate('/login');
      }
    } catch (error) {
      console.error('회원정보 가입 실패. 다시 시도해주세요.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleCheckboxChange = () => {
    setIsTermsChecked((prev) => !prev);
  };

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.title}>회원가입</h1>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <Input.Box className={styles.inputRow}>
            <Input.Label className={styles.inputLabel}>이름</Input.Label>
            <Input
              type="text"
              name="name"
              value={user.name || ''}
              onChange={handleChange('name')}
              className={styles.input}
              placeholder="이름을 입력해주세요"
              required
            />
          </Input.Box>

          <Input.Box className={styles.inputRow}>
            <Input.Label className={styles.inputLabel}>이메일</Input.Label>
            <Input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange('email')}
              className={styles.input}
              placeholder="이메일을 입력해주세요"
              required
            />
          </Input.Box>
        </div>

        <Input.Box className={styles.inputRow}>
          <Input.Label className={styles.inputLabel}>비밀번호</Input.Label>
          <Input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange('password')}
            className={styles.input}
            placeholder="비밀번호를 입력해주세요"
            required
          />
        </Input.Box>

        <p className={styles.password_guide}>
          비밀번호는 최소 8자, 문자, 숫자, 특수 문자를 포함해야 합니다.
        </p>

        <Input.Box className={styles.inputRow}>
          <Input.Label className={styles.inputLabel}>비밀번호 확인</Input.Label>
          <Input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange('confirmPassword')}
            className={styles.input}
            placeholder="비밀번호를 다시 입력해주세요"
            required
          />
        </Input.Box>

        {/* 역할 선택 */}
        <div className={styles.roleSelection}>
          <hr className={styles.separator} />
          <span className={styles.roleSelectionText}>
            회원 유형을 선택해주세요
          </span>
          <hr className={styles.separator} />
        </div>
        <div className={styles.roleSelection}>
          <Input.Box className={styles.roleBox}>
            <Input
              type="radio"
              name="role"
              value="user"
              checked={user.role === 'user'}
              onChange={handleChange('role')}
              className={styles.radio}
            />
            <Input.Label>사용자</Input.Label>
          </Input.Box>
          <Input.Box className={styles.roleBox}>
            <Input
              type="radio"
              name="role"
              value="manager"
              checked={user.role === 'manager'}
              onChange={handleChange('role')}
              className={styles.radio}
            />
            <Input.Label>사장님</Input.Label>
          </Input.Box>
        </div>

        {/* 약관 동의 및 약관 보기 */}
        <div className={styles.checkboxRow}>
          <Input.Box className={styles.checkboxBox}>
            <Input.Label htmlFor="terms" className={styles.checkboxLabel}>
              약관에 동의합니다. <span>(필수)</span>
            </Input.Label>
            <Input
              type="checkbox"
              id="terms"
              checked={isTermsChecked}
              onChange={handleCheckboxChange}
              className={styles.checkbox}
            />
          </Input.Box>
          <span onClick={openModal} className={styles.termsLink}>
            약관 보기
          </span>
        </div>

        <Button
          type="button"
          label="회원가입"
          onClick={handleSignup}
          className={styles.signupButton}
        />
      </form>

      <p className={styles.loginPrompt}>
        이미 계정이 있으신가요?{' '}
        <span onClick={() => navigate('/login')} className={styles.loginLink}>
          로그인
        </span>
      </p>

      {/* 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        minWidth={600}
        minHeight={400}
        backgroundColor={'#ffffff'}
        padding={20}
        borderRadius={8}
      >
        <Terms />
        <Modal.Button
          onClick={() => {
            setIsTermsChecked(true);
            closeModal();
          }}
          className={styles.modalButton}
        >
          약관 동의하기
        </Modal.Button>
      </Modal>
    </div>
  );
}

export default Signup;