import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, reset } from '../store/authSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess || user) {
            navigate('/dashboard');
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onSubmit = (data) => {
        dispatch(registerUser({ email: data.email, password: data.password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-blue-50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join us to register your company</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            {...register('email')}
                            className="w-full px-5 py-3 mt-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        />
                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.email?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className="w-full px-5 py-3 mt-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        />
                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.password?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className="w-full px-5 py-3 mt-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        />
                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword?.message}</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-5 py-3 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02]"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
