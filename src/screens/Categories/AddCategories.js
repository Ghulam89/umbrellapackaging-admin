import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
const AddCategories = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  fetchSizes,
  isEditMode = false,
  editData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(editData?.name || "");
  const [image, setImage] = useState(editData?.image || null);
  const [banner, setBanner] = useState(editData?.bannerImage || null);
  const [bgColor, setBgColor] = useState(editData?.bgColor || "");
  const resetState = () => {
    setName("");
    setImage(null);
    setBanner(null);
    setBgColor("");
  };
  
 useEffect(() => {
      if (isEditMode) {
        setName(editData?.name || "");
        setImage(editData?.image || null);
        setBgColor(editData?.bgColor || "");
        setBanner(editData?.bannerImage || null);
    
      }
    }, [isEditMode, editData]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required!");
      return;
    }

    if (!image && !isEditMode) {
      toast.error("Image is required!");
      return;
    }

    if (!banner && !isEditMode) {
      toast.error("Banner is required!");
      return;
    }

    if (!bgColor && !isEditMode) {
      toast.error("Background color is required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bgColor", bgColor);
    
    if (image) {
      formData.append("image", image);
    }

    if (banner) {
      formData.append("bannerImage", banner);
    }

    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/brands/update/${editData._id}`
          : `${Base_url}/brands/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data.status ==='success') {
        setIsModalOpen(false);
        toast.success(response.data.message);
        fetchSizes();
        resetState();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} className={' rounded-md'}>
      <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-3 flex justify-between items-center sticky top-0 bg-white z-10">

          <div></div>
          <h1 className="capitalize h4 font-semibold">
            {isEditMode ? "Edit Categories" : "Add Categories"}
          </h1>
          <MdClose
            className=" cursor-pointer"
            onClick={() => {
              setIsModalOpen(false)
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
                  label={"Name"}
                  name={"name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={name}
                />
              </div>
              
              <div className="w-[100%]">
                <Input
                  label={"Background Color"}
                  name={"bgColor"}
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className={"border w-full py-3 h-12"}
                  defaultValue={bgColor}
                />
              </div>

              
              <div className="w-[100%]">
                <label className="block mb-2 font-semibold">Banner</label>
                {banner ? (
                  <div className="mb-3 border rounded-md">
                    <img
                      src={
                        typeof banner === "string"
                          ? banner 
                          : URL.createObjectURL(banner)
                      }
                      alt="Selected"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <p className="mb-3 text-sm text-gray-500">
                    No banner selected
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBanner(e.target.files[0])}
                  className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
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
                    className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
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

export default AddCategories;