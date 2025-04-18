import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { AsyncPaginate } from "react-select-async-paginate";

const AddSubCategory = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  fetchSizes,
  isEditMode = false,
  editData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [brandId, setBrandId] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);

  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    try {
      const response = await axios.get(`${Base_url}/brands/getAll`, {
        params: { page, limit: 20, search: searchQuery || "" },
      });

      const { data, totalPages } = response.data;
      
      return {
        options: data.map((item) => ({ 
          label: item.name, 
          value: item._id,
        })),
        hasMore: page < totalPages,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page,
        },
      };
    }
  };

  const handleBrandChange = (selectedOption) => {
    setSelectedBrand(selectedOption);
    setBrandId(selectedOption?.value || "");
  };

  useEffect(() => {
    if (isEditMode && editData) {
      setBrandId(editData?.brandId?._id || "");
      setTitle(editData?.title || "");
      setSubTitle(editData?.subTitle || "");
      setDescription(editData?.description || "");
      setVideoLink(editData?.videoLink || "");
      
      if (editData?.icon) {
        setIconPreview(editData.icon);
      }
      if (editData?.image) {
        setImagePreview(editData.image);
      }
      
      if (editData?.brandId?._id) {
        setSelectedBrand({ 
          label: editData?.brand?.name, 
          value: editData.brandId?._id,
        });
      }
    } else {
      resetState();
    }
  }, [isEditMode, editData]);

  const resetState = () => {
    setBrandId("");
    setTitle("");
    setSubTitle("");
    setDescription("");
    setIcon(null);
    setImage(null);
    setIconPreview("");
    setImagePreview("");
    setVideoLink("");
    setSelectedBrand(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandId && !isEditMode) {
      toast.error("Brand is required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    if (brandId) {
      formData.append("brandId", brandId);
    }
    
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("videoLink", videoLink);
    if (image) {
      formData.append("image", image);
    }
    if (icon) {
      formData.append("icon", icon);
    }

    try {
      const url = isEditMode 
        ? `${Base_url}/category/update/${editData._id}`
        : `${Base_url}/category/create`;
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === 200) {
        setIsModalOpen(false);
        toast.success(response.data.message || 
          (isEditMode ? "Category updated successfully!" : "Category created successfully!"));
        fetchSizes();
        resetState();
      } else {
        toast.error(response.data.message || "Operation failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} className={'rounded-md'}>
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="p-3 flex justify-between items-center sticky top-0 bg-white z-10">
          <div></div>
          <h1 className="capitalize h4 font-semibold">
            {isEditMode ? "Edit Sub Category" : "Add Sub Category"}
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
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Category*
                </label>
                <AsyncPaginate
                  value={selectedBrand}
                  loadOptions={loadOptions}
                  onChange={handleBrandChange}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  placeholder="Select a category..."
                  additional={{ page: 1 }}
                  classNamePrefix="react-select"
                />
              </div>

              <div className="w-full">
                <Input
                  label={"Title*"}
                  name={"title"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={editData?.title}
                  required={true}
                />
              </div>

              <div className="w-full">
                <Input
                  label={"Sub Title"}
                  name={"subTitle"}
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className={"border w-full py-3"}
                  defaultValue={editData?.subTitle}
                  required={true}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2 font-semibold">Image</label>
                {(imagePreview || image) ? (
                  <div className="mb-3 border rounded-md">
                    <img
                      src={imagePreview || (typeof image === 'string' ? image : URL.createObjectURL(image))}
                      alt="Selected"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <p className="mb-3 text-sm text-gray-500">No image selected</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2 font-semibold">Icon</label>
                {(iconPreview || icon) ? (
                  <div className="mb-3 border rounded-md">
                    <img
                      src={iconPreview || (typeof icon === 'string' ? icon : URL.createObjectURL(icon))}
                      alt="Selected Icon"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <p className="mb-3 text-sm text-gray-500">No icon selected</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
                />
              </div>

              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border w-full p-3 rounded-md"
                  rows="3"
                  required={true}
                />
              </div>

              <div className="w-full">
                <Input
                  label={"Video Link"}
                  name={"videoLink"}
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className={"border w-full py-3"}
                  placeholder=""
                  defaultValue={editData?.videoLink}
                  required={true}
                />
              </div>
            </div>
            <Button
              label={isLoading ? "Loading..." : isEditMode ? "Update" : "Submit"}
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

export default AddSubCategory;