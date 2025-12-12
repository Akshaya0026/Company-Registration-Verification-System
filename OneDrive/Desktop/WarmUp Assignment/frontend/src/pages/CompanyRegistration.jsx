import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerCompany, uploadLogo, resetCompanyState, getMyCompany } from '../store/slices/companySlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CompanyRegistration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { company, isSuccess, isError, message, isLoading } = useSelector((state) => state.company);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        industry: '',
        foundedDate: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
    });
    const [logoFile, setLogoFile] = useState(null);

    useEffect(() => {
        dispatch(getMyCompany());
    }, [dispatch]);

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.company_name || '',
                website: company.website || '',
                industry: company.industry || '',
                foundedDate: company.founded_date ? company.founded_date.split('T')[0] : '',
                phone: company.phone || '',
                address: company.address || '',
                city: company.city || '',
                state: company.state || '',
                country: company.country || '',
                postalCode: company.postal_code || ''
            });
        }
    }, [company]);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess && step === 3) {
            toast.success('Company Saved Successfully!');
            navigate('/dashboard');
        }
        dispatch(resetCompanyState());
    }, [isError, isSuccess, message, step, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const submitBasicInfo = () => {
        if (!formData.name) return toast.error("Company Name is required");
        nextStep();
    }

    const submitForm = async () => {
        const resultAction = await dispatch(registerCompany(formData));
        if (registerCompany.fulfilled.match(resultAction)) {
            if (logoFile) {
                await dispatch(uploadLogo(logoFile));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-10">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-blue-50 p-10">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Company Profile</h2>

                {/* Stepper */}
                <div className="flex justify-between mb-10 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                    <div className={`absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 rounded-full transition-all duration-300`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                    {[1, 2, 3].map((num) => (
                        <div key={num} className={`flex flex-col items-center gap-2 bg-white px-2`}>
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-300 ${step >= num ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-50' : 'bg-gray-200 text-gray-500'}`}>
                                {num}
                            </div>
                            <span className={`text-sm font-semibold ${step >= num ? 'text-blue-800' : 'text-gray-400'}`}>
                                {num === 1 ? 'Details' : num === 2 ? 'Branding' : 'Review'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 ml-1">Company Name *</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 mt-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm bg-gray-50 focus:bg-white" placeholder="Acme Inc." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 ml-1">Website</label>
                                <input name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 mt-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm bg-gray-50 focus:bg-white" placeholder="https://" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 ml-1">Industry</label>
                                <input name="industry" value={formData.industry} onChange={handleChange} className="w-full px-4 py-3 mt-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm bg-gray-50 focus:bg-white" placeholder="Fintech" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 ml-1">Founded Date</label>
                                <input type="date" name="foundedDate" value={formData.foundedDate} onChange={handleChange} className="w-full px-4 py-3 mt-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm bg-gray-50 focus:bg-white" />
                            </div>
                        </div>
                        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2" />
                                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                <input name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-8">
                            <button onClick={submitBasicInfo} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]">Next Step →</button>
                        </div>
                    </div>
                )}

                {/* Step 2: Documents */}
                {step === 2 && (
                    <div className="text-center py-10 animate-fadeIn">
                        <div className="max-w-md mx-auto border-2 border-dashed border-blue-200 rounded-2xl p-12 cursor-pointer hover:bg-blue-50 transition-colors group">
                            <div className="mb-4 text-center">
                                <svg className="mx-auto h-12 w-12 text-blue-400 group-hover:text-blue-600 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-700 group-hover:text-blue-700">Upload Company Logo</p>
                            <p className="text-sm text-gray-500 mt-2">Click to browse or drag file here</p>
                            <input type="file" onChange={handleFileChange} accept="image/*" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer max-w-md mx-auto" style={{ position: 'static', display: 'block', width: '0', height: '0' }} />
                            <label onClick={() => document.querySelector('input[type=file]').click()} className="absolute w-full h-full top-0 left-0 cursor-pointer"></label>
                            {/* Simple file input for reliability if custom one fails */}
                            <input type="file" onChange={handleFileChange} accept="image/*" className="mt-4 mx-auto block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        {logoFile && <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">✅ {logoFile.name}</div>}

                        <div className="flex justify-between mt-12">
                            <button onClick={prevStep} className="text-gray-500 hover:text-gray-800 font-medium px-4">← Back</button>
                            <button onClick={nextStep} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]">Review →</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="animate-fadeIn">
                        <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Confirm Details</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <div><dt className="text-sm font-medium text-gray-500">Company Name</dt><dd className="mt-1 text-lg font-semibold text-gray-900">{formData.name}</dd></div>
                                <div><dt className="text-sm font-medium text-gray-500">Website</dt><dd className="mt-1 text-lg font-semibold text-gray-900">{formData.website || 'N/A'}</dd></div>
                                <div><dt className="text-sm font-medium text-gray-500">Location</dt><dd className="mt-1 text-lg font-semibold text-gray-900">{formData.city}, {formData.country}</dd></div>
                                <div><dt className="text-sm font-medium text-gray-500">Logo</dt><dd className="mt-1 text-lg font-semibold text-gray-900">{logoFile ? logoFile.name : (company?.logo_url ? 'Existing Logo' : 'None')}</dd></div>
                            </dl>
                        </div>

                        <div className="flex justify-between mt-10">
                            <button onClick={prevStep} className="text-gray-500 hover:text-gray-800 font-medium px-4">← Back</button>
                            <button onClick={submitForm} disabled={isLoading} className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] transform">
                                {isLoading ? 'Processing...' : 'Confirm & Register'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CompanyRegistration;
