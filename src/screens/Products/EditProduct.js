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


  console.log(existingImages,'sdsd');
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [brandId, setBrandId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [brandIds,setBrandIds] = useState(null)
  const [categoryIds,setCategoryIds] = useState(null)
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [existingBanner, setExistingBanner] = useState("");
  const [altTexts, setAltTexts] = useState([]);
  const [bannerImageAltText, setbannerImageAltText] = useState("");

  // Format filename utility function
  const formatFileName = (fileName) => {
    if (!fileName) return '';
    return fileName
      .replace(/\.[^/.]+$/, '')  // Remove extension
      .replace(/[_-]/g, ' ')     // Replace underscores/dashes with spaces
      .replace(/\s+/g, ' ')      // Collapse multiple spaces
      .trim()                   // Trim whitespace
      .split(' ')               // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');               // Rejoin words
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

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

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoader(true);
        const response = await axios.get(`${Base_url}/products/get?id=${id}`);
        const product = response.data.data;

        setInitialValues({
          name: product.name || "",
          slug: product.slug || "",
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
          keywords: product.keywords || "",
          robots: product.robots || "index, follow",
          actualPrice: product.actualPrice || "",
          description: product.description || "",
          size: product.size || "",
          brandId: product.brandId?._id || "",
          categoryId: product.categoryId?._id || "",
          images: product.images || [],
          bannerImage: product.bannerImage || "",
          bannerTitle: product.bannerTitle || "",
          bannerContent: product.bannerContent || "",
          bannerImageAltText: product.bannerImageAltText || "",
        });

        setExistingImages(product.images || []);

        if (product.bannerImage) {
          setExistingBanner(`${Base_url}/${product.bannerImage}`);
          setbannerImageAltText(product.bannerImage.altText || formatFileName(product.bannerImage.originalPath));
        }

        if (product.brandId) {
          setBrandId({
            value: product.brandId._id,
            label: product.brandId.name
          });
        }

        if(brandIds){
          setBrandIds(product.brandId._id)
        }

        if (product.categoryId) {
          setCategoryId({
            value: product.categoryId._id,
            label: product.categoryId.title
          });
        }

 if(categoryIds){
          setCategoryIds(product.categoryId._id)
        }

        // Initialize alt texts for existing images
        if (product.images && product.images.length > 0) {
          setAltTexts(product.images.map(img =>
            img.altText || formatFileName(img.originalPath)
          ));
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
    slug: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    robots: "index, follow",
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

  const handleFileChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length + existingImages.length > 5) {
      toast.error("You can upload maximum 5 images in total");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);

    // Initialize alt texts with formatted file names
    const newAltTexts = [...altTexts, ...files.map(file => formatFileName(file.name))];
    setAltTexts(newAltTexts);

    setFieldValue("images", newFiles.map((file, index) => ({
      url: file,
      altText: newAltTexts[index] || "",
      originalPath: file.name
    })));
  };

  const handleBannerChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
      setbannerImageAltText(formatFileName(file.name));
      setFieldValue("bannerImage", {
        url: file,
        altText: formatFileName(file.name),
        originalPath: file.name
      });
    }
  };

  const handleRemoveImage = (index, type, setFieldValue) => {
    if (type === 'existing') {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      const newAltTexts = [...altTexts];
      newAltTexts.splice(index, 1);
      setAltTexts(newAltTexts);
    } else {
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);

      const newAltTexts = [...altTexts];
      newAltTexts.splice(index, 1);
      setAltTexts(newAltTexts);

      setFieldValue("images", newFiles.map((file, i) => ({
        url: file,
        altText: newAltTexts[i] || "",
        originalPath: file.name
      })));
    }
  };

  const handleRemoveBanner = (setFieldValue) => {
    setBannerImage(null);
    setBannerPreview("");
    setExistingBanner("");
    setbannerImageAltText("");
    setFieldValue("bannerImage", null);
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


  const handleAltTextChange = (index, value, setFieldValue) => {
    const newAltTexts = [...altTexts];
    newAltTexts[index] = value;
    setAltTexts(newAltTexts);

    // Update Formik field value
    if (index < existingImages.length) {
      // For existing images
      const updatedExisting = [...existingImages];
      updatedExisting[index].altText = value;
      setExistingImages(updatedExisting);
    } else {
      // For new images
      const newIndex = index - existingImages.length;
      setFieldValue(`images[${newIndex}].altText`, value);
    }
  };

  const handlebannerImageAltTextChange = (value, setFieldValue) => {
    setbannerImageAltText(value);
    if (bannerImage) {
      setFieldValue("bannerImage.altText", value);
    } else if (existingBanner) {
      // Update alt text for existing banner
      setFieldValue("bannerImage.altText", value);
    }
  };

  const validationSchema = Yup.object().shape({
    // name: Yup.string().required("Name is required"),
    // actualPrice: Yup.number()
    //   .required("Price is required")
    //   .positive("Price must be positive"),
    // size: Yup.string().required("Size is required"),
    // description: Yup.string().required("Description is required"),
    // bannerTitle: Yup.string().required("Banner title is required"),
    // bannerContent: Yup.string().required("Banner content is required"),
    // images: Yup.array()
    //   .test(
    //     "alt-text-required",
    //     "Alt text is required for all images",
    //     function (images) {
    //       return altTexts.every(text => text && text.trim() !== "");
    //     }
    //   ),
    // bannerImage: Yup.object()
    //   .test(
    //     "banner-alt-text-required",
    //     "Banner alt text is required",
    //     function (value) {
    //       return bannerImageAltText && bannerImageAltText.trim() !== "";
    //     }
    //   )
  });

  const onSubmit = async (values, { resetForm }) => {
    setLoader(true);
    const formData = new FormData();

    // Append product images
    selectedFiles.forEach((file, index) => {
      formData.append("images", file);
      formData.append("altTexts", altTexts[existingImages.length + index] || formatFileName(file.name));
      formData.append("originalPaths", file.name);
    });

    // Append existing images alt texts
if (existingImages?.length > 0) {
  const existingImagesArray = existingImages.map((img, index) => ({
    url: img.url,
    altText: altTexts[index] || formatFileName(img.originalPath),
    originalPath: img.originalPath,
  }));

  formData.append("existingImages", JSON.stringify(existingImagesArray));
}


    // Append banner image
    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
      formData.append("bannerImageAltText", bannerImageAltText || formatFileName(bannerImage.name));
      formData.append("bannerOriginalPath", bannerImage.name);
    } else if (existingBanner) {
      formData.append("existingBanner", JSON.stringify({
        url: initialValues.bannerImage.url,
        altText: bannerImageAltText || formatFileName(initialValues.bannerImage.originalPath),
        originalPath: initialValues.bannerImage.originalPath
      }));
    }

    // Append other changed fields
    Object.keys(values).forEach((key) => {
      if (key !== "images" && key !== "bannerImage" &&
        values[key] !== undefined && values[key] !== null &&
        values[key] !== "" && values[key] !== initialValues[key]) {
        formData.append(key, values[key]);
      }
    });

    if (brandIds) {
      formData.append("brandId", brandIds);
    }

    if (categoryIds) {
      formData.append("categoryId", categoryIds);
    }

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
                  {/* Brand Selector */}
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

                  {/* Category Selector */}
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

                  {/* Product Name */}
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
                  {/* Slug */}
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

                  {/* Meta Title */}
                  <div className="md:w-[48%] w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Meta Title
                    </label>
                    <Field
                      name="metaTitle"
                      type="text"
                      placeholder="Enter meta title"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage
                      name="metaTitle"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Meta Description
                    </label>
                    <Field
                      name="metaDescription"
                      as="textarea"
                      rows={3}
                      placeholder="Enter meta description"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage
                      name="metaDescription"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>

                  {/* Keywords */}
                  <div className="md:w-[48%] w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Keywords
                    </label>
                    <Field
                      name="keywords"
                      type="text"
                      placeholder="Enter keywords, separated by commas"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    />
                    <ErrorMessage
                      name="keywords"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>

                  {/* Robots */}
                  <div className="md:w-[48%] w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Robots
                    </label>
                    <Field
                      name="robots"
                      as="select"
                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                    >
                      <option value="index, follow">Index, Follow</option>
                      <option value="noindex, follow">Noindex, Follow</option>
                      <option value="index, nofollow">Index, Nofollow</option>
                      <option value="noindex, nofollow">Noindex, Nofollow</option>
                    </Field>
                    <ErrorMessage
                      name="robots"
                      component="div"
                      className="text-red text-sm mt-1"
                    />
                  </div>
                  {/* Price */}
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

                  {/* Size */}
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

                  {/* Images Upload */}
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
                        <div key={`existing-${index}`} className="relative w-64">
                          <img
                            src={`${Base_url}/${image.url}`}
                            alt="Preview"
                            className="w-full h-48 object-contain rounded-md shadow-md"
                          />
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Alt Text
                            </label>
                            <input
                              type="text"
                              value={altTexts[index] || ""}
                              onChange={(e) => handleAltTextChange(index, e.target.value, setFieldValue)}
                              className="border w-full bg-lightGray py-2 px-2 rounded-md text-sm"
                              placeholder={formatFileName(image.originalPath)}
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                            onClick={() => handleRemoveImage(index, 'existing', setFieldValue)}
                          >
                            <MdClose size={20} />
                          </button>
                          <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            Existing
                          </span>
                        </div>
                      ))}

                      {/* New images */}
                      {previewImages.map((image, index) => (
                        <div key={`new-${index}`} className="relative w-64">
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
                              value={altTexts[existingImages.length + index] || ""}
                              onChange={(e) => handleAltTextChange(existingImages.length + index, e.target.value, setFieldValue)}
                              className="border w-full bg-lightGray py-2 px-2 rounded-md text-sm"
                              placeholder={formatFileName(selectedFiles[index]?.name)}
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                            onClick={() => handleRemoveImage(index, 'new', setFieldValue)}
                          >
                            <MdClose size={20} />
                          </button>
                          <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
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

                  {/* Description */}
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

                  {/* Banner Title */}
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

                  {/* Banner Image */}
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
                      <div className="relative w-64 mt-3">
                        <img
                          src={bannerPreview || existingBanner}
                          alt="Banner Preview"
                          className="w-full h-48 object-contain rounded-md shadow-md"
                        />
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Banner Alt Text
                          </label>
                          <input
                            type="text"
                            value={bannerImageAltText || values.bannerImageAltText}
                            onChange={(e) => handlebannerImageAltTextChange(e.target.value, setFieldValue)}
                            className="border w-full bg-lightGray py-2 px-2 rounded-md text-sm"

                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                          onClick={() => handleRemoveBanner(setFieldValue)}
                        >
                          <MdClose size={20} />
                        </button>
                        {existingBanner && !bannerPreview && (
                          <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            Existing
                          </span>
                        )}
                        {bannerPreview && (
                          <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
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

                  {/* Banner Content */}
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

                {/* Submit Button */}
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