import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { ErrorMessage, Field } from "formik";

const AddSubSubCategory = ({
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
  const [subTitle, setSubTitle] = useState(editData?.subTitle || "");
  const [mainCategories, setMainCategories] = useState(editData?.categoryId || "");
  const [categories, setCategories] = useState(editData?.subCategoryId || "");
  const [image, setImage] = useState(editData?.image || null);

  const [allMainCategories, setAllMainCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [allNavCategory, setAllNavCategory] = useState([]);
  const [subcategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchAllMainCategories = async () => {
      let allCategories = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await axios.get(`${Base_url}/category/get`, {
            params: { page: currentPage, limit: 20 },
          });

          const { data, totalPages: apiTotalPages } = response.data;

          allCategories = [...allCategories, ...data];
          totalPages = apiTotalPages;
          currentPage++;
        }

        setAllMainCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchAllCategories = async () => {
      let allCategories = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await axios.get(`${Base_url}/subCategory/get`, {
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

    const fetchAllNavListing = async () => {
      try {
        const response = await axios.get(`${Base_url}/category/getNav`);
        const { data } = response.data;

        setAllNavCategory(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchAllNavListing();
    fetchAllCategories();
    fetchAllMainCategories();
  }, []);
  console.log(editData);
  

  useEffect(() => {
    if (isEditMode) {
      setName(editData?.name || "");
      setSubTitle(editData?.subTitle || "");
      setMainCategories(editData?.categoryId || "");
      setCategories(editData?.subCategoryId || "");
      setImage(editData?.image || null);

      const selectedCategory = allNavCategory.find(
        (item) => String(item.id) === String(editData?.categoryId)
      );
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategory || []);
      }
    }
  }, [isEditMode, editData, allNavCategory]);

  const resetState = () => {
    setName("");
    setCategories("");
    setSubTitle("");
    setMainCategories("");
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
    formData.append("subTitle", subTitle);
    formData.append("categoryId", mainCategories);
    formData.append("subCategoryId", categories);
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/subSubCategory/update/${editData.id}`
          : `${Base_url}/subSubCategory/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === 200) {
        setIsModalOpen(false);
        toast.success(response.data.message || "Category saved successfully!");
        fetchSizes();
        resetState();
      } else {
        toast.error(response.data.message || "Failed to save Category.");
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
            {isEditMode ? "Edit Sub Sub Category" : "Add Sub Sub Category"}
          </h1>
          <MdClose
            className="cursor-pointer"
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
            <div className="flex gap-5 flex-wrap">
              {/* Main Category Select */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Main Categories
                </label>
                <select
                  value={mainCategories}
                  onChange={(e) => {
                    const selectedCategory = allNavCategory.find(
                      (item) => String(item.id) === e.target.value
                    );
                    setSubCategories(selectedCategory?.subCategory || []);
                    setMainCategories(e.target.value);
                  }}
                  name="categoryId"
                  className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                >
                  <option value="">Select main categories</option>
                  {allNavCategory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category Select */}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Sub Categories
                </label>
                <select
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  name="categories"
                  className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                >
                  <option value="">Select sub categories</option>
                  {subcategories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name Input */}
              <div className="w-[100%]">
                <Input
                  label={"Name"}
                  name={"name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={editData?.name}
                />
              </div>

              {/* Sub Title Input */}
              <div className="w-[100%]">
                <Input
                  label={"Sub Title"}
                  name={"subTitle"}
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={editData?.subTitle}
                />
              </div>

              {/* Image Type Selection */}
              <div className="w-[100%]">
                <label className="block mb-2 font-semibold">Select Image Type</label>
                <div className="w-100 flex flex-row justify-start items-center gap-10">
                  <div
                    className="flex flex-row justify-start items-center gap-3 cursor-pointer"
                    onClick={() => setImgType('url')}
                  >
                    <div
                      className={`w-3 h-3 rounded-full p-1 ${
                        imgType === 'url' ? 'border-[6px] border-black' : 'border-[6px]'
                      }`}
                    />
                    <p>Upload URL</p>
                  </div>

                  <div
                    className="flex flex-row justify-start items-center gap-3 cursor-pointer"
                    onClick={() => setImgType('file')}
                  >
                    <div
                      className={`w-3 h-3 rounded-full p-1 ${
                        imgType === 'file' ? 'border-[6px] border-black' : 'border-[6px]'
                      }`}
                    />
                    <p>Upload From Gallery</p>
                  </div>
                </div>
              </div>

              {/* Image URL Input or File Upload */}
              {imgType === 'url' ? (
                <div className="w-[100%]">
                  <Input
                    label={"Image Url"}
                    name={"image"}
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className={"border w-full py-3"}
                  />
                </div>
              ) : (
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
              )}
            </div>

            {/* Submit Button */}
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

export default AddSubSubCategory;