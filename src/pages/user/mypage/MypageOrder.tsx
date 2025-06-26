import orderStyles from '@css/mypage/mypageOrder.module.css';
import MypageHeader from '@components/categories/MypageCategories';
import tableStyles from '@css/productTable/productTable.module.css';
import cartStyles from '@css/mypage/mypageCart.module.css';
import ProductTableMenu from '@components/productTable/ProductTableMenu';
import { useNavigate } from 'react-router-dom';
import { Button, Pagination } from 'ys-project-ui';
import { useEffect, useState } from 'react';
import noticeImg from '/icons/alert-circle.png';
import { useUserContext } from '@context/UserContext';
import api from '@utils/api';
import paginationStyles from '@/css/pagination.module.css';
import userPaginationStyles from '@/css/userPagination.module.css';
import ProductTableHeader from '@components/productTable/ProductTableHeader';
import { addCommas } from '@utils/util';

interface Product {
  productId: {
    _id: string;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  createdAt: string;
  products: Product[];
}

const MypageOrder = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrder, setTotalOrder] = useState(0);
  const orderPerPage = 2;
  const userId = user?.id;

  const getReviews = JSON.parse(
    localStorage.getItem(`reviews_${userId}`) || '[]',
  );
  console.log('가져온 리뷰', getReviews);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOrderList = async (page: number) => {
    try {
      if (user) {
        const response = await api.get(
          `/purchase/order/list/${userId}?page=${page}&itemsPerPage=${orderPerPage}`,
        );

        console.log('주문 목록', response.data.orderList);
        if (response.status === 200) {
          setOrderList(response.data.orderList);
          setTotalOrder(response.data.totalCount);
        }
      }
    } catch (err) {
      console.error('주문 내역 조회 실패', err);
    }
  };

  useEffect(() => {
    if (userId) {
      handleOrderList(currentPage);
    }
  }, [currentPage, userId]);

  const handleReview = (order: Product) => {
    console.log('order', order);
    navigate('/add-review', { state: { order } });
  };

  const existOrderId = (order: any) => {
    return getReviews
      .map((item: any) => item.trim().toLowerCase())
      .includes(order._id.trim().toLowerCase());
  };

  return (
    <div className={cartStyles.content_wrap}>
      <MypageHeader />
      {orderList.length !== 0 ? (
        <div>
          <div className={orderStyles.Table_wrap}>
            <ProductTableMenu>
              {orderList.map((orders) => (
                <div key={orders._id} className={orderStyles.order_wrap}>
                  <div className={orderStyles.day}>
                    {new Date(orders.createdAt).toLocaleDateString()} 결제내역
                  </div>
                  <ProductTableHeader className={tableStyles.Header_wrap}>
                    <ProductTableHeader.Menu
                      menu="상품정보"
                      className={tableStyles.Header_menu_first}
                    />
                    <ProductTableHeader.Menu
                      menu="판매 금액"
                      className={tableStyles.Header_menu2}
                    />
                    <ProductTableHeader.Menu
                      menu="수량"
                      className={tableStyles.Header_menu2}
                    />
                    <ProductTableHeader.Menu
                      menu=""
                      className={tableStyles.Header_menu}
                    />
                  </ProductTableHeader>
                  {orders.products.map((order) => (
                    <div
                      key={order.productId._id}
                      className={orderStyles.content}
                    >
                      <div className={orderStyles.table_wrap}>
                        <ProductTableMenu.Detail
                          onClick={() =>
                            navigate(`/product/${order.productId._id}`)
                          }
                          productName={order.productId.name}
                          image={order.productId.image}
                        />
                        <ProductTableMenu.Content
                          content={addCommas(order.price)}
                        />
                        <div className={tableStyles.quantity_wrap}>
                          <ProductTableMenu.Quantity
                            quantity={order.quantity}
                          />
                        </div>
                        <Button
                          label="리뷰 등록하기"
                          onClick={() => handleReview(order)}
                          className={
                            !existOrderId(order)
                              ? orderStyles.review_button
                              : orderStyles.none_review_button
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </ProductTableMenu>
          </div>
        </div>
      ) : (
        <div>
          <div className={cartStyles.none_wrap}>
            <img src={noticeImg} className={cartStyles.alertImg} />
            <p className={cartStyles.p1}>주문 내역이 없습니다.</p>
          </div>
        </div>
      )}
      {totalOrder > 0 && (
        <Pagination
          itemLength={totalOrder}
          value={currentPage}
          itemCountPerPage={orderPerPage}
          onPageChange={handlePageChange}
          className={paginationStyles.pagination}
        >
          <div className={paginationStyles.pageContainer}>
            <Pagination.Navigator
              type="prev"
              className={`${paginationStyles.pageNavigate} ${userPaginationStyles.pageNavigate}`}
            />
            <Pagination.PageButtons
              className={`${paginationStyles.pageButton} ${userPaginationStyles.pageButton}`}
            />
            <Pagination.Navigator
              type="next"
              className={`${paginationStyles.pageNavigate} ${userPaginationStyles.pageNavigate}`}
            />
          </div>
        </Pagination>
      )}
    </div>
  );
};

export default MypageOrder;
