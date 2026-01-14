const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString('hex');

  console.log('=== REGISTRATION ===');
  console.log('Token generated:', token);
  console.log('Token length:', token.length);
  console.log('Token type:', typeof token);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken: token
  });

  const savedUser = await User.findById(user._id);
  console.log('Token saved in DB:', savedUser.verificationToken);
  console.log('Tokens match:', savedUser.verificationToken === token);
  const verifyLink = `https://servicesrequestmanagementsystem1.onrender.com/verify-email/${token}`;
  // ensure single slash in link
  const cleanVerifyLink = verifyLink.replace('//verify-email', '/verify-email');
  
  console.log('Verification link:', cleanVerifyLink);
  
  console.log('Registration - Token generated:', token.substring(0, 10) + '...');
  console.log('Registration - Token length:', token.length);
  console.log('Registration - Verification link:', cleanVerifyLink.substring(0, 50) + '...');

  await sendEmail(
    email,
    'Verify Your Email',
    `<h3>Click to verify your email</h3>
     <a href="${cleanVerifyLink}">${cleanVerifyLink}</a>`
  );

  res.status(201).json({
    success: true, user, message: 'Registered successfully. Please verify your email.'
  });
};

exports.verifyEmail = async (req, res) => {
  try {
    let token = req.params.token;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required' });
    }
    token = token.trim();
    
    console.log('=== VERIFICATION ATTEMPT ===');
    console.log('Token received (first 20 chars):', token.substring(0, 20));
    console.log('Token length:', token.length);
    console.log('Token full:', token);
    let user = await User.findOne({ verificationToken: token });

    if (!user) {
      console.log('Exact match not found, searching all users with tokens...');
      const allUsersWithTokens = await User.find({ 
        verificationToken: { $exists: true, $ne: null, $ne: '' } 
      });
      
      console.log(`Found ${allUsersWithTokens.length} users with verification tokens`);
      
      for (const u of allUsersWithTokens) {
        if (u.verificationToken === token) {
          user = u;
          console.log('Found match by comparison!');
          break;
        }
        if (u.verificationToken && u.verificationToken.substring(0, 20) === token.substring(0, 20)) {
          console.log('Potential match found by substring comparison');
          console.log('DB token:', u.verificationToken);
          console.log('Received token:', token);
          if (u.verificationToken.length === token.length) {
            user = u;
            console.log('Using substring match!');
            break;
          }
        }
      }
    }

    if (!user) {
      console.log('No user found for token');
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }
    console.log('User found:', user.email);
    console.log('User isVerified:', user.isVerified);

    if (user.isVerified) {
      return res.json({ 
        success: true, 
        message: 'Email is already verified. You can now login.' 
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    console.log('Email verified successfully for:', user.email);
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during verification. Please try again later.' 
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.isVerified) {
    return res.status(400).json({ message: 'Please verify your email first' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user
  });
};
