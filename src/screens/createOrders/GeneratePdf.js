import React, { useState, useEffect } from "react";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Button from "../../components/Button";
import { usePDF } from "react-to-pdf";
import moment from "moment";

const GeneratePdf = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  setUsers,
  getData,
}) => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  console.log(getData);

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="">
          <div className=" p-3 flex justify-between items-center">
            <div></div>
            <h1 className="capitalize h4 font-semibold">Generate Pdf</h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className=" p-5">
            <div ref={targetRef} className="container_main">
              <div className="card-container">
                <div className=" border rounded-lg mb-3 p-4 flex gap-3">
                  <div className=" w-48 h-14">
                    <img
                      src={require("../../assets/image/barcode.png")}
                      alt="Sample"
                      className="card-image w-full h-full"
                    />
                  </div>
                  <div className=" w-48 h-16">
                    <img
                      src={require("../../assets/image/logo.png")}
                      alt="Sample"
                      className="card-image"
                    />
                  </div>
                </div>
                <div className=" flex border gap-3 rounded-lg p-4">
                  <div className=" text-left w-[45%]">
                    <p className="  m-0  border-black  font-bold  text-black">
                      To :
                    </p>
                    <ul className="  border-black py-3">

                      <li className="  font-bold text-sm text-black">

                        <span className=" text-gray-400  text-md  font-normal">{getData?.senderAddress1}</span>
                      </li>

                    </ul>
                  </div>
                  <div className="  text-left  w-[45%]">
                    <p className="  m-0  border-black font-bold  text-black">
                      From :
                    </p>

                    <ul className="  border-black py-3">

                      <li className="  font-bold text-sm text-black">

                        <span className=" text-gray-400  text-md font-normal">
                          {getData?.receiverAddress1}
                        </span>
                      </li>

                    </ul>
                  </div>
                </div>

                <div className="border my-3 rounded-lg  p-4">
                  <div className="   flex justify-between items-center  ">
                    <div className=" text-left">
                      <h5 className="  text-lg   font-bold">
                        Tracking Number:
                      </h5>
                      <h5>
                        {getData?.orderId?.tracking}
                      </h5>

                    </div>
                    <div className=" text-left">
                      <div className=" bg-gray-200 border py-4 px-2">
                        <div className=" w-48 h-12">
                          <img
                            src={require("../../assets/image/barcode.png")}
                            alt="Sample"
                            className="card-image w-full h-full"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className=" flex pt-3 justify-between">
                    <div className="">
                      <h3 className=" text-gray-500 font-medium">Ship Date:</h3>
                      <h3 className=" text-gray-500">08/15/2024</h3>
                    </div>
                    <div className="">
                      <h3 className=" text-gray-500 font-medium">Delivery Date:</h3>
                      <h3 className=" text-gray-500">{moment(getData?.createdAt).format('DD-MM-YYYY')}</h3>
                    </div>
                  </div>
                </div>
                <div className=" flex items-center bg-white border-2 p-3 rounded-md  justify-between gap-3">
                  <div>
                    {/* <h5 className="  text-lg border-t border-b py-2.5 border-black font-bold">
                    Tracking Number : {getData?.orderId?.tracking}
                  </h5> */}
                    <h4 className=" m-0 text-black font-semibold text-left">powered by:</h4>
                    <div className=" flex justify-center items-center h-24 w-32">
                      <img
                        src={require("../../assets/image/slip_logo.jpeg")}
                        alt="Sample"
                        className=" mx-auto w-full  h-full"
                      />
                    </div>

                  </div>
                  <div className="  text-left">
                    <h5 className=" font-semibold  text-black text-lg">Shipment Information:</h5>
                    <ul className=" p-0">
                      <li>
                        Pieces: {getData?.itemNumber}
                      </li>
                      <li>
                        COD Amount: {getData?.codAmount}
                      </li>
                      <li>
                        Order ID: {getData?.orderId?._id}
                      </li>
                      <li>
                        Origin: {getData?.senderArea}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className=" mx-auto mt-3 flex justify-center">
              <button
                onClick={() => toPDF()}
                className="text-base  cursor-pointer bg-primary text-white py-2.5 px-5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-md"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GeneratePdf;
