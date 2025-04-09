import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Base_url } from "../../utils/Base_url";
import axios from "axios";
import Modal from "../../components/modal";
import { MdClose } from "react-icons/md";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { AsyncPaginate } from "react-select-async-paginate";

const AddCatalogueProducts = ({
  isModalOpen,
  setIsModalOpen,
  closeModal,
  fetchSizes,
  isEditMode = false,
  editData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(editData?.name || "");
  const [image, setImage] = useState(editData?.image || null);
  const [selectCatalogue, setSelectCatalogues] = useState(editData?.catalogueCategoryId || "");
  const [discount, setDiscount] = useState(editData?.discount || "");
  const [selectedProduct, setSelectedProduct] = useState(
    editData?.productId
      ? { 
          label: editData?.product?.name, 
          value: editData.productId,
          price: editData?.product?.originalPrice 
        }
      : null
  );
  const [catalogue, setCatalogues] = useState([]);

  // Load product options for AsyncPaginate
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    try {
      const response = await axios.get(`${Base_url}/product/get`, {
        params: { page, limit: 20, search: searchQuery || "" },
      });

      const { data, totalPages } = response.data;

      return {
        options: data.map((item) => ({ 
          label: item.name, 
          value: item.id,
          price: item?.originalPrice
        })),
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

  // Fetch all catalogue categories
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        let allCategories = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const response = await axios.get(`${Base_url}/catalogueCategory/get`, {
            params: { page: currentPage, limit: 20 },
          });

          const { data, totalPages: apiTotalPages } = response.data;

          allCategories = [...allCategories, ...data];
          totalPages = apiTotalPages;
          currentPage++;
        }

        setCatalogues(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchAllCategories();
  }, []);

  // Update state when entering edit mode
  useEffect(() => {
    if (isEditMode && editData) {
      setName(editData?.name || "");
      setImage(editData?.image || null);
      setSelectCatalogues(editData?.catalogueCategoryId || "");
      setDiscount(editData?.discount || ""); // Changed from originalPrice to discount
      setSelectedProduct(
        editData?.productId
          ? { 
              label: editData?.product?.name, 
              value: editData.productId,
              price: editData?.product?.originalPrice 
            }
          : null
      );
    }
  }, [isEditMode, editData]);

  // Reset state
  const resetState = () => {
    setName("");
    setImage(null);
    setSelectCatalogues("");
    setDiscount("");
    setSelectedProduct(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct && !isEditMode) {
      toast.error("Product is required");
      return;
    }

    if (!selectCatalogue && !isEditMode) {
      toast.error("Catalogue is required");
      return;
    }

    setIsLoading(true);

    const formData = {
      catalogueCategoryId: selectCatalogue,
      productId: selectedProduct?.value,
      discount: discount,
    };

    try {
      const response = await axios({
        method: isEditMode ? "PUT" : "POST",
        url: isEditMode
          ? `${Base_url}/catalogueProduct/update/${editData.id}`
          : `${Base_url}/catalogueProduct/create`,
        data: formData,
        headers: { "Content-Type": "application/json" },
      });

      if (response?.status === 200) {
        const params = new FormData()
        
        params.append('hasDiscount', true)
        if(isEditMode) {
          params.append('specialPrice', editData?.product?.originalPrice - ((editData?.product?.originalPrice * discount)/100))
        } else {
          params.append('specialPrice', selectedProduct?.price - ((selectedProduct?.price * discount)/100))
        }
      
        await axios.put(`${Base_url}/product/update/${selectedProduct?.value}`, params)
          
        toast.success(response.data.message || "Catalogue Product saved successfully!");
        fetchSizes();
        resetState();
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message || "Failed to save Catalogue Product.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div>
        <div className="p-3 flex justify-between items-center">
          <h1 className="capitalize h4 font-semibold">
            {isEditMode ? "Edit Catalogue Products" : "Add Catalogue Products"}
          </h1>
          <MdClose
            className="cursor-pointer"
            onClick={() => setIsModalOpen(false)}
            size={25}
          />
        </div>
        <hr />
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-5 flex-wrap">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Products
                </label>
                <AsyncPaginate
                  value={selectedProduct}
                  loadOptions={loadOptions}
                  onChange={handleChange}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  placeholder="Select a product..."
                  additional={{ page: 1 }}
                  classNamePrefix="react-select"
                />
              </div>
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Discount (%)
                </label>
                <input
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  name="discount"
                  type="number"
                  className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                />
              </div>
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Catalogue
                </label>
                <select
                  value={selectCatalogue}
                  onChange={(e) => setSelectCatalogues(e.target.value)}
                  name="catalogueId"
                  className="outline-none bg-lightGray w-full border p-2.5 text-black placeholder:text-black rounded-md"
                >
                  <option value="" label="Select..." />
                  {catalogue.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              label={isLoading ? "Loading..." : isEditMode ? "Update" : "Add"}
              type="submit"
              disabled={isLoading}
              className={`bg-primary mt-3 uppercase text-white py-2 w-full ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddCatalogueProducts;