import styles from '@css/faq.module.css';

const FaqPage = () => {
  return (
    <div className={styles.content_wrap}>
      <div>
        <p>FAQ</p>
        <h2>자주 묻는 질문은 여기서 확인하세요!</h2>
      </div>
      <ul>
        <li>
          <a>회원가입은 어떻게 하나요?</a>
          <button>+</button>
        </li>
        <li>
          <a>주문 내역은 어디서 확인 하나요?</a>
          <button>+</button>
        </li>
        <li>
          <a>회원정보 변경은 어디서 하나요?</a>
          <button>+</button>
        </li>
        <li>
          <a>작성한 리뷰 수정은 어떻게 하나요?</a>
          <button>+</button>
        </li>
        <li>
          <a>즐겨찾기 기능은 무엇인가요?</a>
          <button>+</button>
        </li>
      </ul>
    </div>
  );
};

export default FaqPage;
