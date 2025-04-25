import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { MdClose } from "react-icons/md";

const AddBanner = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  fetchSizes,
  isEditMode = false,
  editData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(editData?.location || "");
  const [link, setLink] = useState(editData?.link || "");
  const [image, setImage] = useState(editData?.image || null);

  useEffect(() => {
    if (isEditMode) {
      setLocation(editData?.location || "");
      setLink(editData?.link || "");
      setImage(editData?.image || null);
    }
  }, [isEditMode, editData]);


  const resetState = () => {
    // location("");
    setLink("");
    setImage(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location.trim()) {
      toast.error("location is required!");
      return;
    }


      
      if (!link.trim()) {
        toast.error("Link is required!");
        return;
      }


    if (!image && !isEditMode) {
      toast.error("Image is required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("location", location);
    formData.append("link", link);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/banner/update/${editData.id}`
          : `${Base_url}/banner/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === 200) {
        setIsModalOpen(false);
        toast.success(response.data.message || "Banner saved successfully!");
        resetState();
        fetchSizes();
      } else {
        toast.error(response.data.message || "Failed to save Slider.");
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div>
        <div className="p-3 flex justify-between items-center">
          <div></div>
          <h1 className="capitalize h4 font-semibold">
            {isEditMode ? "Edit Banner" : "Add Banner"}
          </h1>
          <MdClose
            className=" cursor-pointer"
            onClick={() => {setIsModalOpen(false)
              resetState()
            }}
            size={25}
          />
        </div>
        <hr />
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-5 flex-wrap">
              <div className="w-[100%]">
                <Input
                  label={"Location"}
                  name={"location"}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={location}
                />
              </div>
              
            
              <div className="w-[100%]">
                <Input
                  label={"Link"}
                  name={"link"}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={link}
                />
              </div>
            
              <div className="w-[100%]">
              <label className="block mb-2 font-semibold">Image</label>
                {image ? (
                  <div className="mb-3 border rounded-md">
                    <img
                      src={
                        typeof image === "string"
                          ? image 
                          : URL.createObjectURL(image)
                      }
                      alt="Selected"
                      className="w-full h-40 object-cover rounded-md"
                    />

                    {/* <button
                      type="button"
                      onClick={() => setImage(null)} 
                      className="mt-2 text-red-500 underline"
                    >
                      Remove Image
                    </button> */}
                  </div>
                ) : (
                  <p className="mb-3 text-sm text-gray-500">
                    No image selected
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="border w-full  py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
                />
              </div>
            </div>
            <Button
              label={isLoading ? "Loading..." : isEditMode ? "Update" : "Add"}
              type={"submit"}
              disabled={isLoading}
              className={`bg-primary mt-3 uppercase text-white py-2 w-full ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddBanner;
