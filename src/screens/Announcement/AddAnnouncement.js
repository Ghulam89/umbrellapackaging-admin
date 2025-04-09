import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AddAnnouncement = ({
    isModalOpen,
    setIsModalOpen,
    closeModal,
    fetchSizes,
    isEditMode = false,
    editData = {},
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(editData?.title || "");
    const [color, setColor] = useState(editData?.color || "");
    const [subTitle, setSubTitle] = useState(editData?.subTitle || "");



    const resetState = ()=>{
        setTitle("")
        setSubTitle("")
        setColor("")
    }
  
    useEffect(() => {
      if (isEditMode) {
        setTitle(editData?.title || "");
        setColor(editData?.color || "");
        setSubTitle(editData?.subTitle || "");
      }
    }, [isEditMode, editData]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!title.trim()) {
        toast.error("Name is required!");
        return;
      }
      if (!color.trim()) {
        toast.error("Color is required!");
        return;
      }
      if (!subTitle.trim()) {
        toast.error("Sub Title is required!");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios({
          method: isEditMode ? "PUT" : "POST",
          url: isEditMode
            ? `${Base_url}/announce/update/${editData.id}`
            : `${Base_url}/announce/create`,
          data: { title,subTitle,color:color.toLowerCase()},
          headers: { "Content-Type": "application/json" },
        });
  
        if (response?.status === 200) {
          setIsModalOpen(false);
          toast.success(response.data.message || "Announce saved successfully!");
          fetchSizes();
          resetState();
        } else {
          toast.error(response.data.message || "Failed to save size.");
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
              {isEditMode ? "Edit Announce" : "Add Announce"}
            </h1>
            <MdClose className=" cursor-pointer" onClick={() => {setIsModalOpen(false)
              resetState()
            }} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-5 flex-wrap">

                <div className="w-[100%]">
                  <Input
                    label={"Title"}
                    name={"title"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={title}
                  />
                </div>
                <div className="w-[100%]">
                  <Input
                    label={"Color"}
                    name={"Color"}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={color}
                  />
                </div>
                <div className="w-[100%]">
                  <Input
                    label={"Sub Title"}
                    name={"subTitle"}
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={subTitle}
                  />
                </div>
              </div>
              <Button
                label={isLoading ? "Loading..." :isEditMode ? "Update" : "Add"}
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
  
  export default AddAnnouncement;
  