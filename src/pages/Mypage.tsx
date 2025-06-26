import userProfile from '/icons/user_icon.png';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from '@css/mypage/mypage.module.css';
import { Button, Input } from 'ys-project-ui';
import MypageCategories from '@components/categories/MypageCategories';
import { useUserContext } from '@context/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import AWS from 'aws-sdk';
import AddressSearch from '@components/AddressSearch';
import {
  businessNumberPattern,
  emailPattern,
  passwordPattern,
} from '@consts/patterns';
import api from '@utils/api';
import axios from 'axios';

// const ACCESS_KEY_ID = import.meta.env.VITE_ACCESS_KEY_ID;
// const SECRET_ACCESS_KEY = import.meta.env.VITE_SECRET_ACCESS_KEY;
// const REGION = import.meta.env.VITE_REGION;

interface Address {
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
}

const Mypage = () => {
  const [address, setAddress] = useState({
    roadAddress: '',
    zoneCode: '',
    jibunAddress: '',
    detailAddress: '',
  });

  const [previewImg, setPreviewImg] = useState<string>(userProfile);
  const [awsImgAddress, setAwsImgAddress] = useState(''); // 저장된 S3 주소

  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    profileImage: '',
    businessNumber: '',
    provider: '',
  });

  const [isOpen, setIsOpen] = useState(false);
  const { user: loggedInUser, token, updateUser } = useUserContext();

  // AWS S3 설정
  // const configAws = () => {
  //   AWS.config.update({
  //     accessKeyId: ACCESS_KEY_ID, // IAM 사용자 엑세스 키 변경
  //     secretAccessKey: SECRET_ACCESS_KEY, // IAM 엑세스 시크릿키 변경
  //     region: REGION,
  //   });
  //   return new AWS.S3();
  // };

  useEffect(() => {
    if (loggedInUser) {
      console.log('LoggedIn User:', loggedInUser);
      setUpdatedUser({
        name: loggedInUser.name || '',
        email: loggedInUser.email || '',
        password: '',
        role: loggedInUser.role || '',
        profileImage: loggedInUser.profileImage || '',
        businessNumber: loggedInUser.businessNumber || '',
        provider: loggedInUser.provider || 'local',
      });
      setAddress(
        loggedInUser.address || {
          roadAddress: '',
          zoneCode: '',
          jibunAddress: '',
          detailAddress: '',
        },
      );

      setPreviewImg(loggedInUser.profileImage || userProfile);
    }
  }, [loggedInUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'businessNumber') {
      const numericValue = value.replace(/\D/g, '');
      const formattedValue = numericValue
        .replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
        .slice(0, 12);

      setUpdatedUser((prev) => ({ ...prev, businessNumber: formattedValue }));
    } else if (
      ['roadAddress', 'zoneCode', 'jibunAddress', 'detailAddress'].includes(
        name,
      )
    ) {
      setAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClickFile = () => {
    fileInputRef?.current?.click();
  };

  // const uploadToS3 = async (file: File) => {
  //   try {
  //     const s3 = configAws();
  //     const uploadParams = {
  //       Bucket: 'fanspick',
  //       Key: `profile/${file.name}`,
  //       Body: file,
  //     };
  //     const data = await s3.upload(uploadParams).promise();
  //     setAwsImgAddress(data.Location); // 업로드된 URL 저장
  //   } catch (error) {
  //     console.error('이미지 업로드에 실패했습니다.');
  //   }
  // };

  const uploadToS3 = async (file: File) => {
    console.log('file ', file);
    try {
      // 백엔드에서 presigned URL 가져오기
      const response = await api.get('/aws/presigned-url');
      const { url } = response.data;

      // presigned URL을 이용해 S3에 파일 업로드
      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      // console.log('AWS S3 상품메인이미지 업로드 성공 ', data);
      console.log('url2 ', url);

      setAwsImgAddress(url.split('?')[0]); // presigned URL에서 파일 위치 추출
      toast.success('이미지가 성공적으로 업로드되었습니다.');
    } catch (err) {
      console.log('AWS S3 업로드 실패 : ', err);
      toast.error('이미지 업로드에 실패했습니다.');
    }
  };

  const handleChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewImg(previewUrl);
      uploadToS3(file); // 이미지 업로드
    }
  };

  const handleDeleteImg = () => {
    setPreviewImg(userProfile);
    setAwsImgAddress(''); // S3 URL 초기화
    setUpdatedUser((prev) => ({
      ...prev,
      profileImage: userProfile,
    }));
  };

  const handleDaumPost = (data: Address) => {
    setAddress((prev) => ({
      ...prev,
      roadAddress: data.roadAddress,
      jibunAddress: data.jibunAddress,
      zoneCode: data.zonecode,
      detailAddress: prev.detailAddress || '',
    }));
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (updatedUser.provider === 'local' && !updatedUser.password) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    if (
      updatedUser.provider === 'local' &&
      !passwordPattern.test(updatedUser.password)
    ) {
      toast.error(
        '비밀번호는 최소 8자, 문자, 숫자, 특수 문자를 포함해야 합니다.',
      );
      return;
    }

    if (
      updatedUser.provider !== 'kakao' &&
      !emailPattern.test(updatedUser.email)
    ) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (
      updatedUser.role === 'manager' &&
      updatedUser.businessNumber &&
      !businessNumberPattern.test(updatedUser.businessNumber)
    ) {
      toast.error('올바른 사업자번호 형식이 아닙니다. (예: 123-45-67890)');
      return;
    }

    if (!awsImgAddress && updatedUser.profileImage === userProfile) {
      toast.error('프로필 이미지를 업로드 중입니다. 완료 후 다시 시도해주세요.');
      return;
    }

    const userData = {
      ...updatedUser,
      role: loggedInUser?.role, // 기존 role 유지
      provider: loggedInUser?.provider, // 기존 provider 유지
      profileImage: awsImgAddress || updatedUser.profileImage, // S3 URL 사용
      address,
    };

    try {
      const response = await api.put('/oauth/profile-update', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response Data:', response.data);
      if (response.status === 200) {
        toast.success('회원정보 수정 성공');

        const updatedUserData = {
          ...response.data.user,
          role: loggedInUser?.role || response.data.user.role, // 기존 role 유지
          provider: loggedInUser?.provider || response.data.user.provider, // 기존 provider 유지
        };

        updateUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      }
    } catch (error) {
      toast.error('회원정보 수정 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.total}>
      <MypageCategories />
      <div className={styles.edit_box}>
        <div className={styles.imgupload_box}>
          <div className={styles.previewImg_box}>
            <img
              src={previewImg}
              onClick={handleClickFile}
              className={styles.preview_img}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChangeImg}
              className={styles.img_input}
            />
          </div>
          <div className={styles.imgupload_button_box}>
            <Button
              className={styles.imgupload_button}
              onClick={handleClickFile}
              label="사진 업로드"
              style={{
                border: `2px solid ${
                  updatedUser.role === 'manager' ? '#ffacac' : '#ffd700'
                }`,
              }}
            />
            <Button
              className={styles.imgupload_button}
              onClick={handleDeleteImg}
              label="사진 삭제"
              style={{
                border: `2px solid ${
                  updatedUser.role === 'manager' ? '#ffacac' : '#ffd700'
                }`,
              }}
            />
          </div>
        </div>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <label>이름</label>
            <Input
              placeholder="이름"
              name="name"
              value={updatedUser.name}
              onChange={handleChange}
              className={styles.ul_input}
            />
          </li>
          {/* {updatedUser.provider !== 'kakao' && ( */}
          <li className={styles.li}>
            <label>이메일</label>
            <Input
              placeholder="이메일"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
              className={styles.ul_input}
            />
          </li>
          {/* )} */}
          {/* 사업자번호 (매니저만 표시) */}
          {updatedUser.role === 'manager' && (
            <li className={styles.li}>
              <label>사업자번호</label>
              <Input
                type="text"
                placeholder="사업자번호"
                name="businessNumber"
                value={updatedUser.businessNumber}
                onChange={handleChange}
                className={styles.ul_input}
              />
              <p style={{ fontSize: '12px', color: 'blue' }}>
                사업자등록번호는 10자리 숫자여야 합니다.ex) 123-45-67890
              </p>
            </li>
          )}

          <li className={styles.li}>
            <label>주소</label>
            <div className={styles.search_box}>
              <Input
                className={styles.ul_input}
                placeholder="우편번호"
                name="zoneCode"
                value={address.zoneCode || ''}
                onChange={handleChange}
              />
              <Button
                className={styles.edit_button}
                onClick={() => setIsOpen(true)}
                label="주소 검색"
                style={{
                  backgroundColor:
                    updatedUser.role === 'manager' ? '#ffacac' : '#ffd700',
                }}
              />
            </div>
            <AddressSearch
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onComplete={handleDaumPost}
            />
          </li>
          <li className={styles.li}>
            <Input
              className={styles.ul_input}
              placeholder="도로명 주소"
              name="roadAddress"
              value={address.roadAddress || ''}
              onChange={handleChange}
            />
          </li>
          <li className={styles.li}>
            <Input
              className={styles.ul_input}
              placeholder="상세 주소"
              name="detailAddress"
              value={address.detailAddress || ''}
              onChange={handleChange}
            />
          </li>
          {updatedUser.provider === 'local' && (
            <li className={styles.li}>
              <label>비밀번호</label>
              <Input
                placeholder="비밀번호 확인"
                type="password"
                name="password"
                value={updatedUser.password}
                onChange={handleChange}
                className={styles.ul_input}
              />
              <p style={{ fontSize: '12px', color: 'red' }}>
                안전한 회원정보 수정을 위해 비밀번호를 입력해주세요.
              </p>
            </li>
          )}
        </ul>
      </div>
      <p style={{color:"#666", fontSize:"12px"}}>* 사진을 수정할 경우 <span style={{color:"blue"}}>사진 업로드 완료 알림 확인</span>  후 수정버튼을 눌러주세요.</p>
      <div className={styles.edit_button_box}>
        <Button
          onClick={handleSubmit}
          className={styles.edit_button}
          label="회원정보 수정"
          style={{
            backgroundColor:
              updatedUser.role === 'manager' ? '#ffacac' : undefined,
          }}
        />
      </div>
    </div>
  );
};

export default Mypage;
