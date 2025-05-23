import React, { useEffect, useState } from "react";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { MdCategory, MdSupport } from "react-icons/md";
import { TbCategoryFilled } from "react-icons/tb";
import { RiShoppingCartFill } from "react-icons/ri";
import BarChart from "../../chart/BarChart";
import LineChart from "../../chart/LineChart";
import { LuGitPullRequest } from "react-icons/lu";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
const Dashboard = () => {
  const [brand, setBrand] = useState(0);
  const [category, setCategory] = useState(0);
  const [product, setProduct] = useState(0);
  const [instant, setInstant] = useState(0);
  const [request, setRequest] = useState(0);
  const [checkout, setCheckout] = useState(0);
 
  useEffect(() => {
    axios
      .get(`${Base_url}/brands/getAll`)
      .then((res) => {
        console.log(res);
        setBrand(res.data.totalBrands);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${Base_url}/category/getAll`)
      .then((res) => {
        console.log(res);
        setCategory(res.data.totalCategory);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${Base_url}/product/getAll`)
      .then((res) => {
        console.log(res);
        setProduct(res.data.totalProducts);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${Base_url}/instantQuote/getAll`)
      .then((res) => {
        console.log(res);
        setInstant(res.data.pagination?.total);
      })
      .catch((error) => {
        console.log(error);
      });
      axios
      .get(`${Base_url}/requestQuote/getAll`)
      .then((res) => {
        console.log(res);
        setRequest(res.data.pagination?.total);
      })
      .catch((error) => {
        console.log(error);
      });
      axios
      .get(`${Base_url}/checkout/getAll`)
      .then((res) => {
        console.log(res);
        setCheckout(res.data.pagination?.total);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchSizes();
  }, [currentPage, search]);

  const fetchSizes = () => {
    axios
      .get(
        `${Base_url}/user/get?page=${currentPage}&limit=${limit}&search=${search}`
      )
      .then((res) => {
        setUsers(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };


 
  return (
    <>
      <h2 className="main_title">Dashboard</h2>

<section>
  <div className=" py-4  w-full grid  grid-cols-1  xl:grid-cols-3 md:grid-cols-2 gap-5">

    <div className=" w-full">
      <div className=" bg-white shadow-md  flex justify-between p-5 rounded-lg">
        <div>
          <h2 className=" text-secondary text-xl font-bold">Categories</h2>
          <div className=" pt-2 flex items-center gap-3">
            <p className="text-3xl  text-secondary">{brand}</p>
          </div>
        </div>
        <div>
          <MdCategory     size={80} className="  text-primary" />
        </div>
      </div>
    </div>
    <div className=" w-full">
      <div className=" bg-white shadow-md text-black flex justify-between p-5 rounded-lg">
        <div>
          <h2 className="  text-secondary text-xl font-bold">Sub Categories</h2>
          <div className=" pt-2 flex items-center gap-3">
            <p className="text-3xl text-secondary">{category}</p>
          </div>
        </div>
        <div>
          <TbCategoryFilled size={80} className=" text-primary" />
        </div>
      </div>
    </div>
    <div className=" w-full">
      <div className=" bg-white shadow-md text-black flex justify-between p-5 rounded-lg">
        <div>
          <h2 className="  text-secondary text-xl font-bold">Products</h2>
          <div className=" pt-2 flex items-center gap-3">
            <p className="text-3xl  text-secondary">{product}</p>
          </div>
        </div>
        <div>
          <RiShoppingCartFill size={80} className=" text-primary" />
        </div>
      </div>
    </div>
    <div className=" w-full">
      <div className=" bg-white shadow-md text-black flex justify-between p-5 rounded-lg">
        <div>
          <h2 className="  text-secondary text-xl font-bold">Orders</h2>
          <div className=" pt-2 flex items-center gap-3">
            <p className="text-3xl  text-secondary">{checkout}</p>
          </div>
        </div>
        <div>
          <RiShoppingCartFill size={80} className=" text-primary" />
        </div>
      </div>
    </div>
    <div className=" w-full">
      <div className=" bg-white shadow-md text-black flex justify-between p-5 rounded-lg">
        <div>
          <h2 className="  text-secondary text-xl font-bold">Total Instant Quote</h2>
          <div className=" pt-2 flex items-center gap-3">
            <p className="text-3xl  text-secondary">{instant}</p>
          </div>
        </div>
        <div>
          <LuGitPullRequest          size={80} className=" text-primary" />
        </div>
      </div>
    </div>
    <div className=" w-full">
      <div className=" bg-white shadow-md text-black flex justify-between p-5 rounded-lg">
        <div>
          <h2 className="  text-secondary text-xl font-bold">Total Request Quote</h2>
          <div className=" pt-2 flex items-center gap-3">
            <p className="text-3xl  text-secondary">{request}</p>
          </div>
        </div>
        <div>
          <VscGitPullRequestGoToChanges size={80} className=" text-primary" />
        </div>
      </div>
    </div>
  </div>


</section>

      <section className=" grid md:grid-cols-2 mt-2 grid-cols-1 gap-5">
        <div className="">
          <BarChart/>
        </div>
        <div className="">
          <LineChart/>
        </div>
      </section>

    </>
  );
};

export default Dashboard;
