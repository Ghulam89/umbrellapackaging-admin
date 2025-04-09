import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { AsyncPaginate } from "react-select-async-paginate";

const AddCategories = ({
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
  const [banner, setBanner] = useState(editData?.bannerImage || null);
  const [allcolor, setAllColor] = useState([]);
    const [selectColor, setSelectColor] = useState([]);


    const CategoryBrandChange = async()=>{
   
      try {
        const response = await axios.get(`${Base_url}/category/getBrand/${editData?.id}`);
  
        console.log(response?.data?.data?.brand);
  
        const defaultColors = response?.data?.data?.brand?.map((color, index) => ({
          label: color?.name,
          value: color?.id,
        }));
        setAllColor(defaultColors);
        setName(response?.data?.data?.name)
        setBanner(response?.data?.data?.bannerImage)
        setImage(response?.data?.data?.image)
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    
  }

  useEffect(() => {
    if (isEditMode) {
      CategoryBrandChange()
    }
  }, [isEditMode, editData, ]);

  const resetState = () => {

    setName("");
    setImage(null);
    setBanner(null);
    setAllColor([])
  };




  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    try {
      const response = await axios.get(`${Base_url}/brand/get`, {
        params: { page, limit: 20, search: searchQuery || "" },
      });

      const { data, totalPages } = response.data;

      return {
        options: data.map((item) => ({ label: item.name, value: item.id })),
        hasMore: page < totalPages,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page,
        },
      };
    }
  };

  const handleChange = (selectedOptions) => {
    setAllColor(selectedOptions);
    setSelectColor(selectedOptions);
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

    if (!banner && !isEditMode) {
      toast.error("Banner is required!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("imgType", imgType);
    if (image) {
      formData.append("image", image);
    }

    if (banner) {
      formData.append("bannerImage", banner);
    }


    if(selectColor.length>0){
      const colorLabels = selectColor.map(item => item.value);
      formData.append("brandId", JSON.stringify(colorLabels));
    }
    else{
      formData.append("brandId", JSON.stringify([]));

    }


    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/category/update/${editData.id}`
          : `${Base_url}/category/create`,
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
            {isEditMode ? "Edit Category" : "Add Category"}
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

{/* 
            <div className="w-[100%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select Brands
                  </label>
                  <AsyncPaginate
                    value={allcolor}
                    loadOptions={loadOptions}
                    onChange={(selectedOptions) => {
                      console.log(selectedOptions, "selectedOptions");

                      handleChange(selectedOptions);
                    }}
                    isMulti
                    placeholder="Select multiple brands..."
                    additional={{ page: 1 }}
                    classNamePrefix="react-select"
                    // cacheUniqs={[editData.id]}
                  />
                </div> */}


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
                  onChange={(e) => setBanner(e.target.files[0])}
                  className="border w-full  py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
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

export default AddCategories;
