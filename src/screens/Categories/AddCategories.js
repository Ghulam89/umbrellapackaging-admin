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
  const AddCategories = ({
    isModalOpen,
    setIsModalOpen,
    closeModal,
    fetchSizes,
    isEditMode = false,
    editData = {},
  }) => {
    console.log(editData);
  const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
    };
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(editData?.name || "");  
    const [metaTitle, setMetaTitle] = useState(editData?.metaTitle || "");  
    const [metaDescription, setMetaDescription] = useState(editData?.metaDescription || "");  
    const [keywords, setkeywords] = useState(editData?.keywords || "");  
    const [robots, setRobots] = useState(editData?.robots || "index, follow");  
 const [image, setImage] = useState(editData?.image || null);
const [banner, setBanner] = useState(editData?.bannerImage || null);
    const [bgColor, setBgColor] = useState(editData?.bgColor || "");
    const [slug, setSlug] = useState(editData?.slug || generateSlug(editData?.name || ""));

    console.log(slug);
    
    const [content, setContent] = useState(editData?.content || "");
    const [imageAltText, setImageAltText] = useState(editData?.imageAltText || "");
    const [bannerAltText, setBannerAltText] = useState(editData?.bannerAltText || "");
  const resetState = () => {
      setName("");
      setImage(null);
      setBanner(null);
      setBgColor("");
      setSlug("");
      setContent("");
      setMetaTitle("");
      setMetaDescription("");
      setkeywords("");
      setImageAltText("");
      setBannerAltText("");
    };

    useEffect(() => {
      if (!isEditMode || !editData?.slug) {
        setSlug(generateSlug(name));
      }
    }, [name, isEditMode, editData?.slug]);
  

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

    useEffect(() => {
      if (isEditMode) {
      
        setName(editData?.name || "");
        setMetaTitle(editData?.metaTitle || "");
        setMetaDescription(editData?.metaDescription || "");
        setkeywords(editData?.keywords || "");
        setRobots(editData?.robots || "");
        
          setSlug(editData?.slug || generateSlug(editData?.name || ""));
        if (!image) {
          setImageAltText(editData?.imageAltText || "");
        }
        if (!banner) {
          setBannerAltText(editData?.bannerAltText || "");
        }
        setImage(editData?.image ? `${Base_url}/${editData?.image}` : null);
        setBgColor(editData?.bgColor || "");
        setContent(editData?.content || "");
        
        setBanner(editData?.bannerImage ? `${Base_url}/${editData?.bannerImage}` : null);
      }
    }, [isEditMode, editData]);

    const handleBannerChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setBanner(file);
        const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/-/g, ' ');
        setBannerAltText(fileName);
      }
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/-/g, ' ');
        setImageAltText(fileName);
      }
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

      if (!bgColor && !isEditMode) {
        toast.error("Background color is required!");
        return;
      }

      if (!content && !isEditMode) {
        toast.error("Content  is required!");
        return;
      }

      if (!slug) {
        setSlug(generateSlug(name));
      }

      setIsLoading(true);
      const formData = new FormData();
      if (!isEditMode || name !== editData?.name) formData.append("name", name);
      if (!isEditMode || slug !== editData?.slug) formData.append("slug", slug);
      if (!isEditMode || metaTitle !== editData?.metaTitle) formData.append("metaTitle", metaTitle);
      if (!isEditMode || metaDescription !== editData?.metaDescription) formData.append("metaDescription", metaDescription);
      if (!isEditMode || keywords !== editData?.keywords) formData.append("keywords", keywords); 
      if (!isEditMode || robots !== editData?.robots) formData.append("robots", robots); 
      if (!isEditMode || bgColor !== editData?.bgColor) formData.append("bgColor", bgColor);
      if (!isEditMode || content !== editData?.content) formData.append("content", content);
      if (!isEditMode || image !== editData?.image) {
        formData.append("image", image);
      }
      if (!isEditMode || banner !== editData?.bannerImage) {
        formData.append("bannerImage", banner);
      }

      if (!isEditMode || imageAltText !== editData?.imageAltText) formData.append("imageAltText", imageAltText);
      if (!isEditMode || bannerAltText !== editData?.bannerAltText) formData.append("bannerAltText", bannerAltText);

      try {
        const response = await axios({
          method: isEditMode ? "PUT" : "POST",
          url: isEditMode
            ? `${Base_url}/brands/update/${editData._id}`
            : `${Base_url}/brands/create`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.data.status === 'success') {
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

    return (
      <Modal isOpen={isModalOpen} onClose={closeModal} className={' rounded-md'}>
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-3 flex justify-between items-center sticky top-0 bg-white z-10">

            <div></div>
            <h1 className="capitalize h4 font-semibold">
              {isEditMode ? "Edit Categories" : "Add Categories"}
            </h1>
            <MdClose
              className=" cursor-pointer"
              onClick={() => {
                setIsModalOpen(false)
                resetState()
              }}
              size={25}
            />
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


                <div className="w-[100%]">
                  <Input
                    label={"Slug"}
                    name={"slug"}
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    className={"border w-full py-3"}
                    defaultValue={slug}
                    disabled={!isEditMode}
                  />
                </div>

                   <div className="w-[100%]">
                  <Input
                    label={"Meta Title"}
                    name={"metaTitle"}
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={metaTitle}
                    disabled={!isEditMode}
                  />
                </div>
                 <div className="w-[100%]">
                  <Input
                    label={"Meta Description"}
                    name={"metaDescription"}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={metaDescription}
                    disabled={!isEditMode}
                  />
                </div>

                 <div className="w-[100%]">
                  <Input
                    label={"Keywords"}
                    name={"keywords"}
                    value={keywords}
                    onChange={(e) => setkeywords(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={keywords}
                    disabled={!isEditMode}
                  />
                </div>

                 <div className="w-[100%]">
                  <Input
                    label={"robots"}
                    name={"robots"}
                    value={robots}
                    onChange={(e) => setRobots(e.target.value)}
                    className={"border w-full py-3"}
                    defaultValue={robots}
                    disabled={!isEditMode}
                  />
                </div>

                <div className="w-[100%]">
                  <Input
                    label={"Background Color"}
                    name={"bgColor"}
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className={"border w-full py-3 h-12"}
                    defaultValue={bgColor}
                  />
                </div>


                <div className="w-[100%]">
                  <label className="block mb-2    font-semibold">Banner</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
                  />
                  {banner ? (
                    <>
                      <div className="w-[100%] mt-3">
                        <Input
                          label={"Alt Text"}
                          name={"bannerAltText"}
                          value={bannerAltText}
                          onChange={(e) => setBannerAltText(e.target.value)}
                          className={"border w-full py-3"}
                          defaultValue={banner?.name?.replace(/\.[^/.]+$/, "").replace(/-/g, ' ') || bannerAltText}
                        />
                      </div>
                      <div className="mb-3 w-40 h-40  border mt-3 rounded-md">
                        <img
                          src={
                            typeof banner === "string"
                              ? banner
                              : URL.createObjectURL(banner)
                          }
                          alt="Selected"
                          className="w-40 h-40 object-cover rounded-md"
                        />
                      </div>
                    </>

                  ) : (
                    <p className="mb-3 text-sm text-gray-500">
                      No banner selected
                    </p>
                  )}
                </div>



                <div className="w-[100%]">
                  <label className="block mb-2 font-semibold">Choose Image</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-black rounded-md"
                  />
                  {image ? (
                    <>
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
                      <div className="my-3 border w-40 h-40  rounded-md">
                        <img
                          src={
                            typeof image === "string"
                              ? image
                              : URL.createObjectURL(image)
                          }
                          alt="Selected"
                          className="w-40 h-40  object-cover rounded-md"
                        />
                      </div>
                    </>

                  ) : (
                    <p className="mb-3 text-sm text-gray-500">
                      No image selected
                    </p>
                  )}
                </div>

                <div className=" w-full">
                  <label className="block mb-2 font-medium"> Choose Content*</label>
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
                label={isLoading ? "Loading..." : isEditMode ? "Update" : "Add"}
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

  export default AddCategories;