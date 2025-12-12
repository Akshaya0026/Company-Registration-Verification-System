import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, reset } from '../store/authSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, isSuccess, message } = useSelector((state) => state.auth);

    const onChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        const result = await dispatch(changePassword({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword
        }));

        if (changePassword.fulfilled.match(result)) {
            toast.success("Password Updated Successfully");
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            toast.error(result.payload || "Failed to update password");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
            <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">← Back to Dashboard</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Info Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 h-fit">
                        <h2 className="text-xl font-bold mb-4">Profile</h2>
                        <div className="space-y-4">
                            <button onClick={() => navigate('/company-register')} className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-left transition-colors">
                                Edit Company Profile
                            </button>
                        </div>
                    </div>

                    {/* Password Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
                        <h2 className="text-xl font-bold mb-6">Security</h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={onChange} className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input type="password" name="newPassword" value={passwords.newPassword} onChange={onChange} className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={onChange} className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
