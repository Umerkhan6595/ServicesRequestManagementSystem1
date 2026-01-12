const ServiceRequest = require('../models/ServiceRequest');

exports.getAll = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: serviceRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!serviceRequest) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    res.json({ success: true, data: serviceRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, category, priority, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const serviceRequest = await ServiceRequest.create({
      title,
      description,
      category: category || 'General',
      priority: priority || 'Medium',
      status: status || 'Pending',
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: serviceRequest, message: 'Service request created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, category, priority, status } = req.body;

    const serviceRequest = await ServiceRequest.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!serviceRequest) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    if (title) serviceRequest.title = title;
    if (description) serviceRequest.description = description;
    if (category) serviceRequest.category = category;
    if (priority) serviceRequest.priority = priority;
    if (status) serviceRequest.status = status;

    await serviceRequest.save();

    res.json({ success: true, data: serviceRequest, message: 'Service request updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!serviceRequest) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    await ServiceRequest.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Service request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

