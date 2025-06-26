import { ChangeEvent, useEffect, useState } from 'react';
import api from '@utils/api';
import ProductTableHeader from '@components/productTable/ProductTableHeader';
import ProductTableMenu from '@components/productTable/ProductTableMenu';
import AddressSearch from '@components/AddressSearch';
import tableStyles from '@css/productTable/productTable.module.css';
import orderstyles from '@css/order.module.css';
import { Button, Input } from 'ys-project-ui';
import { Address } from 'react-daum-postcode';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { emailPattern } from '@consts/patterns';
import { useUserContext } from '@context/UserContext';
import { addCommas } from '@utils/util';

interface PaymentResponse {
  success: boolean;
  error_msg?: string;
}
/* interface PaymentData {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  name: string;
  amount: number;
}
 */

interface Product {
  detail: {
    name: string;
    image: string;
    price: number;
    _id: string;
    introduce: string;
  };
  totalPrice: number;
}
interface OrderPageProps {
  product: Product[];
  quantity: number[];
  selectedTotalPrice?: number;
}
const OrderPage = () => {
  const { user } = useUserContext();
  const userId = user?.id;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [user, navigate]);
  const { product, quantity, selectedTotalPrice } =
    location.state as OrderPageProps;

  const totalPrice = selectedTotalPrice || product[0].totalPrice;

  const [address, setAddress] = useState({
    roadAddress: user?.address?.roadAddress || '',
    zoneCode: user?.address?.zoneCode || '',
    jibunAddress: user?.address?.jibunAddress || '',
    detailAddress: user?.address?.detailAddress || '',
  });

  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isOpen, setIsOpen] = useState(false);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      ['roadAddress', 'zoneCode', 'jibunAddress', 'detailAddress'].includes(
        name,
      )
    ) {
      setAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOrderClick = async () => {
    const { name, email } = updatedUser;
    if (!name.trim()) {
      toast.error('이름을 입력해주세요.');
      return;
    }
    if (!emailPattern.test(email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    if (
      !address.roadAddress.trim() ||
      !address.zoneCode.trim() ||
      !address.detailAddress.trim()
    ) {
      toast.error('주소를 입력해주세요.');
      return;
    }

    /* 결제 창 호출*/
    const { IMP } = window;
    const impCode = 'imp21152357';

    if (!impCode) {
      toast.error('IMP 가맹점 식별 코드가 설정되지 않았습니다.');
      return;
    }
    IMP.init(impCode);

    const paymentData = {
      userId,
      pg: 'kakaopay', // PG사,(필수)
      pay_method: 'card', // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: totalPrice, // 결제금액,(필수)
      name: product
        .map((item) => item.detail.name)
        .join(', ') /* 상품 여러개일때 */,
    };
    IMP.request_pay(paymentData, async (response: PaymentResponse) => {
      const { success, error_msg } = response;

      if (success) {
        try {
          await api.post('/purchase/payment', paymentData);
        } catch (error) {
          console.error('결제 실패:');
        }
        const orderData = {
          userId,
          products: product.map((item, idx) => ({
            productId: item.detail._id,
            quantity: quantity[idx],
            name: item.detail.name,
            image: item.detail.image,
            price: item.detail.price,
            introduce: item.detail.introduce,
          })),
          orderAddress: address,
          imp_uid: impCode,
          totalPrice: totalPrice,
        };

        try {
          const response = await api.post('/purchase/order', orderData);
          if (response.status === 200) {
            toast.success('주문이 완료되었습니다!');

            const cartKey = `cart_${userId}`;
            const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');

            const updateCart = cartItems.filter(
              (cartItem: { productId: string }) =>
                !product.some(
                  (orderedId) => orderedId.detail._id === cartItem.productId,
                ),
            );

            localStorage.setItem(cartKey, JSON.stringify(updateCart));

            navigate('/mypage-order');
          }
        } catch (error) {
          console.error('주문  실패');
        }
      } else {
        toast.error(`결제 실패: ${error_msg}`);
      }
    });
  };

  return (
    <>
      <div className={orderstyles.orderPageWrap}>
        <h2 className={orderstyles.h2}>주문 페이지</h2>
        <div className={orderstyles.productInfoWrap}>
          <ProductTableHeader className={orderstyles.Header_wrap}>
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
          </ProductTableHeader>
          <ProductTableMenu>
            {product.map((item, index) => (
              <div key={index} className={orderstyles.content}>
                <ProductTableMenu.Detail
                  productName={item.detail.name}
                  image={item.detail.image}
                />
                <ProductTableMenu.Content
                  content={addCommas(item.detail.price)}
                />
                <div className={tableStyles.quantity_wrap}>
                  <ProductTableMenu.Quantity quantity={quantity[index]} />
                </div>
              </div>
            ))}
          </ProductTableMenu>
        </div>
        <div className={orderstyles.totalPriceBox}>
          <p>주문상품금액 {addCommas(totalPrice)}원</p>
          <p>+</p>
          <p>배송비 0원(무료)</p>
          <p>=</p>
          <p>최종 결제 금액 {addCommas(totalPrice)}원</p>
        </div>
        <h3 className={orderstyles.h3}>고객 / 배송지 정보</h3>
        <div className={orderstyles.inputBoxWrap}>
          <div className={orderstyles.inputBox}>
            <label>받는분</label>
            <Input
              name="name"
              value={updatedUser.name}
              onChange={handleChange}
            />
          </div>
          <div className={orderstyles.inputBox}>
            <label>이메일</label>
            <Input
              name="email"
              onChange={handleChange}
              value={updatedUser.email}
            />
          </div>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          label="주소 검색"
          className={orderstyles.addressSearchBtn}
        />
        <div className={orderstyles.inputBoxWrap}>
          <Input
            placeholder="우편번호"
            name="zoneCode"
            value={address.zoneCode || ''}
            onChange={handleChange}
          />
          <Input
            placeholder="도로명 주소"
            name="roadAddress"
            value={address.roadAddress || ''}
            onChange={handleChange}
          />
        </div>
        <AddressSearch
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onComplete={handleDaumPost}
        />
        <div className={orderstyles.inputBoxWrap}>
          <Input
            placeholder="상세 주소"
            name="detailAddress"
            value={address.detailAddress || ''}
            onChange={handleChange}
          />
        </div>
        <Button
          label="카카오페이 간편 결제하기"
          className={orderstyles.paymentBtn}
          onClick={handleOrderClick}
        />
      </div>
    </>
  );
};

export default OrderPage;
