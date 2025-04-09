import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AddNews = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  fetchSizes,
  isEditMode = false,
  editData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(editData?.name || "");
  const [subTitle, setSubTitle] = useState(editData?.subTitle || "");
  const [descr, setDescr] = useState(editData?.descr || "");
  const [image, setImage] = useState( editData?.image || null);


  const [allCategories,setAllCategories] = useState([])

  const [blogs,setBlogs] = useState(editData?.blogCategoryId || "")


  useEffect(()=>{
    const fetchAllCategories = async () => {
      let allCategories = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await axios.get(`${Base_url}/blogCategory/get`, {
            params: { page: currentPage, limit: 20 },
          });

          const { data, totalPages: apiTotalPages } = response.data;

          allCategories = [...allCategories, ...data];
          totalPages = apiTotalPages;
          currentPage++;
        }

        setAllCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchAllCategories();
  },[])

  
  useEffect(() => {
    if (isEditMode) {
      setName(editData?.name || "");
      setSubTitle(editData?.subTitle || "");
      setBlogs(editData?.blogCategoryId || "")
      setDescr(editData?.descr || "");
      setImage(editData?.image || null); // Reset image when in edit mode
    }
  }, [isEditMode, editData]);


  const resetState = () => {
    setName("");
    setSubTitle("")
    setDescr("");
    setImage(null)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !subTitle.trim() || !descr.trim()) {
      toast.error("All fields are required!");
      return;
    }

    if (!image && !isEditMode) {
      toast.error("Image is required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("blogCategoryId", blogs);
    formData.append("subTitle", subTitle);
    formData.append("descr", descr);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/blog/update/${editData.id}`
          : `${Base_url}/blog/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === 200) {
        setIsModalOpen(false);
        toast.success(response.data.message || "Blog saved successfully!");
        fetchSizes();
        resetState();
      } else {
        toast.error(response.data.message || "Failed to save Blog.");
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
            {isEditMode ? "Edit Blogs" : "Add Blogs"}
          </h1>
          <MdClose
            className="cursor-pointer"
            onClick={() => {setIsModalOpen(false)
              resetState();
            }}
            size={25}
          />
        </div>
        <hr />
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-5 flex-wrap">

            <div className=" w-full">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                   Blog Categories
                                </label>
                                <select
                                 value={blogs}
                                 onChange={(e) => setBlogs(e.target.value)}
                                  name="blogCategoryId"
                                  className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                                >
                                  <option value="" label="Select  categories" />
                                  {allCategories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                                
                              </div>
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
                  label={"Sub Title"}
                  name={"subTitle"}
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={subTitle}
                />
              </div>
              <div className="w-[100%]">
                <label className="block mb-2 font-semibold">Description</label>
                <textarea
                  name="descr"
                  value={descr}
                  onChange={(e) => setDescr(e.target.value)}
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

export default AddNews;
