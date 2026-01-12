import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { serviceRequestAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'General', priority: 'Medium', status: 'Pending' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
    else loadServiceRequests();
  }, [user]);

  const loadServiceRequests = async () => {
    setLoading(true);
    try {
      const response = await serviceRequestAPI.getAll();
      if (response.success && response.data) setServiceRequests(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const response = await serviceRequestAPI.update(editingId, formData);
        if (response.success) {
          toast.success('Service request updated successfully!');
          await loadServiceRequests();
        }
      } else {
        const response = await serviceRequestAPI.create(formData);
        if (response.success) {
          toast.success('Service request created successfully!');
          await loadServiceRequests();
        }
      }
      setShowModal(false);
      setFormData({ title: '', description: '', category: 'General', priority: 'Medium', status: 'Pending' });
      setEditingId(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save service request');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (req) => {
    setFormData({ title: req.title, description: req.description, category: req.category, priority: req.priority, status: req.status });
    setEditingId(req._id || req.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service request?')) return;
    setLoading(true);
    try {
      const response = await serviceRequestAPI.delete(id);
      if (response.success) {
        toast.success('Service request deleted successfully!');
        await loadServiceRequests();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete service request');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    if (!id || !newStatus) return;
    setLoading(true);
    try {
      const response = await serviceRequestAPI.update(id, { status: newStatus });
      if (response.success) {
        toast.success(`Status changed to ${newStatus}`);
        setServiceRequests((prev) => prev.map((r) => (r._id === id || r.id === id ? { ...r, status: newStatus } : r)));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  const stats = {
    total: serviceRequests.length,
    pending: serviceRequests.filter((r) => r.status === 'Pending').length,
    inProgress: serviceRequests.filter((r) => r.status === 'In Progress').length,
    completed: serviceRequests.filter((r) => r.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-max">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Service Request Management</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name || 'User'}!</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
            </div>
          </div>
        </motion.div>

        <div className="mb-6">
          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div className="card p-5 flex items-center gap-4" whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-tr from-primary-400 to-primary-600 text-white">📊</div>
              <div>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
                <p className="text-sm muted">Total Requests</p>
              </div>
            </motion.div>

            <motion.div className="card p-5 flex items-center gap-4" whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white">⏳</div>
              <div>
                <h3 className="text-2xl font-bold">{stats.pending}</h3>
                <p className="text-sm muted">Pending</p>
              </div>
            </motion.div>

            <motion.div className="card p-5 flex items-center gap-4" whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-tr from-blue-400 to-blue-600 text-white">🔄</div>
              <div>
                <h3 className="text-2xl font-bold">{stats.inProgress}</h3>
                <p className="text-sm muted">In Progress</p>
              </div>
            </motion.div>

            <motion.div className="card p-5 flex items-center gap-4" whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white">✅</div>
              <div>
                <h3 className="text-2xl font-bold">{stats.completed}</h3>
                <p className="text-sm muted">Completed</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="flex items-center justify-between">
            <div />
            <button onClick={() => { setShowModal(true); setEditingId(null); setFormData({ title: '', description: '', category: 'General', priority: 'Medium', status: 'Pending' }); }} className="btn btn-primary">+ Create New Request</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {serviceRequests.length === 0 ? (
                <motion.div className="col-span-full text-center bg-white/95 backdrop-blur-md rounded-lg p-10 shadow">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold">No service requests yet</h3>
                  <p className="text-sm text-gray-500 mt-2">Create your first service request to get started</p>
                </motion.div>
              ) : (
                serviceRequests.map((request) => (
                  <motion.div key={request._id || request.id} className="card" layout whileHover={{ y: -6 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold">{request.title}</h3>
                      <div className="flex gap-2 items-center">
                        <span className={`text-xs font-semibold text-white px-3 py-1 rounded-full ${request.status === 'Completed' ? 'bg-green-600' : request.status === 'In Progress' ? 'bg-blue-600' : request.status === 'Pending' ? 'bg-amber-500' : 'bg-red-600'}`}>{request.status}</span>
                        <span className={`text-xs font-semibold text-white px-3 py-1 rounded-full ${request.priority === 'High' ? 'bg-red-600' : request.priority === 'Medium' ? 'bg-amber-500' : 'bg-green-600'}`}>{request.priority}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 my-4">{request.description}</p>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-sm muted">{request.category}</div>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => handleEdit(request)} className="btn btn-primary px-3 py-1 text-sm rounded-md">✏️ Edit</button>
                        <button onClick={() => handleChangeStatus(request._id || request.id, 'Pending')} className={`px-3 py-1 rounded-md text-sm ${request.status === 'Pending' ? 'bg-gray-100 text-gray-600' : 'bg-amber-500 text-white'}`} disabled={request.status === 'Pending' || loading}>⏳ Pending</button>
                        <button onClick={() => handleChangeStatus(request._id || request.id, 'In Progress')} className={`px-3 py-1 rounded-md text-sm ${request.status === 'In Progress' ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white'}`} disabled={request.status === 'In Progress' || loading}>🔄 In Progress</button>
                        <button onClick={() => handleChangeStatus(request._id || request.id, 'Completed')} className={`px-3 py-1 rounded-md text-sm ${request.status === 'Completed' ? 'bg-gray-100 text-gray-600' : 'bg-green-600 text-white'}`} disabled={request.status === 'Completed' || loading}>✅ Complete</button>
                        <button onClick={() => handleChangeStatus(request._id || request.id, 'Cancelled')} className={`px-3 py-1 rounded-md text-sm ${request.status === 'Cancelled' ? 'bg-gray-100 text-gray-600' : 'bg-red-600 text-white'}`} disabled={request.status === 'Cancelled' || loading}>❌ Cancel</button>
                        <button onClick={() => handleDelete(request._id || request.id)} className="px-3 py-1 rounded-md text-sm bg-red-600 text-white">🗑️ Delete</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
              <motion.div className="card w-full max-w-2xl p-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Request' : 'Create New Request'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-200 p-3" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-200 p-3" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-200 p-3">
                        <option>General</option>
                        <option>Technical</option>
                        <option>Support</option>
                        <option>Maintenance</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-200 p-3">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-200 p-3">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 mt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
