import { Accordion } from 'ys-project-ui';
import styles from '@css/faq/manager_faq.module.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ys-project-ui';

const MainPage = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faq}>FAQ</div>
      <h2 className={styles.h2}>자주 묻는 질문은 여기서 확인하세요!</h2>
      <Accordion className="custom-accordion">
        <Accordion.Item id={0} className={styles.accordionItem}>
          <Accordion.Header id={0} className={styles.accordionHeader}>
            <Accordion.Trigger index={0} className={styles.accordionTrigger}>
              상품 등록은 어떻게 하나요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={0} className={styles.accordionContent}>
            <p>상품은 홈 화면 상단에 있는 상품등록 페이지에서 가능합니다.</p>
            <p>해당 상품의 정보를 자세하게 입력해주시길 바랍니다.</p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id={1} className={styles.accordionItem}>
          <Accordion.Header id={1} className={styles.accordionHeader}>
            <Accordion.Trigger index={1} className={styles.accordionTrigger}>
              등록한 상품을 수정 또는 삭제할 수 있나요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={1} className={styles.accordionContent}>
            <p>등록한 상품을 수정 또는 삭제가 가능합니다.</p>
            <p>홈 화면 상단에 있는 상품조회 페이지에서 가능합니다.</p>
            <br />
            <p style={{ color: 'red' }}>
              ※ 등록한 상품을 삭제 시 되돌릴 수 없습니다.
            </p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id={2} className={styles.accordionItem}>
          <Accordion.Header id={2} className={styles.accordionHeader}>
            <Accordion.Trigger index={2} className={styles.accordionTrigger}>
              사업자 번호를 어디에서 작성하나요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={2} className={styles.accordionContent}>
            <p>
              우측 상단 프로필을 누르시면 마이페이지에서 사업자번호를 등록할 수
              있습니다.
            </p>
            <p style={{ color: 'red' }}>
              안전한 거래를 위해 사업자번호를 등록해주세요.
            </p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id={3} className={styles.accordionItem}>
          <Accordion.Header id={3} className={styles.accordionHeader}>
            <Accordion.Trigger index={3} className={styles.accordionTrigger}>
              상품 상세는 꼭 이미지로만 등록해야하나요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={3} className={styles.accordionContent}>
            <p style={{ color: 'red' }}>상세 이미지는 필수는 아닙니다.</p>
            <br />
            <p>
              사용자가 해당 상품의 정보를 알 수 있게 사진을 첨부하는 것을
              추천드립니다.
            </p>
            <p>
              상품상세 사진 외 상품 설명을 추가하여 더 자세한 정보를 전달할 수
              있습니다.
            </p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id={4} className={styles.accordionItem}>
          <Accordion.Header id={4} className={styles.accordionHeader}>
            <Accordion.Trigger index={4} className={styles.accordionTrigger}>
              소셜로그인은 구글/카카오/네이버 외 다른 로그인은 없나요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={4} className={styles.accordionContent}>
            <p>현재는 구글, 카카오, 네이버 3개의 간편로그인만 지원합니다.</p>
            <p>
              해당 계정이 없으실 경우 일반 회원가입 진행 후 이메일 로그인을
              해주시길 바랍니다.
            </p>
            <br />
            <div className={styles.buttonContainer}>
              <Button
                type="button"
                label="회원가입"
                onClick={handleSignup}
                className={styles.signupButton}
              />
              <Button
                type="button"
                label="로그인"
                onClick={handleLogin}
                className={styles.loginButton}
              />
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default MainPage;