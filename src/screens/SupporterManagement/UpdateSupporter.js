import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UpdateNews = ({ isModalOpen, setIsModalOpen, closeModal, setUsers, getData }) => {
  const [loading, setLoading] = useState(false);
  const [additionalImage, setAdditionalImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subContent, setSubContent] = useState("");

  useEffect(() => {
    if (getData) {
      
      setTitle(getData.title || "");
      setContent(getData.content || "");
      setSubContent(getData.subContent || "");
      setAdditionalImage(getData.images); 
    }
  }, [getData, isModalOpen]); 

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      [{ 'header': '1' }, { 'header': '2' }, { 'header': [3, 4, 5, 6] }, { 'font': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image', 'video', 'color', 'background', 'align'
  ];

  const handleAdditionalImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAdditionalImage(URL.createObjectURL(file)); // Preview the image
      setImageFile(file); // Store the file for upload
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  // Submit form and upload image if new image file is selected
  const bannerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = additionalImage;

    // Upload new image if selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("images", imageFile);
      
      try {
        const uploadResponse = await axios.post(`http://35.88.137.61/api/api/upload`, formData);
        if (uploadResponse?.data?.data?.[0]) {
          imageUrl = uploadResponse.data.data[0];
        } else {
          toast.error("No data received from the image upload.");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed.");
        setLoading(false);
        return;
      }
    }

    const params = {
      title,
      content,
      subContent,
      images: imageUrl,
    };

    try {
      const res = await axios.put(`${Base_url}/admin/blog/${getData?._id}`, params);
      console.log(res);
     
      if (res.status === 200) {
        toast.success(res.data?.message);
        const blogsRes = await axios.get(`${Base_url}/admin/blog`);
        setUsers(blogsRes?.data?.blogs);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Blog post submission failed:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <div className="p-3 flex justify-between items-center">
            <h1 className="capitalize h4 font-semibold">Update News</h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <form onSubmit={bannerSubmit}>
              <div className="flex gap-5 flex-wrap">
                <div className="md:w-[100%] w-[100%]">
                  <Input
                    label={"Title"}
                    placeholder={"Enter title"}
                    name={"title"}
                    className={"border w-full py-3"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="md:w-[100%] w-[100%]">
                  <Input
                    label={"Small Description"}
                    placeholder={"Enter Description"}
                    name={"content"}
                    className={"border w-full py-3"}
                    value={subContent}
                    onChange={(e) => setSubContent(e.target.value)}
                  />
                </div>

                <div className="my-2 w-full">
                  <label htmlFor="additionalImageInput" className="block mt-2">
                    Blog Image
                  </label>
                  <input
                    accept="image/*"
                    onChange={handleAdditionalImageChange}
                    name="additionalImage"
                    type="file"
                    id="additionalImageInput"
                    className="border bg-lightGray w-full py-3 rounded-md px-3"
                  />
                  {additionalImage ? (
                    <div className="mt-4 flex justify-start">
                      <img src={additionalImage} className="w-20 h-20 rounded-xl m-1" alt="Additional" />
                    </div>
                  ) : getData?.images && (
                    <div className="mt-4 flex justify-start">
                      <img src={getData.images} className="w-20 h-20 rounded-xl m-1" alt="Additional" />
                    </div>
                  )}
                </div>

                <div className="md:w-[100%] w-[100%]">
                  <label htmlFor="description" className="block mt-2">
                    Details
                  </label>
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={handleContentChange} 
                    placeholder="Start writing your blog post here..."
                    modules={modules}
                    formats={formats}
                  />
                </div>
              </div>
              {loading ? (
                <button
                  disabled
                  type="button"
                  className="w-full h-11 bg-primary border-none outline-none rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 48.351C99.0711 47.4636 99.8718 52.0143 94.6742 54.0989C88.3091 56.5868 80.8881 57.8691 73.5038 57.8691C59.1754 57.8691 46.5993 46.2784 46.5993 31.9534C46.5993 20.5651 56.6785 11.3799 66.9001 6.72177C66.9001 6.72177 66.1355 5.30382 66.4032 5.30382C67.8798 4.2729 72.2741 7.16307 73.6629 8.57482C80.6748 14.4307 82.1775 19.0204 82.1775 24.3213C82.1775 28.5937 78.2796 31.7713 75.2956 30.658C74.5326 30.1538 74.1761 29.0148 73.1048 29.0148C71.0262 29.0148 71.4384 34.7579 78.0948 32.9687C83.5637 31.6778 87.0256 29.5113 91.1864 24.5122C92.0217 23.3428 95.6544 20.0637 93.9676 16.5761C91.4231 12.1701 82.9243 11.3854 76.0905 10.5538C78.1005 8.87433 78.7773 8.0742 79.2642 6.94266C80.2636 4.28554 86.5038 4.73383 89.4979 5.98551C92.4996 7.23349 93.9676 9.82792 93.9676 13.0396C93.9676 18.5921 91.0626 21.5757 88.9095 24.3873C88.2084 25.2524 86.4621 26.8528 85.4579 27.7991C83.7871 29.0742 79.9593 30.0647 79.0427 30.3037C75.4335 31.3892 77.1717 38.1123 74.0956 39.1226C70.8573 40.2324 68.5311 36.0989 66.1661 32.5003C63.8029 28.9017 63.2519 25.4795 61.8895 23.3477C60.8037 21.5208 55.8026 17.3023 57.6398 14.9684C61.6637 10.2226 74.0837 8.71331 76.6909 7.41754C78.7624 6.46916 80.4201 5.49841 81.9034 5.49958C83.9473 5.50091 84.1597 9.13536 82.4292 12.6318C82.3343 12.9446 82.4763 13.4277 81.9658 13.8391C81.7706 14.0129 81.0509 14.5855 80.0976 15.0753C76.9639 16.7521 75.2462 21.1166 73.5439 23.5543C71.4909 26.7944 70.1424 29.7973 69.0027 33.0486C67.9689 35.8266 66.8979 39.1349 67.9265 42.1924C68.8732 44.9746 71.3495 48.7403 74.3683 51.3913C76.0202 53.2468 77.8754 54.9641 80.5896 55.653C83.345 56.3715 86.7074 56.1245 89.9646 55.6931C92.0828 55.3327 94.0161 55.4717 94.6742 54.0989C99.8707 52.0155 99.0702 47.4648 93.9676 48.351Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              ) : (
                <Button
                  type="submit"
                  className={"w-full mt-5"}
                  label={"Update"}
                />
              )}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateNews;
