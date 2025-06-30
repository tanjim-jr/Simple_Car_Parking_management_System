import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/components/home.jsx";
import Login from "../src/components/login.jsx";
import Register from "../src/components/register.jsx";
import ResetPassword from "../src/components/ResetPassword.jsx"; // Import the ResetPassword component
import CustomerDashboard from "./components/customerDashboard.jsx";
import AdminDashboard from "./components/adminDashboard.jsx";
import OwnerDashboard from "./components/OwnerDashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/OwnerDashboard" element={<OwnerDashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
