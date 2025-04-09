import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Base_url } from "../../utils/Base_url";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const UpdateFaqs = ({ isModalOpen, setIsModalOpen, closeModal, setUsers, singleUser }) => {
  // Validation schema using Yup
  const validationSchema = Yup.object({
    question: Yup.string().required("Question is required"),
    answer: Yup.string().required("Answer is required"),
  });

  const handleFaqUpdate = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(
        `${Base_url}/faq/update/${singleUser?._id}`,
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        // Fetch the updated list of FAQs
        const res = await axios.get(`${Base_url}/faq/getAll`);
        setUsers(res.data.data);
        setIsModalOpen(false);
        toast.success("FAQ updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Update FAQ</h1>
          <MdClose
            onClick={() => setIsModalOpen(false)}
            size={25}
            className="cursor-pointer"
          />
        </div>
        <hr />
        <Formik
          initialValues={{
            question: singleUser?.question || "",
            answer: singleUser?.answer || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleFaqUpdate}
        >
          {({ isSubmitting }) => (
            <Form className="mt-5">
              <div className="flex gap-5 flex-wrap">
                {/* Question Field */}
                <div className="w-full mb-4">
                  <label htmlFor="question" className="block mb-2 font-medium">
                    Question
                  </label>
                  <Field
                    type="text"
                    name="question"
                    id="question"
                    className="border w-full py-3 px-4"
                    placeholder="Enter question"
                  />
                  <ErrorMessage
                    name="question"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Answer Field */}
                <div className="w-full mb-4">
                  <label htmlFor="answer" className="block mb-2 font-medium">
                    Answer
                  </label>
                  <Field
                    as="textarea"
                    name="answer"
                    id="answer"
                    rows="5"
                    className="border w-full py-3 px-4"
                    placeholder="Enter answer"
                  />
                  <ErrorMessage
                    name="answer"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <Button
                label="Update"
                type="submit"
                className="bg-primary mt-3 uppercase text-white py-2 px-4 w-full"
                disabled={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default UpdateFaqs;
