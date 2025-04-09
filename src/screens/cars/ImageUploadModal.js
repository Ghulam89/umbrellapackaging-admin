import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Button from "../../components/Button";

const ImageUploadModal = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  setActiveCards,
  setUsers,
  getData,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // Effect to set initial image state based on getData
  useEffect(() => {
    if (getData?.threeSixtyImage) {
      setSelectedImages(getData.threeSixtyImage); // Assuming getData.threeSixtyImage is an array of URLs
    }
  }, [getData]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length > 0) {
      const newImageUrls = validImages.map((file) => URL.createObjectURL(file));
      setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
      setImageFiles((prevFiles) => [...prevFiles, ...validImages]);
    }
  };

  const removeImage = (index) => {
    // If the index is within the previously uploaded images, remove from that array
    if (index < (getData?.threeSixtyImage?.length || 0)) {
      // Remove from getData.threeSixtyImage array
      const updatedThreeSixtyImages = getData?.threeSixtyImage?.filter(
        (_, i) => i !== index
      );
      setSelectedImages(updatedThreeSixtyImages);
    } else {
      // Adjust index for new images and remove from selectedImages and imageFiles
      const newImageIndex = index - (getData?.threeSixtyImage?.length || 0);
      setSelectedImages((prevImages) =>
        prevImages.filter((_, i) => i !== newImageIndex)
      );
      setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== newImageIndex));
    }
  };

  const bannerSubmit = async () => {
    setLoading(true);
    let profilePhotoUrls = [];

    // Check if any image files were selected
    if (imageFiles.length > 0) {
      try {
        const param = new FormData();
        imageFiles.forEach((file) => {
          param.append("images", file);
        });

        const profilePhotoResponse = await axios.post(
          `http://35.88.137.61/api/api/upload`,
          param
        );

        if (profilePhotoResponse?.data?.data) {
          profilePhotoUrls = profilePhotoResponse.data.data; // Get the uploaded image URLs
        }
      } catch (error) {
        console.log(error);
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }
    }

    const params = {
      threeSixtyImage: [
        ...(getData?.threeSixtyImage || []), // Include previously uploaded images
        ...profilePhotoUrls // Include newly uploaded images
      ],
    };

    try {
      const res = await axios.post(`${Base_url}/user/edit-car/${getData?._id}`, params);
      if (res.status === 200) {
        toast.success(res.data?.message);
        setIsModalOpen(false);
        setLoading(false);

        // Fetch pending cars
        axios.post(`${Base_url}/admin/all-cars-by-status?status=pending`)
          .then((res) => setUsers(res.data))
          .catch((error) => console.log(error));

        // Fetch active cars
        axios.post(`${Base_url}/admin/all-cars-by-status?status=active`)
          .then((res) => setActiveCards(res.data))
          .catch((error) => console.log(error));
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="">
          <div className="p-3 flex justify-between items-center">
            <h1 className="capitalize h4 font-semibold">Update 360 tour</h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <div className="text-center my-2">
              {/* Display previously uploaded images */}
              {/* {getData?.threeSixtyImage?.map((image, index) => (
                <div key={index} className="relative inline-block mx-2">
                  <img
                    src={image}
                    className="w-28 h-28 rounded-md"
                    alt={`Previously uploaded ${index + 1}`}
                  />
                  <MdClose
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 text-red-500 cursor-pointer"
                    size={20}
                  />
                </div>
              ))} */}
              {/* Display selected images */}
              {selectedImages.map((image, index) => (
                <div key={`selected-${index}`} className="relative inline-block mx-2">
                  <img
                    src={image}
                    className="w-28 h-28 rounded-md"
                    alt={`Preview ${index + 1}`}
                  />
                  <MdClose
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0  text-white bg-primary text-red-500 cursor-pointer"
                    size={20}
                  />
                </div>
              ))}

              <div className="my-5">
                <label
                  htmlFor="fileInput"
                  className="px-12 py-2 bg-white font-semibold text-primary border border-gray-200 rounded-lg cursor-pointer"
                >
                  Browse Files
                </label>
                <input
                  accept="image/*"
                  onChange={handleFileChange}
                  name="profileImages"
                  type="file"
                  id="fileInput"
                  multiple
                  className="hidden"
                />
              </div>
              {loading===true?(
                  <button
                  disabled
                  type="button"
                  class="text-white bg-primary hover:bg-primary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 w-60  justify-center py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
              ):              <Button label={'Upload'} className={'  w-auto   w-60 bg-primary'} onClick={bannerSubmit} loading={loading} />
}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageUploadModal;
