import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AddAge = ({
    isModalOpen,
    setIsModalOpen,
    closeModal,
    fetchSizes,
    isEditMode = false,
    editData = {},
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(editData?.name || "");
  
    useEffect(() => {
      if (isEditMode) {
        setName(editData?.name || "");
      }
    }, [isEditMode, editData]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!name.trim()) {
        toast.error("Name is required!");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios({
          method: isEditMode ? "PUT" : "POST",
          url: isEditMode
            ? `${Base_url}/age/update/${editData.id}`
            : `${Base_url}/age/create`,
          data: { name },
          headers: { "Content-Type": "application/json" },
        });
  
        if (response?.status === 200) {
          setIsModalOpen(false);
          toast.success(response.data.message || "Age saved successfully!");
          fetchSizes();
        } else {
          toast.error(response.data.message || "Failed to save Age.");
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
              {isEditMode ? "Edit Age" : "Add Age"}
            </h1>
            <MdClose className=" cursor-pointer" onClick={() => setIsModalOpen(false)} size={25} />
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
  
  export default AddAge;
  