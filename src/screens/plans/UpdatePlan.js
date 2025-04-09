import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";

const UpdatePlan = ({ isModalOpen, setIsModalOpen, closeModal, getData,setUsers }) => {
  const [planData, setPlanData] = useState({
    name: "",
    price: "",
    maxImages: "",
    maxCars: "",
    listingDuration: "",
    featureAdsDays: "",
    refreshBoost: "",
    has360View: false,
  });

  const [loading, setLoader] = useState(false);

  // Initialize planData with existing data if editing
  useEffect(() => {
    if (getData) {
      setPlanData({
        name: getData?.name || "",
        price: getData?.price || "",
        maxImages: getData?.maxImages || "",
        maxCars: getData?.maxCars || "",
        listingDuration: getData?.listingDuration || "",
        featureAdsDays: getData?.featureAdsDays || "",
        refreshBoost: getData?.refreshBoost || "",
        has360View: getData?.has360View || false,
      });
    }
  }, [getData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlanData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const bannerSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    
    try {
      const params = {
        name: planData?.name,
        price: Number(planData?.price) ? Number(planData?.price) : 0,
        maxImages: Number(planData?.maxImages),
        maxCars: Number(planData?.maxCars),
        listingDuration: Number(planData?.listingDuration),
        featureAdsDays: Number(planData?.featureAdsDays),
        refreshBoost: Number(planData?.refreshBoost) ? Number(planData?.refreshBoost) : 0,
        has360View: planData.has360View,
      };

      const response = await axios.post(
        `${Base_url}/admin/update-plan/${getData?._id}`,
        params
      );


      console.log(response);
      

      if (response.status===200) {
        toast.success("Plan updated successfully!");
        setLoader(false);
        setIsModalOpen(false)

        axios
        .get(`${Base_url}/admin/plan`)
        .then((res) => {
          console.log(res);
  
          setUsers(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
        
      } else {
        toast.error(response.data.message);
        setLoader(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
      setLoader(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="">
          <div className="p-3 flex justify-between items-center">
            <h1 className="capitalize h4 font-semibold">Update Plan</h1>
            <MdClose onClick={() => setIsModalOpen(false)} size={25} />
          </div>
          <hr />
          <div className="p-5">
            <form onSubmit={bannerSubmit}>
              <div className="flex gap-5 flex-wrap">
                <div className="w-[48%]">
                  <label className="block mb-2 text-sm text-gray-900 font-medium">Plan Name</label>
                  <select
                    name="name"
                    value={planData.name}
                    onChange={handleChange}
                    className="border w-full py-3 outline-none bg-lightGray p-2.5 text-black placeholder:text-primary rounded-md"
                    defaultValue={planData?.name}
                  >
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                {(planData.name === "Gold" || planData.name === "Platinum") && (
                  <div className="w-[48%]">
                    <Input
                      label="Price"
                      name="price"
                      type="number"
                      value={planData.price}
                      onChange={handleChange}
                      className="border w-full py-3"
                      defaultValue={getData?.price}
                    />
                  </div>
                )}

                <div className="w-[48%]">
                  <Input
                    label="Max Images"
                    name="maxImages"
                    type="number"
                    value={planData.maxImages}
                    onChange={handleChange}
                    className="border w-full py-3"
                    defaultValue={getData?.maxImages}
                  />
                </div>
                <div className="w-[48%]">
                  <Input
                    label="Max Cars"
                    name="maxCars"
                    type="number"
                    value={planData.maxCars}
                    onChange={handleChange}
                    className="border w-full py-3"
                    defaultValue={getData?.maxCars}
                  />
                </div>
                <div className="w-[48%]">
                  <Input
                    label="Listing Duration (days)"
                    name="listingDuration"
                    type="number"
                    value={planData.listingDuration}
                    onChange={handleChange}
                    className="border w-full py-3"
                    defaultValue={getData?.listingDuration}
                  />
                </div>
                <div className="w-[48%]">
                  <Input
                    label="Feature Ads Days"
                    name="featureAdsDays"
                    type="number"
                    value={planData.featureAdsDays}
                    onChange={handleChange}
                    className="border w-full py-3"
                    defaultValue={getData?.featureAdsDays}
                  />
                </div>

                <div className="w-[48%]">
                  <Input
                    label="Refresh Boost"
                    name="refreshBoost"
                    type="number"
                    value={planData.refreshBoost}
                    onChange={handleChange}
                    className="border w-full py-3"
                    defaultValue={getData?.refreshBoost}
                  />
                </div>
              </div>

              {loading ? (
                <button
                  disabled
                  type="button"
                  className="bg-[#FB5722] w-full text-center mt-3 py-2.5 rounded-lg text-white uppercase font-semibold"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5733 10.4718 44.049 10.1079C47.8864 9.50375 51.7922 9.47893 55.6171 10.0401C60.8261 10.7915 65.8352 12.6341 70.2666 15.4652C74.698 18.2962 78.4293 22.0659 81.1718 26.555C83.3874 29.9732 85.0597 33.7302 86.1142 37.6864C86.8046 40.0431 89.3423 41.6781 91.7676 41.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
              ) : (
                <Button
                  label="Update Plan"
                  className="bg-[#FB5722] w-full text-center mt-3 py-2.5 rounded-lg text-white uppercase font-semibold"
                />
              )}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdatePlan;
