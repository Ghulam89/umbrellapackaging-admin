import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./screens/dashboard/Dashboard";
import SupporterManagement from "./screens/SupporterManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from "./screens/Login";
import Customers from "./screens/Customer";
import Brands from "./screens/brands";
import Plans from "./screens/plans";
import Cars from "./screens/cars";
import ServiceRequest from "./screens/serviceRequests";
import UpdateCars from "./screens/cars/UpdateCars";
import Garage from "./screens/garage";
import UpdateGarage from "./screens/garage/UpdateGarage";
import HomeBanner from "./screens/homeBanner";
import News from "./screens/news";
import FeaturedRequest from "./screens/featuresCreate";
import ContactUs from "./screens/contactUs";
import Faqs from "./screens/faqs";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Glossary from "./screens/glossary";
import SubCategory from "./screens/subCategory";
import AddProduct from "./screens/Products/AddProduct";
import Orders from "./screens/orders";
import Rewards from "./screens/Rewards";
import Sliders from "./screens/Sliders";
import SubSubCategories from "./screens/SubSubCategories";
import Sizes from "./screens/Sizes";
import Age from "./screens/Age";
import Genders from "./screens/Genders";
import Colors from "./screens/Colors";
import Products from "./screens/Products";
import StockManagement from "./screens/StockManagement";
import BlogCategories from "./screens/BlogCategories";
import Categories from "./screens/Categories";
import Deals from "./screens/Deals";
import AddDeals from "./screens/Deals/AddDeals";
import EditDeals from "./screens/Deals/EditDeals";
import Wrapper from "./screens/Wrapper";
import Catalogues from "./screens/Catalogues/Catalogues";
import CatalogueCategories from "./screens/CatalogueCategories/CatalogueCategories";
import OrderDetails from "./screens/orders/OrderDetails";
import CatalogueProducts from "./screens/CatalogueProducts/CatalogueProducts";
import EditProduct from "./screens/Products/EditProduct";
import UpdateCustomers from "./screens/Customer/UpdateCustomer";
import Announcement from "./screens/Announcement/Announcement";
import PromoCode from "./screens/PromoCode/PromoCode";
import Subscribe from "./screens/Subscribe/Subscribe";
import Clearance from "./screens/Clearance";
import AddClearance from "./screens/Clearance/AddClearance";
import EditClearance from "./screens/Clearance/EditClearance";
function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route element={<PrivateRoute />}>
        <Route path="/" element={<Wrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/update_garage/:id" element={<UpdateGarage />} />
          <Route path="/update_car/:id" element={<UpdateCars />} />
          <Route path="/service_request" element={<ServiceRequest />} />
          <Route path="/key_management" element={<SupporterManagement />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/promo-code" element={<PromoCode />} />
          <Route path="/customer/:id" element={<UpdateCustomers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/blog-categories" element={<BlogCategories />} />
          <Route path="/stock-management" element={<StockManagement />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/add-deals" element={<AddDeals />} />
          <Route path="/add-edit/:id" element={<EditDeals />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/sub-categories" element={<SubCategory />} />
          <Route path="/sub-sub-categories" element={<SubSubCategories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/sizes" element={<Sizes />} />
          <Route path="/colors" element={<Colors/>} />
          <Route path="/age" element={<Age />} />
          <Route path="/genders" element={<Genders />} />
          <Route path="/home_banner" element={<HomeBanner />} />
          <Route path="/sliders" element={<Sliders />} />
          <Route path="/blogs" element={<News />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/clearance" element={<Clearance />} />
          <Route path="/add-clearance" element={<AddClearance />} />
          <Route path="/edit-clearance/:id" element={<EditClearance />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/catalogues" element={<Catalogues />} />
          <Route path="/catalogue-categories" element={<CatalogueCategories />} />
          <Route path="/catalogue-products" element={<CatalogueProducts />} />
          <Route path="/glossary" element={<Glossary/>} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/featured_request" element={<FeaturedRequest />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
