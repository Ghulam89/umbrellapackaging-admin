import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import Button from "../../components/Button";
import axios from "axios";
import { Base_url } from "../../utils/Base_url";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ServiceRequest = () => {
  const [users, setUsers] = useState([]);
  const [carStatus, setCarStatus] = useState("pending");

  useEffect(() => {
    fetchUsers();
  }, [carStatus]); // Fetch users again whenever carStatus changes

  const fetchUsers = () => {
    axios
      .get(`${Base_url}/user/garage`)
      .then((res) => {
        console.log(res?.data);
        setUsers(res?.data?.garages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(users);

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
          .delete(`${Base_url}/admin/delete-garage/${id}`)
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");

              axios
              .get(`${Base_url}/user/garage`)
              .then((res) => {
                console.log(res?.data);
                setUsers(res?.data?.garages);
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

  // Filter users based on selected carStatus
  const filteredUsers = users.filter((item) => item.status === carStatus);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="main_title">Service Request</h2>
        </div>

        <div className="flex gap-3">
          <div>
            <Button
              onClick={() => setCarStatus("pending")}
              label={"pending"}
              className={`${
                carStatus === "pending" ? "bg-secondary" : "bg-primary"
              }`}
            />
          </div>
          <div>
            <Button
              onClick={() => setCarStatus("active")}
              label={"approved"}
              className={`${
                carStatus === "active" ? "bg-secondary" : "bg-primary"
              }`}
            />
          </div>
        </div>
      </div>

      <section className="mb-20 mt-7 text-gray-800">
        <div className="rounded-lg overflow-x-auto shadow-lg">
          <div className="flex flex-col">
            <div className="sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full mb-0">
                    <thead className="bg-primary">
                      <tr className="rounded-lg whitespace-nowrap">
                        <th className="text-sm text-white font-bold px-6 py-4">
                          No
                        </th>
                        <th className="text-sm text-white font-bold px-6 py-4">
                          Service Name
                        </th>
                        <th className="text-sm text-white font-bold px-6 py-4">
                          Price
                        </th>
                        <th className="text-sm text-white font-bold px-6 py-4">
                          Category
                        </th>
                        <th className="text-sm text-white font-bold px-6 py-4">
                          Status
                        </th>
                        <th className="text-sm text-white font-bold px-6 py-4">
                          Update Status
                        </th>
                        <th className="text-sm text-white font-bold px-10 py-4">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers?.map((item, index) => (
                        <tr
                          className="bg-white border-t rounded-md"
                          key={item._id}
                        >
                          <th
                            scope="row"
                            className="text-sm font-normal px-6 py-4 whitespace-nowrap"
                          >
                            <p className="mb-0.5 font-medium text-black">
                              #{index + 1}
                            </p>
                          </th>
                          <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-base text-black py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-full">
                              {item?.serviceName}
                            </span>
                          </td>
                          <td className="text-sm font-normal text-center px-6 py-4 whitespace-nowrap">
                            <span className="text-base text-black py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-full">
                              {item?.price}
                            </span>
                          </td>
                          <td className="align-middle text-center text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                            <span className="text-base text-black py-1 px-2.5 leading-none whitespace-nowrap bg-green-200 rounded-full">
                              {item?.category}
                            </span>
                          </td>
                          <td className="align-middle text-center text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                            <span className="text-sm text-white bg-primary py-1 px-2.5 leading-none whitespace-nowrap bg-green-200 rounded-full">
                              {item?.status}
                            </span>
                          </td>
                          <td className="align-middle text-center text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                            {item?.status === "active" ? (
                              <Button
                                label={"Approved"}
                                className={" bg-green"}
                              />
                            ) : (
                              <Link to={`/create_garage/${item?._id}`}>
                                <Button
                                  label={"Create Garage"}
                                  className={"bg-primary"}
                                />
                              </Link>
                            )}
                          </td>
                          <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <div>
                                <img
                                  onClick={() => removeFunction(item._id)}
                                  src={require("../../assets/image/del.png")}
                                  alt="Delete"
                                />
                              </div>
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

export default ServiceRequest;
