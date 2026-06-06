import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import { rateLimit } from "express-rate-limit";
import { errorNotFound, globalErrorHandler } from "@middleware/error-handler";
import authRouter from "./features/auth/auth.route";
import publicRouter from "./features/public/public.route";
import provinceRouter from "./features/province/province.route";
import districtRouter from "./features/district/district.route";



const app: express.Application = express();

// --- 1. Global Middlewares ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "*"],
      },
    },
  }),
); // Set various security-related HTTP headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: "10kb" })); // Body parser, reading data from body into req.body, limit size to 10kb
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Parse URL-encoded bodies
app.use(hpp()); // Prevent HTTP parameter pollution

// Rate limiting: Limit requests from the same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// --- 2. Routes ---
const ROUTE = "/api/v1";

app.use(`${ROUTE}/auth`, authRouter);;
app.use(`${ROUTE}/public`, publicRouter);
app.use(`${ROUTE}/province`, provinceRouter);
app.use(`${ROUTE}/district`, districtRouter);


// --- 3. Health Check ---
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Smart POS Service is running!",
    timestamp: new Date().toISOString(),
  });
});

// --- 4. 404 Handler ---
app.use(errorNotFound);

// --- 5. Global Error Handler (Must be last) ---
app.use(globalErrorHandler);

//dd

export default app;
