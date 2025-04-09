import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCustomers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoader] = useState(false);
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${Base_url}/user/get/${id}`);
        setCustomer(response?.data?.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("Failed to fetch customer data");
      }
    };

    fetchCustomer();
  }, [id]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
  });

  // Form Submit Handler
  const onSubmit = async (values, { resetForm }) => {
    setLoader(true);

    try {
      // Create an object to store only the changed fields
      const updatedFields = {};

      // Compare initial values (customer) with current form values (values)
      for (const key in values) {
        if (values[key] !== customer[key]) {
          updatedFields[key] = values[key];
        }
      }

      // If no fields were changed, show a message and return
      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes were made.");
        setLoader(false);
        return;
      }

      // Send only the updated fields to the server
      const response = await axios.put(`${Base_url}/user/update/${id}`, updatedFields);

      if (response.status === 200) {
        toast.success(response.data.message || "Customer updated successfully!");
        resetForm();
        navigate("/customers");
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
        <h1 className="capitalize main_title font-semibold">Edit Customer</h1>
      </div>
      <div className="p-5 shadow-lg bg-white mt-4 rounded-md">
        <Formik
          enableReinitialize
          initialValues={{
            firstName: customer.firstName || "",
            lastName: customer.lastName || "",
            email: customer.email || "",
            phone: customer.phone || "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex gap-5 justify-between flex-wrap">
                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    First Name
                  </label>
                  <Field
                    name="firstName"
                    type="text"
                    placeholder="Enter First Name"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Last Name
                  </label>
                  <Field
                    name="lastName"
                    type="text"
                    placeholder="Enter Last Name"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="md:w-[48%] w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Phone
                  </label>
                  <Field
                    name="phone"
                    type="text"
                    placeholder="Enter Phone"
                    className="border w-full bg-lightGray py-3 px-2 rounded-md"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-center items-center">
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
                    label="Update"
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

export default UpdateCustomers;