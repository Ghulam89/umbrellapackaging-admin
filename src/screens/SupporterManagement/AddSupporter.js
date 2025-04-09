import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";

const AddSupporter = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  setUsers,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);

  console.log(selectedImage);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setSelectedImages(file)
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [loading,setLoading]= useState(false);



  const bannerSubmit = async (values) => {
    if (!selectedImage) {
      toast.error("Please choose your profile!");
    } else if (values.title.value.length === 0) {
      toast.error("Please Enter title!");
    } else if (values.carName.value.length === 0) {
      toast.error("Please Enter car Name!");
    } else if (values.carModel.value.length === 0) {
      toast.error("Please Enter car model!");
    } else if (values.year.value.length === 0) {
      toast.error("Please Enter year!");
    } else if (values.codeSeries.value.length === 0) {
      toast.error("Please Enter code Series!");
    } else if (values.ilco.value.length === 0) {
      toast.error("Please Enter code ilco!");
    } else if (values.cardNo.value.length === 0) {
      toast.error("Please Enter code card no!");
    } else if (values.transponder.value.length === 0) {
      toast.error("Please Enter transponder!");
    } else if (values.substitute.value.length === 0) {
      toast.error("Please Enter substitute!");
    } else if (values.notes.value.length === 0) {
      toast.error("Please Enter notes!");
    } else {
      setLoading(true)
      let profilephoto = " ";

      try {
        let param = new FormData();

        param.append("avatars", selectedImages);

        profilephoto = await axios.post(
          `https://autoproapp-1537b3ac9acb.herokuapp.com/v1/customer/uploadImage`,
          param
        );

        console.log(profilephoto, "=====profile photo===");
        // console.log(profilephoto?.data?.response,'=====profile photo2===');
      } catch (error) {
        console.log(error);
      }
      

      const params = {
        title: values.title.value,
        carName: values.carName.value,
        carModel: values.carModel.value,
        year: values.year.value,
        codeSeries: values.codeSeries.value,
        cardNo: values.cardNo.value,
        transponder: values.transponder.value,
        substitute: values.substitute.value,
        notes: values.notes.value,
        image: profilephoto?.data[0].url,
      };
      await axios
        .post(`${Base_url}/key/create`, params)
        .then((res) => {
          console.log(res.data);

          if (res.data.status === 'success') {
            toast.success(res.data?.message);
            setIsModalOpen(false);
            setLoading(false)
            axios
              .get(`${Base_url}/key/getAll`)
              .then((res) => {
                console.log(res.data);

                setUsers(res.data.data);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          toast.error(error);

          setLoading(false)
        });
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {/* Modal Content */}
        <div className="">
          <div className=" p-3 flex justify-between items-center">
            <div></div>
            <h1 className="capitalize h4 font-semibold">Add Keys</h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className=" p-5">
            <div className=" text-center my-2">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  className="mx-auto  w-28  h-28  rounded-xl"
                  alt=""
                />
              ) : (
                <>
                 
                  <div className="mx-auto flex justify-center items-center  bg-gray-100 w-28  h-28  rounded-xl">
                    <IoImageOutline className=" text-primary" size={60} />
                  </div>
                </>
              )}

              <div className="  my-5">
                <label
                  htmlFor="fileInput"
                  className="px-12 py-2 bg-white  font-semibold text-primary border   border-gray-200 rounded-lg cursor-pointer"
                >
                  Browse File
                </label>
                <input
                  accept="image/*"
                  onChange={handleFileChange}
                  name="profileImage"
                  type="file"
                  id="fileInput"
                  className="hidden"
                />
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                bannerSubmit(e.target);
              }}
            >
              <div className=" flex gap-5 flex-wrap">
                <div className=" md:w-[48%] w-[100%]">
                  <Input
                    label={"Title"}
                    placeholder={""}
                    name={"title"}
                    className={"border  w-full  py-3"}
                  />
                </div>
                <div className=" md:w-[48%] w-[100%]">
                  <Input
                    label={"Car Name"}
                    placeholder={""}
                    name={"carName"}
                    className={"border  w-full  py-3"}
                  />
                </div>

                <div className=" md:w-[48%] w-[100%]">
                  <Input
                    label={"Car Model"}
                    placeholder={""}
                    name={"carModel"}
                    className={"border  w-full  py-3"}
                  />
                </div>
                <div className=" md:w-[48%] w-[100%]">
                  <Input
                    label={"Year"}
                    placeholder={""}
                    name={"year"}
                    className={"border  w-full  py-3"}
                  />
                </div>
                <div className=" md:w-[48%] w-[100%]">
                  <Input
                    label={"Code Series"}
                    name={"codeSeries"}
                    placeholder={""}
                    className={"border  w-full  py-3"}
                  />
                </div>
                <div className=" md:w-[48%] w-[100%]">
                  <Input
                    label={"Ilco"}
                    placeholder={""}
                    name={"ilco"}
                    className={"border  w-full  py-3"}
                  />
                </div>
                <div className=" md:w-[48%] w-[100%]">
                  <Input
                    label={"Card no"}
                    placeholder={""}
                    name={"cardNo"}
                    className={"border  w-full  py-3"}
                  />
                </div>
                <div className=" md:w-[48%] w-[100%]">
                  <Input
                    label={"Transponder"}
                    placeholder={""}
                    name={"transponder"}
                    className={"border  w-full  py-3"}
                  />
                </div>
                <div className="  w-[100%]">
                  <Input
                    label={"Substitute"}
                    placeholder={""}
                    name={"substitute"}
                    className={"border  w-full  py-3"}
                  />
                </div>
                <div className=" md:w-[100%] w-[100%]">
                  <Input
                    label={"notes"}
                    placeholder={""}
                    name={"notes"}
                    className={"border  w-full  py-3"}
                  />
                </div>
              </div>
             {loading===true? <button
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
            </button>: <Button
                label={"save"}
                type={"submit"}
                className={
                  "   bg-primary mt-3 uppercase text-white py-2  w-full"
                }
              />}
            
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddSupporter;
