const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    console.log('Signup request received:', { ...req.body, password: '[REDACTED]' });
    const user = await User.create(req.body);
    console.log('User created:', user);
    const token = generateToken(user);
    console.log('Token generated:', token ? 'Token created successfully' : 'Failed to create token');
    
    // Return user without password and include token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email
    };
    
    console.log('Sending response with user and token');
    res.status(201).json({ user: userResponse, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('Login successful for user:', user.email);
    const token = generateToken(user);
    console.log('Token generated:', token ? 'Token created successfully' : 'Failed to create token');
    
    // Return user without password and include token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email
    };
    
    console.log('Sending response with user and token');
    res.json({ user: userResponse, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('Update profile request received:', { userId: req.user._id, ...req.body });
    const { name, email } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        console.log('Update profile failed: Email already in use');
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      console.log('Update profile failed: User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Profile updated successfully for user:', updatedUser.email);
    
    // Generate new token with updated user info
    const token = generateToken(updatedUser);
    
    res.json({ 
      user: updatedUser,
      token,
      message: 'Profile updated successfully' 
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    console.log('Update password request received for user:', req.user._id);
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('Update password failed: User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      console.log('Update password failed: Current password is incorrect');
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    console.log('Password updated successfully for user:', user.email);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
};
