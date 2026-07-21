const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const connectDB = require("./config/db");
const sendEmail = require("./utils/sendEmail");
const contactRoutes = require("./routes/contact.routes");
const partnerRoutes = require("./routes/partner.routes");
const authRoutes = require("./routes/auth.routes");
const reportRoutes = require("./routes/report.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Trust proxy for Render deployment (required for express-rate-limit)
app.set('trust proxy', 1);

// Connect to database
connectDB();

// Security Middleware
app.use(helmet());

// Logging Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite default dev server
  'http://localhost:5174', // Admin dev server
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://investerly.vercel.app', // Explicit production URL
  process.env.FRONTEND_URL // Additional dynamic production URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

app.use('/api', apiLimiter);

// General Middleware
app.use(express.json({ limit: '10mb' }));

// Health check
app.get("/", (req, res, next) => {
  if (req.hostname === 'portal.investerly.in') return next();
  res.json({ status: "Backend running" });
});

// Direct proxy for the portal subdomain
app.use((req, res, next) => {
  if (req.hostname === 'portal.investerly.in') {
    return createProxyMiddleware({
      target: 'https://137.59.55.62',
      changeOrigin: true,
      secure: false,
      hostRewrite: 'portal.investerly.in',
      protocolRewrite: 'https',
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Host', 'investerly.in');
      }
    })(req, res, next);
  }
  next();
});

// Proxy the legacy login page
app.use('/legacy-login', createProxyMiddleware({
  target: 'https://137.59.55.62', // Old server IP
  changeOrigin: true,
  secure: false, // Ignores SSL certificate errors for the IP
  pathRewrite: { '^/legacy-login': '/login.php' },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Host', 'investerly.in'); // Fool the old server
  }
}));

// Proxy the legacy assets
app.use('/legacy-assets', createProxyMiddleware({
  target: 'https://137.59.55.62',
  changeOrigin: true,
  secure: false,
  autoRewrite: true,
  protocolRewrite: 'https',
  pathRewrite: {
    '^/legacy-assets/css\\?family=Lato': '/css?family=Lato',
    '^/legacy-assets': '/'
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Host', 'investerly.in');
  }
}));

// Catch-all proxy for the portal subdomain
app.use('/legacy-proxy', createProxyMiddleware({
  target: 'https://137.59.55.62',
  changeOrigin: true,
  secure: false,
  hostRewrite: 'portal.investerly.in',
  protocolRewrite: 'https',
  pathRewrite: {
    '^/legacy-proxy': '/'
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Host', 'investerly.in');
  }
}));

app.use("/api/contact", contactRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Catch-all route for undefined endpoints
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Backend started
});