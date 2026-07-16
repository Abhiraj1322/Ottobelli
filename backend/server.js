const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/authRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const customizationRoutes = require("./routes/customizationRoutes");
const cartRoutes = require("./routes/cartRoutes");
const profileRoutes = require("./routes/profileRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes.js");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ottobelli.onrender.com/",
  "https://ottobelli.vercel.app",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json()); // Allows server to accept JSON data in request bodies

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/customizations", customizationRoutes);
app.use("/api/cart", cartRoutes);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Ottobelli API is running successfully.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});