import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import api from '@utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TokenExpiration from '../components/TokenExpiration';

interface Address {
  roadAddress: string;
  zoneCode: string;
  jibunAddress: string;
  detailAddress: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profileImage?: string;
  businessNumber?: string;
  address?: Address;
  provider?: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  updateUser: Dispatch<SetStateAction<User | null>>;
  updateToken: Dispatch<SetStateAction<string | null>>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 자동 로그아웃 타이머 설정
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const now = new Date().getTime(); // 현재 시간

    if (!storedUser || !storedToken || !tokenExpiry) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    // 토큰 만료
    if (now > Number(tokenExpiry)) {
      handleTokenExpiry();
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (!parsedUser.role) {
      console.error('User data is missing the role field.');
    }

    // 토큰 남은시간 계산
    const timeLeft = Number(tokenExpiry) - now;
    const timeoutId = setTimeout(() => {
      handleTokenExpiry();
    }, timeLeft);

    setUser({ ...JSON.parse(storedUser), tokenExpiry: Number(tokenExpiry) });
    setToken(storedToken);
    setIsLoading(false);

    return () => clearTimeout(timeoutId);
  }, []);

  // 토큰 만료 함수
  const handleTokenExpiry = () => {
    console.log('토큰이 만료되었습니다.');
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setIsModalOpen(true); // 만료되면 모달 표시
  };

  const logout = async () => {
    try {
      await api.post('/oauth/logout');
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
      toast.success('로그아웃 되었습니다.');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        updateUser: setUser,
        updateToken: setToken,
        logout,
      }}
    >
      {children}
      <TokenExpiration isOpen={isModalOpen} onClose={handleModalClose} />
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;
export { useUserContext };
