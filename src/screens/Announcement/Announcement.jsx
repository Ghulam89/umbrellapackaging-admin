import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import Button from "../../components/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { Base_url } from "../../utils/Base_url";
import { FaSearch } from "react-icons/fa";
import Input from "../../components/Input";
import AddAnnouncement from "./AddAnnouncement";

const Announcement = () => {
    const [users, setUsers] = useState([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const handleEdit = (item) => {
    setEditData(item);
    setIsUpdateOpen(true);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchSizes();
  }, [currentPage, search]);

  const fetchSizes = () => {
    axios
      .get(`${Base_url}/announce/get?page=${currentPage}&limit=${limit}&search=${search}`)
      .then((res) => {
        console.log(res);
        
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
          .delete(`${Base_url}/announce/delete/${id}`)
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
      <div className="flex justify-between items-center">
        <h2 className="main_title">Announcement</h2>
        <Button
          className="bg-primary py-2.5"
          label="Add"
          onClick={() => {
            setEditData(null);
            setIsUpdateOpen(true);
          }}
        />
      </div>

      
      <AddAnnouncement  isModalOpen={isUpdateOpen}
        setIsModalOpen={setIsUpdateOpen}
        isEditMode={!!editData}
        editData={editData}
        fetchSizes={fetchSizes}
        
        />

      <div className="my-4">
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
                  <th className="text-sm text-white font-bold px-6 py-4">Title</th>
                  <th className="text-sm text-white font-bold px-6 py-4">Color</th>
                  <th className="text-sm text-white font-bold px-6 py-4">Sub Title</th>
                  <th className="text-sm text-white font-bold px-6 py-4">Action</th>
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
                        {item.title}
                      </span>
                    </td>
                    <td className="text-sm font-normal px-6 py-4">
                      <span className="text-base text-black bg-green-200 py-1 px-2.5 rounded-full">
                        {item.color}
                      </span>
                    </td>
                    <td className="text-sm font-normal px-6 py-4">
                      <span className="text-base text-black bg-green-200 py-1 px-2.5 rounded-full">
                        {item.subTitle}
                      </span>
                    </td>
                    <td className="text-sm font-normal px-6 py-4">
                      <div className="flex gap-2 justify-center items-center">
                        <img
                             onClick={() => handleEdit(item)}

                          src={require("../../assets/image/edit.png")}
                          alt="Edit"
                          className="cursor-pointer"
                        />
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
      </section>
    </>
  );
};

export default Announcement;
