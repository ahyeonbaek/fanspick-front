import { useNavigate, useParams } from 'react-router-dom';
import styles from '@css/product/productDetail.module.css';
import { Button, Tabs } from 'ys-project-ui';
import { useEffect, useState } from 'react';
import ProductCount from '@components/product/ProductCount';
// import ReviewBox from '../../../components/review/ReviewBox';
// import profileImg from '/icons/user_icon.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@utils/api';
import { useUserContext } from '@context/UserContext';
import ProductReviewPage from '../review/ProductReviews';
import { addCommas } from '../../../utils/util';

interface ProductDetailProps {
  _id: string;
  name: string;
  price: number;
  introduce: string;
  image: string;
  category: {
    name: string[];
  };
  detailImage: string[];
}
interface CartItem {
  productId: string;
  quantity: number;
}

const ProductDetail = () => {
  const [getProduct, setGetProduct] = useState<ProductDetailProps>();
  const { id } = useParams<{ id: string }>();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const onChangeTab = (index: number) => {
    setActiveTab(index);
  };
  const navigate = useNavigate();
  const { user } = useUserContext();

  /* 장바구니 로컬 스토리지 저장 */
  const handleAddCart = () => {
    const userId = user?.id || 'guest';

    // 사용자별 장바구니 키 생성
    const cartKey = `cart_${userId}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');

    const isAlreadyCart = cartItems.some(
      (item: any) => item.productId === getProduct?._id,
    );

    /* 장바구니에 만약 같은 상품이 있다면 수량을 더해서 저장*/
    if (isAlreadyCart) {
      const updatedCartItems = cartItems.map((product: any) =>
        product.productId === getProduct?._id
          ? { ...product, quantity: product.quantity + quantity } // 수량 추가
          : product,
      );
      localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
      toast.success('장바구니에 수량이 추가되었습니다.');
    } else {
      const cartInfo = { productId: getProduct?._id, quantity };
      cartItems.push(cartInfo);
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      toast.success('장바구니에 추가되었습니다.');
    }
  };

  /* 즐겨찾기 로컬 스토리지 저장 */
  const handleAddFavorites = () => {
    const userId = user?.id;
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    // 사용자별 즐겨찾기 키 생성
    const favoritesKey = `favorite_${userId}`;
    const favoriteItems = JSON.parse(
      localStorage.getItem(favoritesKey) || '[]',
    );

    if (!getProduct?._id) {
      toast.error('상품 정보가 유효하지 않습니다.');
      return;
    }

    const isAlreadyFavorite = favoriteItems.some(
      (item: any) => item.productId === getProduct._id,
    );

    if (!isAlreadyFavorite) {
      const updatedFavorites = [
        ...favoriteItems,
        { productId: getProduct._id },
      ];
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
      toast.success('즐겨찾기에 추가되었습니다.');
    } else {
      toast.warning('이미 즐겨찾기에 있는 상품입니다.');
    }
  };

  /* 상품 데이터 불러오기 */
  const getAllProduct = async () => {
    try {
      const response = await api.get(`/manager/product/${id}`);

      if (response.status === 200) {
        setGetProduct(response.data.product);
      }
    } catch (err) {
      console.error('에러');
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  if (!getProduct) {
    return;
  }

  /* 상품 데이터 주문 페이지로 그대로 전달 */
  const handleBuyClick = () => {
    if (getProduct) {
      const productDetails = [
        { detail: getProduct, totalPrice: getProduct.price * quantity },
      ];
      /* navigate('/order', {
        state: { product: [{ detail: getProduct, quantity }] },
      }); */
      navigate('/order', {
        state: { product: productDetails, quantity: [quantity] },
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.productDetailWrapper}>
        {/* 상품 이미지 */}
        <div className={styles.productImageBox}>
          <img
            src={getProduct.image}
            alt="상품 이미지"
            className={styles.productImage}
          />
        </div>
        {/* 상품 정보 */}
        <div className={styles.productInfoBox}>
          <h1 className={styles.productTitle}>{getProduct.name}</h1>
          <p className={styles.productPrice}>{addCommas(getProduct.price)}원</p>
          <p className={styles.productDescription}>{getProduct.introduce}</p>
          <ProductCount onChange={setQuantity} />
          <Button
            label="구매하기"
            className={styles.buyButton}
            onClick={handleBuyClick}
          />
          <div className={styles.secondBtnWrap}>
            <Button label="장바구니" onClick={handleAddCart} />
            <Button label="즐겨찾기" onClick={handleAddFavorites} />
          </div>
        </div>
      </div>
      <Tabs
        onChangeTab={onChangeTab}
        defaultTabIndex={0}
        className={styles.tabs}
      >
        <Tabs.MenuList className={styles.tabsMenuList}>
          <Tabs.Menu
            className={`${styles.tabsMenu} ${
              activeTab === 0 ? styles.active : ''
            }`}
          >
            설명
          </Tabs.Menu>
          <Tabs.Menu
            className={`${styles.tabsMenu} ${
              activeTab === 1 ? styles.active : ''
            }`}
          >
            리뷰
          </Tabs.Menu>
        </Tabs.MenuList>
        <Tabs.Pannel className={styles.tabsPannel}>
          <div className={styles.detailImageWrap}>
            {getProduct.detailImage.map((image, index) => (
              <img
                key={index}
                src={image}
                className={styles.detailImage}
                alt="상품 상세 이미지"
              />
            ))}
          </div>
        </Tabs.Pannel>
        <Tabs.Pannel>
          <ProductReviewPage productId={getProduct._id} />
        </Tabs.Pannel>
      </Tabs>
    </div>
  );
};

export const handleCartMerge = (userId: string) => {
  const guestCartKey = 'cart_guest';
  const userCartKey = `cart_${userId}`;

  const guestCart = JSON.parse(localStorage.getItem(guestCartKey) || '[]');
  const userCart = JSON.parse(localStorage.getItem(userCartKey) || '[]');

  const mergedCart: CartItem[] = [...userCart];

  guestCart.forEach((guestItem: CartItem) => {
    const existingItemIndex = mergedCart.findIndex(
      (item) => item.productId === guestItem.productId,
    );
    /* findIndex는 일치하는 항목이 없으면 -1을 반환함 */

    if (existingItemIndex >= 0) {
      // 동일 상품이 있을 경우 수량을 합산
      mergedCart[existingItemIndex].quantity += guestItem.quantity;
    } else {
      mergedCart.push(guestItem);
    }
  });

  localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
  localStorage.removeItem(guestCartKey);
};

export default ProductDetail;
