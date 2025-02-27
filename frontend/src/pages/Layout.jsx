import { Outlet } from "react-router-dom";
import Navbar1 from '../components/Navbar1';
import Footer from '../components/footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow">{children}
      <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
