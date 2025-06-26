import { useEffect, useState } from 'react';
import cartStyles from '@css/mypage/mypageCart.module.css';
import tableStyles from '@css/productTable/productTable.module.css';
import noticeImg from '/icons/alert-circle.png';
import ProductTableHeader from '@components/productTable/ProductTableHeader';
import ProductTableMenu from '@components/productTable/ProductTableMenu';
import { useNavigate } from 'react-router-dom';
import { Button, Pagination } from 'ys-project-ui';
import MypageHeader from '@components/categories/MypageCategories';
import { toast } from 'react-toastify';
import trash from '/icons/trash.png';
import api from '@utils/api';
import paginationStyles from '@/css/pagination.module.css';
import userPaginationStyles from '@/css/userPagination.module.css';
import { addCommas } from '@utils/util';
import { useUserContext } from '@context/UserContext';

interface Cart {
  productId: string;
  quantity: number;
}

interface Detail {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const MypageCart = () => {
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState<Cart[]>([]);
  const { user } = useUserContext();
  const [cart, setCart] = useState<Cart[]>([]); //로컬에서 가져온 장바구니 내역
  const [isDetail, setIsDetail] = useState<Detail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cartsPerPage = 5;

  const userId = user?.id;
  const cartKey = userId ? `cart_${userId}` : 'cart_guest';

  useEffect(() => {
    // 로그인 상태와 비로그인 상태 일때
    const cartData = localStorage.getItem(cartKey);
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, [userId]); // userId가 변경될 때마다 실행

  const saveCartToLocalStorage = () => {
    localStorage.setItem(cartKey, JSON.stringify(cart)); // 장바구니 상태 로컬스토리지에 저장
  };

  useEffect(() => {
    saveCartToLocalStorage();
  }, [cart]); // cart 상태 변경시마다 로컬스토리지에 반영

  //장바구니 내역 가져오기
  const localCart = JSON.parse(localStorage.getItem(cartKey) || '[]');

  useEffect(() => {
    if (localCart) {
      setCart(localCart);
    }
  }, []);

  useEffect(() => {
    console.log('cart 상태', cart);
  }, [cart]);

  useEffect(() => {
    const getProductDetail = async () => {
      if (!cart || cart.length === 0) return; //

      const ids = cart.map((item) => item.productId); // 상품의 아이디만 담은 배열

      try {
        const response = await api.get('/mypage/productbyids', {
          params: { ids },
        }); //장바구니에 담긴 상품의 id를 전달

        console.log(response.data.productDetail);
        setIsDetail(response.data.productDetail);
      } catch (err) {
        console.error('장바구니 상품 조회 실패', err);
      }
    };

    getProductDetail();
  }, [cart]);

  //장바구니 내역 전체 삭제하기
  const deleteCart = () => {
    setCart([]);
  };

  //수량 빼기
  const handleDown = (id: string) => {
    setCart((prevCart) =>
      prevCart.map(
        (product) =>
          product.productId === id && product.quantity > 1
            ? { ...product, quantity: product.quantity - 1 } // 장바구니 수량 감소
            : product, // 다른 상품은 변경하지 않음
      ),
    );
    setIsSelected((prev) =>
      prev.map(
        (product) =>
          product.productId === id && product.quantity > 0
            ? { ...product, quantity: product.quantity - 1 } // 선택된 상품 수량 감소
            : product, // 다른 상품은 변경하지 않음
      ),
    );
  };

  //수량 더하기
  const handleUp = (id: string) => {
    setCart((prevCart) =>
      prevCart.map(
        (product) =>
          product.productId === id
            ? { ...product, quantity: product.quantity + 1 } // 수량 증가
            : product, // 다른 상품은 변경 하지 않음
      ),
    );
    setIsSelected((prev) =>
      prev.map(
        (product) =>
          product.productId === id && product.quantity > 0
            ? { ...product, quantity: product.quantity + 1 } // 선택된 상품 수량 증가
            : product, // 다른 상품은 변경하지 않음
      ),
    );
  };

  const isChecked = (id: string) =>
    isSelected.some((product) => product.productId === id);

  //선택된 아이템 관리
  const handleChangeCheckBox = (id: string) => {
    setIsSelected((prev) => {
      // 이미 선택된 id가 있으면 해당 상품 객체를 배열에서 제거
      if (prev.some((product) => product.productId === id)) {
        return prev.filter((product) => product.productId !== id);
      }
      // id가 없으면 cart에서 해당 상품을 찾아서 추가 (undefined가 아닌 값만 추가)
      const product = cart.find((product) => product.productId === id);
      return product ? [...prev, product] : prev; // 상품이 없으면 배열을 그대로 반환
    });
  };

  //장바구니 선택한 하나의 아이템 삭제 버튼
  const handleDeleteItem = (productId: string) => {
    setCart((prev) =>
      prev.filter((product) => product.productId !== productId),
    );
    toast.success('삭제가 완료되었습니다.');
  };

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
  }, [cart]);

  //mypageCart의 return부분
  const productDetailMap = cart
    .map((product) => {
      const detail = isDetail.find(
        (detail) => detail._id === product.productId,
      );
      const price = detail?.price || 0;
      return {
        ...product,
        detail,
        totalPrice: price * product.quantity, // 수량버튼을 누를때마다 변경되는 가격
      };
    })
    .reverse();

  //구매버튼 누를 때 보낼 상품의 상세 정보
  const selectedDetail = isSelected.map((product) => {
    const detail = isDetail.find((detail) => detail._id === product.productId);
    const price = detail?.price || 0;
    return {
      detail,
      totalPrice: price * product.quantity, // 수량버튼을 누를때마다 변경되는 각 상품의 가격
    };
  });

  //선택된 상품의 총 금액
  const selectedTotalPriceMap = selectedDetail.map((item) => item.totalPrice);

  const selectedTotalPrice = selectedTotalPriceMap.reduce(
    (sum, price) => sum + price,
    0,
  );

  useEffect(() => {
    console.log(selectedTotalPrice);
  }, [isSelected]);

  useEffect(() => {
    console.log('isSelected', isSelected);
  }, [isSelected]);

  //구매하기 버튼 누를 때
  const handleBuyClick = () => {
    if (selectedDetail.length > 0) {
      const quantities = isSelected.map((item) => item.quantity);

      const dataToSend = {
        product: selectedDetail, //상품 정보
        quantity: quantities,
        selectedTotalPrice,
      };

      navigate('/order', {
        state: dataToSend,
      });
    } else {
      toast.error('선택된 상품이 없습니다.');
    }
  };

  // 현재 페이지에 맞는 데이터
  const startIndex = (currentPage - 1) * cartsPerPage; //0
  const endIndex = startIndex + cartsPerPage; //5
  const currentDetailMap = productDetailMap.slice(startIndex, endIndex);

  return (
    <div className={cartStyles.content_wrap}>
      <MypageHeader />
      {cart.length !== 0 ? (
        <div>
          <div className={cartStyles.Table_wrap}>
            <Button
              onClick={deleteCart}
              className={cartStyles.total_delete}
              label="전체 삭제"
            />
            <ProductTableHeader className={tableStyles.Header_wrap}>
              <ProductTableHeader.Menu
                menu="상품정보"
                className={tableStyles.Header_menu_first}
              />
              <ProductTableHeader.Menu
                menu="판매 금액"
                className={tableStyles.Header_menu}
              />
              <ProductTableHeader.Menu
                menu="수량"
                className={tableStyles.Header_menu}
              />
              <ProductTableHeader.Menu
                menu=""
                className={tableStyles.Header_menu}
              />
            </ProductTableHeader>
            <ProductTableMenu>
              {currentDetailMap.map((product) => (
                <div key={product.productId} className={tableStyles.content}>
                  <ProductTableMenu.CheckBox
                    className={cartStyles.checkbox_box}
                    productId={product.productId}
                    isChecked={isChecked(product.productId)}
                    onChange={handleChangeCheckBox}
                  />
                  <ProductTableMenu.Detail
                    onClick={() => navigate(`/product/${product.detail?._id}`)}
                    productName={product.detail?.name}
                    image={product.detail?.image}
                  />
                  <ProductTableMenu.Content
                    content={addCommas(product.totalPrice)}
                  />
                  <div className={tableStyles.quantity_wrap}>
                    <ProductTableMenu.QuantityButton
                      label="-"
                      onClick={handleDown}
                      id={product.productId}
                    />
                    <ProductTableMenu.Quantity quantity={product.quantity} />
                    <ProductTableMenu.QuantityButton
                      label="+"
                      onClick={handleUp}
                      id={product.productId}
                    />
                  </div>
                  <ProductTableMenu.DeleteButton
                    productId={product.productId}
                    onClick={handleDeleteItem}
                    image={trash}
                  />
                </div>
              ))}
            </ProductTableMenu>
          </div>
          <p className={cartStyles.totalprice}>
            선택된 상품의 총 금액: {selectedTotalPrice}원
          </p>
          <div className={cartStyles.button_box}>
            <Button
              className={cartStyles.button}
              label="구매하기"
              onClick={handleBuyClick}
            />
          </div>
          <Pagination
            itemLength={isDetail.length}
            value={currentPage}
            itemCountPerPage={cartsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            className={paginationStyles.pagination}
          >
            <Pagination.Navigator
              className={`${paginationStyles.pageNavigate} ${userPaginationStyles.pageNavigate}`}
              type="prev"
            />
            <Pagination.PageButtons
              className={`${paginationStyles.pageButton} ${userPaginationStyles.pageButton}`}
            />
            <Pagination.Navigator
              className={`${paginationStyles.pageNavigate} ${userPaginationStyles.pageNavigate}`}
              type="next"
            />
          </Pagination>
        </div>
      ) : (
        <div>
          <div className={cartStyles.none_wrap}>
            <img src={noticeImg} className={cartStyles.alertImg} />
            <p className={cartStyles.p1}>장바구니에 담긴 상품이 없습니다.</p>
            <p className={cartStyles.p2}>마음에 드는 상품을 담아보세요!</p>
            <Button label="상품 담으러 가기" onClick={() => navigate('/')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MypageCart;
