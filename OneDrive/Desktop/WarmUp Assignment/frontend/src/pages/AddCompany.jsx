// src/pages/AddCompany.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { uploadCompany } from "../api"; // ensure path matches your api export
import toast from "react-hot-toast";

const initial = {
  company_name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  website: "",
};

export default function AddCompany() {
  const [form, setForm] = useState(initial);
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setLogoFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const validate = () => {
    if (!form.company_name || !form.company_name.trim()) {
      toast.error("Company name is required");
      return false;
    }
    // optional: add URL/postal validation
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v || ""));
      if (logoFile) fd.append("logo", logoFile);

      await uploadCompany(fd, "post");
      toast.success("Company saved");
      navigate("/companies");
    } catch (err) {
      // error handled by api interceptor
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto card p-6">
          <h2 className="text-2xl font-semibold mb-4">Add Company</h2>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm">Company name <span className="text-red-500">*</span></span>
              <input name="company_name" value={form.company_name} onChange={handleChange} className="input mt-1" />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label>
                <span className="text-sm">City</span>
                <input name="city" value={form.city} onChange={handleChange} className="input mt-1" />
              </label>
              <label>
                <span className="text-sm">State</span>
                <input name="state" value={form.state} onChange={handleChange} className="input mt-1" />
              </label>
            </div>

            <label>
              <span className="text-sm">Address</span>
              <input name="address" value={form.address} onChange={handleChange} className="input mt-1" />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label>
                <span className="text-sm">Country</span>
                <input name="country" value={form.country} onChange={handleChange} className="input mt-1" />
              </label>
              <label>
                <span className="text-sm">Postal code</span>
                <input name="postal_code" value={form.postal_code} onChange={handleChange} className="input mt-1" />
              </label>
              <label>
                <span className="text-sm">Website</span>
                <input name="website" value={form.website} onChange={handleChange} className="input mt-1" placeholder="https://example.com" />
              </label>
            </div>

            <div>
              <span className="text-sm">Logo (optional)</span>
              <input type="file" accept="image/*" onChange={handleFile} className="block mt-2" />
              {preview && <img src={preview} alt="logo preview" className="h-24 w-24 object-cover rounded mt-2" />}
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className="btn">
                {submitting ? "Saving..." : "Save Company"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
