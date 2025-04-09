import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";

const CreateOrder = ({ isModalOpen, setIsModalOpen, closeModal, setUsers }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);
  const generateRandomAccountId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  console.log(selectedImage);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setSelectedImages(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [loading, setLoading] = useState(false);

  const bannerSubmit = async (values) => {
    try {
      setLoading(true);
      const accountId = generateRandomAccountId();
  
      const orderResponse = await axios.get(`${Base_url}/order/get/${values?.orderId?.value}`);
      
      if (orderResponse.data.status === "ok") {
        const params = {
          shippingRef: values.shippingRef.value,
          goodsDescr: values.goodsDescr.value,
          product: values.product.value,
          customCurrencyCode: values.customCurrencyCode.value,
          length: values.length.value,
          width: values.width.value,
          height: values.height.value,
          goodsOriginCode: values.goodsOriginCode.value,
          weight: values.weight.value,
          label: `DW${accountId}`,
          itemNumber: values.itemNumber.value,
          packageNumber: values.packageNumber.value,
          shipValue: values.shipValue.value,
          serviceType: values.serviceType.value,
          paymentMethod: values.paymentMethod.value,
          codAmount: values.codAmount.value,
          notes: values.notes.value,
          hsCode: values.hsCode.value,
          quantity: values.quantity.value,
          unitPrice: values.unitPrice.value,
          receiverName: values.receiverName.value,
          receiverContact: values.receiverContact.value,
          receiverAddress1: values.receiverAddress1.value,
          receiverAddress2: values.receiverAddress2.value,
          receiverArea: values.receiverArea.value,
          receiverCity: values.receiverCity.value,
          receiverCountryCode: values.receiverCountryCode.value,
          receiverMobile: values.receiverMobile.value,
          receiverPhone: values.receiverPhone.value,
          receiverZipCode: values.receiverZipCode.value,
          receiverEmail: values.receiverEmail.value,
          senderName: values.senderName.value,
          senderContact: values.senderContact.value,
          senderAddress1: values.senderAddress1.value,
          senderAddress2: values.senderAddress2.value,
          senderArea: values.senderArea.value,
          senderCity: values.senderCity.value,
          senderCountryCode: values.senderCountryCode.value,
          senderMobile: values.senderMobile.value,
          senderPhone: values.senderPhone.value,
          senderZipCode: values.senderZipCode.value,
          senderEmail: values.senderEmail.value,
          orderId: values.orderId.value,
          userId: orderResponse.data.data.userId?._id,
        };
  
        const bookResponse = await axios.post(`${Base_url}/book/create`, params);
  
        if (bookResponse.data.status === "ok") {
          toast.success(bookResponse.data?.message);
  
          const formData = new FormData();
          formData.append("tracking", bookResponse?.data?.data?._id);
  
          const updateResponse = await axios.put(
            `${Base_url}/order/update/${bookResponse?.data?.data?.orderId}`,
            formData
          );
  
          console.log(updateResponse.data);
          setIsModalOpen(false);

          axios
          .get(`${Base_url}/order/get`)
          .then((res) => {
            console.log(res.data);
    
            setUsers(res.data.data);
          })
          .catch((error) => {
            console.log(error);
          });

        } else if (bookResponse.data.status === "fail") {
          toast.error(bookResponse.data?.message);
        }
      } else {
        toast.error(orderResponse.data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {/* Modal Content */}
        <div className="">
          <div className=" p-3 flex justify-between items-center">
            <div></div>
            <h1 className="capitalize h4 font-semibold">Create Order </h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className=" p-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                bannerSubmit(e.target);
              }}
            >
              <div className="  grid   grid-cols-2 gap-3">
                <div className=" w-[100%]">
                  <Input
                    label={"Order ID:"}
                    placeholder={""}
                    name={"orderId"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Shipping Refernce:"}
                    placeholder={""}
                    name={"shippingRef"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>

                <div className=" w-[100%]">
                  <Input
                    label={"Goods Description:"}
                    placeholder={""}
                    name={"goodsDescr"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Product:"}
                    placeholder={""}
                    name={"product"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Custom Currency Code:"}
                    placeholder={""}
                    name={"customCurrencyCode"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"length:"}
                    placeholder={""}
                    name={"length"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"width:"}
                    placeholder={""}
                    name={"width"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"height:"}
                    placeholder={""}
                    name={"height"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Goods Origin Country Code:"}
                    placeholder={""}
                    name={"goodsOriginCode"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Weight:"}
                    placeholder={""}
                    name={"weight"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"No Of Items:"}
                    placeholder={""}
                    name={"itemNumber"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"No Of Packages:"}
                    placeholder={""}
                    name={"packageNumber"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Shipment Value:"}
                    placeholder={""}
                    name={"shipValue"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Service Type:"}
                    placeholder={""}
                    name={"serviceType"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Payment Method:"}
                    placeholder={""}
                    name={"paymentMethod"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"COD Amount:"}
                    placeholder={""}
                    name={"codAmount"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Notes:"}
                    placeholder={""}
                    name={"notes"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Hs Code:"}
                    placeholder={""}
                    name={"hsCode"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Quantity:"}
                    placeholder={""}
                    name={"quantity"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"UnitPrice:"}
                    placeholder={""}
                    name={"unitPrice"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Name:"}
                    placeholder={""}
                    name={"receiverName"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Contact Person:"}
                    placeholder={""}
                    name={"receiverContact"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Address 1:"}
                    placeholder={""}
                    name={"receiverAddress1"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Address 2:"}
                    placeholder={""}
                    name={"receiverAddress2"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Area:"}
                    placeholder={""}
                    name={"receiverArea"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver City:"}
                    placeholder={""}
                    name={"receiverCity"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Country Code:"}
                    placeholder={""}
                    name={"receiverCountryCode"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Mobile:"}
                    placeholder={""}
                    name={"receiverMobile"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Phone:"}
                    placeholder={""}
                    name={"receiverPhone"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Zipcode :"}
                    placeholder={""}
                    name={"receiverZipCode"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Receiver Email :"}
                    placeholder={""}
                    name={"receiverEmail"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Name :"}
                    placeholder={""}
                    name={"senderName"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Contact Person :"}
                    placeholder={""}
                    name={"senderContact"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Address 1 :"}
                    placeholder={""}
                    name={"senderAddress1"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Address 2 :"}
                    placeholder={""}
                    name={"senderAddress2"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Area :"}
                    placeholder={""}
                    name={"senderArea"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender City :"}
                    placeholder={""}
                    name={"senderCity"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Country Code :"}
                    placeholder={""}
                    name={"senderCountryCode"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Phone :"}
                    placeholder={""}
                    name={"senderPhone"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Mobile :"}
                    placeholder={""}
                    name={"senderMobile"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
                
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Zipcode :"}
                    placeholder={""}
                    name={"senderZipCode"}
                    className={"border  w-full  py-3"}
                    required={true}
                    type={'number'}
                  />
                </div>
                <div className=" w-[100%]">
                  <Input
                    label={"Sender Email :"}
                    placeholder={""}
                    type={'name'}
                    name={"senderEmail"}
                    className={"border  w-full  py-3"}
                    required={true}
                  />
                </div>
              </div>
              {loading === true ? (
                <button
                  disabled
                  type="button"
                  class="w-full h-11 bg-primary border-none outline-none  rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-white animate-spin"
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
                  label={"Submit"}
                  type={"submit"}
                  className={
                    "   bg-primary mt-3 uppercase text-white py-2  w-full"
                  }
                />
              )}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateOrder;
