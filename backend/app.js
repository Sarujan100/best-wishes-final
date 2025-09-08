
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const sendEmailRoutes = require('./routes/sendMailRotes');
const giftContributionRoutes = require('./routes/giftContributionRoutes');
<<<<<<< HEAD
const surpriseGiftRoutes = require('./routes/surpriseGiftRoutes');
=======
>>>>>>> 2d72065a26e8fe5eb82706b3ed0b7949f9734138
const paymentRoutes = require('./routes/paymentRoutes');


const app = express();

connectDB();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
if (process.env.FRONT_URL) {
  allowedOrigins.push(process.env.FRONT_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use(cookieParser());

//  Routes
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.use('/api', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/Email', sendEmailRoutes);
app.use('/api/gift', giftContributionRoutes);
<<<<<<< HEAD
app.use('/api/surprise', surpriseGiftRoutes);
=======
>>>>>>> 2d72065a26e8fe5eb82706b3ed0b7949f9734138


module.exports = app;

//hellow