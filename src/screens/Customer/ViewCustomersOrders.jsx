import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import axios from "axios";
import { Base_url } from "../../utils/Base_url";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import { usePDF } from "react-to-pdf";
const ViewCustomersOrders = () => {
  const [users, setUsers] = useState([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isUpdateOpen2, setIsUpdateOpen2] = useState(false);
  const [singleUser, setSingleUser] = useState({});
  const {id} = useParams();
  const UpdateModal = () => {
    setIsUpdateOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateOpen(false);
  };


  const UpdateModal2 = () => {
    setIsUpdateOpen2(true);
  };

  const closeUpdateModal2 = () => {
    setIsUpdateOpen2(false);
  };

  console.log(isUpdateOpen);

  const [deleteUser, setDeleteUser] = useState({});

  console.log(deleteUser, "deleteUser");

  useEffect(() => {
    axios
      .get(`${Base_url}/book/getUser/${id}`)
      .then((res) => {
        console.log(res.data);

        setUsers(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(users);



  const { toPDF, targetRef } = usePDF({ filename: `page.pdf` });




  

  return (

    <div className=" bg-primary  h-full flex justify-center items-center">
    
      <section   className=" w-[80%] bg-white my-8 mx-auto p-4 rounded-lg  rounded-lg shadow-lg">
           <div  ref={targetRef} className="">
            <div className=" px-6  my-5"> 
            <div className=" my-3 ">
         <img  src={require('../../assets/image/slip_logo.jpeg')}  className=" mx-auto   w-44 object-contain" alt="" />
         </div>
        <div className=" py-4 border-t border-b text-center font-semibold  text-xl">
            Diec World Finance Report!
        </div>
        <div className="block pt-2">
          
                  <table className="min-w-full mb-0">
                    <thead className="">
                      <tr className=" rounded-lg bg-gray-50 border-t whitespace-nowrap ">
                        <th
                          scope="col"
                          className=" text-sm text-gray-500  font-bold py-4"
                        >
                          Shipper No
                        </th>
                        <th
                          scope="col"
                          className=" text-sm text-black  font-bold  py-4"
                        >
                           Tracking No
                        </th>
                        <th
                          scope="col"
                          className=" text-sm text-black  font-bold  py-4"
                        >
                          Order Created Date
                        </th>

                        <th
                          scope="col"
                          className="text-sm  text-black   font-bold  py-4"
                        >
                          Product Description 
                        </th>

                        <th
                          scope="col"
                          className="text-sm  text-black  font-bold  py-4"
                        >
                          Quantity
                        </th>

                        <th
                          scope="col"
                          className="text-sm  text-black  font-bold  py-4"
                        >
                          Unit Price
                        </th>
                        <th
                          scope="col"
                          className="text-sm  text-black   font-bold  py-4"
                        >
                          Weight Units
                        </th>
                        <th
                          scope="col"
                          className="text-sm  text-black   font-bold py-4"
                        >
                          Unit of Measurement
                        </th>

                      </tr>
                    </thead>
                    <tbody className="">
                      {users?.map((item, index) => {
                        return (
                          <>
                            <tr className="bg-white border-t   rounded-md ">
                              <th
                                scope="row"
                                className="text-sm font-normal py-4   whitespace-nowrap "
                              >
                                <p className="mb-0.5 font-medium text-black">
                                  {item?.senderName}
                                </p>
                              </th>
                              <td className="align-middle text-sm font-normal py-4 whitespace-nowrap  text-center">
                                <span className=" text-base text-black  py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline   bg-green-200  rounded-full">
                                {item?.orderId?.tracking}
                                </span>
                              </td>
                              <td className="text-sm font-normal text-center py-4 whitespace-nowrap">
                                <span className=" text-base text-black  py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline   bg-green-200  rounded-full">
                                  {item?.orderId?.unitPrice}
                                </span>
                              </td>
                              <td className="align-middle text-center text-sm font-normal  py-4 whitespace-nowrap text-left">
                                <span className=" text-base text-black  py-1 px-2.5 leading-none  whitespace-nowrap    bg-green-200  rounded-full">
                                  {item?.orderId?.comment}
                                </span>
                              </td>
                              <td className="align-middle text-center text-sm font-normal py-4 whitespace-nowrap ">
                                <span className=" text-base text-black  py-1 px-2.5 leading-none  whitespace-nowrap    bg-green-200  rounded-full">
                                {item?.orderId?.quantity}
                                </span>
                              </td>
                              <td className="align-middle text-center text-sm font-normal py-4 whitespace-nowrap ">
                                <span className=" text-base text-black  py-1 px-2.5 leading-none  whitespace-nowrap    bg-green-200  rounded-full">
                                {item?.orderId?.unitPrice}
                                </span>
                              </td>
                              <td className="align-middle text-center text-sm font-normal py-4 whitespace-nowrap ">
                                <span className=" text-base text-black  py-1 px-2.5 leading-none  whitespace-nowrap    bg-green-200  rounded-full">
                                {item?.weight}
                                </span>
                              </td>
                              <td className="align-middle text-center text-sm font-normal py-4 whitespace-nowrap ">
                                <span className=" text-base text-black  py-1 px-2.5 leading-none  whitespace-nowrap    bg-green-200  rounded-full">
                                Kg
                                </span>
                              </td>

                             
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
               
             

              <div className=" flex justify-end border-t border-b py-4 text-right items-center">
                <div>
                <div className=" font-medium">
                    <span className=" text-gray-500"> Total Unit Price: </span> 3390
                </div>
                <div className="font-medium">
                    <span className=" text-gray-500 text-end"> Total Order: </span> 6
                </div>
                </div>
              </div>
             
            
          
        </div>
            </div>
           </div>
       
        
        <div className=" w-40 pt-2 float-right">
            <Button onClick={() => toPDF()} label={'Download PDF'} className={' '} />
        </div>
      </section>
      </div>
  );
};

export default ViewCustomersOrders;
