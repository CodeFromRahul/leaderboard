import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js';
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', userRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
