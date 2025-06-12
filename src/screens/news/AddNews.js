import react,{ useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React from "react";

const AddNews = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  fetchBlogs,
  isEditMode = false,
  editData = {},
}) => {


   const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
    };

  const [isLoading, setIsLoading] = useState(false);
  const [imageAltText, setImageAltText] = useState(editData?.imageAltText || "");
  const [title, setTitle] = useState("");
   const [slug, setSlug] = useState(editData?.slug || generateSlug(editData?.title || ""));
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("pending");
const [metaTitle, setMetaTitle] = useState(editData?.metaTitle || "");  
    const [metaDescription, setMetaDescription] = useState(editData?.metaDescription || "");  
    const [keywords, setkeywords] = useState(editData?.keywords || "");  
    const [robots, setRobots] = useState(editData?.robots || "index, follow");  
  useEffect(() => {
    if (isEditMode && editData) {
       setMetaTitle(editData?.metaTitle || "");
        setMetaDescription(editData?.metaDescription || "");
        setkeywords(editData?.keywords || "");
        setRobots(editData?.robots || "");
      setTitle(editData.title || "");
       setSlug(editData?.slug || generateSlug(editData?.title || ""));
       setContent(editData.content || "");
      setImage(editData.image ? `${Base_url}/${editData.image}` : null);
      setStatus(editData.status || "pending");
      setImageAltText(editData.imageAltText || "");
      
    }
  }, [isEditMode, editData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
      setImageAltText(fileName);
    }
  };

  const resetState = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setStatus("pending");
     setSlug("");
     setMetaTitle("")
     setMetaDescription("")
     setkeywords("")
     setRobots("");
    setImageAltText("");
    
  };

   useEffect(() => {
      if (!isEditMode || !editData?.slug) {
        setSlug(generateSlug(title));
      }
    }, [title, isEditMode, editData?.slug]);

const imageHandler = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();
  
  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${Base_url}/blog/upload-editor-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success===true) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        const imageUrl = response.data.url;
        const altText = response.data.alt || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
        
        // Insert image with all required attributes
        quill.clipboard.dangerouslyPasteHTML(
          range.index,
          `<img 
            src="${imageUrl}" 
            alt="${altText}" 
            loading="lazy"
            style="max-width:100%;height:auto;"
          />`
        );
        
        quill.setSelection(range.index + 1);
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };
};


  const quillRef = React.useRef(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

   const formats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
    'color', 'background',
    'align'
  ], []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title, and content are required!");
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
    // formData.append("shortDescription", shortDescription);
    formData.append("status", status);
    if (!isEditMode || slug !== editData?.slug) formData.append("slug", slug);
      if (!isEditMode || metaTitle !== editData?.metaTitle) formData.append("metaTitle", metaTitle);
      if (!isEditMode || metaDescription !== editData?.metaDescription) formData.append("metaDescription", metaDescription);
      if (!isEditMode || keywords !== editData?.keywords) formData.append("keywords", keywords); 
      if (!isEditMode || robots !== editData?.robots) formData.append("robots", robots); 
    
    if (image && typeof image !== 'string') {
      formData.append("image", image);
    }

    if (imageAltText) formData.append("imageAltText", imageAltText);

    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/blog/update/${editData._id}`
          : `${Base_url}/blog/create`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.status === 'success') {
        setIsModalOpen(false);
        toast.success(response.data.message);
        fetchBlogs();
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


  const BlogContent = ({ content }) => {
  // Ensure images always have alt text when rendering
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    doc.querySelectorAll('img').forEach(img => {
      if (!img.alt) {
        img.alt = img.src.split('/').pop()
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, ' ')
          .trim() || 'Product image';
      }
    });
    
    return doc.body.innerHTML;
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
};

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
                                                  disabled={!isEditMode}
                                                  defaultValue={robots}
                                                />
                                              </div>

              {/* <div>
                <Input
                  label="Short Description*"
                  name="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="border w-full p-3 rounded-md"
                  placeholder="Enter short description"
                  required
                  multiline
                  rows={3}
                    defaultValue={shortDescription}
                />
              </div> */}

              <div>
                <label className="block mb-2 font-medium">
                  Featured Image*
                  {!isEditMode && (
                    <span className="text-xs text-gray-500 ml-1">(required)</span>
                  )}
                </label>

                <div className="rounded-md">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full cursor-pointer bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100"
                      required={!isEditMode}
                    />
                  </label>
                </div>
                
                {image ? (
                  <>
                    <div className="mb-3 border w-32 h-32 mt-4 rounded-md overflow-hidden">
                      <img
                        src={typeof image === "string" ? image : URL.createObjectURL(image)}
                        alt="Featured preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-[100%] mt-3">
                      <Input
                        label={"Alt Text"}
                        name={"imageAltText"}
                        value={imageAltText}
                        onChange={(e) => setImageAltText(e.target.value)}
                        className={"border w-full py-3"}
                        placeholder=""
                         defaultValue={image?.name?.replace(/\.[^/.]+$/, "").replace(/-/g, ' ')||imageAltText}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 mb-2">No image selected</p>
                )}
              </div>

              <div>
                <label className="block mb-2 font-medium">Content*</label>
                <div className="bg-white rounded-md">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your blog content here..."
                    className="h-64 mb-12"
                  />
                </div>
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
                  : "bg-primary hover:bg-blue-700"
              } text-white font-medium`}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddNews;