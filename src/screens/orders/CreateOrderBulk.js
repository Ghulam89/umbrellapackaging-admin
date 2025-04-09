import React, { useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import * as XLSX from "xlsx";

const CreateOrderBulk = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  setUsers,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  console.log(data, "=============>>>>>>>>>>>");

  const generateRandomAccountId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleFileUpload = (event) => {
    console.log(event);

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const bannerSubmit = async (e) => {
    e.preventDefault();
  
    if (data.length === 0) {
      toast.error("Please upload an Excel file!");
    } else if (data[0].length === 0) {
      toast.error("The uploaded Excel file is empty!");
    } else {
      setLoading(true);
      const keys = data[0];
      const promises = data.slice(1).map(async (row) => {
        const params = {};
        keys.forEach((key, index) => {
          params[key] = row[index];
        });
  
        try {
          const orderResponse = await axios.get(`${Base_url}/order/get/${params.orderId}`);
  
          if (orderResponse.data.status === "ok") {
            params.label = `DW${generateRandomAccountId()}`;
            // Initialize all the params fields
            params.shippingRef = params.shippingRef || "";
            params.goodsDescr = params.goodsDescr || "";
            params.product = params.product || "";
            params.customCurrencyCode = params.customCurrencyCode || "";
            params.length = params.length || "";
            params.width = params.width || "";
            params.height = params.height || "";
            params.goodsOriginCode = params.goodsOriginCode || "";
            params.weight = params.weight || "";
            params.itemNumber = params.itemNumber || "";
            params.packageNumber = params.packageNumber || "";
            params.shipValue = params.shipValue || "";
            params.serviceType = params.serviceType || "";
            params.paymentMethod = params.paymentMethod || "";
            params.codAmount = params.codAmount || "";
            params.notes = params.notes || "";
            params.hsCode = params.hsCode || "";
            params.quantity = params.quantity || "";
            params.unitPrice = params.unitPrice || "";
            params.receiverName = params.receiverName || "";
            params.receiverContact = params.receiverContact || "";
            params.receiverAddress1 = params.receiverAddress1 || "";
            params.receiverAddress2 = params.receiverAddress2 || "";
            params.receiverArea = params.receiverArea || "";
            params.receiverCity = params.receiverCity || "";
            params.receiverCountryCode = params.receiverCountryCode || "";
            params.receiverMobile = params.receiverMobile || "";
            params.receiverPhone = params.receiverPhone || "";
            params.receiverZipCode = params.receiverZipCode || "";
            params.receiverEmail = params.receiverEmail || "";
            params.senderName = params.senderName || "";
            params.senderContact = params.senderContact || "";
            params.senderAddress1 = params.senderAddress1 || "";
            params.senderAddress2 = params.senderAddress2 || "";
            params.senderArea = params.senderArea || "";
            params.senderCity = params.senderCity || "";
            params.senderCountryCode = params.senderCountryCode || "";
            params.senderMobile = params.senderMobile || "";
            params.senderPhone = params.senderPhone || "";
            params.senderZipCode = params.senderZipCode || "";
            params.senderEmail = params.senderEmail || "";
            params.orderId = params.orderId || "";
            params.userId  =  orderResponse.data.data.userId?._id;
  
            if (!params.orderId || params.orderId.trim() === "") {
              toast.error("Order ID is required and cannot be empty!");
              return;
            }
  
            console.log(params);
  
            try {
              const res = await axios.post(`${Base_url}/book/create`, params);
              console.log(res);
  
              if (res.data.status === "ok") {
                toast.success(res.data?.message);
                const trackingParams = new FormData();
                trackingParams.append("tracking", res?.data?.data?._id);
  
                await axios.put(
                  `${Base_url}/order/update/${res?.data?.data?.orderId}`,
                  trackingParams
                );
                setIsModalOpen(false);
                toast.success("Order created successfully!");
              } else if (res.data.status === "fail") {
                bannerSubmit();
              }
            } catch (error) {
              toast.error(error.response?.data?.message || error.message);
            }
            
          } else {
            toast.error('Invalid order ID!');
          }
        } catch (error) {
          toast.error('Failed to fetch order details. Please check the order ID and try again.');
        }
      });
  
      await Promise.all(promises);
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <div className="p-3 flex justify-between items-center">
            <h1 className="capitalize h4 font-semibold">
              Create Order In Bulk
            </h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <form onSubmit={bannerSubmit}>
              <div className="grid grid-cols-1 gap-3">
                <div className="w-[100%]">
                  <Input
                    type="file"
                    label="Upload Excel File:"
                    onChange={handleFileUpload}
                    className="border w-full py-3"
                  />
                </div>
              </div>
              {loading ? (
                <button
                  disabled
                  type="button"
                  className="w-full h-11 bg-primary border-none outline-none rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
              ) : (
                <Button
                  label="Submit"
                  type="submit"
                  className="bg-primary mt-3 uppercase text-white py-2 w-full"
                />
              )}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateOrderBulk;
