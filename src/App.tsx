

// App.tsx or Routes.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VendorDashboard from "./components/pages/VendorDashboard";
import OrderDashboard from "./components/pages/OrdersDashboard";
import NewOrderScreen from "./components/pages/Shipping";
import VendorLogin from "./components/VendorLogin/VendorLogin";
import RegisterVendor from "./components/RegisteVendor/RegisterVendor";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<VendorLogin />} />
        <Route path="/register" element={<RegisterVendor />} />
        <Route path="/dashboard" element={<VendorDashboard />} />
        <Route path="/orders" element={<OrderDashboard />} />
        <Route path="/shipping" element={<NewOrderScreen />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;

