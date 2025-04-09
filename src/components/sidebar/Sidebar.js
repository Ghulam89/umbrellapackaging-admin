import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  MdCategory,
  MdOutlineContacts,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { PiSlidersBold } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { FaQuestionCircle } from "react-icons/fa";
import {ImBlogger} from "react-icons/im";
import {BsSliders} from 'react-icons/bs';
import { FiUsers } from "react-icons/fi";
import { useRef } from "react";
import logo from '../../assets/image/umbrella-logo.svg';
import { TbCategoryFilled } from "react-icons/tb";
import Button from "../Button";
import { LuLogOut } from "react-icons/lu";
import { toast } from "react-toastify";

const Sidebar = ({ side, closeSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <RxDashboard size={20} /> },
    { path: "/customers", label: "Customers", icon: <FiUsers size={20} /> },
    // { path: "/announcement", label: "Announcement", icon: <RxDashboard size={20} /> },
    // { path: "/promo-code", label: "Promo Code", icon: <RxDashboard size={20} /> },
    { path: "/orders", label: "Orders", icon: <RxDashboard size={20} /> },
    // { path: "/sliders", label: "Sliders", icon: <PiSlidersBold size={20} /> },
    // { path: "/home_banner", label: "Ads Banners", icon: <PiSlidersBold size={20} /> },
    // { path: "/brands", label: "Brands", icon: <RxDashboard size={20} /> },
    { path: "/category", label: "Categories", icon: <MdCategory       size={20} /> },
    { path: "/sub-categories", label: "Sub Categories", icon: <TbCategoryFilled size={20} /> },
    // { path: "/sub-sub-categories", label: "Sub Sub Categories", icon: <BsSliders size={20} /> },
    // { path: "/sizes", label: "Sizes", icon: <BsSliders size={20} /> },
    // { path: "/colors", label: "Colors", icon: <BsSliders size={20} /> },
    // { path: "/age", label: "Age", icon: <BsSliders size={20} /> },
    // { path: "/genders", label: "Gender", icon: <BsSliders size={20} /> },  
    { path: "/products", label: "Products", icon: <MdOutlineProductionQuantityLimits size={20} /> },
    // { path: "/stock-management", label: "Stock Management", icon: <MdOutlineProductionQuantityLimits size={20} /> },
    // { path: "/blog-categories", label: "Blog Categories", icon: <ImBlogger size={20} /> },
    { path: "/blogs", label: "Blogs", icon: <ImBlogger size={20} /> },
    // { path: "/deals", label: "Deals", icon: <ImBlogger size={20} /> },
    // { path: "/clearance", label: "Clearance", icon: <ImBlogger size={20} /> },
    // { path: "/catalogues", label: "Catalogues", icon: <ImBlogger size={20} /> },
    
    // { path: "/catalogue-categories", label: "Catalogue Categories", icon: <ImBlogger size={20} /> },
    // { path: "/catalogue-products", label: "Catalogue Products", icon: <ImBlogger size={20} /> },

    { path: "/contact-us", label: "Contact Us", icon: <MdOutlineContacts size={20} /> },
    { path: "/faqs", label: "FAQs", icon: <FaQuestionCircle size={20} /> },
    { path: "/subscribe", label: "Subscribe", icon: <FaQuestionCircle size={20} /> },
  ];


  const menuRef = useRef(null);
  const navigate = useNavigate()
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
        <img src={logo} alt="" className=" w-40 mx-auto" />
      </div>

      <ul className=" pt-6">
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
