import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./screens/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from "./screens/Login";
import Customers from "./screens/Customer";
import HomeBanner from "./screens/homeBanner";
import News from "./screens/news";
import FeaturedRequest from "./screens/featuresCreate";
import ContactUs from "./screens/contactUs";
import Faqs from "./screens/faqs";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import SubCategory from "./screens/subCategory";
import AddProduct from "./screens/Products/AddProduct";
import Orders from "./screens/orders";
import Rewards from "./screens/Rewards";
import Sliders from "./screens/Sliders";
import SubSubCategories from "./screens/SubSubCategories";
import Products from "./screens/Products";
import Categories from "./screens/Categories";
import Wrapper from "./screens/Wrapper";
import OrderDetails from "./screens/orders/OrderDetails";
import EditProduct from "./screens/Products/EditProduct";
import UpdateCustomers from "./screens/Customer/UpdateCustomer";
import Announcement from "./screens/Announcement/Announcement";
import PromoCode from "./screens/PromoCode/PromoCode";
import Subscribe from "./screens/Subscribe/Subscribe";
import RequestQuote from "./screens/RequestQuote";
import InstantQuote from "./screens/InstantQuote";
import Reviews from "./screens/Reviews";
function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Wrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/request-quote" element={<RequestQuote />} />
            <Route path="/instant-quote" element={<InstantQuote />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/promo-code" element={<PromoCode />} />
            <Route path="/customer/:id" element={<UpdateCustomers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-details/:id" element={<OrderDetails />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/category" element={<Categories />} />
            <Route path="/sub-categories" element={<SubCategory />} />
            <Route path="/sub-sub-categories" element={<SubSubCategories />} />
            <Route path="/home_banner" element={<HomeBanner />} />
            <Route path="/sliders" element={<Sliders />} />
            <Route path="/blogs" element={<News />} />
            <Route path="/subscribe" element={<Subscribe />} />
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
