import { useEffect, useState } from 'react';
import ProductCard from '@components/product/ProductCard';
import styles from '@css/homepage.module.css';
import api from '@utils/api';
import { useLocation } from 'react-router-dom';
import { Pagination } from 'ys-project-ui';
import paginationStyles from '@/css/pagination.module.css';
import userPaginationStyles from '@/css/userPagination.module.css';

export interface ProductProps {
  _id: string;
  userId: string;
  name: string;
  price: number;
  introduce: string;
  image: string;
  detailImage: string[];
  category: {
    name: string[];
  };
}

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProduct, setTotalProduct] = useState(0);
  const productPerPage = 8;

  const [products, setProducts] = useState<ProductProps[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');

  useEffect(() => {
    // 카테고리가 바뀔 때 페이지를 초기화
    setCurrentPage(1);
  }, [categoryFilter]);
  const getAllProducts = async (page: number) => {
    try {
      const response = await api.get(
        `/manager/products-category?page=${page}&itemsPerPage=${productPerPage}&category=${
          categoryFilter || ''
        }`,
      );
      if (response.status === 200) {
        setProducts(response.data.product);
        setTotalProduct(response.data.totalCount);
      }
    } catch (err) {
      console.error('상품 가져오기 실패');
    }
  };

  // 카테고리 필터링
  /* const filteredProducts = categoryFilter
    ? products.filter((product) =>
        product.category?.name.includes(categoryFilter),
      )
    : products; */

  useEffect(() => {
    getAllProducts(currentPage);
  }, [currentPage, categoryFilter]);

  /* 페이지네이션 */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const categoryName = categoryFilter ? categoryFilter : '';
  return (
    <div className={styles.container}>
      <h2>{categoryName ? `` : '다양한 굿즈를 만나보세요!'}</h2>

      <h1>
        {categoryName ? (
          `${categoryName} 카테고리`
        ) : (
          <>
            다양한 굿즈와 함께 당신만의 특별한 아이템을 찾아보세요.
            <br /> 인기 상품부터 최신 아이템까지, 원하는 굿즈를 손쉽게 만나실 수
            있습니다.
          </>
        )}
      </h1>
      <div className={styles.productListWrap}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>

      <Pagination
        itemLength={totalProduct}
        value={currentPage}
        itemCountPerPage={productPerPage}
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
    </div>
  );
};

export default HomePage;
