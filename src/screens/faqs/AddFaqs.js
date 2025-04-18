import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AddFaqs = ({
    isModalOpen,
    setIsModalOpen,
    closeModal,
    fetchSizes,
    isEditMode = false,
    editData = {},
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState(editData?.question || "");
    const [answer, setAnswer] = useState(editData?.answer || "");
  
    useEffect(() => {
      if (isEditMode) {
        setQuestion(editData?.question || "");
        setAnswer(editData?.answer || "");
      }
    }, [isEditMode, editData]);


    const resetData = ()=>{
      setQuestion('')
      setAnswer('')
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!question.trim()) {
        toast.error("Question is required!");
        return;
      }

      if (!answer.trim()) {
        toast.error("Answer is required!");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios({
          method: isEditMode ? "PUT" : "POST",
          url: isEditMode
            ? `${Base_url}/faq/update/${editData.id}`
            : `${Base_url}/faq/create`,
          data: { question,answer },
          headers: { "Content-Type": "application/json" },
        });
  
        if (response?.status === 200) {
          setIsModalOpen(false);
          toast.success(response.data.message || "Faq saved successfully!");
          fetchSizes();
          resetData();
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
      <Modal isOpen={isModalOpen} onClose={closeModal} className={' rounded-md'}>
        <div>
          <div className="p-3 flex justify-between items-center">
            <div></div>
            <h1 className="capitalize h4 font-semibold">
              {isEditMode ? "Edit Faq" : "Add Faq"}
            </h1>
            <MdClose className=" cursor-pointer" onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-5 flex-wrap">
                <div className="w-[100%]">
                  <Input
                    label={"Question"}
                    name={"name"}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={question}
                  />
                </div>
                <div className="w-[100%]">
                  <Input
                    label={"Answer"}
                    name={"answer"}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={answer}
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
  
  export default AddFaqs;
  