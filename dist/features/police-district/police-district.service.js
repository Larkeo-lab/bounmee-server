"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPoliceDistrictsAndReportService = exports.deletePoliceDistrictService = exports.getAllPoliceDistrictsService = exports.createPoliceDistrictService = void 0;
exports.getPoliceDistrictByIdService = getPoliceDistrictByIdService;
exports.updatePoliceDistrictService = updatePoliceDistrictService;
const prisma_1 = require("../../config/prisma");
const bcryptjs_1 = require("bcryptjs");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createPoliceDistrictService = async (data, createdBy) => {
    // 2. User account identity (userName / email / phone) must be unique
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                { userName: data.userName },
                data.email ? { email: data.email } : undefined,
                data.phone ? { phone: data.phone } : undefined,
            ].filter(Boolean),
        },
    });
    if (existingUser) {
        let duplicatedField = "";
        if (existingUser.userName === data.userName) {
            duplicatedField = "Username";
        }
        else if (data.email && existingUser.email === data.email) {
            duplicatedField = "Email";
        }
        else if (data.phone && existingUser.phone === data.phone) {
            duplicatedField = "Phone number";
        }
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.USER_ALREADY_EXISTS, root_1.ErrorCode.USER_ALREADY_EXISTS, { duplicatedField });
    }
    // 3. Create the police district record
    const policeDistrict = await prisma_1.prisma.policeDistrict.create({
        data: {
            chiefName: data.chiefName,
            deputyChiefName: data.deputyChiefName,
            image: data.image || null,
            createdBy,
        },
    });
    // 4. Create the linked User account (User is the central account table)
    const hashedPassword = (0, bcryptjs_1.hashSync)(data.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            userName: data.userName,
            password: hashedPassword,
            email: data.email || null,
            phone: data.phone || null,
            profileImage: data.profileImage || null,
            provinceId: data.provinceId || null,
            districtId: data.districtId || null,
            villageId: data.villageId || null,
            address: data.address || null,
            policeDistrictId: policeDistrict.id,
            userType: "DISTRICT_POLICE",
        },
    });
    const { password, ...userWithoutPassword } = user;
    return { policeDistrict, user: userWithoutPassword };
};
exports.createPoliceDistrictService = createPoliceDistrictService;
const getAllPoliceDistrictsService = async (page, limit) => {
    const skip = (page - 1) * limit;
    const [policeDistricts, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.policeDistrict.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                users: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        phone: true,
                        provinceId: true,
                        districtId: true,
                        villageId: true,
                        address: true,
                        userType: true,
                        isActive: true,
                    },
                },
            },
        }),
        prisma_1.prisma.policeDistrict.count(),
    ]);
    return {
        policeDistricts,
        total,
    };
};
exports.getAllPoliceDistrictsService = getAllPoliceDistrictsService;
async function getPoliceDistrictByIdService(id) {
    const policeDistrict = await prisma_1.prisma.policeDistrict.findUnique({
        where: { id },
        include: {
            users: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    phone: true,
                    profileImage: true,
                    provinceId: true,
                    districtId: true,
                    villageId: true,
                    address: true,
                    userType: true,
                    isActive: true,
                },
            },
        },
    });
    if (!policeDistrict) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.POLICE_DISTRICT_NOT_FOUND, root_1.ErrorCode.POLICE_DISTRICT_NOT_FOUND);
    }
    return policeDistrict;
}
async function updatePoliceDistrictService(id, data, updatedBy) {
    const policeDistrict = await prisma_1.prisma.policeDistrict.findUnique({
        where: { id },
        include: { users: { select: { id: true } } },
    });
    if (!policeDistrict) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.POLICE_DISTRICT_NOT_FOUND, root_1.ErrorCode.POLICE_DISTRICT_NOT_FOUND);
    }
    const { chiefName, deputyChiefName, image, userName, password, email, phone, profileImage, provinceId, districtId, villageId, address, } = data;
    // Update the linked User account if any account field was provided
    const accountUser = policeDistrict.users[0];
    const hasAccountChange = userName !== undefined ||
        password !== undefined ||
        email !== undefined ||
        phone !== undefined ||
        profileImage !== undefined ||
        provinceId !== undefined ||
        districtId !== undefined ||
        villageId !== undefined ||
        address !== undefined;
    if (accountUser && hasAccountChange) {
        // userName / email / phone must stay unique (excluding this account)
        if (userName || email || phone) {
            const conflict = await prisma_1.prisma.user.findFirst({
                where: {
                    id: { not: accountUser.id },
                    OR: [
                        userName ? { userName } : undefined,
                        email ? { email } : undefined,
                        phone ? { phone } : undefined,
                    ].filter(Boolean),
                },
            });
            if (conflict) {
                let duplicatedField = "";
                if (userName && conflict.userName === userName) {
                    duplicatedField = "Username";
                }
                else if (email && conflict.email === email) {
                    duplicatedField = "Email";
                }
                else if (phone && conflict.phone === phone) {
                    duplicatedField = "Phone number";
                }
                throw new bad_request_1.BadRequestException(root_1.ErrorMessages.USER_ALREADY_EXISTS, root_1.ErrorCode.USER_ALREADY_EXISTS, { duplicatedField });
            }
        }
        await prisma_1.prisma.user.update({
            where: { id: accountUser.id },
            data: {
                ...(userName !== undefined ? { userName } : {}),
                ...(password ? { password: (0, bcryptjs_1.hashSync)(password, 10) } : {}),
                ...(email !== undefined ? { email: email || null } : {}),
                ...(phone !== undefined ? { phone: phone || null } : {}),
                ...(profileImage !== undefined
                    ? { profileImage: profileImage || null }
                    : {}),
                ...(provinceId !== undefined ? { provinceId: provinceId || null } : {}),
                ...(districtId !== undefined ? { districtId: districtId || null } : {}),
                ...(villageId !== undefined ? { villageId: villageId || null } : {}),
                ...(address !== undefined ? { address: address || null } : {}),
            },
        });
    }
    return await prisma_1.prisma.policeDistrict.update({
        where: { id },
        data: {
            ...(chiefName !== undefined ? { chiefName } : {}),
            ...(deputyChiefName !== undefined ? { deputyChiefName } : {}),
            ...(image !== undefined ? { image: image || null } : {}),
            updatedBy,
        },
        include: {
            users: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    phone: true,
                    profileImage: true,
                    provinceId: true,
                    districtId: true,
                    villageId: true,
                    address: true,
                    userType: true,
                    isActive: true,
                },
            },
        },
    });
}
const deletePoliceDistrictService = async (id) => {
    const policeDistrict = await prisma_1.prisma.policeDistrict.findUnique({
        where: { id },
    });
    if (!policeDistrict) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.POLICE_DISTRICT_NOT_FOUND, root_1.ErrorCode.POLICE_DISTRICT_NOT_FOUND);
    }
    await prisma_1.prisma.policeDistrict.delete({ where: { id } });
    return { policeDistrict };
};
exports.deletePoliceDistrictService = deletePoliceDistrictService;
const getAllPoliceDistrictsAndReportService = async (userId) => {
    if (!userId) {
        return [];
    }
    // 1. Get current logged-in user and their provinceId
    const loggedInUser = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!loggedInUser || !loggedInUser.provinceId) {
        return [];
    }
    // Get the province code
    const province = await prisma_1.prisma.province.findUnique({
        where: { id: loggedInUser.provinceId },
    });
    if (!province) {
        return [];
    }
    // 2. Fetch all districts in this province
    const districts = await prisma_1.prisma.district.findMany({
        where: { provinceCode: province.code },
        orderBy: { code: "asc" },
    });
    // 3. For each district, gather details
    const results = await Promise.all(districts.map(async (district) => {
        // Find the user account that represents the district police
        const districtUser = await prisma_1.prisma.user.findFirst({
            where: {
                districtId: district.id,
                userType: "DISTRICT_POLICE",
                isActive: true,
            },
            include: {
                policeDistrict: true,
            },
        });
        // Count villages belonging to this district
        const villageCount = await prisma_1.prisma.village.count({
            where: { districtCode: district.code },
        });
        // Count pending reports (badgeCount)
        const badgeCount = await prisma_1.prisma.report.count({
            where: {
                districtId: district.id,
                status: "PENDING",
            },
        });
        // Fetch all reports in this district
        const reports = await prisma_1.prisma.report.findMany({
            where: { districtId: district.id },
            orderBy: { createdAt: "desc" },
        });
        // Format date as "D,M,YYYY"
        const d = new Date(district.createdAt);
        const formattedDate = `${d.getDate()},${d.getMonth() + 1},${d.getFullYear()}`;
        return {
            id: district.id,
            chiefName: districtUser?.policeDistrict?.chiefName || "ທ່ານ .....",
            deputyChiefName: districtUser?.policeDistrict?.deputyChiefName || "ທ່ານ .....",
            districtName: district.nameLo,
            villageCount: villageCount || 0,
            badgeCount,
            date: formattedDate,
            imageUrl: district.image || "https://images.unsplash.com/photo-1543157148-f68f2ea433a1?w=600&auto=format&fit=crop&q=80",
            address: districtUser?.address || "",
            phone: districtUser?.phone || "",
            reports,
        };
    }));
    return results;
};
exports.getAllPoliceDistrictsAndReportService = getAllPoliceDistrictsAndReportService;
