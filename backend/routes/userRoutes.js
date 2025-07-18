import express from 'express';
const router = express.Router();
import User from '../model/user.js';
import History from '../model/History.js';

// Get top 10 users
router.get('/users', async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  res.json(users);
});

// Claim random points
router.post('/claim', async (req, res) => {
  const { userId } = req.body;
  const points = Math.floor(Math.random() * 10) + 1;

  const user = await User.findById(userId);
  user.totalPoints += points;
  await user.save();

  const history = new History({ userId, pointsClaimed: points });
  await history.save();

  res.json({ points });
});

router.post('/add-user', async (req, res) => {
  const { name } = req.body;
  const newUser = new User({ name, totalPoints: 0 });
  await newUser.save();
  res.json({ message: 'User created', user: newUser });
});

// Get history
router.get('/history/:userId', async (req, res) => {
  const history = await History.find({ userId: req.params.userId }).sort({ timestamp: -1 });
  res.json(history);
});

export default router;  
