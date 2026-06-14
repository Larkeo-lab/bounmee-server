import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import { rateLimit } from "express-rate-limit";
import { errorNotFound, globalErrorHandler } from "@middleware/error-handler";
import authRouter from "./features/auth/auth.route";
import provinceRouter from "./features/province/province.route";
import districtRouter from "./features/district/district.route";
import citizenRouter from "./features/citizen/citizen.route";
import policeDepartmentRouter from "./features/police-department/police-department.route";
import policeDistrictRouter from "./features/police-district/police-district.route";
import villageChiefRouter from "./features/village-chief/village-chief.route";
import villageRouter from "./features/village/village.route";
import newsRouter from "./features/news/news.route";
import reportRouter from "./features/report/report.route";
import storageRouter from "./features/storage/storage.route";



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
app.use(`${ROUTE}/province`, provinceRouter);
app.use(`${ROUTE}/district`, districtRouter);
app.use(`${ROUTE}/citizen`, citizenRouter);
app.use(`${ROUTE}/police-department`, policeDepartmentRouter);
app.use(`${ROUTE}/police-district`, policeDistrictRouter);
app.use(`${ROUTE}/village-chief`, villageChiefRouter);
app.use(`${ROUTE}/village`, villageRouter);
app.use(`${ROUTE}/news`, newsRouter);
app.use(`${ROUTE}/report`, reportRouter);
app.use(`${ROUTE}/storage`, storageRouter);


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
