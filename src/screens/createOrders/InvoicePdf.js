import React, { useState, useEffect } from "react";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Button from "../../components/Button";
import { usePDF } from "react-to-pdf";

const InvoicePdf = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  setUsers,
  getData,
}) => {
  const { toPDF, targetRef } = usePDF({ filename: "invoice.pdf" });

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className=" ">
          <div className="p-3 flex justify-between items-center">
            <div></div>
            <h1 className="capitalize h4 font-semibold">Generate Pdf</h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <div ref={targetRef} className="container_main">
              <div className="">
                <div className=" h-32  w-56 mx-auto">
                <img
                    src={require("../../assets/image/slip_logo.jpeg")}
                  alt="Sample"
                  className="card-image h-full w-full object-center"
                />
                </div>
                <h1 className="font-bold text-3xl pb-10 text-center pt-2">
                  Invoice
                </h1>

                {/* From/To Table */}
                <div>
                  <table className="w-full border border-gray-300 mb-5">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 text-left">
                          From : {getData?.receiverArea}
                        </th>
                        <th className="p-2 text-left">
                          To : {getData?.senderArea}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-t border-gray-300">
                          {getData?.receiverAddress1}
                        </td>
                        <td className="p-2 border-t border-gray-300">
                          {getData?.senderAddress1}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Package Details Table */}
                <div className="my-5">
                  <table className="w-full border border-gray-300">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 text-left">Package Description</th>
                        <th className="p-2 text-left">Package Quantity</th>
                        <th className="p-2 text-left">Shipment Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-t border-gray-300">
                          {getData?.packageNumber}
                        </td>
                        <td className="p-2 border-t border-gray-300">
                          {getData?.quantity}
                        </td>
                        <td className="p-2 border-t border-gray-300">
                         {getData?.shipValue}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex  justify-between">
                <div className=" text-left">
                    <h5 className="  text-lg   font-bold">
                    Tracking Number:
                  </h5>
                  <h5 className=" font-semibold">
                  {getData?.orderId?.tracking}
                  </h5>
                 
                  </div>
                  <h5 className="text-lg font-bold">
                    Total: ${getData?.orderId?.unitPrice * getData?.orderId?.quantity}
                  </h5>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-3 flex justify-end">
              <button
                onClick={() => toPDF()}
                className="text-base cursor-pointer bg-primary text-white py-2.5 px-5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-md"
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

export default InvoicePdf;
