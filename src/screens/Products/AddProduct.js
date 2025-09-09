import React, { useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddProduct = () => {
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')   
      .replace(/^-+/, '')      
      .replace(/-+$/, '');    
  };

  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [brandId, setBrandId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [altTexts, setAltTexts] = useState([]);
  const [bannerAltText, setBannerAltText] = useState("");
  
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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

  // Improved file name formatting function
  const formatFileName = (fileName) => {
    if (!fileName) return '';
    
    // Remove file extension
    let formatted = fileName.replace(/\.[^/.]+$/, '');
    
    // Replace special characters with spaces
    formatted = formatted.replace(/[_-]/g, ' ');
    
    // Remove any remaining special characters except spaces
    formatted = formatted.replace(/[^\w\s]/gi, '');
    
    // Trim and capitalize each word
    formatted = formatted
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return formatted;
  };

  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    try {
      const response = await axios.get(`${Base_url}/brands/getAll`, {
        params: { page, limit: 20, search: searchQuery || "" },
      });

      const { data, totalPages } = response.data;

      return {
        options: data.map((item) => ({ label: item.name, value: item._id })),
        hasMore: page < totalPages,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      console.error("Error fetching brands:", error);
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page,
        },
      };
    }
  };

  const loadOptionsCategory = async (searchQuery, loadedOptions, { page }) => {
    try {
      const response = await axios.get(`${Base_url}/category/getAll`, {
        params: { page, limit: 20, search: searchQuery || "" },
      });

      const { data, totalPages } = response.data;

      return {
        options: data.map((item) => ({ label: item.title, value: item._id })),
        hasMore: page < totalPages,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page,
        },
      };
    }
  };

  const handleChangeBrand = (selectedOption) => {
    setBrandId(selectedOption);
  };

  const handleChangeCategory = (selectedOption) => {
    setCategoryId(selectedOption);
  };

  const handleFileChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);

    // Initialize alt texts with properly formatted file names
    const newAltTexts = [...altTexts, ...files.map(file => formatFileName(file.name))];
    setAltTexts(newAltTexts);

    // Update Formik field value
    setFieldValue("images", newFiles.map((file, index) => ({
      url: file,
      altText: newAltTexts[index] || formatFileName(file.name),
      originalPath: file.name
    })));
  };

  const handleBannerChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
      const formattedAltText = formatFileName(file.name);
      setBannerAltText(formattedAltText);
      
      // Update Formik field value
      setFieldValue("bannerImage", {
        url: file,
        altText: formattedAltText,
        originalPath: file.name
      });
    }
  };

  const handleRemoveImage = (index, setFieldValue) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    const newAltTexts = [...altTexts];
    newAltTexts.splice(index, 1);
    setAltTexts(newAltTexts);

    setFieldValue("images", newFiles.map((file, i) => ({
      url: file,
      altText: newAltTexts[i] || formatFileName(file.name),
      originalPath: file.name
    })));
  };

  const handleAltTextChange = (index, value, setFieldValue) => {
    const newAltTexts = [...altTexts];
    newAltTexts[index] = value;
    setAltTexts(newAltTexts);

    setFieldValue("images", selectedFiles.map((file, i) => ({
      url: file,
      altText: newAltTexts[i] || formatFileName(file.name),
      originalPath: file.name
    })));
  };

  const handleBannerAltTextChange = (value, setFieldValue) => {
    setBannerAltText(value);
    if (bannerImage) {
      setFieldValue("bannerImage.altText", value);
    }
  };

  const handleRemoveBanner = (setFieldValue) => {
    setBannerImage(null);
    setBannerPreview("");
    setBannerAltText("");
    setFieldValue("bannerImage", null);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    metaTitle: Yup.string().required("Meta Title is required"),
    metaDescription: Yup.string().required("Meta Description is required"),
    keywords: Yup.string().required("Keywords is required"),
    robots: Yup.string().required("Robots is required"),
    actualPrice: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    size: Yup.string().required("Size is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.array()
      .min(1, "At least one image is required")
      .max(5, "Maximum 5 images allowed")
      .test(
        "alt-text-required",
        "Alt text is required for all images",
        function (images) {
          return images.every(img => img.altText && img.altText.trim() !== "");
        }
      ),
    brandId: Yup.string().required("Brand is required"),
    categoryId: Yup.string().required("Category is required"),
    bannerImage: Yup.object()
      .shape({
        url: Yup.mixed().required("Banner image is required"),
        altText: Yup.string().required("Banner alt text is required"),
        originalPath: Yup.string().required()
      })
      .required("Banner image is required"),
    bannerTitle: Yup.string().required("Banner title is required"),
    bannerContent: Yup.string().required("Banner content is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    setLoader(true);

    const formData = new FormData();

    selectedFiles.forEach((file, index) => {
      formData.append("images", file);
      formData.append("altTexts", altTexts[index] || formatFileName(file.name));
    });

    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
      formData.append("bannerImageAltText", bannerAltText || formatFileName(bannerImage.name));
    }

    // Append other form values
    Object.keys(values).forEach((key) => {
      if (key !== "images" && key !== "bannerImage" && values[key] !== undefined && values[key] !== null && values[key] !== "" && key !== "brandId" && key !== "categoryId") {
        formData.append(key, values[key]);
      }
    });

    formData.append("brandId", brandId.value);
    formData.append("categoryId", categoryId.value);

    try {
      const response = await axios.post(`${Base_url}/products/create`, formData);
      if (response?.data?.status === 'success') {
        toast.success(response.data.message);
        resetForm();
        setPreviewImages([]);
        setSelectedFiles([]);
        setAltTexts([]);
        setBrandId(null);
        setCategoryId(null);
        setBannerImage(null);
        setBannerPreview("");
        setBannerAltText("");
        navigate("/products");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="p-3 flex justify-between items-center">
        <h1 className="capitalize main_title font-semibold">Add Products</h1>
      </div>
      <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
        <Formik
          initialValues={{
            name: "",
            slug: "",
            metaTitle: "",
            metaDescription: "",
            keywords: "",
            robots: "index, follow",
            actualPrice: "",
            description: "",
            size: "",
            brandId: "",
            images: [],
            categoryId: "",
            bannerImage: null,
            bannerTitle: "",
            bannerContent: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, setFieldValue, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex gap-5 justify-between flex-wrap">
                <div className="w-[49%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Brand
                  </label>
                  <AsyncPaginate
                    value={brandId}
                    loadOptions={loadOptions}
                    onChange={(selectedOption) => {
                      handleChangeBrand(selectedOption);
                      setFieldValue("brandId", selectedOption?.value || "");
                    }}
                    placeholder="Select Brand..."
                    additional={{ page: 1 }}
                    classNamePrefix="react-select"
                  />
                  <ErrorMessage
                    name="brandId"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Category
                  </label>
                  <AsyncPaginate
                    value={categoryId}
                    loadOptions={loadOptionsCategory}
                    onChange={(selectedOption) => {
                      handleChangeCategory(selectedOption);
                      setFieldValue("categoryId", selectedOption?.value || "");
                    }}
                    placeholder="Select category..."
                    additional={{ page: 1 }}
                    classNamePrefix="react-select"
                  />
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Product Name
                  </label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Enter name"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    onChange={(e) => {
                      const name = e.target.value;
                      const generatedSlug = generateSlug(name);
                      setFieldValue("name", name);
                      setFieldValue("slug", generatedSlug);
                    }}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Slug
                  </label>
                  <Field
                    name="slug"
                    type="text"
                    placeholder="Enter slug"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    
                  />
                  <ErrorMessage
                    name="slug"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Meta Title
                  </label>
                  <Field
                    name="metaTitle"
                    type="text"
                    placeholder="Enter Meta Title"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="metaTitle"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Meta Description
                  </label>
                  <Field
                    name="metaDescription"
                    as="textarea"
                    rows={3}
                    type="text"
                    placeholder="Enter Meta Description"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="metaDescription"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Keywords
                  </label>
                  <Field
                    name="keywords"
                    type="text"
                    placeholder="Enter Keywords"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="keywords"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Robots
                  </label>
                  <Field
                    name="robots"
                    as="select"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  >
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </Field>
                  <ErrorMessage
                    name="robots"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Price
                  </label>
                  <Field
                    name="actualPrice"
                    type="number"
                    placeholder="Enter Price"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="actualPrice"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Size
                  </label>
                  <Field
                    name="size"
                    type="text"
                    placeholder="Enter Size"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="size"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="w-[100%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Upload Images (Max 5)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    className="block w-full p-3 text-sm text-gray-900 border rounded-md cursor-pointer focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-4 mt-3">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative w-64">
                        <img
                          src={image}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-md shadow-md"
                        />
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={altTexts[index] || formatFileName(selectedFiles[index]?.name) || ''}
                            onChange={(e) => handleAltTextChange(index, e.target.value, setFieldValue)}
                            className="border w-full bg-lightGray py-2 px-2 rounded-md text-sm"
                            placeholder={formatFileName(selectedFiles[index]?.name) || "Enter alt text"}
                          />
                        </div>

                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                          onClick={() => handleRemoveImage(index, setFieldValue)}
                        >
                          <MdClose size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>
                <div className="w-[100%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Product Description
                  </label>
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    className="h-48 mb-12"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="w-[100%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Banner Title
                  </label>
                  <Field
                    name="bannerTitle"
                    type="text"
                    placeholder="Enter banner title"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="bannerTitle"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>
                <div className="w-[100%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBannerChange(e, setFieldValue)}
                    className="block w-full p-3 text-sm text-gray-900 border rounded-md cursor-pointer focus:outline-none"
                  />
                  {bannerPreview && (
                    <div className="mt-3">
                      <div className="relative h-48 w-48">
                        <img
                          src={bannerPreview}
                          alt="Banner Preview"
                          className="h-48 w-48 object-contain rounded-md shadow-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                          onClick={() => handleRemoveBanner(setFieldValue)}
                        >
                          <MdClose size={20} />
                        </button>
                      </div>
                      <div className="mt-2 w-48">
                        <label className="block text-sm font-medium text-gray-700">
                          Banner Alt Text
                        </label>
                        <input
                          type="text"
                          value={bannerAltText || formatFileName(bannerImage?.name) || ""}
                          onChange={(e) => handleBannerAltTextChange(e.target.value, setFieldValue)}
                          className="border w-full bg-lightGray py-2 px-2 rounded-md text-sm"
                          placeholder={formatFileName(bannerImage?.name) || "Enter banner alt text"}
                        />
                      </div>
                    </div>
                  )}
                  <ErrorMessage
                    name="bannerImage"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="w-[100%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Banner Content
                  </label>
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    value={values.bannerContent}
                    onChange={(value) => setFieldValue("bannerContent", value)}
                    className="h-48 mb-12"
                  />
                  <ErrorMessage
                    name="bannerContent"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-center items-center mt-6">
                {loading ? (
                  <button
                    disabled
                    type="button"
                    className="h-11 bg-primary w-64 border-none outline-none rounded-lg shadow-sm cursor-pointer text-lg text-white font-semibold"
                  >
                    Loading...
                  </button>
                ) : (
                  <Button
                    label="Submit"
                    type="submit"
                    className="bg-primary uppercase w-64 text-white py-2"
                  />
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddProduct;