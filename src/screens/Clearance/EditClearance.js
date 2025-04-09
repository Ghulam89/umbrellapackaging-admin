import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
const EditClearance = () => {

  const {id} = useParams();
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [clearance, setClearance] = useState({});
 
  useEffect(() => {
   


    const fetchClearance = async () => {
   
      try {
        const response = await axios.get(`${Base_url}/clearance/get/${id}`);

        console.log(response,'datga');
        

        setClearance(response?.data?.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

   
    fetchClearance();

  }, []);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    // name: Yup.string().required("Name  is required"),
    // price: Yup.string().required("Price is required"),
    // type: Yup.string().required("Type is required"),
    // image: Yup.string().required("Image is required"),
  });

  // Form Submit Handler
  const onSubmit = async (values, { resetForm }) => {
    console.log("hello");
   
        setLoader(true);
        console.log(values);
    const formData = {
        name: values.name,
        price: values.price,
        type: values.type,
        link:`/shop?limit=10&page=1&sortBy=&brandIds=&deal=["Clearance"]&categoryIds=&subCategoryIds=&subSubCategoryIds=&colorName=&minPrice=&maxPrice=&priceComparison=${values.type}&price=${values.price}`

    }

    try {
      const response = await axios.put(`${Base_url}/clearance/update/${id}`, formData);
      if (response.status === 200) {
        toast.success(response.data.message || "clearance saved successfully!");
        resetForm();

        navigate("/clearance");
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
        <h1 className="capitalize main_title font-semibold">Edit Clearance</h1>
      </div>
      <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
        <Formik
        enableReinitialize
          initialValues={{
            name: clearance.name || "",
            type: clearance.type || "",
            price: clearance.price || "",
           
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex gap-5 justify-between flex-wrap">
               
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
                    <option value={"greaterEqual"}>Upto</option>
                    <option value={"less"}>Under</option>
                    <option value={"equal"}>Equal</option>
                  </Field>
                  <ErrorMessage
                    name="type"
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

export default EditClearance;
