import { Accordion } from 'ys-project-ui';
import styles from '@/css/faq/user_faq.module.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ys-project-ui';

const UserFaq = () => {
  const navigate = useNavigate(); //

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
              고객센터의 상담시간이 언제인가요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={0} className={styles.accordionContent}>
            <p>고객센터 전화번호: 1588-0000</p>
            <p>
              상담 시간: 평일 오전 9시 30분 ~ 오후 6시 (점심 시간: 오전 11시 30분
              ~ 오후 1시 30분, 주말 및 공휴일 휴무)
            </p>
            <br />
            <p style={{ color: 'red' }}>
              ※ 문의량이 많을 경우 상담 연결 및 답변이 지연될 수 있습니다.
            </p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id={1} className={styles.accordionItem}>
          <Accordion.Header id={1} className={styles.accordionHeader}>
            <Accordion.Trigger index={1} className={styles.accordionTrigger}>
              배송은 언제 되나요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={1} className={styles.accordionContent}>
            <p>
              영업일 기준 오후 1시 이전 결제 완료 주문건: 당일 출고됩니다.{' '}
              <span>(일부 상품 제외)</span>
            </p>
            <br />
            <p>공휴일의 경우 다음 영업일에 출고됩니다.</p>
            <p>
              출고된 경우 서울/수도권 지역은 대부분 다음날 수령, 지방은 1~3일
              이내 배송됩니다.
            </p>
            <p>
              전체 배송 기간은 업무일 기준 3~7일 정도 소요되며, 일부 택배사
              사정에 따라 변동될 수 있습니다.
            </p>
            <br />
            <p style={{ color: 'red' }}>
              ※ 주문 상품이 재고 부족일 경우 배송 시간이 달라질 수 있습니다.
            </p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id={2} className={styles.accordionItem}>
          <Accordion.Header id={2} className={styles.accordionHeader}>
            <Accordion.Trigger index={2} className={styles.accordionTrigger}>
              비회원으로 주문이 가능한가요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={2} className={styles.accordionContent}>
            <p style={{ color: 'red' }}>비회원으로는 주문이 불가능합니다.</p>
            <p>
              일반 로그인, 구글 로그인, 카카오 로그인, 네이버 로그인 중 선택하여
              회원가입 후 주문이 가능합니다.
            </p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id={3} className={styles.accordionItem}>
          <Accordion.Header id={3} className={styles.accordionHeader}>
            <Accordion.Trigger index={3} className={styles.accordionTrigger}>
              소셜로그인은 구글/카카오/네이버 외 다른 로그인은 없나요?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id={3} className={styles.accordionContent}>
            <p>현재는 구글, 카카오, 네이버 3개의 간편로그인만 지원합니다.</p>
            <p>
              해당 계정이 없으실 경우 일반 회원가입 진행 후 이메일 로그인을
              해주시길 바랍니다.
            </p>
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

export default UserFaq;
