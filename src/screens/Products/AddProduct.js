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

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [brandId, setBrandId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  console.log(brandId);
  console.log(categoryId);
  
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
    
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...previews]);
    setFieldValue("images", [...selectedFiles, ...files]);
  };

  const handleRemoveImage = (index, setFieldValue) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFieldValue("images", newFiles);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    actualPrice: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    size: Yup.string().required("Size is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.array()
      .min(1, "At least one image is required")
      .max(5, "Maximum 5 images allowed"),
    brandId: Yup.string().required("Brand is required"),
    categoryId: Yup.string().required("Category is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    setLoader(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });
    
    Object.keys(values).forEach((key) => {
      if (key !== "images" && values[key] !== undefined && values[key] !== null && values[key] !== "" && key !== "brandId"  && key !== "categoryId") {
        formData.append(key, values[key]);
      }
    });

   formData.append("brandId", brandId.value);
    formData.append("categoryId", categoryId.value);

    try {
      const response = await axios.post(`${Base_url}/products/create`, formData);
      if (response.status === 200) {
        toast.success(response.data.message);
        resetForm();
        setPreviewImages([]);
        setSelectedFiles([]);
        setBrandId(null);
        setCategoryId(null);
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
            actualPrice: "",
            description: "",
            size: "",
            brandId: "",
            images: [],
            categoryId: "",
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
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-md shadow-md"
                        />
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
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows="4"
                    placeholder="Enter Description"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="description"
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