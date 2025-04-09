import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import Wrapper from "../Wrapper";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import { AsyncPaginate } from "react-select-async-paginate";
import moment from "moment/moment";

const AddDeals = () => {
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [catalogues, setCatalogues] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);




  const [selectedProduct, setSelectedProduct] = useState(null);

  console.log(selectedProduct);
  

    
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

  // Handle product selection
  const handleChange = (selectedOption) => {
    setSelectedProduct(selectedOption);
  };




  const [selectedOption, setSelectedOption] = useState("");

  console.log(selectedOption);

  useEffect(() => {
   
  }, []);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name  is required"),
    // price: Yup.string().required("Price  is required"),
    // endDate: Yup.string().required("Date  is required"),
    type: Yup.string().required("Type is required"),
    image: Yup.string().required("Image is required"),
  });

  // Form Submit Handler
  const onSubmit = async (values, { resetForm }) => {
    console.log(values.price);

     if(values.type==="Clearance" && (values.price ===undefined || values.price==="" || values.price===null)){
      toast.error("Price is required!");
       return;
     }

     if(!selectedProduct){
      toast.error("Product is required!");
       return;
     }
     if(values.endDate === ""){
      toast.error("Date is required!");
        return;
      }

      if(values.price>selectedProduct?.price){
        toast.error("Price should be less than original price!");
        return;
      }
      setLoader(true);
      console.log(values);
      const formData = new FormData();
  
      formData.append("image", values.image);
      formData.append("endDate",moment(values.endDate).format('YYYY-MM-DD HH:mm:ss'))
  
      Object.keys(values).forEach((key) => {
        if (key !== "image" && values[key] !== "" && key !== "link") {
          formData.append(key, values[key]);
        }
      });
      formData.append('productId', selectedProduct?.value);
      formData.append('save', selectedOption);
      formData.append(
        "link", `product_details/${selectedProduct?.value}`
      );
  
      try {
        const response = await axios.post(`${Base_url}/deal/create`, formData);
        if (response.status === 200) {
          toast.success(response.data.message || "Deal saved successfully!");
          resetForm();
  
          navigate("/deals");
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

  const handleCheckboxChange = (value) => {
    setSelectedOption(value);
  };

  return (
    <>
      <div className="p-3 flex justify-between items-center">
        <h1 className="capitalize main_title font-semibold">Add Deals</h1>
      </div>
      <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
        <Formik
          initialValues={{
            name: "",
            // endDate: "",
            type: "",
            image: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, setFieldValue,values}) => (
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






                {/* Title Input */}
                <div className="md:w-[48%] w-full">
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
                </div>
                <div className=" sm:w-[48%]  w-full">
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
                </div>
                 {values?.type === "Clearance" &&  selectedProduct && (
                  <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    original Price
                  </label>
                  <Field
                    name="price"
                    type="text"
                    value={selectedProduct?.price}
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
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    End Date
                  </label>
                  <input
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



                

                {/* Title Input */}
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
                  <ErrorMessage
                    name="image"
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
                    label="Submit"
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

export default AddDeals;
