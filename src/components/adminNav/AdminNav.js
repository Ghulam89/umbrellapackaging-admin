import { FiMenu } from "react-icons/fi";
import { useEffect, useState } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../../assets/image/umbrella-logo.svg';
const AdminNav = ({ openSidebar, side, closeSidebar }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('ceat_admin_user'))
  const Dropdown = () => {
    setModalOpen(!isModalOpen);
  }
  const navigate = useNavigate();
  const logoutFun = () => {
    localStorage.removeItem('shopzone_admin');
    navigate('/');
    toast.success('Logout successfully!');

  }

  return (
    <nav
      className={`fixed  z-30 top-0 right-0   ${side === "left-0 md:-left-64" ? "left-0" : "left-0 md:left-64"
        }`}
    >
      <div className="   bg-white shadow-md w-full flex justify-between  items-center p-4">
        <div className=" flex items-center gap-4">
          {side === "left-0 md:-left-64" ? (
            <FiMenu size={30} onClick={closeSidebar} color="black" />
          ) : (
            <FiMenu size={30} color="black" onClick={openSidebar} />
          )}

          {/* <div className=" hidden md:block w-96">
            <Input
              placeholder={`Search...`}
              Icon={<FaSearch />}
              className={" w-full border"}
            />
          </div> */}
          {/* <p className="  capitalize sm:text-2xl text-xl  font-medium">Welcome to umbrella packaging admin panel</p> */}
        </div>

        <div className=" flex items-center gap-5">

          <div className=" relative">
            <div className=" flex items-center gap-2">
            {/* onClick={Dropdown} */}
            <div  className=" w-10 h-10  cursor-pointer bg-primary flex  justify-center items-center rounded-full">
              {userData?.firstName && userData?.lastName ? (
                <span className="text-white uppercase font-semibold text-sm">
                  {`${userData.firstName.charAt(0)}/${userData.lastName.charAt(0)}`}
                </span>
              ) : (
                // <span className="text-white uppercase font-semibold text-sm">N/A</span>
                <img src={require('../../assets/image/profile.jpg')} className=" w-full h-full rounded-full" alt="" />
              )}            </div>

              <span>Admin</span>
            </div>
            {isModalOpen && (
              <div className=" pt-3 mt-2 bg-white w-80 rounded-md shadow-[1px_1px_10px_rgba(0,_0,_0,_0.2)] absolute top-12 right-4">

                <div className=" flex gap-4 px-4 py-2 pb-1.5">
                  <div className=" cursor-pointer">
                    <img src={require('../../assets/image/profile.jpg')} className=" w-14 h-14 rounded-full" alt="" />

                  </div>
                  <div>
                    <h5 className=" font-semibold text-lg  text-primary uppercase">{`${userData?.firstName} ${' '} ${userData?.lastName}`}</h5>
                    <span className=" text-gray-500">{userData?.email}</span>
                  </div>
                </div>
                <hr />
                <ul className=" p-4">
                  <li onClick={logoutFun} className=" flex cursor-pointer items-center gap-3 py-3">
                    <RiLogoutCircleRLine size={20} className=" text-primary" />
                    <span className=" font-semibold">Sign out</span>
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};
export default AdminNav;
