import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const HomeBanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [image, setImage] = useState(null);
  const [bannerId, setBannerId] = useState(null);
  const [bannerExists, setBannerExists] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
    const [imageAltText, setImageAltText] = useState("");

  const [modifiedFields, setModifiedFields] = useState({
    description: false,
    videoLink: false,
    image: false
  });
  
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  useEffect(() => {
    fetchBanner();
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchBanner = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${Base_url}/banner/getAll`);
      console.log(response);
      
      if (response.data && response.data.data) {
        const banners = response.data.data;
        const firstBanner = banners?.[0] || {};
        setBannerId(firstBanner?._id);
        setDescription(firstBanner?.description || "");
        setVideoLink(firstBanner?.videoLink || "");
              setImageAltText(firstBanner?.imageAltText || ""); 

        const imagePath = firstBanner?.image;
        setPreviewImage(
          imagePath 
            ? (imagePath.startsWith('http') ? imagePath : `${Base_url}/${imagePath}`)
            : null
        );
        setBannerExists(!!firstBanner?._id);
        setModifiedFields({
          description: false,
          videoLink: false,
          image: false
        });
      } else {
        setBannerExists(false);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      toast.error(error.response?.data?.message || "Failed to fetch banner");
      setBannerExists(false);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Description is required!");
      return;
    }

    if (!videoLink.trim() || !isValidUrl(videoLink)) {
      toast.error("Please enter a valid video URL!");
      return;
    }

    if (!bannerExists && !image) {
      toast.error("Image is required for new banner!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    
    if (modifiedFields.description || !bannerExists) {
      formData.append("description", description);
    }
    
    if (modifiedFields.videoLink || !bannerExists) {
      formData.append("videoLink", videoLink);
    }
 if (imageAltText) {
    formData.append("imageAltText", imageAltText);
  }
    if (image) {
      formData.append("image", image);
    }

    try {
      const url = bannerExists 
        ? `${Base_url}/banner/update/${bannerId}`
        : `${Base_url}/banner/create`;
      
      const method = bannerExists ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === 200 || response?.status === 201) {
        toast.success(response.data.message);
        if (!bannerExists) {
          setBannerId(response.data.data._id);
          setBannerExists(true);
        }
        fetchBanner();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setModifiedFields(prev => ({...prev, description: true}));
  };

  const handleVideoLinkChange = (e) => {
    setVideoLink(e.target.value);
    setModifiedFields(prev => ({...prev, videoLink: true}));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate image size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }



    // Clear previous image if exists
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    
    setImage(file);
    setModifiedFields(prev => ({...prev, image: true}));
    setPreviewImage(URL.createObjectURL(file));

  const altText = file.name
    .replace(/\.[^/.]+$/, "") 
    .replace(/[-_]/g, ' ')    
    .trim();               
  setImageAltText(altText);

  };

  const handleClearImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setImage(null);
    setPreviewImage(null);
      setImageAltText("");
    setModifiedFields(prev => ({...prev, image: true}));
  };

  const handleDeleteBanner = async () => {
    if (!bannerId) return;
    try {
      await axios.delete(`${Base_url}/banner/delete/${bannerId}`);
      toast.success("Banner deleted successfully");
      setBannerId(null);
      setDescription("");
      setVideoLink("");
      setImage(null);
      setPreviewImage(null);
      setBannerExists(false);
        setImageAltText("");
      setModifiedFields({
        description: false,
        videoLink: false,
        image: false
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete banner");
    }
  };

  return (
    <div>
      <h2 className="main_title mb-4">Banner</h2>

      <div className="p-5 bg-white rounded-md">
        {isFetching ? (
          <div className="text-center py-10">Loading banner data...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex gap-5 flex-wrap">
              <div className="w-[100%]">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Banner Content
                </label>
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  value={description}
                  onChange={handleDescriptionChange}
                  className="h-48 mb-12"
                />
              </div>
              
              <div className="w-[100%]">
                <Input
                  label={"Video Link"}
                  name={"videoLink"}
                  value={videoLink}
                  onChange={handleVideoLinkChange}
                  className={"border w-full py-3"}
                  placeholder="Enter Video Link"
                  defaultValue={videoLink}
                />
              </div>
              
              <div className="w-[100%]">
                <label className="block mb-2 font-semibold">Image</label>
               
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>

                {previewImage ? (
                  <>
                  <div className="my-3">
                    <div className="w-40 h-40 border rounded-md relative">
                      <img
                        src={previewImage}
                        alt="Selected"
                        className="w-40 h-40 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                   <div className="w-[100%] mt-3">
                      <Input
                        label={"Alt Text"}
                        name={"imageAltText"}
                        value={imageAltText}
                        onChange={(e) => setImageAltText(e.target.value)}
                        className={"border w-full py-3"}
                        defaultValue={image?.name?.replace(/\.[^/.]+$/, "").replace(/-/g, ' ') || imageAltText}
                      />
                    </div>
                  </>
                  
                ) : (
                  <p className="mb-3 text-sm text-gray-500">
                    No image selected
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button
                label={isLoading ? "Loading..." : bannerExists ? "Update Banner" : "Create Banner"}
                type={"submit"}
                disabled={isLoading || isFetching}
                className={`bg-primary text-white py-2 px-4 rounded ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              
              {bannerExists && (
                <Button
                  label={"Delete Banner"}
                  type={"button"}
                  onClick={handleDeleteBanner}
                  disabled={isLoading || isFetching}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                />
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeBanner;