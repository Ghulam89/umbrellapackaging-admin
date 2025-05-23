import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Base_url } from "../../utils/Base_url";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState({});
  const [products, setProducts] = useState([]);
  console.log(orderDetails);

  useEffect(() => {
    axios
      .get(`${Base_url}/checkout/get/${id}`)
      .then((res) => {
        setOrderDetails(res.data.data);
        setProducts(res?.data?.data?.productIds || []);
      })
      .catch((error) => console.error(error));
  }, [id]);


  useEffect(() => {
    if (orderDetails?.status) {
      setStatus(orderDetails.status);
    }
  }, [orderDetails?.status]);

  const totalPrice = products.reduce(
    (acc, product) => acc + product?.totalOriginalPrice * product?.quantity,
    0

  );
  const [status, setStatus] = useState(orderDetails?.status || "pending");

  const updateStatus = (newStatus) => {
    const params = {
      status: newStatus,
    };

    axios
      .put(`${Base_url}/checkout/update/${id}`, params)
      .then((res) => {
        if (res?.data?.status === "ok") {
          toast.success("Status updated successfully!");
          setStatus(newStatus);
        } else {
          toast.error("Failed to update status. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        toast.error("An error occurred while updating the status.");
      });
  };
  return (
    <>
      <div className=" w-full mx-auto py-10 px-6">
        <div className=" flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Your Order Details
          </h1>
          <div className="mt-4 pb-3">
            <label>Status </label>
            <select
              className="w-full px-4 py-2.5 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => {
                const selectedStatus = e.target.value;
                updateStatus(selectedStatus);
              }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="on-the-way">On the Way</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
              Order Info
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>Order Date:</strong>{" "}
                {moment(orderDetails.updatedAt).format("DD-MM-YYYY")}
              </p>

              <p>
                <strong>Status:</strong> {orderDetails.status}
              </p>
              <p>
                <strong>Payment Status:</strong> {orderDetails.paymentStatus}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                Stripe
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
              Customer
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {orderDetails.firstName}{" "}
                {orderDetails.lastName}
              </p>
              <p>
                <strong>Email:</strong> {orderDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {orderDetails.phoneNumber}
              </p>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
              Address
            </h2>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>Shipping Address:</strong> {orderDetails?.delivery?.addressLine1}
                {orderDetails.city}, {orderDetails.state}
                {orderDetails.country}
              </p>
              <p>
                <strong>Billing Address:</strong> Same
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-10 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
            Products
          </h2>
          {products.length > 0 ? (
            products.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 mb-4 hover:bg-gray-50 p-4 rounded-md transition"
              >
                <img
                  src={`${Base_url}/${item?.images[0]}`}
                  alt=""
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1 mx-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {item?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item?.quantity}
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ${(item?.actualPrice)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No products found in this order.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-10 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
            Order Summary
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${orderDetails?.subTotalBill}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charge</span>
              <span>${orderDetails?.deliveryCharges}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>{(Number(orderDetails?.subTotalBill) * Number(orderDetails?.discount)) / 100}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${orderDetails?.totalBill}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
