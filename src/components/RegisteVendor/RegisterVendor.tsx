import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import axios from "axios";
import "./RegisterVendor.css";
import SuccessModal from "./SucessModal";
import AlreadyExistsModal from "./AlreadyExistedVendor";

const RegisterVendor = () => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlreadyExists, setShowAlreadyExists] = useState(false);

  const [formData, setFormData] = useState({
    business_name: "",
    business_category: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    owner_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    verification_type: "",
    verification_number: "",
    website_url: "",
    linkedin_url: "",
    business_logo: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.business_name) newErrors.business_name = "Business name is required";
      if (!formData.business_category) newErrors.business_category = "Category is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.pincode) {
        newErrors.pincode = formData.country === "Canada" ? "Postal code is required" : "Pincode is required";
      }
    }

    if (step === 2) {
      if (!formData.owner_name) newErrors.owner_name = "Owner name is required";
      if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Minimum 6 characters";
      }
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const next = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prev = () => setStep(prev => prev - 1);

  const submit = async () => {
    try {
      const { confirm_password, ...payload } = formData;
      await axios.post("http://localhost:8000/api/vendor/register", payload);
      setShowSuccess(true); // ✅ show modal on success
    } catch (error: any) {
      const message = error.response?.data?.detail || "";

      if (message.includes("Vendor already exists")) {
        setShowAlreadyExists(true);
      } else {
        alert("❌ " + message || "Registration failed");
      }

      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        {step === 1 && (
          <StepOne
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            next={next}
            handleChange={handleChange}
          />
        )}
        {step === 2 && (
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            next={next}
            prev={prev}
            handleChange={handleChange}
          />
        )}
        {step === 3 && (
          <StepThree
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            submit={submit}
            prev={prev}
            handleChange={handleChange}
          />
        )}
      </div>

      {/* ✅ Render Modal here */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      {showAlreadyExists && <AlreadyExistsModal onClose={() => setShowAlreadyExists(false)} />}
    </>
  );
};

export default RegisterVendor;
