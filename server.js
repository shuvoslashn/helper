import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import cors from 'cors';

// configure
dotenv.config();

// rest object
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

// connect DataBase
connectDB();

//* routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/service', serviceRoutes);

// check api
app.get('/', (req, res) => {
    res.json({ message: 'welcome to ecommerce app' });
});

// port
const PORT = process.env.PORT || 8080;

// server listening
app.listen(PORT, () => {
    console.log(` server running at ${PORT} `.bgCyan);
});
