import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('요청 인터셉터 에러:', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error('잘못된 요청입니다.');
          break;
        case 401:
          toast.error('인증 실패: 권한이 없습니다.');
          break;
        case 403:
          toast.error('접근 금지: 권한이 없습니다.');
          break;
        case 404:
          toast.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          toast.error('서버 내부 오류가 발생했습니다.');
          break;
        default:
          toast.error(`알 수 없는 오류: ${error.response.status}`);
      }
    } else if (error.request) {
      toast.error('서버로부터 응답이 없습니다.');
    } else {
      toast.error('요청 설정 중 에러 발생');
    }
    return Promise.reject(error);
  },
);

export default api;
