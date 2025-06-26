import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { ReactNode } from 'react';
import { toast } from 'react-toastify';

interface PrivateRouteProps {
  children: ReactNode;
  isManager?: boolean;
}

export const PrivateRoute = ({
  children,
  isManager = true,
}: PrivateRouteProps) => {
  const { user } = useUserContext();
  // 로그인하지 않은 사용자도 홈페이지는 접근할 수 있게 하기
  if (!user && window.location.pathname !== '/') {
    toast.error('로그인이 필요합니다.');
    return <Navigate to="/login" />;
  }

  if (!isManager && user?.role !== 'manager') {
    /* 유저일때 매니저 페이지 못가게 */
    toast.error('잘못된 접근 입니다.');
    return <Navigate to="/" />;
  }
  /* 매니저일때 유저 페이지 못가게 */
  if (isManager && user?.role === 'manager') {
    return <Navigate to="/main" />;
  }

  return <>{children}</>;
};

/* 로그인 유무만 판단 */
export const AuthRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useUserContext();

  // 로그인하지 않은 경우
  if (!user) {
    toast.error('로그인이 필요합니다.');
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
