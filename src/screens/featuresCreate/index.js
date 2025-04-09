import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import Button from "../../components/Button";
import axios from "axios";
import { Base_url } from "../../utils/Base_url";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
const FeaturedRequest = () => {
  const [users, setUsers] = useState([]);
  const [activeCars, setActiveCards] = useState([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [view, setView] = useState({});

  useEffect(() => {
    axios
      .get(
        `https://new-motorqe-backend.vercel.app/v1/user/get_feature_application`
      )
      .then((res) => {
        console.log(res?.data);

        setUsers(res?.data?.applications);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .post(`${Base_url}/admin/all-cars-by-status?status=active`)
      .then((res) => {
        console.log(res, "active cars");

        setActiveCards(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          .delete(`${Base_url}/admin/delete-car/${id}`)
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");

              axios
                .post(`${Base_url}/admin/all-cars-by-status?status=pending`)
                .then((res) => {
                  console.log(res);

                  setUsers(res.data);
                })
                .catch((error) => {
                  console.log(error);
                });

              axios
                .post(`${Base_url}/admin/all-cars-by-status?status=active`)
                .then((res) => {
                  console.log(res, "active cars");

                  setActiveCards(res.data);
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

  const UpdateStatus = (id, newStatus) => {
    const params = {
      status: newStatus,
    };
    axios
      .patch(`${Base_url}/user/update_feature_application/${id}`, params)
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          toast.success(res.data.message);

          const featureTimePeriodInMinutes =
            res?.data?.application?.featureTimePeriod * 24 * 60;
          const params = {
            featureTimePeriod: featureTimePeriodInMinutes,
          };
          axios
            .post(
              `${Base_url}/user/make-feature/${res?.data?.application?.carId}`,
              params
            )
            .then((res) => {
            //   toast.success(res.data.message);
            })
            .catch((err) => {});
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const UpdateRefresh = () => {
    axios
      .patch(`${Base_url}/admin/allow-refresh`)
      .then((res) => {
        console.log(res);

        if (res.data.success === true) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderTable = (data) => (
    <section className="mb-20 mt-7 text-gray-800">
      <div className=" rounded-lg   overflow-x-auto shadow-lg">
        <div className="flex flex-col">
          <div className=" sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full sm:px-6 lg:px-8 ">
              <div className="overflow-hidden">
                <table className="min-w-full mb-0">
                  <thead className=" bg-primary">
                    <tr className=" rounded-lg whitespace-nowrap ">
                      <th
                        scope="col"
                        className=" text-sm text-white  font-bold px-6 py-4"
                      >
                        No
                      </th>
                      <th
                        scope="col"
                        className=" text-sm text-white  font-bold px-6 py-4"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="text-sm  text-white   font-bold px-6 py-4"
                      >
                        Image
                      </th>

                      <th
                        scope="col"
                        className=" text-sm text-white  font-bold px-6 py-4"
                      >
                        Featured Price
                      </th>


                      <th
                        scope="col"
                        className="text-sm  text-white   font-bold px-6 py-4"
                      >
                        Feature Time Period
                      </th>


                      <th
                        scope="col"
                        className="text-sm  text-white   font-bold px-6 py-4"
                      >
                        Status
                      </th>

                      <th
                        scope="col"
                        className="text-sm  text-white   font-bold px-6 py-4"
                      >
                        Update Status
                      </th>

                      {/* <th
                        scope="col"
                        className="text-sm  text-white   font-bold px-10 py-4"
                      >
                        Action
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="">
                    {users?.map((item, index) => {
                      return (
                        <>
                          <tr className="bg-white border-t   rounded-md ">
                            <th
                              scope="row"
                              className="text-sm font-normal px-6 py-4   whitespace-nowrap "
                            >
                              <p className="mb-0.5 font-medium text-black">
                                #1
                              </p>
                            </th>
                            <td className="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap  text-center">
                              <span className=" text-base text-black  py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline   bg-green-200  rounded-full">
                                {item?.carId?.title}
                              </span>
                            </td>
                            <td className="align-middle text-center text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                              <div className=" w-14 h-14 rounded-lg overflow-hidden">
                                <img
                                  src={item?.carId?.car_images[0]}
                                  className=" w-full h-full"
                                  alt=""
                                />
                              </div>
                            </td>
                            <td className="text-sm font-normal text-center px-6 py-4 whitespace-nowrap">
                              <span className=" text-base text-black  py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline   bg-green-200  rounded-full">
                                {item?.price}
                              </span>
                            </td>
                            <td className="align-middle text-center text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                              <span className=" text-base text-black  py-1 px-2.5 leading-none  whitespace-nowrap    bg-green-200  rounded-full">
                                {item?.featureTimePeriod}
                              </span>
                            </td>
                           

                           
                            <td className="align-middle text-center text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                              <span className=" text-sm text-white bg-primary   py-1 px-2.5 leading-none  whitespace-nowrap    bg-green-200  rounded-full">
                                {item?.status}
                              </span>
                            </td>

                            <td className="align-middle text-center text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                              <select
                                value={item.status || "pending"}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  UpdateStatus(item._id, newStatus);
                                }}
                                className="px-3 py-2 bg-gray-200 rounded-lg shadow-md"
                              >
                                <option value={"pending"}>Pending</option>
                                <option value={"approved"}>Approved</option>
                                <option value={"rejected"}>Rejected</option>
                              </select>
                            </td>

                            {/* <td className="align-middle  text-sm font-normal  py-4 whitespace-nowrap">
                              <div className=" flex items-center justify-center gap-2">
                                <div className=" cursor-pointer">
                                  <img
                                    onClick={() => removeFunction(item._id)}
                                    src={require("../../assets/image/del.png")}
                                    alt=""
                                  />
                                </div>
                              </div>
                            </td> */}
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <div className=" flex   justify-between items-center">
        <div>
          <h2 className="main_title"> Featured Request</h2>
        </div>
      </div>
      {renderTable(users)}
    </>
  );
};

export default FeaturedRequest;
