import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  MdCategory,
  MdOutlineContacts,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { PiSlidersBold } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { FaQuestionCircle, FaStarOfDavid } from "react-icons/fa";
import {ImBlogger} from "react-icons/im";
import { FiUsers } from "react-icons/fi";
import logo from '../../assets/image/umbrella-logo.svg';
import { TbCategoryFilled } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import { toast } from "react-toastify";
const Sidebar = ({ side, closeSidebar }) => {

  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <RxDashboard size={20} /> },
    { path: "/customers", label: "Customers", icon: <FiUsers size={20} /> },
    { path: "/request-quote", label: "Request Quote", icon: <FiUsers size={20} /> },  
    { path: "/instant-quote", label: "Instant Quote", icon: <FiUsers size={20} /> },
    { path: "/orders", label: "Orders", icon: <RxDashboard size={20} /> },
    { path: "/home_banner", label: "Banner", icon: <PiSlidersBold size={20} /> },
    { path: "/category", label: "Categories", icon: <MdCategory       size={20} /> },
    { path: "/sub-categories", label: "Sub Categories", icon: <TbCategoryFilled size={20} /> },
    { path: "/products", label: "Products", icon: <MdOutlineProductionQuantityLimits size={20} /> },
    { path: "/blogs", label: "Blogs", icon: <ImBlogger size={20} /> },
    { path: "/contact-us", label: "Contact Us", icon: <MdOutlineContacts size={20} /> },
    { path: "/faqs", label: "FAQs", icon: <FaQuestionCircle size={20} /> },
    { path: "/subscribe", label: "Subscribe", icon: <FaQuestionCircle size={20} /> },
    { path: "/reviews", label: "Reviews", icon: <FaStarOfDavid size={20} /> },
  ];
  
  const navigate = useNavigate();

 const logoutFun = () => {
    localStorage.removeItem('shopzone_admin');
    navigate('/');
    toast.success('Logout successfully!');

  }

  return (
    <div
      className={`fixed top-0 shadow-xl border ${side} sm:left-0 w-64   bg-white z-50 transition-all`}
    >
     <div className=" pb-7  overflow-x-auto h-screen "> 
     <i
        className="bi bi-x-lg absolute text-black top-4 right-4 sm:hidden block cursor-pointer text-lg"
        onClick={closeSidebar}
      ></i>
      <div className="p-5 pb-0">
        <img src={logo} alt="" className="  w-40 mx-auto" />
      </div>

      <ul className=" pt-6 pb-16">
        {menuItems.map((tab, index) => (
          <Link
            key={index}
            to={tab.path}
            className={`px-4 mx-3 my-1 rounded-lg capitalize cursor-pointer font-semibold transition-all py-3  flex items-center ${
              location.pathname === tab.path ? " bg-primary text-white" : " hover:border-primary border  hover:text-primary text-secondary "
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </Link>
        ))}
      </ul>

     </div>

     <div className="  pb-5 pt-5 bg-white absolute bottom-0 w-full">
      <div className=" mx-3">
      <button onClick={logoutFun} className=" text-center border hover:bg-primary hover:text-white border-primary w-full flex  items-center justify-center gap-4 py-2 rounded-md text-primary"> <LuLogOut /> Logout</button>

      </div>
     </div>
    </div>
  );
};

export default Sidebar;
