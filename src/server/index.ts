
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectToDatabase } from './db';
import campaignRoutes from './routes/campaignRoutes';
import messageRoutes from './routes/messageRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectToDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/campaigns', campaignRoutes);
app.use('/personalized-message', messageRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
