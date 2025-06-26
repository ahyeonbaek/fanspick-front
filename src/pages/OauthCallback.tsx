import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '@context/UserContext';
import { toast } from 'react-toastify';

function OauthCallback() {
  const { updateUser, updateToken } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      const id = queryParams.get('id');
      const name = queryParams.get('name');
      const email = queryParams.get('email');
      const role = queryParams.get('role');
      const provider = queryParams.get('provider');
      const profileImage = queryParams.get('profileImage');

      console.log('Fetched Provider:', provider);

      if (!token) {
        toast.error('로그인 실패. 다시 시도해주세요.');
        navigate('/login');
        return;
      }

      localStorage.setItem('token', token);
      updateToken(token);

      const user = {
        id: id || 'unknown_id',
        name: name || '',
        email: email || '',
        role: role || 'user',
        profileImage: profileImage || '',
        provider: provider || 'unknown',
      };
      console.log('User to be saved:', user);

      localStorage.setItem('user', JSON.stringify(user));
      console.log('User saved to localStorage:', user);
      updateUser(user);

      toast.success(`${user.name}님 환영합니다!`);
      navigate('/');
    };

    fetchUserData();
  }, [updateUser, updateToken, navigate, location.search]);

  return <div>로그인 중입니다. 잠시만 기다려주세요...</div>;
}

export default OauthCallback;
