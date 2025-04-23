

// App.tsx or Routes.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VendorDashboard from "./components/pages/VendorDashboard";


import VendorLogin from "./components/VendorLogin/VendorLogin";
import RegisterVendor from "./components/RegisteVendor/RegisterVendor";


import AutomaticImageUploader from "./components/images/image";
import VendorOrdersDashboard from "./components/orders/VendorOrdersDashboard";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<VendorLogin />} />
        <Route path="/register" element={<RegisterVendor />} />
        <Route path="/dashboard" element={<VendorDashboard />} />
       
        <Route path="/images" element={<AutomaticImageUploader />} />
        <Route path="/orders" element={<VendorOrdersDashboard />} />
        
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;

