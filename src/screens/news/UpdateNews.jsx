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
  console.log(subContent);

  const [adstext, setadstext] = useState("");
  const [adslink, setadslink] = useState("");

  // Update state values when getData changes
  useEffect(() => {
    if (getData) {
      setTitle(getData?.title || "");
      setContent(getData.content || "");
      setSubContent(getData.subtitle || "");
      setAdditionalImage(null); // Reset additional image preview
    }
  }, [getData]);

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
      setAdditionalImage(URL.createObjectURL(file));
      setImageFile(file);
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

    const params = new FormData();
    params.append('title', title);
    params.append('content', subContent);
    params.append('shortDescription', content);
    params.append('image', imageFile);

    try {
      const res = await axios.put(`${Base_url}/blog/update/${getData?._id}`, params);
      console.log("Update Response:", res);

      if (res.data.status === 'success') {
        toast.success(res.data?.message);
        const blogsRes = await axios.get(`${Base_url}/blog/getAll?page=1`);
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
            <h1 className="capitalize h4 font-semibold">Update Blogs</h1>
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
                    defaultValue={getData?.title}
                  />
                </div>

                <div className="md:w-[100%] w-[100%]">
                  <Input
                    label={"Small Description"}
                    placeholder={"Enter Description"}
                    name={"subContent"}
                    className={"border w-full py-3"}
                    value={subContent}
                    onChange={(e) => setSubContent(e.target.value)}
                    defaultValue={getData?.subtitle}
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
                  ) : (
                    <div className="mt-4 flex justify-start">
                      <img src={getData?.image} className="w-20 h-20 rounded-xl m-1" alt="Additional" />
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
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5533C95.2932 28.8227 92.871 24.3692 89.8167 20.4867C86.3098 16.3097 80.9299 13.462 76.0387 12.5155C72.3301 11.7812 69.9298 14.6355 69.9298 18.5588C69.9298 20.3671 71.5344 21.9585 73.6749 21.9585C74.5691 21.9585 75.4589 21.3453 75.7408 20.5881C76.1284 19.5745 77.4892 18.3798 78.9855 18.3798C79.9939 18.3798 80.892 19.0762 81.1381 19.8358C81.6907 21.5059 82.3563 23.1468 83.0383 24.6583C83.4772 25.5865 83.8599 26.3742 83.8599 27.0045C83.8599 28.9561 81.3526 30.2969 78.1935 29.7371C76.9682 29.4826 76.0898 29.5856 75.0001 29.5856C73.8732 29.5856 73.0586 29.2345 72.3746 29.8683C72.1986 30.0489 72.0698 30.2285 71.9755 30.4042C71.3797 31.4486 71.3669 32.5468 71.8313 33.8634C72.3248 35.2513 73.1782 36.2201 74.5463 36.6033C75.9429 36.991 77.2619 36.2028 78.1287 35.3558C79.4673 34.0942 80.8023 32.8842 81.9855 31.4138C83.7025 29.4335 83.0162 26.4923 81.7022 24.6675C80.7042 23.1564 79.6174 22.4228 78.3379 22.0637C76.7759 21.5262 75.2033 21.1215 73.6916 21.0617C71.6164 21.0003 69.9755 22.5166 69.9755 24.6133C69.9755 26.0082 70.8851 27.0746 72.4515 27.0773C73.5876 27.0806 74.7079 27.9625 75.0769 28.7818C75.517 29.7973 75.6615 31.1562 76.1643 32.4156C77.0224 34.7121 79.1309 36.1484 81.0367 36.3253C82.9672 36.5096 84.2253 35.0701 84.9734 33.8382C85.2679 33.1863 85.5078 32.4932 85.8437 31.7932C87.3479 28.3754 89.1675 25.4706 91.2231 23.1523C93.5412 20.5557 95.0176 18.6527 93.9676 16.0205C93.1672 13.9384 92.0526 12.4593 91.4317 11.0207C91.0409 9.94002 90.5334 9.02005 90.6338 7.6989C90.7768 5.82396 92.0747 4.34849 93.9676 4.07902V39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
              ) : (
                <Button label={'Update News'} type="submit" className="w-full mt-4 bg-primary">
                  Update
                </Button>
              )}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateNews;
