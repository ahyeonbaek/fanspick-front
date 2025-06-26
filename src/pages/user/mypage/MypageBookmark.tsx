import { Button, Pagination } from 'ys-project-ui';
import MypageHeader from '@components/categories/MypageCategories';
import ProductTableHeader from '@components/productTable/ProductTableHeader';
import ProductTableHeaderMenu from '@components/productTable/ProductTableHeaderMenu';
import ProductTableMenu from '@components/productTable/ProductTableMenu';
import cartStyles from '@css/mypage/mypageCart.module.css';
import tableStyles from '@css/productTable/productTable.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noticeImg from '/icons/alert-circle.png';
import { toast } from 'react-toastify';
import { useUserContext } from '@context/UserContext';
import trash from '/icons/trash.png';
import cart from '/icons/cart_icon.png';
import api from '@utils/api';
import paginationStyles from '@/css/pagination.module.css';
import userPaginationStyles from '@/css/userPagination.module.css';
import { addCommas } from '@utils/util';

interface Bookmark {
  productId: string;
}

interface Detail {
  _id: string;
  name: string;
  price: number | undefined;
  image: string;
}

const MypageBookmark = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState<Bookmark[]>([]); //로컬에서
  const [isDetail, setIsDetail] = useState<Detail[]>([]); //서버에서
  const [currentPage, setCurrentPage] = useState(1);
  const favoritesPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('isFavorite 상태', isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    const getProductDetail = async () => {
      if (!isFavorite || isFavorite.length === 0) return;

      const ids = isFavorite.map((item) => item.productId); // 상품의 아이디만 담은 배열
      console.log(ids);

      setIsLoading(true);
      try {
        const response = await api.get('/mypage/productbyids', {
          params: { ids },
        }); //장바구니에 담긴 상품의 id를 전달
        console.log(response.data);
        setIsDetail(response.data.productDetail);
      } catch (err) {
        console.error('장바구니 상품 조회 실패', err);
      } finally {
        setIsLoading(false);
      }
    };

    getProductDetail();
  }, [isFavorite]);

  // const fetchFavorites = async () => {
  //   const ids = isFavorite.map((item) => item._id);

  //   try {
  //     const response = await api.get('/mypage/product-by-ids', {
  //       params: { ids },
  //     });
  //     setIsDetail(response.data.productDetail);
  //     // setTotalFavorites(response.data.totalCount);
  //   } catch (err) {
  //     console.error('즐겨찾기 데이터 가져오기 실패', err);
  //   }
  // };

  //유저 정보 가져오기
  const { user } = useUserContext();
  const userId = user?.id;
  if (!userId) {
    toast.error('로그인이 필요합니다.');
    return;
  }

  //유저의 즐겨찾기 목록을 가져옴
  const inFavorites = JSON.parse(
    localStorage.getItem(`favorite_${userId}`) || '[]',
  );

  useEffect(() => {
    if (inFavorites) {
      setIsFavorite(inFavorites);
    }
  }, [user]);

  // const getFavoriteDetail = async (page: number) => {
  //   const ids = isFavorite.map((item) => item._id);

  //   try {
  //     const response = await api.get(
  //       `/manager/product-by-ids/${productId}?page=${page}&itemsPerPage=${favoritesPerPage}`,
  //       {
  //         params: { ids },
  //       },
  //     );
  //     console.log(response.data);
  //     setIsDetail(response.data.productDetail);
  //     setTotalFavorites(isFavorite.length);
  //   } catch (err) {
  //     console.error('즐겨찾기 목록 가져오기 실패', err);
  //   }
  // };

  // useEffect(() => {
  //   getFavoriteDetail(currentPage);
  // }, [isFavorite, currentPage]);

  //아이템 삭제 버튼
  const handleDeleteItem = (productId: string) => {
    setIsFavorite((prev) => {
      const updatedFavorites = prev.filter(
        (product) => product.productId !== productId,
      ); //삭제하려는 아이템의 아이디를 지움
      if (userId) {
        localStorage.setItem(
          `favorite_${userId}`,
          JSON.stringify(updatedFavorites),
        );
      }
      toast.success('삭제가 완료 되었습니다.');
      return updatedFavorites;
    });
  };

  //즐겨찾기 내역 전체 삭제하기
  const deleteCart = () => {
    setIsFavorite([]);
  };

  useEffect(() => {
    if (isFavorite) {
      localStorage.setItem(`favorite_${userId}`, JSON.stringify(isFavorite));
    }
  }, [isFavorite]);

  //로컬과 서버에서 받아온 값 합치기
  const productDetailMap = isFavorite
    .map((product) => ({
      ...product,
      isDetail: isDetail.find((detail) => product.productId === detail._id),
    }))
    .reverse();

  console.log('productDetail', productDetailMap);

  // 현재 페이지에 맞는 데이터
  const startIndex = (currentPage - 1) * favoritesPerPage; //0
  const endIndex = startIndex + favoritesPerPage; //5
  const currentDetailMap = productDetailMap.slice(startIndex, endIndex);

  //장바구니에 넣기
  const handleAddCart = (id: string) => {
    const localCart = JSON.parse(
      localStorage.getItem(`cart_${userId}`) || '[]',
    );

    const newItem = { productId: id, quantity: 1 }; // 장바구니에 추가할 상품

    const existItem = localCart.find(
      (item: { productId: string }) => item.productId === id,
    ); // 장바구니에 이미 존재하는지

    //장바구니에 있는 상품일 때
    if (existItem) {
      const updatedQuantity = localCart.map((item: any) =>
        item.productId === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedQuantity));
      toast.success('장바구니에 추가 되었습니다.');
      return;
    }

    //장바구니에 없는 상품일 때
    const updatedItem = [...localCart, newItem];

    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedItem));
    toast.success('장바구니에 추가되었습니다.');

    console.log('product.productId');
  };

  return (
    <div className={cartStyles.content_wrap}>
      {isFavorite.length !== 0 ? (
        <div>
          <MypageHeader />
          {isLoading ? (
            <div>
              <p>즐겨찾기 내역 불러오는 중..</p>
            </div>
          ) : (
            <div>
              <div className={cartStyles.Table_wrap}>
                <Button
                  onClick={deleteCart}
                  className={cartStyles.total_delete}
                  label="전체 삭제"
                />
                <ProductTableHeader className={tableStyles.bookmark_wrap}>
                  <ProductTableHeaderMenu
                    menu="상품정보"
                    className={tableStyles.Header_menu_first}
                  />
                  <ProductTableHeaderMenu
                    menu="판매 금액"
                    className={tableStyles.Header_menu}
                  />
                  <ProductTableHeaderMenu
                    menu=""
                    className={tableStyles.Header_menu}
                  />
                </ProductTableHeader>
                <ProductTableMenu>
                  {currentDetailMap.map((product) => (
                    <div>
                      <div
                        key={product.productId}
                        className={tableStyles.bookmark_content}
                      >
                        <ProductTableMenu.Detail
                          onClick={() =>
                            navigate(`/product/${product.isDetail?._id}`)
                          }
                          productName={product.isDetail?.name}
                          image={product.isDetail?.image}
                        />
                        <ProductTableMenu.Content
                          content={addCommas(product.isDetail?.price)}
                        />
                        <div className={cartStyles.bookmark_buttons_wrap}>
                          <ProductTableMenu.DeleteButton
                            productId={product.productId}
                            onClick={handleAddCart}
                            image={cart}
                          />
                          <ProductTableMenu.DeleteButton
                            productId={product.productId}
                            onClick={() => handleDeleteItem(product.productId)}
                            image={trash}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </ProductTableMenu>
              </div>
              <Pagination
                itemLength={isDetail.length}
                value={currentPage}
                itemCountPerPage={favoritesPerPage}
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
          )}
        </div>
      ) : (
        <div>
          <MypageHeader />
          <div className={cartStyles.none_wrap}>
            <img src={noticeImg} className={cartStyles.alertImg} />
            <p className={cartStyles.p1}>즐겨찾기에 담긴 상품이 없습니다.</p>
            <p className={cartStyles.p2}>마음에 드는 상품을 담아보세요!</p>
            <Button label="계속 쇼핑하기" onClick={() => navigate('/')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MypageBookmark;
