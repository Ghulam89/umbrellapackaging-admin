import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const [videoDescription, setVideoDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);

  // New banner fields
  const [bannerTitleFirst, setBannerTitleFirst] = useState("");
  const [bannerContentFirst, setBannerContentFirst] = useState("");
  const [bannerImageFirst, setBannerImageFirst] = useState(null);
  const [bannerImageFirstPreview, setBannerImageFirstPreview] = useState("");
  const [bannerTitleSecond, setBannerTitleSecond] = useState("");
  const [bannerContentSecond, setBannerContentSecond] = useState("");
  const [bannerImageSecond, setBannerImageSecond] = useState(null);
  const [bannerImageSecondPreview, setBannerImageSecondPreview] = useState("");

  const [bannerTitleThird, setBannerTitleThird] = useState("");
  const [bannerContentThird, setBannerContentThird] = useState("");
  const [bannerImageThird, setBannerImageThird] = useState(null);
  const [bannerImageThirdPreview, setBannerImageThirdPreview] = useState("");

  const [bannerTitleFourth, setBannerTitleFourth] = useState("");
  const [bannerContentFourth, setBannerContentFourth] = useState("");
  const [bannerImageFourth, setBannerImageFourth] = useState(null);
  const [bannerImageFourthPreview, setBannerImageFourthPreview] = useState("");

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
      setVideoDescription(editData?.videoDescription || "");
      setBannerTitleFirst(editData?.bannerTitleFirst || "");
      setBannerContentFirst(editData?.bannerContentFirst || "");
      setBannerTitleSecond(editData?.bannerTitleSecond || "");
      setBannerContentSecond(editData?.bannerContentSecond || "");
      setBannerTitleThird(editData?.bannerTitleThird || "");
      setBannerContentThird(editData?.bannerContentThird || "");
      setBannerTitleFourth(editData?.bannerTitleFourth || "");
      setBannerContentFourth(editData?.bannerContentFourth || "");

      if (editData?.icon) {
        setIconPreview(`${Base_url}/${editData.icon}`);
      }
      if (editData?.image) {
        setImagePreview(`${Base_url}/${editData.image}`);
      }
      if (editData?.bannerImageFirst) {
        setBannerImageFirstPreview(`${Base_url}/${editData.bannerImageFirst}`);
      }
      if (editData?.bannerImageSecond) {
        setBannerImageSecondPreview(`${Base_url}/${editData.bannerImageSecond}`);
      }
      if (editData?.bannerImageThird) {
        setBannerImageThirdPreview(`${Base_url}/${editData.bannerImageThird }`);
      }
      if (editData?.bannerImageFourth) {
        setBannerImageFourthPreview(`${Base_url}/${editData.bannerImageFourth }`);
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
    setVideoDescription("");
    setSelectedBrand(null);

    // Reset banner fields
    setBannerTitleFirst("");
    setBannerContentFirst("");
    setBannerImageFirst(null);
    setBannerImageFirstPreview("");

    setBannerTitleSecond("");
    setBannerContentSecond("");
    setBannerImageSecond(null);
    setBannerImageSecondPreview("");

    setBannerTitleThird("");
    setBannerContentThird("");
    setBannerImageThird(null);
    setBannerImageThirdPreview("");

    setBannerTitleFourth("");
    setBannerContentFourth("");
    setBannerImageFourth(null);
    setBannerImageFourthPreview("");
  };

  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandId && !isEditMode) {
      toast.error("Brand is required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    if (brandId && (!isEditMode || brandId !== editData?.brandId?._id)) {
      formData.append("brandId", brandId);
    }

    if (!isEditMode || title !== editData?.title) formData.append("title", title);
    if (!isEditMode || subTitle !== editData?.subTitle) formData.append("subTitle", subTitle);
    if (!isEditMode || description !== editData?.description) formData.append("description", description);
    if (!isEditMode || videoLink !== editData?.videoLink) formData.append("videoLink", videoLink);
    if (!isEditMode || videoDescription !== editData?.videoDescription) formData.append("videoDescription", videoDescription);
    if (!isEditMode || bannerTitleFirst !== editData?.bannerTitleFirst) formData.append("bannerTitleFirst", bannerTitleFirst);
    if (!isEditMode || bannerContentFirst !== editData?.bannerContentFirst) formData.append("bannerContentFirst", bannerContentFirst);
    if (!isEditMode || bannerTitleSecond !== editData?.bannerTitleSecond) formData.append("bannerTitleSecond", bannerTitleSecond);
    if (!isEditMode || bannerContentSecond !== editData?.bannerContentSecond) formData.append("bannerContentSecond", bannerContentSecond);
    if (!isEditMode || bannerTitleThird !== editData?.bannerTitleThird) formData.append("bannerTitleThird", bannerTitleThird);
    if (!isEditMode || bannerContentThird !== editData?.bannerContentThird) formData.append("bannerContentThird", bannerContentThird);
    if (!isEditMode || bannerTitleFourth !== editData?.bannerTitleFourth) formData.append("bannerTitleFourth", bannerTitleFourth);
    if (!isEditMode || bannerContentFourth !== editData?.bannerContentFourth) formData.append("bannerContentFourth", bannerContentFourth);

    if (image && (!isEditMode || (image instanceof File))) {
      formData.append("image", image);
    }
    if (icon && (!isEditMode || (icon instanceof File))) {
      formData.append("icon", icon);
    }
    if (bannerImageFirst && (!isEditMode || (bannerImageFirst instanceof File))) {
      formData.append("bannerImageFirst", bannerImageFirst);
    }
    if (bannerImageSecond && (!isEditMode || (bannerImageSecond instanceof File))) {
      formData.append("bannerImageSecond", bannerImageSecond);
    }
    if (bannerImageThird && (!isEditMode || (bannerImageThird instanceof File))) {
      formData.append("bannerImageThird", bannerImageThird);
    }
    if (bannerImageFourth && (!isEditMode || (bannerImageFourth instanceof File))) {
      formData.append("bannerImageFourth", bannerImageFourth);
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

  const renderBannerSection = (number) => {
    const titleState = number === 1 ? bannerTitleFirst :
      number === 2 ? bannerTitleSecond :
        number === 3 ? bannerTitleThird : bannerTitleFourth;
    const setTitle = number === 1 ? setBannerTitleFirst :
      number === 2 ? setBannerTitleSecond :
        number === 3 ? setBannerTitleThird : setBannerTitleFourth;
    const contentState = number === 1 ? bannerContentFirst :
      number === 2 ? bannerContentSecond :
        number === 3 ? bannerContentThird : bannerContentFourth;
    const setContent = number === 1 ? setBannerContentFirst :
      number === 2 ? setBannerContentSecond :
        number === 3 ? setBannerContentThird : setBannerContentFourth;
    const imagePreview = number === 1 ? bannerImageFirstPreview :
      number === 2 ? bannerImageSecondPreview :
        number === 3 ? bannerImageThirdPreview : bannerImageFourthPreview;
    const setImage = number === 1 ? setBannerImageFirst :
      number === 2 ? setBannerImageSecond :
        number === 3 ? setBannerImageThird : setBannerImageFourth;
    const setImagePreview = number === 1 ? setBannerImageFirstPreview :
      number === 2 ? setBannerImageSecondPreview :
        number === 3 ? setBannerImageThirdPreview : setBannerImageFourthPreview;

    return (
      <div className="w-full border p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-3">Banner {number}</h3>
        <div className="flex gap-5 flex-wrap">
          <div className="w-full ">
            <Input
              label={`Title`}
              name={`bannerTitle${number}`}
              value={titleState}
              onChange={(e) => setTitle(e.target.value)}
              className={"border w-full py-3"}
              required={true}
              defaultValue={titleState}
            />
          </div>

          <div className="w-full">
            <label className="block mb-2 font-medium">Description*</label>
            <ReactQuill
              theme="snow"
              value={contentState}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="bg-white rounded-md"
              placeholder="Write your description here..."
            />
          </div>
          <div className="w-full">
            <label className="block mb-2 font-semibold">Banner Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setImage, setImagePreview)}
              className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
            />

            {imagePreview ? (
              <div className="mb-3 mt-3 h-40 w-40 border rounded-md">
                <img
                  src={imagePreview}
                  alt={`Banner ${number}`}
                  className=" h-40 w-40 object-cover rounded-md"
                />
              </div>
            ) : (
              <p className="mb-3 mt-3 text-sm text-gray-500">No image selected</p>
            )}
          </div>
        </div>
      </div>
    );
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
                <label className="block mb-2 font-medium">Description*</label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  formats={formats}
                  className="bg-white rounded-md"
                  placeholder="Write your description here..."
                />
              </div>

              <div className="w-full">
                <label className="block mb-2 font-semibold">Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setImage, setImagePreview)}
                  className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
                />
                {(imagePreview || image) ? (
                  <div className="mb-3 mt-3 w-40 h-40 border rounded-md">
                    <img
                      src={imagePreview || (typeof image === 'string' ? image : URL.createObjectURL(image))}
                      alt="Selected"
                      className="w-40 h-40 object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <p className="mb-3 mt-3 text-sm text-gray-500">No image selected</p>
                )}
              </div>

              <div className="w-full">
                <label className="block mb-2 font-semibold">Icon</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setIcon, setIconPreview)}
                  className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
                />
                {(iconPreview || icon) ? (
                  <div className="mb-3  w-32 h-32 mt-3 border rounded-md">
                    <img
                      src={iconPreview || (typeof icon === 'string' ? icon : URL.createObjectURL(icon))}
                      alt="Selected Icon"
                      className="w-32  h-32  object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <p className="mb-3 text-sm text-gray-500">No icon selected</p>
                )}
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

              <div className="w-full">
                <label className="block mb-2 font-medium">Video Description*</label>
                <ReactQuill
                  theme="snow"
                  value={videoDescription}
                  onChange={setVideoDescription}
                  modules={modules}
                  formats={formats}
                  className="bg-white rounded-md"
                  placeholder="Write your video content here..."
                />
              </div>

              {/* Banner Sections */}
              {renderBannerSection(1)}
              {renderBannerSection(2)}
              {renderBannerSection(3)}
              {renderBannerSection(4)}
            </div>
            <Button
              label={isLoading ? "Loading..." : isEditMode ? "Update" : "Submit"}
              type={"submit"}
              disabled={isLoading}
              className={`bg-primary mt-3 uppercase text-white py-2 w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddSubCategory;