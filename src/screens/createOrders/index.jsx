import React, { useEffect, useState, useRef } from "react";
import Wrapper from "../Wrapper";
import axios from "axios";
import { Base_url } from "../../utils/Base_url";
import Swal from "sweetalert2";
import CreateOrder from "../orders/CreateOrder";
import AddSubCategory from "../subCategory/AddSubCategory";
import moment from "moment";
import CreateOrderBulk from "../orders/CreateOrderBulk";
import CreateOrderLabel from "../orders/CreateOrderLabel";
import GeneratePdf from "./GeneratePdf";
import InvoicePdf from "./InvoicePdf";
const CreateOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [invoicePdfModalOpen, setInvoicePdfModalOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [singleUser, setSingleUser] = useState([]);
  const [pdfData,setPdfData] = useState({})
  useEffect(() => {
    axios
      .get(`${Base_url}/book/get`)
      .then((res) => {
        console.log(res.data);
        setUsers(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });



      


      
  }, []);

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
          .delete(`${Base_url}/subcategory/delete/${id}`)
          .then((res) => {
            if (res.status === 200) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              axios
                .get(`${Base_url}/subcategory/getAll`)
                .then((res) => {
                  setUsers(res.data.data);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const [statusHidden, setStatusHidden] = useState(true);

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <div className="flex w-full justify-between items-center">
          <div>
            <h2 className="main_title">Orders</h2>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => setIsUpdateOpen(true)}
              className="bg-[#A36A2D] text-white px-5 py-2.5 rounded-md"
            >
              Create Order
            </button>
            <button
              onClick={() => setBulkModalOpen(true)}
              className="bg-[#A36A2D] text-white px-5 py-2.5 rounded-md"
            >
              Create Order in Bulk
            </button>
            <button
              onClick={() => setLabelModalOpen(true)}
              className="bg-[#A36A2D] text-white px-5 py-2.5 rounded-md"
            >
              Generate Bulk Order Label
            </button>
          </div>
        </div>

        <AddSubCategory
          getData={singleUser}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setUsers={setUsers}
        />

        <CreateOrder
          isModalOpen={isUpdateOpen}
          setIsModalOpen={setIsUpdateOpen}
        />

        <CreateOrderBulk
          isModalOpen={bulkModalOpen}
          setIsModalOpen={setBulkModalOpen}
        />

        <CreateOrderLabel
          isModalOpen={labelModalOpen}
          setIsModalOpen={setLabelModalOpen}
        />

        <GeneratePdf
          isModalOpen={pdfModalOpen}
          setIsModalOpen={setPdfModalOpen}
          getData={pdfData}
        />

<InvoicePdf
          isModalOpen={invoicePdfModalOpen}
          setIsModalOpen={setInvoicePdfModalOpen}
          getData={pdfData}
        />
      </div>

      <section className="mb-20 mt-7 text-gray-800">
        <div className="block rounded-lg shadow-lg bg-white">
          <div className="flex flex-col overflow-x-auto">
            <div className="sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full mb-0">
                    <thead className="bg-[#A36A2D]">
                      <tr className="rounded-lg whitespace-nowrap">
                        <th
                          scope="col"
                          className="text-sm text-white font-bold px-6 py-4"
                        >
                          Tracking Number
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-white font-bold px-6 py-4"
                        >
                          Message
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-white font-bold px-6 py-4"
                        >
                          Product Image
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-white font-bold px-6 py-4"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-white font-bold px-6 py-4"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-white font-bold px-6 py-4"
                        >
                          Order Label
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-white font-bold px-6 py-4"
                        >
                          Invoice
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-white font-bold px-6 py-4"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((item, index) => (
                        <tr
                          key={index}
                          className="bg-white border-t rounded-md"
                        >
                          <th
                            scope="row"
                            className="text-sm font-normal px-6 py-4 whitespace-nowrap"
                          >
                            <div className="flex justify-center flex-row text-center items-center">
                              <p className="mb-0.5 font-medium text-black">
                                {item?.orderId?.tracking}
                              </p>
                            </div>
                          </th>
                          <td className="align-middle text-sm text-center font-normal px-6 py-4 whitespace-nowrap">
                            <span className="text-base text-black py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-full">
                              {item?.orderId?.comment}
                            </span>
                          </td>
                          <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-base text-black py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-full">
                              {item?.orderId?.image ? (
                                <img
                                  src={item?.orderId?.image}
                                  className="mx-auto w-14 rounded-md h-14"
                                />
                              ) : (
                                <img
                                  src={require("../../assets/image/cart_image.png")}
                                  className="mx-auto w-14 rounded-md h-14"
                                />
                              )}
                            </span>
                          </td>
                          <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              <span className="text-base text-black py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-full">
                                {moment(item?.createdAt).format("DD-MM-YYYY")}
                              </span>
                            </div>
                          </td>
                          <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              <span className="text-sm text-white bg-primary py-1 px-3 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-full">
                                {item?.status}
                              </span>
                            </div>
                          </td>
                          <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              <span
                                onClick={() => {setPdfModalOpen(true)
                                  setPdfData(item)
                                }}
                                className="text-base cursor-pointer bg-primary text-white py-2.5 px-5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-md"
                              >
                                Print
                              </span>
                            </div>
                          </td>
                          <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              <span
                                onClick={() => {setInvoicePdfModalOpen(true)
                                  setPdfData(item)
                                }}
                                className="text-base cursor-pointer bg-primary text-white py-2.5 px-5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-md"
                              >
                                Invoice
                              </span>
                            </div>
                          </td>
                          <td className="align-middle text-right text-sm font-normal px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              <span
                                onClick={() => {
                                  setSingleUser(item);
                                  setIsModalOpen(true);
                                }}
                                className="text-base bg-primary text-white py-2.5 px-5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-md"
                              >
                                Update
                              </span>
                              {/* <span
                                onClick={() => removeFunction(item._id)}
                                className="text-base bg-red-400 text-white py-2.5 px-5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-md"
                              >
                                Delete
                              </span> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateOrders;
