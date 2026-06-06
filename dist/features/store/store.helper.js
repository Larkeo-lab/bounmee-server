"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStoreWhereInput = void 0;
const buildStoreWhereInput = (search, filter) => {
    const where = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
        ];
    }
    if (filter?.provinceId) {
        where.provinceId = filter.provinceId;
    }
    if (filter?.districtId) {
        where.districtId = filter.districtId;
    }
    if (filter?.status) {
        where.status = filter.status;
    }
    if (filter?.type) {
        where.type = filter.type;
    }
    if (filter?.bussinessType) {
        where.bussinessType = filter.bussinessType;
    }
    if (filter?.staffSaleId) {
        where.staffSaleId = filter.staffSaleId;
    }
    if (filter?.startDate && filter?.endDate) {
        where.AND = [
            { startDate: { gte: filter.startDate } },
            { endDate: { lte: filter.endDate } },
        ];
    }
    return where;
};
exports.buildStoreWhereInput = buildStoreWhereInput;
