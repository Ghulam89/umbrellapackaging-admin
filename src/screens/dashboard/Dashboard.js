import React, { useEffect, useState } from "react";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { MdCategory, MdSupport } from "react-icons/md";
import { TbCategoryFilled } from "react-icons/tb";
import Swal from "sweetalert2";
import { RiShoppingCartFill } from "react-icons/ri";
import BarChart from "../../chart/BarChart";
import LineChart from "../../chart/LineChart";
const Dashboard = () => {
  const [brand, setBrand] = useState(0);
  const [category, setCategory] = useState(0);
  const [product, setProduct] = useState(0);

  useEffect(() => {
    axios
      .get(`${Base_url}/brand/get`)
      .then((res) => {
        console.log(res);
        setBrand(res.data.count);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${Base_url}/category/get`)
      .then((res) => {
        console.log(res);
        setCategory(res.data.count);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${Base_url}/product/get`)
      .then((res) => {
        console.log(res);
        setProduct(res.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  const [users, setUsers] = useState([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const handleEdit = (item) => {
    setEditData(item);
    setIsUpdateOpen(true);
  };
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const removeFunction = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#A47ABF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${Base_url}/user/delete/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              fetchSizes();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
          <MdCategory           size={80} className="  text-primary" />
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
  </div>


</section>



{/* <div className="flex justify-between items-center">
        <h2 className="main_title">Customers</h2>
      </div> */}

      {/* <div className="my-4">
        <Input
          placeholder="Search..."
          Icon={<FaSearch />}
          value={search}
          onChange={handleSearch}
          className="w-full bg-white border"
        />
      </div>
      <section className="mb-20 mt-5 text-gray-800">
        <div className="block rounded-lg shadow-lg bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full mb-0">
              <thead className="bg-primary rounded-lg">
                <tr>
                  <th className="text-sm text-white font-bold px-6 py-4">No</th>
                  <th className="text-sm text-white font-bold px-6 py-4">
                    Name
                  </th>
                  <th className="text-sm text-white font-bold px-6 py-4">
                    Email
                  </th>
                  <th className="text-sm text-white font-bold px-6 py-4">
                    Phone
                  </th>
                  <th className="text-sm text-white font-bold px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((item, index) => (
                  <tr key={item.id} className="bg-white text-center border-b">
                    <td className="text-sm font-normal px-6 py-4">
                      {index + 1 + (currentPage - 1) * limit}
                    </td>
                    <td className="text-sm font-normal px-6 py-4">
                      <span className="text-base text-black bg-green-200 py-1 px-2.5 rounded-full">
                        {item.username}
                      </span>
                    </td>
                    <td className="text-sm font-normal px-6 py-4">
                      <span className="text-base text-black bg-green-200 py-1 px-2.5 rounded-full">
                        {item.email}
                      </span>
                    </td>
                    <td className="text-sm font-normal px-6 py-4">
                      <span className="text-base text-black bg-green-200 py-1 px-2.5 rounded-full">
                        {item.phone}
                      </span>
                    </td>
                    <td className="text-sm font-normal px-6 py-4">
                      <div className="flex gap-2 justify-center items-center">
                        <Link to={`/customer/${item?.id}`}>
                        <img
                          
                          src={require("../../assets/image/edit.png")}
                          alt="Edit"
                          className="cursor-pointer"
                        />
                        </Link>
                        
                        <img
                          onClick={() => removeFunction(item.id)}
                          src={require("../../assets/image/del.png")}
                          alt="Delete"
                          className="cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end gap-2 items-center p-4">
              <button
                className="px-4 py-2 text-white bg-black rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex items-center gap-4">
                <p className=" font-medium">
                  Page {currentPage} of {totalPages}
                </p>
                <select
                  className="px-2 py-1 border rounded"
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                >
                  {Array.from({ length: totalPages }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="px-4 py-2 text-white bg-black rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section> */}
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
