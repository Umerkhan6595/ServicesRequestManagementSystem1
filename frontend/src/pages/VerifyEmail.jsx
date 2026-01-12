import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return setTimeout(() => navigate('/login'), 1200);

      try {
        const cleanToken = token.trim();
        const result = await authAPI.verifyEmail(cleanToken);

        if (result.success) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to login...');
          toast.success('Email verified successfully!');
          setTimeout(() => navigate('/login'), 1800);
        } else {
          setTimeout(() => navigate('/login'), 1200);
        }
      } catch (error) {
        setTimeout(() => navigate('/login'), 1200);
      }
    };
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg p-8"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
      >
        <div className="text-center mb-4">
          <div className="text-5xl mb-4">
            {status === 'verifying' && '⏳'}{status === 'success' && '✅'}{status === 'error' && '❌'}
          </div>
          <h1 className="text-2xl font-semibold mb-2">
            {status === 'verifying' && 'Verifying Email'}{status === 'success' && 'Email Verified!'}{status === 'error' && 'Verification Failed'}
          </h1>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {status === 'verifying' && (
          <div className="mt-6 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary rounded-full border-t-transparent animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-md bg-primary text-white">Go to Login</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

