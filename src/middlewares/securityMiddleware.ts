import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'x-xss-protection';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const app = express();

// CORS Middleware
const corsOptions = {
  origin: process.env.APP_ENV == 'development' ? '*' : process.env.ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Helmet Middleware for various security headers
app.use(helmet());

// XSS (Cross-Site Scripting) Protection
app.use(xss());

// Cookie Parser
app.use(cookieParser());

// Rate Limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

export default app;
