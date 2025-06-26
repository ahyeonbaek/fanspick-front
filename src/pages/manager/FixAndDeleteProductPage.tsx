import { Input, Button } from 'ys-project-ui';
import styles from '@css/manager/fixAndDeleteProductPage.module.css';
import addImg from '/icons/addImg.png';
import cancel from '/icons/cancel.png';
import api from '@utils/api';
import { useUserContext } from '@context/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { addCommas } from '@utils/util';

interface CheckedCategory {
  id: number;
  item: string;
}

const FixAndDeleteProductPage = () => {
  const [managerId, setManagerId] = useState('');
  const [categories, setCategories] = useState([]); // db에서 가져온 카테고리
  const [productName, setproductName] = useState(''); // 상품이름
  const [productPrice, setproductPrice] = useState(''); // 상품가격
  const [productintroduce, setProductIntroduce] = useState(''); // 상품설명
  const [categoryCheckedList, setCategoryCheckedList] = useState<
    CheckedCategory[]
  >([]);
  const [imgUrl, setImgUrl] = useState<string>(''); // 상품이미지
  const [awsImgAddress, setAwsImgAddress] = useState(''); // 상품이미지 저장된 S3 주소
  const [predetailViewUrls, setPreDetailViewUrls] = useState<string[]>([]); // 상세이미지 미리보기 url
  const [awsDetailImgAddress, setAwsDetailImgAddress] = useState<string[]>([]); // 상품상세이미지 저장된 S3 주소

  const imgRef = useRef<HTMLInputElement>(null);
  const imgDetailRef = useRef<HTMLInputElement>(null);
  const navigator = useNavigate();
  const { user } = useUserContext();
  const productId = localStorage.getItem('productId');

  useMemo(() => {
    if (user) {
      setManagerId(user.id);
    }
  }, [user]);

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setproductName(e.target.value);
  };
  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const value = input.replace(/[^0-9]/g, ''); // 문자는 입력못하게
    setproductPrice(value);
  };
  const handleChangeIntroduce = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setProductIntroduce(e.target.value);
  };

  const handleClickFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      const url = URL.createObjectURL(file);
      setImgUrl(url);
      // setImgFile(file);

      const reader = new FileReader();

      reader.onload = (e) => {
        // 파일을 읽은 후 실행할 코드를 정의
        const image = new Image();
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          // console.log(width, height);
          if (width !== height) {
            toast.error('이미지의 크기는 가로 세로 길이가 같아야 합니다.');
            setImgUrl('');
            // setImgFile(null);
          } else {
            uploadToS3(file);
          }
        };
        if (e.target && typeof e.target.result === 'string') {
          image.src = e.target.result; // 이미지 객체가 파일 내용을 로드하게
        }
      };
      reader.readAsDataURL(file); // 실제로 파일을 읽어 onload 실행

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
        } catch (err) {
          console.log('AWS S3 업로드 실패 : ', err);
        }
      };
    }
  };

  const handleCheckedCategory = (
    e: ChangeEvent<HTMLInputElement>,
    value: string,
    id: number,
  ) => {
    const isChecked = e.target.checked;
    categoryCheckedList.shift();

    if (isChecked) {
      setCategoryCheckedList((prev) => [...prev, { id, item: value }]);
    } else {
      setCategoryCheckedList((prev) =>
        prev.filter((item) => item.item !== value),
      );
    }
  };

  /* 상품 상세 이미지 업로드(다중) */
  const handleAddDetailImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 4);

      // 기존 이미지 파일에 새로운 파일추가
      if (e.target.files.length > 3) {
        toast.error('숙소 이미지는 최대 3개까지 등록가능합니다.');
        return;
      }
      // console.log('filesArray ', e.target.files);
      const validFiles: globalThis.File[] = [];
      let checkFiles = 0;

      const uploadMultiToS3 = async (files: File[]) => {
        try {
          // 백엔드에서 presigned URL 가져오기
          const response = await api.get('/aws/presigned-urls', {
            params: { fileCount: files.length },
          });
          const { urls }: { urls: string[] } = response.data;
          console.log('urls ', urls);
          // presigned URLS을 이용해 S3에 파일 업로드
          const uploadFilesS3 = Array.from(files).map((file, index) =>
            axios.put(urls[index], file, {
              headers: {
                'Content-Type': file.type,
              },
            }),
          );

          await Promise.all(uploadFilesS3);

          const uploadedUrls = urls.map((url) => url.split('?')[0]);
          setAwsDetailImgAddress(uploadedUrls);
        } catch (err) {
          console.log('AWS S3 다중업로드 실패 : ', err);
        }
      };

      filesArray.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          // 파일을 읽은 후 실행할 코드를 정의
          const image = new Image();
          image.onload = () => {
            const width = image.width;
            // console.log(width);
            if (width < 900) {
              toast.error('이미지의 가로길이는 최소 900px 이상이어야 합니다. ');
              setPreDetailViewUrls([]);
              // setDetailImageFiles([]);
            } else {
              validFiles.push(file);
            }
            checkFiles++;

            // 모든 파일 검증이 끝난 후 업로드
            if (checkFiles === filesArray.length) {
              if (validFiles.length === filesArray.length) {
                uploadMultiToS3(filesArray);
              }
            }
          };

          if (e.target && typeof e.target.result === 'string') {
            image.src = e.target.result; // 이미지 객체가 파일 내용을 로드하게
          }
        };
        reader.readAsDataURL(file); // 실제로 파일을 읽어 onload 실행
      });

      // setDetailImageFiles(newImageFiles);

      const newPreviewUrls = [...predetailViewUrls];

      filesArray.forEach((file) => {
        const image = window.URL.createObjectURL(file);
        // 생성된 미리보기URL을 임시 배열에 추가
        newPreviewUrls.push(image);
        setPreDetailViewUrls(newPreviewUrls);
        // if (newPreviewUrls.length === newImageFiles.length) {
        //   setPreDetailViewUrls(newPreviewUrls);
        // }
      });
    }
  };

  const handleClickDefaultImage = () => {
    if (imgRef.current) {
      imgRef.current.click();
    }
  };
  const handleClickDefaultDetailImage = () => {
    if (imgDetailRef.current) {
      imgDetailRef.current.click();
    }
  };
  const handleDeleteImage = () => {
    setImgUrl('');
    setAwsImgAddress('');
  };
  const handleDeleteDetailImage = (index: number) => {
    const newImageFiles = awsDetailImgAddress.filter(
      (_, fileIndex) => fileIndex !== index,
    );
    setAwsDetailImgAddress(newImageFiles);

    const newPreviewUrls = predetailViewUrls.filter(
      (_, urlIndex) => urlIndex !== index,
    );
    setPreDetailViewUrls(newPreviewUrls);
  };

  const handleFixConfirm = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const categoryCheckedId = categoryCheckedList.map((prev) => prev.id);
      const categoryIndex = categoryCheckedId[0];
      // console.log("categoryIndex ", categoryIndex);

      const data = {
        _id: productId,
        userId: managerId,
        name: productName,
        price: productPrice,
        introduce: productintroduce,
        categoryIndex: categoryIndex,
        image: awsImgAddress,
        detailImage: awsDetailImgAddress,
      };

      const response = await api.put('/manager/product', data);
      // console.log('response data ', response.data);

      if (response.status === 204) {
        toast.success('상품 수정이 완료되었습니다.');
        navigator('/select-product');
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 400) {
        console.log('입력이 안된 필드값이 있습니다. 다시 시도해 주세요. ', err);
      } else if (err.response?.status === 500) {
        console.log('internal error ', err);
      }
    }
  };

  const handleClickSubmitConfirmToast = () => {
    if (awsImgAddress === '') {
      toast.error('상품이미지를 등록해주세요');
      return;
    }
    if (!productName) {
      toast.error('상품 이름을 등록해주세요');
      return;
    }

    if (!productPrice) {
      toast.error('상품 가격을 등록해주세요');
      return;
    }
    if (!productintroduce) {
      toast.error('상품 설명을 등록해주세요');
      return;
    }
    if (categoryCheckedList.length === 0) {
      toast.error('카테고리를 등록해주세요');
      return;
    }
    if (predetailViewUrls.length === 0) {
      toast.error('상품상세이미지를 등록해주세요');
      return;
    }

    toast.info(
      <div className={styles.customToastDiv}>
        <p>정말로 수정하시겠습니까?</p>
        <Button style={{zIndex:'1000', marginTop:"10px"}} onClick={handleFixConfirm} label="수정"></Button>
        <Button style={{zIndex:'1000'}}  onClick={() => toast.dismiss()} label="취소"></Button>
      </div>,
      { autoClose: false, draggable: false, className: "customToastDiv" },
    );
  };

  const handleDeleteConfirm = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await api.delete(`/manager/product/${productId}`);
      if (response.status === 204) {
        toast.success('상품 삭제가 완료되었습니다.');
        navigator('/select-product');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickDeleteConfirmToast = () => {
    toast.info(
      <div className={styles.customToastDiv}>
        <p>정말로 삭제하시겠습니까?</p>
        <Button style={{zIndex:'1000', marginTop:"10px"}} onClick={handleDeleteConfirm} label="삭제"></Button>
        <Button style={{zIndex:'1000'}}  onClick={() => toast.dismiss()} label="취소"></Button>
      </div>,
      { autoClose: false, draggable: false },
    );
  };

  const getCategory = async () => {
    try {
      const response = await api.get('/manager/category');
      if (response.status === 200) {
        // console.log('프론트 카테고리 가져오기 성공', response.data.data);
        const category = response.data.data[0].name;
        setCategories(category);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getProduct = async () => {
    try {
      const response = await api.get(`/manager/product/${productId}`);
      if (response.status === 200) {
        console.log('단일 상품정보 가져오기 성공', response.data.product);
        const productData = response.data.product;
        setproductName(productData.name);
        setproductPrice(productData.price);
        setProductIntroduce(productData.introduce);
        setImgUrl(productData.image);
        setAwsImgAddress(productData.image);
        setPreDetailViewUrls(productData.detailImage);
        setAwsDetailImgAddress(productData.detailImage);
        setCategoryCheckedList([{ id: 0, item: productData.category.name[0] }]);

        // console.log('categoryCheckedList ', categoryCheckedList);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCategory();
    getProduct();
  }, []);
  return (
    <>
      <div className={styles.body}>
        <div className={styles.main}>
          <h1>상품상세조회</h1>
        </div>
        <div className={styles.addProduct}>
          <section className={styles.addProductInfo}>
            <div className={styles.addProductPhoto}>
              <Input.Label>
                상품이미지 (가로와 세로 크기가 같아야 등록가능)
              </Input.Label>
              {!imgUrl && (
                <div className={styles.addProductPhotoDiv}>
                  <img
                    className={styles.addProductPhotoPreviewImg}
                    alt="기본 이미지"
                    onClick={handleClickDefaultImage}
                    src={addImg}
                  />
                  <input
                    className={styles.addProductPhotoInput}
                    type="file"
                    id="productImg"
                    accept="image/*"
                    onChange={handleClickFile}
                    ref={imgRef}
                  />
                  <input
                    className={styles.addProductPhotoInput}
                    type="file"
                    id="productImg"
                    accept="image/*"
                    onChange={handleClickFile}
                    ref={imgRef}
                  />
                </div>
              )}

              {imgUrl && (
                <div className={styles.addProductImgContainer}>
                  <div>
                    <img
                      className={styles.addProductPhotoImg}
                      src={imgUrl}
                      alt=""
                      onClick={handleClickDefaultImage}
                    />
                    <img src={cancel} alt="x버튼" className={styles.cancel} />
                    <div
                      className={styles.overlay}
                      onClick={() => handleDeleteImage()}
                    >
                      <p className={styles.deleteImg}>삭제</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.inputWrap}>
              <div className={styles.input}>
                <Input.Label>상품이름</Input.Label>
                <input
                  type="text"
                  placeholder="상품이름"
                  onChange={handleChangeName}
                  value={productName}
                />
              </div>
              <div className={styles.input}>
                <Input.Label>가격</Input.Label>
                <input
                  type="text"
                  placeholder="가격"
                  onChange={handleChangePrice}
                  value={addCommas(Number(productPrice))}
                />
              </div>
            </div>
            <div className={styles.input}>
              <Input.Label>상품설명</Input.Label>
              <textarea
                typeof="text"
                placeholder="상품설명"
                rows={4}
                onChange={handleChangeIntroduce}
                value={productintroduce}
                className={styles.textarea}
              />
            </div>
            <Input.Label>카테고리</Input.Label>
            <div className={styles.inputCategory}>
              {categories.map((item, index) => (
                <div key={index} className={styles.inputCategoryLabel}>
                  <Input
                    type="checkbox"
                    id={item}
                    checked={categoryCheckedList.some(
                      (prev) => prev.item === item,
                    )}
                    onChange={(e) => handleCheckedCategory(e, item, index)}
                  />
                  <Input.Label htmlFor={item}>{item}</Input.Label>
                </div>
              ))}
            </div>
            <div className={styles.input}>
              <label>
                상품상세이미지 (최대3개, 이미지는 최소 가로 900px 이상)
              </label>
              {predetailViewUrls.length < 1 && (
                <div className={styles.addProductPhotoDiv}>
                  <img
                    className={styles.addProductPhotoPreviewImg}
                    alt="기본 이미지"
                    onClick={handleClickDefaultDetailImage}
                    src={addImg}
                  />
                  <input
                    className={styles.addProductPhotoInput}
                    type="file"
                    id="productDetailImg"
                    accept="image/*"
                    onChange={handleAddDetailImages}
                    ref={imgDetailRef}
                    multiple
                  />
                </div>
              )}
              <div className={styles.addProductDetailImgContainer}>
                {predetailViewUrls.map((url, i) => (
                  <div key={i} className={styles.imageContainer}>
                    <img
                      className={styles.addProductPhotoDetailImg}
                      src={url}
                      alt={`Image preview ${i + 1}`}
                    />
                    <div
                      className={styles.overlayDetail}
                      onClick={() => handleDeleteDetailImage(i)}
                    >
                      <p className={styles.deleteDetailImg}>삭제</p>
                      <img src={cancel} alt="x버튼" className={styles.cancel} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <Button
                className={styles.submitButton}
                label="상품수정하기"
                type="button"
                onClick={handleClickSubmitConfirmToast}
              ></Button>
              <Button
                className={styles.submitButton}
                label="상품삭제하기"
                type="button"
                onClick={handleClickDeleteConfirmToast}
              ></Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default FixAndDeleteProductPage;
