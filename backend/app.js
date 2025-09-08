
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
const surpriseGiftRoutes = require('./routes/surpriseGiftRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const heroSectionRoutes = require('./routes/heroSectionRoutes');


const app = express();

connectDB();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
if (process.env.FRONT_URL) {
  allowedOrigins.push(process.env.FRONT_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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
app.use('/api/surprise', surpriseGiftRoutes);
app.use('/api', heroSectionRoutes);


module.exports = app;

//hellow