import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { getMyCompany } from '../store/slices/companySlice';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { company } = useSelector((state) => state.company);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        dispatch(getMyCompany());
    }, [dispatch]);

    const onLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl hidden md:flex flex-col z-10">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-blue-600 tracking-tighter">Bluestock<span className="text-gray-400">.io</span></h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span>Dashboard</span>
                    </button>
                    <button onClick={() => navigate('/company-register')} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        <span>Company Profile</span>
                    </button>
                    <button onClick={() => navigate('/settings')} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>Settings</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{greeting}, {user?.email?.split('@')[0]}!</h1>
                        <p className="text-gray-500 mt-1">Here is what's happening with your account today.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Profile Status</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${company ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {company ? 'Active' : 'Pending'}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{company ? 'Verified' : 'Incomplete'}</div>
                        <p className="text-sm text-gray-400 mt-2">Update your info anytime</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-blue-100 font-medium">Company</h3>
                            <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <div className="text-2xl font-bold">{company?.company_name || 'Not Registered'}</div>
                        <p className="text-sm text-blue-100 mt-2">
                            {company ? `${company.city}, ${company.country}` : 'Register now to get started'}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Next Step</h3>
                            <span className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                            </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                            {company ? 'Complete Verification' : 'Register Company'}
                        </div>
                        <button
                            onClick={() => navigate('/company-register')}
                            className="text-sm text-blue-600 font-medium mt-2 hover:underline"
                        >
                            {company ? 'Edit Details →' : 'Start Now →'}
                        </button>
                    </div>
                </div>

                {/* Company Details Section */}
                {company && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center space-x-6 mb-8">
                            {company.logo_url && (
                                <img src={company.logo_url} alt="Logo" className="w-24 h-24 rounded-2xl object-cover shadow-sm border" />
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{company.company_name}</h2>
                                <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{company.website}</a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Industry</h4>
                                <p className="text-lg font-medium text-gray-900">{company.industry}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</h4>
                                <p className="text-lg font-medium text-gray-900">{company.city}, {company.state}, {company.country}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Founded</h4>
                                <p className="text-lg font-medium text-gray-900">{new Date(company.founded_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Address</h4>
                                <p className="text-lg font-medium text-gray-900">{company.address}, {company.postal_code}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!company && (
                    <div className="bg-blue-50 rounded-2xl p-10 text-center border border-blue-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to setup your company?</h2>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">Complete your company profile to unlock full access to the platform and start managing your business.</p>
                        <button onClick={() => navigate('/company-register')} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
                            Register Company Now
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
