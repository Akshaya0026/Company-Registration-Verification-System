import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { uploadCompany } from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import FormField from "../components/FormField";
import { validateImageMsg, validatePostalMsg, validateUrlMsg } from "../utils/validators";

export default function EditCompany() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/companies/${id}`);
        setForm(res.data);
        if (res.data.logo_url) setPreview(res.data.logo_url);
      } catch (err) {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading || !form) {
    return (
      <>
        <Navbar />
        <main className="container py-6">
          <div className="card max-w-2xl mx-auto">
            <div className="skeleton h-6 w-2/3 mb-4" />
            <div className="skeleton h-8 w-full mb-2" />
            <div className="skeleton h-8 w-full mb-2" />
            <div className="skeleton h-8 w-full" />
          </div>
        </main>
      </>
    );
  }

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((s) => ({ ...s, [e.target.name]: null }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    const err = validateImageMsg(file);
    if (err) {
      setErrors((s) => ({ ...s, logo: err }));
      toast.error(err);
      return;
    }
    setErrors((s) => ({ ...s, logo: null }));
    setLogoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const next = {};
    if (!form.company_name || !form.company_name.trim()) next.company_name = "Company name is required";
    const pErr = validatePostalMsg(form.postal_code);
    if (pErr) next.postal_code = pErr;
    const uErr = validateUrlMsg(form.website);
    if (uErr) next.website = uErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v || ""));
      if (logoFile) fd.append("logo", logoFile);
      await uploadCompany(fd, "put", id);
      toast.success("Company updated");
      navigate("/companies");
    } catch (err) {
      // handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-6">
        <div className="card max-w-2xl mx-auto">
          <h2 className="h2 mb-4">Edit Company</h2>
          <form onSubmit={submit} className="space-y-4" noValidate>
            <FormField label="Company name" name="company_name" value={form.company_name} onChange={handle} required error={errors.company_name} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="City" name="city" value={form.city || ""} onChange={handle} />
              <FormField label="State" name="state" value={form.state || ""} onChange={handle} />
            </div>

            <FormField label="Address" name="address" value={form.address || ""} onChange={handle} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField label="Country" name="country" value={form.country || ""} onChange={handle} />
              <FormField label="Postal code" name="postal_code" value={form.postal_code || ""} onChange={handle} error={errors.postal_code} />
              <FormField label="Website" name="website" value={form.website || ""} onChange={handle} error={errors.website} />
            </div>

            <div>
              <label className="block text-sm mb-1">Logo (optional)</label>
              <input aria-label="logo-input" type="file" accept="image/*" onChange={handleFile} className="block" />
              {errors.logo && <p className="text-xs text-red-600 mt-1">{errors.logo}</p>}
              {preview && <img src={preview} alt="logo preview" className="h-24 w-24 object-cover rounded mt-2" />}
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className="btn" aria-busy={submitting}>
                {submitting ? "Updating..." : "Update Company"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
