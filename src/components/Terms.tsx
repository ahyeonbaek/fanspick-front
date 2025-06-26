import styles from '@css/terms.module.css';

const Terms = () => {
  return (
    <div className={styles.termsContainer}>
      <h1 className={styles.h1}>FansPick 이용 약관</h1>

      <h2 className={styles.h2}>제1조 (목적)</h2>
      <p className={styles.p}>
        이 약관은 FansPick(이하 “몰”이라 한다)이 제공하는 인터넷 서비스(이하
        “서비스”라 한다)를 이용함에 있어, “몰”과 이용자의 권리, 의무 및
        책임사항을 규정함을 목적으로 합니다.
      </p>

      <h2 className={styles.h2}>제2조 (정의)</h2>
      <ul className={styles.ul}>
        <li className={styles.li}>
          ① “몰”이란 FansPick이 재화 또는 용역을 이용자에게 제공하기 위해 설정한
          온라인 플랫폼을 의미합니다.
        </li>
        <li className={styles.li}>
          ② “이용자”란 “몰”에 접속하여 이 약관에 따라 “몰”이 제공하는 서비스를
          이용하는 회원 및 비회원을 의미합니다.
        </li>
        <li className={styles.li}>
          ③ “회원”이란 “몰”에 회원가입을 통해 등록한 자로서, 지속적으로 “몰”의
          서비스를 이용할 수 있는 자를 의미합니다.
        </li>
        <li className={styles.li}>
          ④ “비회원”이란 회원가입 없이 “몰”의 서비스를 이용하는 자를 의미합니다.
        </li>
      </ul>

      <h2 className={styles.h2}>제3조 (약관의 명시 및 개정)</h2>
      <ul className={styles.ul}>
        <li className={styles.li}>
          ① “몰”은 이 약관의 내용, 상호, 대표자 성명, 주소, 연락처,
          사업자등록번호 등을 이용자가 확인할 수 있도록 “몰” 초기 화면에
          게시합니다.
        </li>
        <li className={styles.li}>
          ② 약관을 개정할 경우, 개정된 내용과 적용일자를 최소 7일 전에 “몰” 초기
          화면에 공지합니다. 단, 이용자에게 불리한 약관 변경의 경우, 30일 이상
          공지합니다.
        </li>
        <li className={styles.li}>
          ③ 개정된 약관은 적용일 이후 체결된 계약에만 적용되며, 기존 계약에는
          개정 전 약관이 적용됩니다.
        </li>
      </ul>

      <h2 className={styles.h2}>제4조 (서비스의 제공 및 변경)</h2>
      <ul className={styles.ul}>
        <li className={styles.li}>
          ① “몰”은 다음과 같은 업무를 수행합니다:
          <ul className={styles.ul}>
            <li className={styles.li}>
              - 재화 또는 용역에 대한 정보 제공 및 구매계약 체결
            </li>
            <li className={styles.li}>
              - 구매계약이 체결된 재화 또는 용역의 배송
            </li>
            <li className={styles.li}>- 기타 “몰”이 정하는 서비스 제공</li>
          </ul>
        </li>
        <li className={styles.li}>
          ② “몰”은 재화 등의 품절 또는 기술적 사양 변경 등의 경우, 제공 내용을
          변경할 수 있으며, 이를 공지합니다.
        </li>
      </ul>
    </div>
  );
};

export default Terms;
