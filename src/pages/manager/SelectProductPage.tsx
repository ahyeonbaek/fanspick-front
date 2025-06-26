import { useEffect, useMemo, useState } from 'react';
import api from '@utils/api';
import styles from '@css/manager/selectProductPage.module.css';
import { useUserContext } from '@context/UserContext';
import { useNavigate } from 'react-router-dom';
import { addCommas } from '@utils/util';
import { Pagination } from 'ys-project-ui';
import paginationStyles from '@/css/pagination.module.css';
import managerPaginationStyles from '@/css/managerPagination.module.css';

/* 상품이미지 클릭하면 상품상세페이지로 네비 넣기 */
interface ProductProps {
  userId: string;
  _id: string;
  name: string;
  price: string;
  introduce: string;
  image: string;
  detailImage: string[];
  category: {
    name: string[];
  };
}

const SelectProductPage = () => {
  const [getProduct, setGetProduct] = useState<ProductProps[]>([]);
  const [userId, setUserId] = useState('');
  const { user } = useUserContext();
  const navigator = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 8;
  console.log('totalProducts ', totalProducts);

  useMemo(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  const handleClickCard = (product: ProductProps) => {
    localStorage.setItem('productId', product._id);
    navigator('/fix-product');
  };

  const getAllProduct = async (page: number) => {
    try {
      const response = await api.get(
        `/manager/products?userId=${userId}&page=${page}&itemsPerPage=${productsPerPage}`,
      );
      console.log('response.data', response.data);
      if (response.status === 200) {
        console.log('전체 상품 가져오기 성공', response.data);
        setGetProduct(response.data.product);
        setTotalProducts(response.data.totalCount);
      }
    } catch (err) {
      console.log('전체 상품 가져오기 실패');
    }
  };

  useEffect(() => {
    getAllProduct(currentPage);
  }, [currentPage]);

  /* 페이지네이션 */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className={styles.container}>
      <h1>상품 조회</h1>
      <div className={styles.productList}>
        {getProduct.map((product, index) => (
          <div
            key={index}
            onClick={() => handleClickCard(product)}
            className={styles.productCard}
          >
            <img
              src={product.image}
              alt="상품이미지"
              className={styles.productImage}
            />
            <h3>{product.name}</h3>
            <p>{addCommas(Number(product.price))}원</p>
          </div>
        ))}
      </div>

      <Pagination
        itemLength={totalProducts}
        value={currentPage}
        itemCountPerPage={productsPerPage}
        onPageChange={handlePageChange}
        className={paginationStyles.pagination}
      >
        <div className={paginationStyles.pageContainer}>
          <Pagination.Navigator
            type="prev"
            className={`${paginationStyles.pageNavigate} ${managerPaginationStyles.pageNavigate}`}
          />
          <Pagination.PageButtons
            className={`${paginationStyles.pageButton} ${managerPaginationStyles.pageButton}`}
          />
          <Pagination.Navigator
            type="next"
            className={`${paginationStyles.pageNavigate} ${managerPaginationStyles.pageNavigate}`}
          />
        </div>
      </Pagination>
    </div>
  );
};

export default SelectProductPage;
