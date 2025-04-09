import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import { AsyncPaginate } from "react-select-async-paginate";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [subsubcategories, setSubSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [allcolor, setAllColor] = useState([]);
  const [selectColor, setSelectColor] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
    const [allNavCategory,setAllNavCategory] = useState([]);
  
    const [brandCategory, setBrandCategory] = useState([]);
    console.log(brandCategory,'brandCategory');

  console.log(selectColor, "allcolr=================");

  // Load product options for AsyncPaginate
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    try {
      const response = await axios.get(`${Base_url}/color/get`, {
        params: { page, limit: 20, search: searchQuery || "" },
      });

      const { data, totalPages } = response.data;

      return {
        options: data.map((item) => ({ label: item.name, value: item.id })),
        hasMore: page < totalPages,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page,
        },
      };
    }
  };

  const handleChange = (selectedOptions) => {
    setAllColor(selectedOptions);
    setSelectColor(selectedOptions);
  };

  // Fetch product data and set initial values
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${Base_url}/product/get/${id}`);
        const productData = response.data.data;

        setProducts(productData);
        const defaultColors = productData.colorName?.map((color, index) => ({
          label: color,
          value: index.toString(),
        }));
        setAllColor(defaultColors);
        if (productData.image && productData.image.length > 0) {
          setPreviewImages(productData.image);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchBrands = async () => {
      let allBrand = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await axios.get(`${Base_url}/brand/get`, {
            params: { page: currentPage, limit: 20 },
          });

          const { data, totalPages: apiTotalPages } = response.data;

          allBrand = [...allBrand, ...data];
          totalPages = apiTotalPages;
          currentPage++;
        }

        setBrands(allBrand);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchAllCategories = async () => {
      let allCategories = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await axios.get(`${Base_url}/category/get`, {
            params: { page: currentPage, limit: 20 },
          });

          const { data, totalPages: apiTotalPages } = response.data;

          allCategories = [...allCategories, ...data];
          totalPages = apiTotalPages;
          currentPage++;
        }

        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchAllSubCategories = async () => {
      let subcategories = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await axios.get(`${Base_url}/subCategory/get`, {
            params: { page: currentPage, limit: 20 },
          });

          const { data, totalPages: apiTotalPages } = response.data;

          subcategories = [...subcategories, ...data];
          totalPages = apiTotalPages;
          currentPage++;
        }

        setSubCategories(subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    const fetchAllSubSubCategories = async () => {
      let subsubcategories = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await axios.get(`${Base_url}/subSubCategory/get`, {
            params: { page: currentPage, limit: 20 },
          });

          const { data, totalPages: apiTotalPages } = response.data;

          subsubcategories = [...subsubcategories, ...data];
          totalPages = apiTotalPages;
          currentPage++;
        }

        setSubSubCategories(subsubcategories);
      } catch (error) {
        console.error("Error fetching subsubcategories:", error);
      }
    };


    const fetchAllNavListing = async () => {
     
      try {
      
          const response = await axios.get(`${Base_url}/category/getNav`);
          const { data } = response.data;

          setAllNavCategory(data)
        
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const CategoryBrandChange = async(id)=>{
   
      try {
        const response = await axios.get(`${Base_url}/category/getBrand/${id}`);
  
        console.log(response?.data?.data?.brand);
  
        setBrandCategory(response?.data?.data?.brand);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    
  }

    fetchBrands();
    fetchAllCategories();
    fetchAllSubCategories();
    fetchAllSubSubCategories();
    fetchAllNavListing();
    CategoryBrandChange(products?.categoryId);
  }, [products]);

  const CategoryBrandChange = async(id)=>{
   
    try {
      const response = await axios.get(`${Base_url}/category/getBrand/${id}`);

      console.log(response?.data?.data?.brand);

      setBrandCategory(response?.data?.data?.brand);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  
}

  // Handle file changes
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...previews]);
  };

  // Remove image handler
  const handleRemoveImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    // Add validation rules here
  });

  // Form submit handler
  const onSubmit = async (values, { resetForm }) => {
    setLoader(true);

    console.log(values?.specialPrice,'===================================');
    

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("image", file);
    });

    if(selectColor.length>0){
      const colorLabels = selectColor.map(item => item.label);
      formData.append("colorName", JSON.stringify(colorLabels));
    }


    if(values?.specialPrice && values?.specialPrice>0){

      formData.append("hasDiscount", true);

    }
    

    Object.keys(values).forEach((key) => {

     
      if (
        key !== "image" &&
        values[key] !== undefined &&
        values[key] !== null &&
        key !== "colorName" && key !=="hasSpecialPrice" && key !=="hasDiscount"
      ) {
        if (typeof values[key] === "object") {
          formData.append(key, JSON.stringify(values[key]));

        } 
         else {
          formData.append(key, values[key]);
        }
      }
    });

    try {
      const response = await axios.put(
        `${Base_url}/product/update/${id}`,
        formData
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        resetForm();
        setPreviewImages([]);
        setSelectedFiles([]);
        navigate("/products");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="p-3 flex justify-between items-center">
        <h1 className="capitalize main_title font-semibold">Update Products</h1>
      </div>
      <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
        <Formik
          initialValues={products}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex gap-5 justify-between flex-wrap">
                {/* Title SKU */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    SKU
                  </label>
                  <Field
                    name="SKU"
                    type="text"
                    placeholder="Enter SKU"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="SKU"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title SKU */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Delivery Type
                  </label>
                  <Field
                    name="deliveryType"
                    type="text"
                    placeholder="Enter Delivery Type"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="deliveryType"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title URL */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    URL
                  </label>
                  <Field
                    name="Url"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Url"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                 {/* Category Select */}
                           <div className="md:w-[48%] w-full">
                                  <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Categories
                                  </label>
                                  <Field
                                    as="select"
                                    name="categoryId"
                                    className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                                    onChange={(e) => {
                                      const selectedCategory = allNavCategory?.find(
                                        (item) => String(item.id) === e.target.value
                                      );
                                      setSubCategories(selectedCategory?.subCategory ?? []);
                                      CategoryBrandChange(selectedCategory?.id)
                                      setFieldValue("subCategoryId", "");
                                      setFieldValue("subSubCategoryId", "");
                                      setFieldValue("categoryId", e.target.value);
                                    }}
                                  >
                                    <option value="" label="Select categories" />
                                    {allNavCategory?.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage
                                    name="categoryId"
                                    component="div"
                                    className="text-red text-sm mt-1"
                                  />
                                </div>
                
                                
                
                                
                
                                {/* Category Select */}
                                <div className="w-[49%]">
                                  <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Sub Categories
                                  </label>
                                  <Field
                                    as="select"
                                    name="subCategoryId"
                                    onChange={(e) => {
                                      const selectedSubCategory = subcategories?.find(
                                        (item) => String(item.id) === e.target.value
                                      );
                                      setSubSubCategories(selectedSubCategory?.subSubCategory ?? []);
                                      setFieldValue("subSubCategoryId", "");
                                      setFieldValue("subCategoryId", e.target.value);
                                    }}
                                    className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                                  >
                                    <option value="" label="Select sub categories" />
                                    {subcategories.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage
                                    name="subCategoryId"
                                    component="div"
                                    className="text-red text-sm mt-1"
                                  />
                                </div>
                
                                {/* Category Select */}
                                <div className="md:w-[48%] w-full">
                                  <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Sub Sub Categories
                                  </label>
                                  <Field
                                    as="select"
                                    name="subSubCategoryId"
                                    className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                                  >
                                    <option value="" label="Select sub categories" />
                                    {subsubcategories.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage
                                    name="subCategoryId"
                                    component="div"
                                    className="text-red text-sm mt-1"
                                  />
                                </div>
                
                                {/* Category Select */}
                                <div className="w-[49%]">
                                  <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Brand
                                  </label>
                                  <Field
                                    as="select"
                                    name="brandId"
                                    className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                                  >
                                    <option value="" label="Select brand" />
                                    {brandCategory?.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage
                                    name="brandId"
                                    component="div"
                                    className="text-red text-sm mt-1"
                                  />
                                </div>

                {/* Category Select */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select Color
                  </label>
                  <Field
                    as="select"
                    name="colorId"
                    className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                  >
                    <option value="" label="Select Color" />
                    {allcolor.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="colorId"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select Color
                  </label>
                  <AsyncPaginate
                    value={allcolor}
                    loadOptions={loadOptions}
                    onChange={(selectedOptions) => {
                      console.log(selectedOptions, "selectedOptions");

                      handleChange(selectedOptions);
                    }}
                    isMulti
                    placeholder="Select colors..."
                    additional={{ page: 1 }}
                    classNamePrefix="react-select"
                    cacheUniqs={[id]}
                  />
                </div>

                {/* Title Input */}
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

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Discount
                  </label>
                  <Field
                    name="discount"
                    type="number"
                    placeholder="Enter  Min Discount"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="discount"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Tag
                  </label>
                  <Field
                    name="tag"
                    type="text"
                    placeholder="Enter Tag"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="tag"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Discount Type
                  </label>
                  <Field
                    name="discountType"
                    type="text"
                    placeholder="Enter  Discount Type"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="discountType"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    City
                  </label>
                  <Field
                    name="city"
                    type="text"
                    placeholder="Enter  City"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Is Available
                  </label>
                  <Field
                    name="isAvailable"
                    type="text"
                    placeholder="Enter  Is Available"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="isAvailable"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Stock Qty
                  </label>
                  <Field
                    name="stock"
                    type="number"
                    placeholder="Enter  Stock Qty"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="stock"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Min Stock Qty
                  </label>
                  <Field
                    name="minStock"
                    type="number"
                    placeholder="Enter  Min Stock Qty"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="minStock"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Category Select */}
                <div className="w-[49%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Status
                  </label>
                  <Field
                    as="select"
                    name="Status"
                    className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                  >
                    <option value="" label="Select Status" />
                    <option value={"In Stock"}>In Stock</option>
                    <option value={"Out Of Stock"}>Out Of Stock</option>
                  </Field>
                  <ErrorMessage
                    name="Status"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Website Sell Price
                  </label>
                  <Field
                    name="originalPrice"
                    type="number"
                    placeholder="Enter  Original Price"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="originalPrice"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Special Price
                  </label>
                  <Field
                    name="specialPrice"
                    type="number"
                    placeholder="Enter  Special Price"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="specialPrice"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Save Price
                  </label>
                  <Field
                    name="sellPrice"
                    type="number"
                    placeholder="Enter sell Price"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="sellPrice"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Special Price End Date
                  </label>
                  <Field
                    name="specialPriceEndDate"
                    type="date"
                    placeholder="Enter  Special Price End Date"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="specialPriceEndDate"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    DI
                  </label>
                  <Field
                    name="DI"
                    type="text"
                    placeholder="Enter DI"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="DI"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    ACT
                  </label>
                  <Field
                    name="ACT"
                    type="number"
                    placeholder="Enter ACT"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="ACT"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    NSW_M
                  </label>
                  <Field
                    name="NSW_M"
                    type="number"
                    placeholder="Enter NSW_M"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="NSW_M"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    NSW_R
                  </label>
                  <Field
                    name="NSW_R"
                    type="number"
                    placeholder="Enter NSW_R"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="NSW_R"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    NT_M
                  </label>
                  <Field
                    name="NT_M"
                    type="number"
                    placeholder="Enter NT_M"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="NT_M"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    NT_R
                  </label>
                  <Field
                    name="NT_R"
                    type="number"
                    placeholder="Enter NT_R"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="NT_R"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    QLD_M
                  </label>
                  <Field
                    name="QLD_M"
                    type="number"
                    placeholder="Enter QLD_M"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="QLD_M"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    QLD_R
                  </label>
                  <Field
                    name="QLD_R"
                    type="number"
                    placeholder="Enter QLD_R"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="QLD_R"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    REMOTE
                  </label>
                  <Field
                    name="REMOTE"
                    type="number"
                    placeholder="Enter REMOTE"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="REMOTE"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    SA_M
                  </label>
                  <Field
                    name="SA_M"
                    type="number"
                    placeholder="Enter SA_M"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="SA_M"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    SA_R
                  </label>
                  <Field
                    name="SA_R"
                    type="number"
                    placeholder="Enter SA_R"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="SA_R"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    TAS_M
                  </label>
                  <Field
                    name="TAS_M"
                    type="number"
                    placeholder="Enter TAS_M"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="TAS_M"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    TAS_R
                  </label>
                  <Field
                    name="TAS_R"
                    type="number"
                    placeholder="Enter TAS_R"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="TAS_R"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    VIC_M
                  </label>
                  <Field
                    name="VIC_M"
                    type="number"
                    placeholder="Enter VIC_M"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="VIC_M"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    VIC_R
                  </label>
                  <Field
                    name="VIC_R"
                    type="number"
                    placeholder="Enter VIC_R"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="VIC_R"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    WA_M
                  </label>
                  <Field
                    name="WA_M"
                    type="number"
                    placeholder="Enter WA_M"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="WA_M"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    WA_R
                  </label>
                  <Field
                    name="WA_R"
                    type="number"
                    placeholder="Enter WA_R"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="WA_R"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    NZ
                  </label>
                  <Field
                    name="NZ"
                    type="number"
                    placeholder="Enter NZ"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="NZ"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}
                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Discontinued
                  </label>
                  <Field
                    name="Discontinued"
                    type="number"
                    placeholder="Enter Discontinued"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Discontinued"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    MPN
                  </label>
                  <Field
                    name="MPN"
                    type="number"
                    placeholder="Enter MPN"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="MPN"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Weight (kg)
                  </label>
                  <Field
                    name="weight"
                    type="number"
                    placeholder="Enter Weight (kg)"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="weight"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Carton Length (cm)
                  </label>
                  <Field
                    name="cartonLength"
                    type="number"
                    placeholder="Enter Carton Length (cm)"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="cartonLength"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Carton Width (cm)
                  </label>
                  <Field
                    name="cartonWidth"
                    type="number"
                    placeholder="Enter Carton Width (cm)"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="cartonWidth"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Carton Height (cm)
                  </label>
                  <Field
                    name="cartonHeight"
                    type="number"
                    placeholder="Enter Carton Height (cm)"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="cartonHeight"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    CBM
                  </label>
                  <Field
                    name="CBM"
                    type="number"
                    placeholder="Enter CBM"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="CBM"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label
                    htmlFor="Image1"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Image 1
                  </label>
                  <Input
                    name="Image1"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image1"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 2
                  </label>
                  <Input
                    name="Image2"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image2"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 3
                  </label>
                  <Input
                    name="Image3"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image3"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 4
                  </label>
                  <Input
                    name="Image4"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image4"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 5
                  </label>
                  <Input
                    name="Image5"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image5"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 6
                  </label>
                  <Input
                    name="Image6"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image6"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 7
                  </label>
                  <Input
                    name="Image7"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image7"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 8
                  </label>
                  <Input
                    name="Image8"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image8"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 9
                  </label>
                  <Input
                    name="Image9"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image9"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 10
                  </label>
                  <Input
                    name="Image10"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image10"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 11
                  </label>
                  <Input
                    name="Image11"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image11"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 12
                  </label>
                  <Input
                    name="Image12"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="Image12"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 13
                  </label>
                  <Input
                    name="image13"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="image13"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 14
                  </label>
                  <Input
                    name="image14"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="image14"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 15
                  </label>
                  <Input
                    name="image15"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="image15"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image 16
                  </label>
                  <Input
                    name="image16"
                    type="text"
                    placeholder="Enter URL"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="image16"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Size Guide Image
                  </label>
                  <Input
                    name="sizeGuideImage"
                    type="file"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("sizeGuideImage", file);
                    }}
                    placeholder="Enter sizeGuideImage"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="sizeGuideImage"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Image Upload */}
                <div className="w-[100%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      handleFileChange(e);
                      setFieldValue("image", [
                        ...selectedFiles,
                        ...Array.from(e.target.files),
                      ]);
                    }}
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
                          onClick={() => {
                            handleRemoveImage(index);
                            setFieldValue(
                              "image",
                              selectedFiles.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <MdClose size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className=" w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Specification
                  </label>
                  <Field
                    name="specification"
                    type="text"
                    placeholder="Enter  Specification"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="specification"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Title Input */}
                <div className="w-[100%]">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="detail"
                    type="text"
                    placeholder="Enter Description"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="detail"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>
              </div>

              <div className=" flex justify-center items-center">
                {/* Submit Button */}
                {loading ? (
                  <button
                    disabled
                    type="button"
                    className=" h-11 bg-primary w-64 border-none outline-none rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                  >
                    Loading...
                  </button>
                ) : (
                  <Button
                    label="Update"
                    type="submit"
                    className="bg-primary mt-3 uppercase w-64 text-white py-2 "
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

export default EditProduct;
