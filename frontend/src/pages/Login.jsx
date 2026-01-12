import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

const API_URL = import.meta.env.VITE_API_URL; // <-- Vercel ke liye env variable

 const authAPI = {
  login: async ({ email, password }) => {
    return fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",   // 🔥 Required for cross-origin cookies
      body: JSON.stringify({ email, password }),
    }).then(res => res.json());
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white to-gray-50" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md card p-8"
      >
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gradient">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to manage your service requests</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-600 focus:ring-primary-600 p-3"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-600 focus:ring-primary-600 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 disabled:opacity-70"
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

