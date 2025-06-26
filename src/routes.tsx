// routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import {
  MypageOrder,
  MypageReview,
  MypageBookmark,
  MypageCart,
  SelectProductPage,
  OrderPage,
  UserFaq,
  UserProvider,
  EditReviewPage,
  AddReviewPage,
  AddProductPage,
  MainPage,
  ProductDetail,
  Mypage,
  Layout,
  HomePage,
  Singup,
  Login,
  ErrorPage,
  FixAndDeleteProductPage,
} from '@utils/index.ts';
import OauthCallback from './pages/OauthCallback';
import { AuthRoute, PrivateRoute } from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    errorElement: (
      <UserProvider>
        <ErrorPage />
      </UserProvider>
    ),
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute isManager={true}>
            <HomePage />
          </PrivateRoute>
        ),
      },
      {
        path: '/mypage',
        element: (
          <AuthRoute>
            <Mypage />
          </AuthRoute>
        ),
      },
      {
        path: '/main',
        element: (
          <PrivateRoute isManager={false}>
            <MainPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/add-product',
        element: (
          <PrivateRoute isManager={false}>
            <AddProductPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/select-product',
        element: (
          <PrivateRoute isManager={false}>
            <SelectProductPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/fix-product',
        element: (
          <PrivateRoute isManager={false}>
            <FixAndDeleteProductPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Singup />,
      },
      {
        path: '/user-faq',
        element: <UserFaq />,
      },
      {
        path: '/cart',
        element: <MypageCart />,
      },
      {
        path: '/product/:id',
        element: <ProductDetail />,
      },
      {
        path: '/add-review',
        element: <AddReviewPage />,
      },
      {
        path: '/edit-review/:reviewId',
        element: <EditReviewPage />,
      },
      {
        path: 'mypage-bookmark',
        element: <MypageBookmark />,
      },
      {
        path: 'mypage-order',
        element: <MypageOrder />,
      },
      {
        path: 'mypage-review',
        element: <MypageReview />,
      },
      {
        path: '/order',
        element: <OrderPage />,
      },
      {
        path: '/oauth/callback',
        element: <OauthCallback />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <UserProvider>
        <ErrorPage />
      </UserProvider>
    ),
  },
]);

export default router;
