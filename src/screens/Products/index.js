import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import Button from "../../components/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { Base_url } from "../../utils/Base_url";
import { FaSearch } from "react-icons/fa";
import Input from "../../components/Input";
import { Link } from "react-router-dom";
import UploadCSV from "./UploadCSV";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get(`${Base_url}/products/getAll?page=${currentPage}&limit=${itemsPerPage}&name=${search}`)
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotalItems(res.data.totalProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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
        setLoading(true); // Show loading when deleting
        axios
          .delete(`${Base_url}/products/delete/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              fetchProducts();
            }
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="main_title">Products</h2>
        <div className="flex gap-2 items-center">
          <Link to={'/add-product'}>
            <Button
              className="bg-primary py-2.5"
              label="Add Product"
            />
          </Link>
        </div>
      </div>

      <UploadCSV setIsModalOpen={setIsUploadOpen} isModalOpen={isUploadOpen} fetchProducts={fetchProducts} />

      <div className="my-4">
        <Input
          placeholder="Search..."
          Icon={<FaSearch />}
          value={search}
          onChange={handleSearch}
          className="w-full bg-white border"
        />
      </div>

      {/* Display total items and current range */}
      <div className="mb-2 text-sm text-gray-600">
        Total Sub Categories: {totalItems} | Showing {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </div>

      {/* Only show table when not loading */}
     
        <section className="mb-20 mt-5 text-gray-800">
          <div className="block rounded-lg shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full mb-0">
                <thead className="bg-primary rounded-lg">
                  <tr>
                    <th className="text-sm text-white font-bold px-6 py-4">No</th>
                    <th className="text-sm text-white font-bold px-6 py-4">Name</th>
                    <th className="text-sm text-white font-bold px-6 py-4">Category</th>
                    <th className="text-sm text-white font-bold px-6 py-4">Sub Category</th>
                    <th className="text-sm text-white font-bold px-6 py-4">Image</th>
                    <th className="text-sm text-white font-bold px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                   {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                     <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No sub products found
                    </td>
                  </tr>
                ) : (
                    products.map((item, index) => (
                      <tr key={item._id} className="bg-white text-center border-b">
                        <td className="text-sm font-normal px-6 py-4">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-sm font-normal px-6 py-4">
                          <span className="text-base text-black bg-green-200 py-1 px-2.5 rounded-full">
                            {item.name}
                          </span>
                        </td>
                        <td className="text-sm font-normal px-6 py-4">
                          <span className="text-base text-black bg-green-200 py-1 px-2.5 rounded-full">
                            {item.brandId?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="text-sm font-normal px-6 py-4">
                          <span className="text-base text-black bg-green-200 py-1 px-2.5 rounded-full">
                            {item.categoryId?.title || 'N/A'}
                          </span>
                        </td>
                        <td className="text-sm font-normal whitespace-nowrap px-4 py-4">
                          {item?.images?.[0]?.url ? (
                            <img 
                              src={`${Base_url}/${item.images[0].url}`} 
                              className="rounded-md w-20 h-16 mx-auto object-cover" 
                              alt={item.name} 
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="text-sm font-normal px-6 py-4">
                          <div className="flex gap-2 justify-center items-center">
                            <Link to={`/edit-product/${item?._id}`}>
                              <img
                                src={require("../../assets/image/edit.png")}
                                alt="Edit"
                                className="cursor-pointer w-6 h-6"
                              />
                            </Link>
                            <img
                              onClick={() => removeFunction(item._id)}
                              src={require("../../assets/image/del.png")}
                              alt="Delete"
                              className="cursor-pointer w-6 h-6"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Pagination - only show if there are products */}
              {products.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <button
                      className="px-4 py-2 text-white bg-black rounded disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <select
                        className="px-2 py-1 border rounded"
                        value={currentPage}
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                      >
                        {Array.from({ length: totalPages }, (_, index) => (
                          <option key={index + 1} value={index + 1}>
                            Page {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      className="px-4 py-2 text-white bg-black rounded disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
     
    </>
  );
};

export default Products;