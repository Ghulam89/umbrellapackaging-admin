import React from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddGlossary = ({ isModalOpen, setIsModalOpen, closeModal, setUsers }) => {
    // Form validation schema using Yup
    const validationSchema = Yup.object({
        question: Yup.string().required("Question is required"),
        answer: Yup.string().required("Answer is required"),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await axios.post(`${Base_url}/faq/create`, values, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.status === "success") {
                const res = await axios.get(`${Base_url}/faq/getAll`);
                setUsers(res.data.data);
                setIsModalOpen(false);
                toast(response.data.message);
                resetForm();
            } else {
                toast(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal} className="rounded-md">
                <div>
                    <div className="p-3 flex justify-between items-center">
                        <div></div>
                        <h1 className="capitalize h4 font-semibold">Add FAQs</h1>
                        <MdClose onClick={() => setIsModalOpen(false)} size={25} />
                    </div>
                    <hr />
                    <div className="p-5">
                        <Formik
                            initialValues={{ question: "", answer: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <div className="flex gap-5 flex-wrap">
                                        <div className="w-[100%]">
                                            <label htmlFor="question" className="block mb-2 font-medium">
                                                Question
                                            </label>
                                            <Field
                                                name="question"
                                                type="text"
                                                placeholder="Enter question"
                                                className={`border w-full py-3 px-4 ${
                                                    errors.question && touched.question
                                                        ? "border-primary"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="question"
                                                component="div"
                                                className="text-primary text-sm mt-1"
                                            />
                                        </div>

                                        <div className="w-[100%]">
                                            <label htmlFor="answer" className="block mb-2 font-medium">
                                                Answer
                                            </label>
                                            <Field
                                                name="answer"
                                                as="textarea"
                                                rows="5"
                                                placeholder="Enter answer"
                                                className={`border w-full py-3 px-4 ${
                                                    errors.answer && touched.answer
                                                        ? "border-primary"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="answer"
                                                component="div"
                                                className="text-primary text-sm mt-1"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        label={isSubmitting ? "Submitting..." : "Submit"}
                                        type="submit"
                                        className="bg-primary mt-3 uppercase text-white py-2 w-full"
                                        disabled={isSubmitting}
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddGlossary;
