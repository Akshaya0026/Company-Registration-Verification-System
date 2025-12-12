import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, reset } from '../store/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-blue-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your company</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="you@example.com"
              className="w-full px-5 py-3 mt-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="••••••••"
              className="w-full px-5 py-3 mt-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-5 py-3 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02]"
          >
            {isLoading ? 'Signing In...' : 'Log In'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">Register now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
