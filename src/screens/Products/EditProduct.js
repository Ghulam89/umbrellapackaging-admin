import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [brandId, setBrandId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [existingBanner, setExistingBanner] = useState("");

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
    const fetchProductData = async () => {
      try {
        setLoader(true);
        const response = await axios.get(`${Base_url}/products/get/${id}`);
        const product = response.data.data;
        
        setInitialValues({
          name: product.name || "",
          actualPrice: product.actualPrice || "",
          description: product.description || "",
          size: product.size || "",
          brandId: product.brandId?._id || "",
          categoryId: product.categoryId?._id || "",
          images: product.images || [],
          bannerImage: product.bannerImage || "",
          bannerTitle: product.bannerTitle || "",
          bannerContent: product.bannerContent || "",
        });

        setExistingImages(product.images || []);
        
        if (product.bannerImage) {
          setExistingBanner(`${Base_url}/${product.bannerImage}`);
        }
        
        if (product.brandId) {
          setBrandId({
            value: product.brandId._id,
            label: product.brandId.name
          });
        }
        
        if (product.categoryId) {
          setCategoryId({
            value: product.categoryId._id,
            label: product.categoryId.title
          });
        }

      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(error?.response?.data?.message || "Failed to load product");
      } finally {
        setLoader(false);
      }
    };

    fetchProductData();
  }, [id]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    actualPrice: "",
    description: "",
    size: "",
    brandId: "",
    categoryId: "",
    images: [],
    bannerImage: null,
    bannerTitle: "",
    bannerContent: "",
  });

  console.log(initialValues);
  

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
    if (files.length + selectedFiles.length + existingImages.length > 5) {
      toast.error("You can upload maximum 5 images in total");
      return;
    }
    
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...previews]);
    setFieldValue("images", [...selectedFiles, ...files]);
  };

  const handleBannerChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
      setFieldValue("bannerImage", file);
    }
  };

  const handleRemoveImage = (index, type, setFieldValue) => {
    if (type === 'existing') {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      setFieldValue("images", newFiles);
    }
  };

  const handleRemoveBanner = (setFieldValue) => {
    setBannerImage(null);
    setBannerPreview("");
    setExistingBanner("");
    setFieldValue("bannerImage", null);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().optional(),
    actualPrice: Yup.number()
      .optional()
      .positive("Price must be positive"),
    size: Yup.string().optional(),
    description: Yup.string().optional(),
    bannerTitle: Yup.string().optional(),
    bannerContent: Yup.string().optional(),
  });

  const onSubmit = async (values, { resetForm }) => {
    setLoader(true);

    const formData = new FormData();
    
    // Append new images
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });
    
    // Append banner image if changed
    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }
    
    // Append only changed fields
    Object.keys(values).forEach((key) => {
      if (key !== "images" && 
          key !== "bannerImage" && 
          values[key] !== undefined && 
          values[key] !== null && 
          values[key] !== "" && 
          values[key] !== initialValues[key]) {
        formData.append(key, values[key]);
      }
    });

    if (brandId && brandId.value !== initialValues.brandId) {
      formData.append("brandId", brandId.value);
    }
    
    if (categoryId && categoryId.value !== initialValues.categoryId) {
      formData.append("categoryId", categoryId.value);
    }

    // if (existingImages.length > 0) {
    //   formData.append("existingImages", JSON.stringify(existingImages));
    // }

    try {
      const response = await axios.put(`${Base_url}/products/update/${id}`, formData);
      if (response.status === 200) {
        toast.success(response.data.message);
        resetForm();
        setPreviewImages([]);
        setSelectedFiles([]);
        setBrandId(null);
        setCategoryId(null);
        setBannerImage(null);
        setBannerPreview("");
        setExistingBanner("");
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
        <h1 className="capitalize main_title font-semibold">Edit Product</h1>
      </div>
      <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
        {loading && !initialValues.name ? (
          <div className="text-center py-10">Loading product data...</div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
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
                      placeholder="Select brand..."
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
                    />
                    <ErrorMessage
                      name="name"
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
                      Upload Images (Max 5 total)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      className="block w-full p-3 text-sm text-gray-900 border rounded-md cursor-pointer focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-4 mt-3">
                      {/* Existing images */}
                      {existingImages.map((image, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={`${Base_url}/${image}`}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-md shadow-md"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                            onClick={() => handleRemoveImage(index, 'existing', setFieldValue)}
                          >
                            <MdClose size={20} />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            Existing
                          </span>
                        </div>
                      ))}
                      
                      {previewImages.map((image, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={image}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-md shadow-md"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                            onClick={() => handleRemoveImage(index, 'new', setFieldValue)}
                          >
                            <MdClose size={20} />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            New
                          </span>
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
  {(bannerPreview || existingBanner) && (
    <div className="relative w-40 h-40 mt-3">
      <img
        src={bannerPreview || existingBanner}
        alt="Banner Preview"
        className="h-40 w-40 object-cover rounded-md shadow-md"
      />
      <button
        type="button"
        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
        onClick={() => handleRemoveBanner(setFieldValue)}
      >
        <MdClose size={20} />
      </button>
      {existingBanner && !bannerPreview && (
        <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
          Existing
        </span>
      )}
      {bannerPreview && (
        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
          New
        </span>
      )}
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
                      Updating...
                    </button>
                  ) : (
                    <Button
                      label="Update Product"
                      type="submit"
                      className="bg-primary w-64 text-white py-2"
                    />
                  )}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
};

export default EditProduct;