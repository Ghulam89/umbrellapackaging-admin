import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddNews = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  fetchSizes,
  isEditMode = false,
  editData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("pending");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  useEffect(() => {
    if (isEditMode && editData) {
      setTitle(editData.title || "");
      setContent(editData.content || "");
      setImage(`${Base_url}/${editData.image}` || null);
      setStatus(editData.status || "pending");
      setSelectedCategory(editData.category || "");
    }
  }, [isEditMode, editData]);

  const resetState = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setStatus("pending");
    setSelectedCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() ||  !content.trim()) {
      toast.error("Title,  and content are required!");
      return;
    }

    if (!image && !isEditMode) {
      toast.error("Featured image is required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    formData.append("category", selectedCategory);
    
    if (image && typeof image !== 'string') {
      formData.append("image", image);
    }

    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/blog/update/${editData._id}`
          : `${Base_url}/blog/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === 200) {
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
    'color', 'background',
    'align'
  ];

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} className={'rounded-md'}>
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="p-3 flex justify-between items-center sticky top-0 bg-white z-10">
          <div></div>
          <h1 className="capitalize text-xl font-semibold">
            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <MdClose
            className="cursor-pointer hover:text-red-500"
            onClick={() => {
              setIsModalOpen(false);
              resetState();
            }}
            size={25}
          />
        </div>
        <hr />
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Input
                  label="Title*"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border w-full p-3 rounded-md"
                  placeholder="Enter blog title"
                  required

                  defaultValue={title}
                />
              </div>


              <div>
                <label className="block mb-2 font-medium">
                   Image*
                  {!isEditMode && (
                    <span className="text-xs text-gray-500 ml-1">(required)</span>
                  )}
                </label>


                <div className=" rounded-md ">
                  
                    <label className="">
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className=" w-full cursor-pointer bg-blue-50 text-blue-600 p-2  rounded-md hover:bg-blue-100"
                        required={!isEditMode}
                      />
                    </label>
                  </div>
                 
                {image ? (
                  <div className="mb-3 border w-32 h-32 mt-4 rounded-md overflow-hidden">
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt="Featured preview"
                      className="w-full  h-full object-cover"
                    />
                   
                  </div>
                ) : (
                  <p className="text-gray-500 mb-2">No image selected</p>
                )}
                
              </div>

              <div>
                <label className="block mb-2 font-medium">Content*</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  className="bg-white rounded-md"
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            <Button
            label={isLoading ? (
              "Processing..."
            ) : isEditMode ? (
              "Update Blog Post"
            ) : (
              "Publish Blog Post"
            )}
              type="submit"
              disabled={isLoading}
              className={`mt-6 w-full py-3 rounded-md ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : " bg-primary hover:bg-blue-700"
              } text-white font-medium`}
            >
             
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddNews;