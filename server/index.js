import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a User model
const userSchema = new mongoose.Schema({
  auth0Id: String,
  email: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// 🔥 Add a new user (POST /api/users/add_user)
app.post('/api/users/add_user', async (req, res) => {
  try {
    const { auth0Id, email, username } = req.body;
    const newUser = new User({ auth0Id, email, username });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔥 Get user by Auth0 ID (GET /api/users/:userId)
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔥 Update username (PUT /api/users/:userId/name?new_name=NewUsername)
app.put('/api/users/:userId/name', async (req, res) => {
  try {
    const { new_name } = req.query;
    if (!new_name) {
      return res.status(400).json({ message: 'Missing new_name query parameter' });
    }

    const user = await User.findOneAndUpdate(
      { auth0Id: req.params.userId },
      { username: new_name },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Username updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔥 Delete user by Auth0 ID (DELETE /api/users/:userId)
app.delete('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ auth0Id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));