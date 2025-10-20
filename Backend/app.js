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
app.use(cors());

app.use(
  cors({ origin: "*", credentials: true })
);
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://medical-xvdx-git-master-ayodejis-projects-59ca9000.vercel.app/",
//     ], // Allow frontend dev server and production
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

// ✅ Connect to MongoDB first, then start server
connectDB()
  .then(() => {
    // Mount all routes
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/doctors", require("./routes/doctor"));
    app.use("/api/appointments", require("./routes/appointment"));
    app.use("/api/payments", require("./routes/payment"));
    app.use("/api/admin", require("./routes/admin"));

    // Root route (simple health check)
    app.get("/", (req, res) => {
      res.send("✅ MediBook Backend is running and connected to MongoDB!");
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
