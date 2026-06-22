"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const express_rate_limit_1 = require("express-rate-limit");
const error_handler_1 = require("./shared/middleware/error-handler");
const auth_route_1 = __importDefault(require("./features/auth/auth.route"));
const province_route_1 = __importDefault(require("./features/province/province.route"));
const district_route_1 = __importDefault(require("./features/district/district.route"));
const citizen_route_1 = __importDefault(require("./features/citizen/citizen.route"));
const police_department_route_1 = __importDefault(require("./features/police-department/police-department.route"));
const police_district_route_1 = __importDefault(require("./features/police-district/police-district.route"));
const village_chief_route_1 = __importDefault(require("./features/village-chief/village-chief.route"));
const village_route_1 = __importDefault(require("./features/village/village.route"));
const news_route_1 = __importDefault(require("./features/news/news.route"));
const report_route_1 = __importDefault(require("./features/report/report.route"));
const storage_route_1 = __importDefault(require("./features/storage/storage.route"));
const app = (0, express_1.default)();
// --- 1. Global Middlewares ---
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            ...helmet_1.default.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "*"],
        },
    },
})); // Set various security-related HTTP headers
app.use((0, cors_1.default)()); // Enable CORS
app.use(express_1.default.json({ limit: "10kb" })); // Body parser, reading data from body into req.body, limit size to 10kb
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" })); // Parse URL-encoded bodies
app.use((0, hpp_1.default)()); // Prevent HTTP parameter pollution
// Rate limiting: Limit requests from the same API
const limiter = (0, express_rate_limit_1.rateLimit)({
    max: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
// --- 2. Routes ---
const ROUTE = "/api/v1";
app.use(`${ROUTE}/auth`, auth_route_1.default);
;
app.use(`${ROUTE}/province`, province_route_1.default);
app.use(`${ROUTE}/district`, district_route_1.default);
app.use(`${ROUTE}/citizen`, citizen_route_1.default);
app.use(`${ROUTE}/police-department`, police_department_route_1.default);
app.use(`${ROUTE}/police-district`, police_district_route_1.default);
app.use(`${ROUTE}/village-chief`, village_chief_route_1.default);
app.use(`${ROUTE}/village`, village_route_1.default);
app.use(`${ROUTE}/news`, news_route_1.default);
app.use(`${ROUTE}/report`, report_route_1.default);
app.use(`${ROUTE}/storage`, storage_route_1.default);
// --- 3. Health Check ---
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Smart POS Service is running!",
        timestamp: new Date().toISOString(),
    });
});
// --- 4. 404 Handler ---
app.use(error_handler_1.errorNotFound);
// --- 5. Global Error Handler (Must be last) ---
app.use(error_handler_1.globalErrorHandler);
//dd
exports.default = app;
