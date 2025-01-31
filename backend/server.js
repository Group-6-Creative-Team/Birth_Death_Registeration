import dotenv from 'dotenv';
dotenv.config();  // Load environment variables here
import userRoutes from './routes/userRoute.js';
import express from 'express';
import connectDB from './database/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import paymentRoute from './routes/paymentRoute.js';
import paymentMethod from './routes/paymentMethodRoute.js';
import districtRoutes from './routes/districtRoute.js';
import birthRoutes from './routes/birthRoute.js';
import deathRoutes from './routes/deathRoute.js';

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 9000;
app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', // Allow only frontend on this port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any other headers your frontend might use
}));

app.use(express.json({ limit: '10mb' })); // Adjust size as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  console.log('GET request to /');
  res.send('Server is working');
});

app.use('/api/users', userRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/birth', birthRoutes);
app.use('/api/death', deathRoutes);
app.use('/api/payment-methods', paymentMethod);
app.use('/api/payments', paymentRoute); // Corrected line

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
