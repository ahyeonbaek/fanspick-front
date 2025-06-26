import { Outlet } from 'react-router-dom';
import Footer from '@components/Footer';
import '../index.css';
import Header from './Header';
import { ToastContainer } from 'react-toastify';

const Layout = () => {
  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="content">
          <Outlet />
        </div>
        <Footer />
      </div>
      <ToastContainer
      toastStyle={{ width: "450px"}}
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Layout;
