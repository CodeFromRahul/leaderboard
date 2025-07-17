import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', userRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
