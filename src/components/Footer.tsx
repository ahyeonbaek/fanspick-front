import { FC, useMemo } from 'react';
import styles from '../css/footer.module.css';
import facebookIcon from '/icons/facebook.png';
import twitterIcon from '/icons/twitter.png';
import instagramIcon from '/icons/instagram.png';
import linkedinIcon from '/icons/linkedin.png';

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = ({ className }) => {
  const footerCls = useMemo(() => {
    return className
      ? `${className} ${styles.footerContainer}`
      : styles.footerContainer;
  }, [className]);

  return (
    <footer className={footerCls}>
      <div className={styles.footerContent}>
        {/* 저작권 */}
        <div className={styles.footerCopyright}>
          FansPick © 2025. All rights reserved.
        </div>
        {/* 소셜 미디어 */}
        <div className={styles.footerSocial}>
          <a href="#linkedin">
            <img
              src={linkedinIcon}
              alt="LinkedIn"
              className={styles.socialIcon}
            />
          </a>
          <a href="#facebook">
            <img
              src={facebookIcon}
              alt="Facebook"
              className={styles.socialIcon}
            />
          </a>
          <a href="#instagram">
            <img
              src={instagramIcon}
              alt="Instagram"
              className={styles.socialIcon}
            />
          </a>
          <a href="#twitter">
            <img
              src={twitterIcon}
              alt="Twitter"
              className={styles.socialIcon}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
