import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Registration successful! Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 1800);
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div className="relative z-10 w-full max-w-md card p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gradient">Create Account</h1>
          <p className="text-sm text-gray-500 mt-2">Join us and start managing your service requests</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" required value={formData.name} onChange={handleChange} placeholder="Name"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-600 focus:ring-primary-600 p-3" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Email"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-600 focus:ring-primary-600 p-3" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Enter password" minLength={6}
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-600 focus:ring-primary-600 p-3" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" minLength={6}
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-600 focus:ring-primary-600 p-3" />
          </div>

          <button type="submit" disabled={loading} className="w-full btn btn-primary py-3 disabled:opacity-70">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">Already have an account?{' '}<Link to="/login" className="text-primary-600 font-medium hover:underline">Login here</Link></p>
      </motion.div>
    </div>
  );
};

export default Register;

