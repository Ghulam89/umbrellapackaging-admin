import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import Wrapper from "../Wrapper";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import { AsyncPaginate } from "react-select-async-paginate";
import moment from "moment/moment";

const EditDeals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [deals, setDeals] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  // Load product options for AsyncPaginate
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    try {
      const response = await axios.get(`${Base_url}/product/get`, {
        params: { page, limit: 20, search: searchQuery || "" },
      });

      const { data, totalPages } = response.data;

      return {
        options: data.map((item) => ({ label: item.name, value: item.id,price:item.originalPrice})),
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


  const [originalPrice,setOriginalPrice] = useState(null);

  // Handle product selection
  const handleChange = (selectedOption) => {
    setSelectedProduct(selectedOption);
  };

  useEffect(() => {
    if (deals) {
      setSelectedProduct(
        deals?.productId
          ? { label: deals.productName, value: deals.productId}
          : null
      );
    }

    axios.get(`${Base_url}/product/get/${deals.productId}`).then((res) => {
      setOriginalPrice(res?.data?.data?.originalPrice);
    });
  }, [deals]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get(`${Base_url}/deal/get/${id}`);
        setDeals(response?.data?.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchDeals();
  }, [id]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    // name: Yup.string().required("Name  is required"),
    // type: Yup.string().required("Type is required"),
    // image: Yup.mixed().nullable(),
  });

  const onSubmit = async (values, { resetForm }) => {
    console.log("Submitted Values:", values);
  
    setLoader(true);
    const formData = new FormData();
  
    // Price validation
    if (values.price && values.price > originalPrice) {
      toast.error("Price should be less than original price");
      setLoader(false);
      return; // Stop submission if validation fails
    }
  
    let hasUpdates = false; // Track if there are any updates
  
    // Check and append only updated fields
    Object.keys(values).forEach((key) => {
      if (values[key] !== deals[key] && key !== "image" && key !== "link" && key !== "endDate") {
        formData.append(key, values[key]);
        hasUpdates = true;
      }
    });
  
    // Handle image update
    if (values.image) {
      formData.append("image", values.image);
      hasUpdates = true;
    }
  
    // Handle selected product update
    if (selectedProduct && selectedProduct.value !== deals?.productId) {
      formData.append("productId", selectedProduct.value);
      formData.append("link", `product_details/${selectedProduct.value}`);
      hasUpdates = true;
    }
  
    // Handle save option update
    if (selectedOption && selectedOption !== deals?.save) {
      formData.append("save", selectedOption);
      hasUpdates = true;
    }
  
    // Format and update endDate only if changed
    if (values.endDate && values.endDate !== deals?.endDate) {
      const formattedEndDate = moment(values.endDate).format("YYYY-MM-DD HH:mm:ss");
      formData.append("endDate", formattedEndDate);
      hasUpdates = true;
    }
  
    // Prevent API call if no fields were updated
    if (!hasUpdates) {
      toast.info("No changes detected.");
      setLoader(false);
      return;
    }
  
    try {
      const response = await axios.put(`${Base_url}/deal/update/${id}`, formData);
      if (response.status === 200) {
        toast.success(response.data.message || "Deal updated successfully!");
        resetForm();
        navigate("/deals");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoader(false);
    }
  };
  

  const handleCheckboxChange = (value) => {
    setSelectedOption(value);
  };

  return (
    <>
      <div className="p-3 flex justify-between items-center">
        <h1 className="capitalize main_title font-semibold">Edit Deals</h1>
      </div>
      <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
        <Formik
          enableReinitialize
          initialValues={{
            name: deals.name,
            type: deals.type ,
            price: deals.price ,
            endDate: deals.endDate ? moment(deals.endDate).format("YYYY-MM-DD") : "",
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex gap-5 justify-between flex-wrap">
                {/* Title Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Name
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

                {/* Type Input */}
                {/* <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Type
                  </label>
                  <Field
                    name="type"
                    as="select"
                    placeholder="Enter Type"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  >
                    <option>Select Type</option>
                    <option value={"half price"}>Half Price</option>
                    <option value={"buy one get one free"}>Buy one get one free</option>
                    <option value={"Clearance"}>Clearance</option>

                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {values?.type === "Clearance" &&  selectedProduct && (
                                  <div className="md:w-[48%] w-full">
                                  <label className="block mb-2 text-sm font-medium text-gray-900">
                                    original Price
                                  </label>
                                  <Field
                                    // name="price"
                                    type="text"
                                    value={originalPrice}
                                    placeholder="Enter Price"
                                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                                    disabled
                                  />
                                  <ErrorMessage
                                    name="price"
                                    component="div"
                                    className="text-red text-sm mt-1"
                                  />
                                </div>
                
                                 )}  

                {values?.type === "Clearance" && (
                                    <div className="md:w-[48%] w-full">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                      Price
                                    </label>
                                    <Field
                                      name="price"
                                      type="text"
                                      placeholder="Enter Price"
                                      className="border w-full bg-lightGray py-3 px-2 rounded-md"
                                    />
                                    <ErrorMessage
                                      name="price"
                                      component="div"
                                      className="text-red text-sm mt-1"
                                    />
                                  </div>
                  
                                )}

                {/* End Date Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    End Date
                  </label>
                  <Field
                    name="endDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    placeholder="Enter Date"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                {/* Select Product */}
                {/* <div className="sm:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select Product
                  </label>
                  <AsyncPaginate
                    value={selectedProduct}
                    loadOptions={loadOptions}
                    onChange={handleChange}
                    placeholder="Select a product..."
                    additional={{ page: 1 }}
                    classNamePrefix="react-select"
                  />
                  <ErrorMessage
                    name="productId"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div> */}

                {/* Image Input */}
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Image
                  </label>
                  <Input
                    name="image"
                    type="file"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("image", file);
                    }}
                    placeholder="Enter Image"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  {deals.image && !values.image && (
                    <img
                      src={`${deals.image}`}
                      alt="Deal Image"
                      className="mt-2 w-20 h-20 object-cover"
                    />
                  )}
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-center items-center">
                {/* Submit Button */}
                {loading ? (
                  <button
                    disabled
                    type="button"
                    className="h-11 bg-primary w-64 border-none outline-none rounded-lg mt-4 shadow-sm cursor-pointer text-lg text-white font-semibold"
                  >
                    Loading...
                  </button>
                ) : (
                  <Button
                    label="Submit"
                    type="submit"
                    className="bg-primary mt-3 uppercase w-64 text-white py-2"
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

export default EditDeals;