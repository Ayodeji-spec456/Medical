// Backend/app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 Security and Middleware
app.use(helmet());

// ✅ CORS Configuration (fixed)
const allowedOrigins = [
  "https://medical-gamma-jade.vercel.app", // Production (Vercel)
  "http://localhost:3000", // Local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

// ✅ Connect to MongoDB first, then start server
connectDB()
  .then(() => {
    // Mount routes
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/doctors", require("./routes/doctor"));
    app.use("/api/appointments", require("./routes/appointment"));
    app.use("/api/payments", require("./routes/payment"));
    app.use("/api/admin", require("./routes/admin"));

    // Health check route
    app.get("/", (req, res) => {
      res.send("✅ MediBook Backend is running and connected to MongoDB!");
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

// 🧩 Global Error Handler for CORS (optional but helpful)
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy: Origin not allowed" });
  }
  next(err);
});
