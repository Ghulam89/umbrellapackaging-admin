import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AddBrands = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  fetchSizes,
  isEditMode = false,
  editData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgType, setImgType] = useState('url');
  const [name, setName] = useState(editData?.name || "");
  const [image, setImage] = useState(editData?.image || null);

  useEffect(() => {
    if (isEditMode) {
      setName(editData?.name || "");
      setImage(editData?.image || null);
    }
  }, [isEditMode, editData]);


  const resetState = () => {
    setName("");
    setImage(null);
  };

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

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("imgType", imgType);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/brand/update/${editData.id}`
          : `${Base_url}/brand/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === 200) {
        setIsModalOpen(false);
        toast.success(response.data.message || "Brand saved successfully!");
        fetchSizes();
        resetState();
      } else {
        toast.error(response.data.message || "Failed to save Brand.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
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
            {isEditMode ? "Edit Brand" : "Add Brand"}
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
                  label={"Name"}
                  name={"name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={name}
                />
              </div>


              <div className="w-[100%]">
                <label className="block mb-2 font-semibold">Select Image Type</label>
                <div className="w-100 flex flex-row justify-start items-center gap-10">
                  <div className="flex flex-row justify-start items-center gap-3 cursor-pointer" onClick={() => {
                    setImgType('url')
                  }}>
                    <div className={`w-3 h-3 rounded-full p-1  ${imgType === 'url' ? 'border-[6px] border-black' : 'border-[6px]'}`} />
                    <p>Upload URL</p>
                  </div>

                  <div className="flex flex-row justify-start items-center gap-3 cursor-pointer" onClick={() => {
                    setImgType('file')
                  }}>
                    <div className={`w-3 h-3 rounded-full p-1  ${imgType === 'file' ? 'border-[6px] border-black' : 'border-[6px]'}`} />
                    <p>Upload From Gallery</p>
                  </div>
                </div>

              </div>


              {imgType === 'url' ? <div className="w-[100%]">
                <Input
                  label={"Image Url"}
                  name={"image"}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={image}
                />
              </div>
                :
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
              </div>}


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

export default AddBrands;
