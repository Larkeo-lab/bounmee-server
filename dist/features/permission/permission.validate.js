"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsQuerySchema = exports.permissionParamsSchema = exports.updatePermissionSchema = exports.createPermissionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const permissionsSchema = zod_1.default
    .record(zod_1.default.string(), // resource name (e.g., "users", "roles")
zod_1.default.array(zod_1.default.string()))
    .default({});
exports.createPermissionSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Permission name is required"),
    description: zod_1.default.string().optional(),
    isActive: zod_1.default.boolean().optional(),
    permissions: permissionsSchema,
    storeId: zod_1.default.string().uuid("Invalid store ID"),
});
exports.updatePermissionSchema = exports.createPermissionSchema.partial();
exports.permissionParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid permission ID"),
});
exports.getPermissionsQuerySchema = zod_1.default.object({
    storeId: zod_1.default.string().uuid("Invalid store ID").optional(),
    isActive: zod_1.default
        .preprocess((val) => {
        if (val === "true")
            return true;
        if (val === "false")
            return false;
        return val;
    }, zod_1.default.boolean())
        .optional(),
    search: zod_1.default.string().optional(),
});
